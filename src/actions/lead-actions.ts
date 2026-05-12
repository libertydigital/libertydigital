"use server";

import { revalidatePath } from "next/cache";

import { sendCustomerConfirmationEmail, sendNewLeadNotification } from "@/lib/email";
import { getPrisma } from "@/lib/prisma";
import { SERVICES_BY_SLUG, type ServiceSlug } from "@/lib/services";
import {
  contactInquirySchema,
  validateServiceLeadInput,
  type ContactInquiryInput,
} from "@/lib/validations";

type ActionState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

const successMessage =
  "Your request has been received. Liberty Digital Consulting Services will review your details and contact you with the next steps.";

const failureMessage =
  "Something went wrong while submitting your request. Please check your details and try again.";

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
  const parsed = validateServiceLeadInput(serviceSlug, input);

  if (!parsed.success) {
    return {
      success: false,
      message: failureMessage,
      fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors),
    };
  }

  try {
    const prisma = getPrisma();
    const service = SERVICES_BY_SLUG[serviceSlug];
    const formData = extractFormData(serviceSlug, parsed.data as Record<string, unknown>);

    const lead = await prisma.lead.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        whatsapp: parsed.data.whatsapp || null,
        preferredContactMethod: parsed.data.preferredContactMethod || null,
        serviceSlug,
        serviceName: service.title,
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

    await Promise.allSettled([
      sendNewLeadNotification({
        leadId: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp,
        preferredContactMethod: lead.preferredContactMethod,
        serviceName: lead.serviceName,
        message: lead.message,
        formData: formData as Record<string, unknown>,
      }),
      sendCustomerConfirmationEmail({
        leadId: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp,
        preferredContactMethod: lead.preferredContactMethod,
        serviceName: lead.serviceName,
        message: lead.message,
        formData: formData as Record<string, unknown>,
      }),
    ]);

    revalidatePath("/admin");
    revalidatePath("/admin/leads");

    return {
      success: true,
      message: successMessage,
    };
  } catch {
    return {
      success: false,
      message: failureMessage,
    };
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

  return submitLeadAction(parsed.data.serviceSlug, {
    ...parsed.data,
  });
}
