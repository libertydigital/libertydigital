import { Resend } from "resend";

import { BUSINESS_DETAILS } from "@/lib/services";

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

function serializeFormData(formData: Record<string, unknown>) {
  return Object.entries(formData)
    .map(([key, value]) => `${key}: ${String(value ?? "")}`)
    .join("\n");
}

export async function sendNewLeadNotification(payload: LeadEmailPayload) {
  const resend = getResend();
  const notificationEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!resend || !notificationEmail) {
    return { skipped: true };
  }

  const dashboardLink = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin/leads/${payload.leadId}`
    : null;

  return resend.emails.send({
    from: `${BUSINESS_DETAILS.name} <onboarding@resend.dev>`,
    to: notificationEmail,
    subject: `New Lead: ${payload.serviceName} Request`,
    text: [
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
      dashboardLink ? `Dashboard link: ${dashboardLink}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

export async function sendCustomerConfirmationEmail(payload: LeadEmailPayload) {
  const resend = getResend();

  if (!resend || !payload.email) {
    return { skipped: true };
  }

  return resend.emails.send({
    from: `${BUSINESS_DETAILS.name} <onboarding@resend.dev>`,
    to: payload.email,
    subject: "We received your request",
    text: `Hello ${payload.fullName},

Thank you for contacting ${BUSINESS_DETAILS.name}.

We have received your request for ${payload.serviceName}. The team will review your details and contact you with the next steps.

Regards,
${BUSINESS_DETAILS.name}`,
  });
}
