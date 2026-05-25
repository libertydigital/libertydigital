import { Resend } from "resend";

import { BUSINESS_DETAILS } from "@/lib/services";
import { formatFamilyMemberSummary, summarizeStoredUploadFiles } from "@/lib/utils";

let resendClient: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
}

function getEmailFromAddress() {
  return process.env.EMAIL_FROM || `${BUSINESS_DETAILS.name} <onboarding@resend.dev>`;
}

function getDashboardLink(leadId: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    return null;
  }

  return `${siteUrl.replace(/\/+$/, "")}/admin/leads/${leadId}`;
}

type LeadEmailPayload = {
  leadId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  preferredContactMethod?: string | null;
  serviceName: string;
  message?: string | null;
  formData: Record<string, unknown>;
};

type EmailSendResult = Awaited<ReturnType<Resend["emails"]["send"]>>;

function serializeFormData(formData: Record<string, unknown>) {
  return Object.entries(formData)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        const familySummary = formatFamilyMemberSummary(value);

        if (familySummary !== "No family members added") {
          return `${key}: ${familySummary}`;
        }

        return `${key}: ${summarizeStoredUploadFiles(value)}`;
      }

      return `${key}: ${String(value ?? "")}`;
    })
    .join("\n");
}

function assertEmailSendResult(
  result: EmailSendResult,
  context: "admin-notification" | "customer-confirmation",
) {
  if (result.error) {
    throw new Error(
      `Resend ${context} failed: ${result.error.name} - ${result.error.message}`,
    );
  }

  return result;
}

export async function sendNewLeadNotification(payload: LeadEmailPayload) {
  const resend = getResend();
  const notificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!resend || !notificationEmail) {
    return { skipped: true };
  }

  const dashboardLink = getDashboardLink(payload.leadId);

  const result = await resend.emails.send({
    from: getEmailFromAddress(),
    to: notificationEmail,
    subject: `New Lead: ${payload.serviceName} Request`,
    text: [
      `A new service request has been submitted on the website.`,
      "",
      `Full name: ${payload.fullName}`,
      `Email: ${payload.email ?? "Not provided"}`,
      `Phone: ${payload.phone ?? "Not provided"}`,
      `WhatsApp: ${payload.whatsapp ?? "Not provided"}`,
      `Preferred contact method: ${payload.preferredContactMethod ?? "Not provided"}`,
      `Service requested: ${payload.serviceName}`,
      `Message: ${payload.message ?? "Not provided"}`,
      "",
      "Service-specific answers:",
      serializeFormData(payload.formData),
      dashboardLink ? "" : null,
      dashboardLink ? `Login and review this request: ${dashboardLink}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return assertEmailSendResult(result, "admin-notification");
}

export async function sendCustomerConfirmationEmail(payload: LeadEmailPayload) {
  const resend = getResend();

  if (!resend || !payload.email) {
    return { skipped: true };
  }

  const result = await resend.emails.send({
    from: getEmailFromAddress(),
    to: payload.email,
    subject: "We received your request",
    text: `Hello ${payload.fullName},

Thank you for contacting ${BUSINESS_DETAILS.name}.

We have received your request for ${payload.serviceName}. The team will review your details and contact you with the next steps.

Regards,
${BUSINESS_DETAILS.name}`,
  });

  return assertEmailSendResult(result, "customer-confirmation");
}
