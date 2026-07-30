"use server";

import { revalidatePath } from "next/cache";

import type { Prisma } from "@prisma/client";

import { sendCustomerConfirmationEmail, sendNewLeadNotification } from "@/lib/email";
import { getPrisma } from "@/lib/prisma";
import { SERVICES_BY_SLUG, type ServiceSlug } from "@/lib/services";
import {
  contactInquirySchema,
  serviceSlugSchema,
  validateServiceLeadInput,
  type ContactInquiryInput,
} from "@/lib/validations";

export type ActionState =
  | {
      success: true;
      message: string;
      trackingReference: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

function getSuccessMessage(trackingReference: string) {
  return `Your request has been received. Your tracking reference is ${trackingReference}. Keep this reference safe and use it with your phone number on the tracking page.`;
}

const failureMessage =
  "Something went wrong while submitting your request. Please check your details and try again.";

async function generateTrackingReference() {
  const prisma = getPrisma();
  const dayStamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const randomChunk = Math.floor(1000 + Math.random() * 9000);
    const reference = `LDC-${dayStamp}-${randomChunk}`;
    const existing = await prisma.lead.findUnique({
      where: { trackingReference: reference },
      select: { id: true },
    });

    if (!existing) {
      return reference;
    }
  }

  return `LDC-${dayStamp}-${Date.now().toString().slice(-5)}`;
}

function flattenErrors(errors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(errors).filter(([, value]) => value && value.length > 0),
  ) as Record<string, string[]>;
}

function extractFormData(
  serviceSlug: ServiceSlug,
  input: Record<string, unknown>,
) {
  const allowedFields = SERVICES_BY_SLUG[serviceSlug].formFields.map(
    (field) => field.name,
  );

  return Object.fromEntries(
    allowedFields
      .map((key) => [key, input[key]])
      .filter(([, value]) => value !== undefined && value !== ""),
  );
}

export async function submitLeadAction(
  serviceSlug: ServiceSlug,
  input: Record<string, unknown>,
): Promise<ActionState> {
  console.log("[API] Lead submission started:", { serviceSlug });
  const apiStartTime = Date.now();

  if (!serviceSlugSchema.safeParse(serviceSlug).success) {
    return {
      success: false,
      message: failureMessage,
    };
  }

  const parsed = validateServiceLeadInput(serviceSlug, input);

  if (!parsed.success) {
    return {
      success: false,
      message: failureMessage,
      fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    const service = SERVICES_BY_SLUG[serviceSlug];
    const prisma = getPrisma();
    const formData = extractFormData(serviceSlug, parsed.data as Record<string, unknown>);
    const trackingReference = await generateTrackingReference();

    const dbStartTime = Date.now();
    const lead = await prisma.lead.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        whatsapp: parsed.data.whatsapp || null,
        preferredContactMethod: parsed.data.preferredContactMethod || null,
        serviceSlug,
        serviceName: service.title,
        trackingReference,
        message: parsed.data.message || null,
        formData,
        activities: {
          create: {
            type: "CREATED",
            description: "Lead created from public service form.",
          },
        },
      },
    });
    const dbDuration = Date.now() - dbStartTime;
    console.log(`[API] Lead created in DB (${dbDuration}ms):`, { leadId: lead.id });

    // Send emails in the background without blocking the response
    // This makes the form submission feel much faster to the user
    void sendEmailsInBackground(lead, serviceSlug, formData as Record<string, unknown>);

    // Revalidate cache in the background
    void Promise.resolve().then(() => {
      revalidatePath("/admin");
      revalidatePath("/admin/leads");
    });

    const totalDuration = Date.now() - apiStartTime;
    console.log(`[API] Lead submission completed in ${totalDuration}ms`);

    return {
      success: true,
      message: getSuccessMessage(trackingReference),
      trackingReference,
    };
  } catch (error) {
    console.error("[API] Lead submission error:", error);
    return {
      success: false,
      message: failureMessage,
    };
  }
}

async function sendEmailsInBackground(
  lead: { id: string; fullName: string; email: string | null; phone: string | null; whatsapp: string | null; preferredContactMethod: string | null; serviceName: string; trackingReference: string; message: string | null },
  serviceSlug: ServiceSlug,
  formData: Record<string, unknown>,
) {
  try {
    const prisma = getPrisma();

    const emailResults = await Promise.allSettled([
      sendNewLeadNotification({
        leadId: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp,
        preferredContactMethod: lead.preferredContactMethod,
        serviceName: lead.serviceName,
        trackingReference: lead.trackingReference,
        message: lead.message,
        formData,
      }),
      sendCustomerConfirmationEmail({
        leadId: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp,
        preferredContactMethod: lead.preferredContactMethod,
        serviceName: lead.serviceName,
        trackingReference: lead.trackingReference,
        message: lead.message,
        formData,
      }),
    ]);

    const emailActivities: Prisma.LeadActivityCreateManyLeadInput[] = [];

    emailResults.forEach((result, index) => {
      const emailType = index === 0 ? "admin notification" : "customer confirmation";

      if (result.status === "fulfilled") {
        if (result.value.status === "sent") {
          emailActivities.push({
            type: "NOTE_ADDED",
            description: `${result.value.context} email sent${result.value.emailId ? ` (Resend ID: ${result.value.emailId}).` : "."}`,
          });
          return;
        }

        emailActivities.push({
          type: "NOTE_ADDED",
          description: `${result.value.context} email skipped: ${result.value.reason}`,
        });
        return;
      }

      if (result.status === "rejected") {
        console.error(`Lead email failed: ${emailType}`, {
          leadId: lead.id,
          serviceSlug,
          reason:
            result.reason instanceof Error ? result.reason.message : String(result.reason),
        });

        emailActivities.push({
          type: "NOTE_ADDED",
          description: `${emailType} email failed: ${
            result.reason instanceof Error ? result.reason.message : String(result.reason)
          }`,
        });
      }
    });

    if (emailActivities.length > 0) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          activities: {
            createMany: {
              data: emailActivities,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Background email sending error:", error);
    // Fail silently - don't throw, as this is running in the background
  }
}

export async function submitContactInquiryAction(
  input: ContactInquiryInput,
): Promise<ActionState> {
  const parsed = contactInquirySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: failureMessage,
      fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    const service = SERVICES_BY_SLUG[parsed.data.serviceSlug];
    const prisma = getPrisma();
    const formData = extractFormData(
      parsed.data.serviceSlug,
      parsed.data as Record<string, unknown>,
    );
    const trackingReference = await generateTrackingReference();
    const lead = await prisma.lead.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        whatsapp: parsed.data.whatsapp || null,
        preferredContactMethod: parsed.data.preferredContactMethod || null,
        serviceSlug: parsed.data.serviceSlug,
        serviceName: service.title,
        trackingReference,
        message: parsed.data.message || null,
        formData,
        activities: {
          create: {
            type: "CREATED",
            description: "Lead created from public contact form.",
          },
        },
      },
    });

    void sendEmailsInBackground(
      lead,
      parsed.data.serviceSlug,
      formData as Record<string, unknown>,
    );

    void Promise.resolve().then(() => {
      revalidatePath("/admin");
      revalidatePath("/admin/leads");
    });

    return {
      success: true,
      message: getSuccessMessage(trackingReference),
      trackingReference,
    };
  } catch (error) {
    console.error("[API] Contact inquiry submission error:", error);
    return {
      success: false,
      message: failureMessage,
    };
  }
}
