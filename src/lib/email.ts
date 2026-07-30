import { Resend } from "resend";

import { BUSINESS_DETAILS } from "@/lib/services";
import { getSiteUrl } from "@/lib/site-url";
import { buildTrackingLookupPath } from "@/lib/tracking";
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
  return (
    process.env.EMAIL_FROM ||
    `${BUSINESS_DETAILS.name} Notifications <notifications@${getBusinessEmailDomain()}>`
  );
}

function getBusinessEmailDomain() {
  const [, domain = "libertydigitalconsulting.com"] = BUSINESS_DETAILS.email.split("@");
  return domain;
}

function getReplyToAddress() {
  return process.env.EMAIL_REPLY_TO || BUSINESS_DETAILS.email;
}

function getDashboardLink(leadId: string) {
  return `${getSiteUrl()}/admin/leads/${leadId}`;
}

function getTrackingLink(payload: LeadEmailPayload) {
  return `${getSiteUrl()}${buildTrackingLookupPath(
    payload.trackingReference,
    payload.phone || payload.whatsapp,
  )}`;
}

function getLogoUrl() {
  return `${getSiteUrl()}/liberty-logo-light.png`;
}

type LeadEmailPayload = {
  leadId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  preferredContactMethod?: string | null;
  serviceName: string;
  trackingReference: string;
  message?: string | null;
  formData: Record<string, unknown>;
};

type EmailSendResult = Awaited<ReturnType<Resend["emails"]["send"]>>;
type EmailDeliveryContext = "admin notification" | "customer confirmation";

export type EmailDeliveryResult =
  | {
      status: "sent";
      context: EmailDeliveryContext;
      emailId: string | null;
    }
  | {
      status: "skipped";
      context: EmailDeliveryContext;
      reason: string;
    };

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

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderDetailRow(label: string, value: unknown) {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #edf1f5;">
        <div style="font-size:11px;line-height:16px;letter-spacing:0.14em;text-transform:uppercase;color:#6d8499;font-weight:700;">${escapeHtml(label)}</div>
        <div style="padding-top:4px;font-size:14px;line-height:22px;color:#112031;font-weight:600;">${escapeHtml(value || "Not provided")}</div>
      </td>
    </tr>
  `;
}

function renderFormDataHtml(formData: Record<string, unknown>) {
  const rows = Object.entries(formData)
    .map(([key, value]) => {
      let formattedValue: string;

      if (Array.isArray(value)) {
        const familySummary = formatFamilyMemberSummary(value);
        formattedValue =
          familySummary !== "No family members added"
            ? familySummary
            : summarizeStoredUploadFiles(value);
      } else {
        formattedValue = String(value ?? "");
      }

      return renderDetailRow(
        key
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"),
        formattedValue,
      );
    })
    .join("");

  return rows || renderDetailRow("Service answers", "No service-specific answers submitted");
}

function renderButton(label: string, href: string, variant: "primary" | "dark" = "primary") {
  const background =
    variant === "primary"
      ? "linear-gradient(135deg,#fff8ec 0%,#e9d4ab 48%,#c89f63 100%)"
      : "#112031";
  const color = variant === "primary" ? "#112031" : "#fffaf3";

  return `
    <a href="${escapeHtml(href)}" style="display:inline-block;border-radius:999px;background:${background};color:${color};font-size:14px;line-height:18px;font-weight:800;text-decoration:none;padding:14px 22px;box-shadow:0 16px 34px rgba(4,10,18,0.18);">${escapeHtml(label)}</a>
  `;
}

function renderEmailShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: string;
}) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4eee5;font-family:Inter,Manrope,Arial,sans-serif;color:#112031;">
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">${escapeHtml(intro)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4eee5;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;border-collapse:collapse;">
            <tr>
              <td style="overflow:hidden;border-radius:30px;background:#112031;box-shadow:0 28px 70px rgba(4,10,18,0.22);">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:28px 30px 24px;background:#112031;background-image:linear-gradient(135deg,#112031 0%,#193147 58%,#0b1119 100%);">
                      <img alt="Liberty Digital Consulting Services" src="${escapeHtml(getLogoUrl())}" width="168" style="display:block;max-width:168px;height:auto;margin-bottom:28px;">
                      <div style="font-size:11px;line-height:16px;letter-spacing:0.22em;text-transform:uppercase;color:#ead9bc;font-weight:800;">${escapeHtml(eyebrow)}</div>
                      <h1 style="margin:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:38px;font-weight:600;color:#fffaf3;">${escapeHtml(title)}</h1>
                      <p style="margin:14px 0 0;max-width:540px;font-size:15px;line-height:26px;color:rgba(255,250,243,0.78);">${escapeHtml(intro)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 30px 30px;background:#fffaf3;">
                      ${children}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 30px;background:#0b1119;color:rgba(255,250,243,0.68);font-size:12px;line-height:20px;">
                      <strong style="color:#fffaf3;">${escapeHtml(BUSINESS_DETAILS.name)}</strong><br>
                      ${escapeHtml(BUSINESS_DETAILS.address)}<br>
                      <a href="mailto:${escapeHtml(BUSINESS_DETAILS.email)}" style="color:#ead9bc;text-decoration:none;">${escapeHtml(BUSINESS_DETAILS.email)}</a>
                      &nbsp;|&nbsp;
                      <a href="tel:${escapeHtml(BUSINESS_DETAILS.phone)}" style="color:#ead9bc;text-decoration:none;">${escapeHtml(BUSINESS_DETAILS.phone)}</a>
                      <div style="margin-top:12px;color:rgba(255,250,243,0.48);">
                        Liberty Digital Consulting provides document preparation and digital consulting support. We are not a government agency or issuing authority.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderAdminNotificationHtml(payload: LeadEmailPayload) {
  const dashboardLink = getDashboardLink(payload.leadId);
  const trackingLink = getTrackingLink(payload);

  return renderEmailShell({
    eyebrow: "New website request",
    title: payload.serviceName,
    intro: `${payload.fullName} submitted a new service request and is waiting for follow-up from the Liberty Digital team.`,
    children: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:18px 20px;border:1px solid #ead9bc;border-radius:24px;background:#fff7e8;">
            <div style="font-size:11px;line-height:16px;letter-spacing:0.18em;text-transform:uppercase;color:#b18a51;font-weight:800;">Tracking reference</div>
            <div style="padding-top:8px;font-size:24px;line-height:30px;font-weight:800;color:#112031;">${escapeHtml(payload.trackingReference)}</div>
          </td>
        </tr>
      </table>
      <div style="height:22px;"></div>
      ${renderButton("Open lead in admin", dashboardLink)}
      <span style="display:inline-block;width:10px;"></span>
      ${renderButton("View public tracker", trackingLink, "dark")}
      <div style="height:26px;"></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #edf1f5;border-radius:22px;background:#ffffff;padding:0 18px;">
        ${renderDetailRow("Client", payload.fullName)}
        ${renderDetailRow("Email", payload.email)}
        ${renderDetailRow("Phone", payload.phone)}
        ${renderDetailRow("WhatsApp", payload.whatsapp)}
        ${renderDetailRow("Preferred contact", payload.preferredContactMethod)}
        ${renderDetailRow("Message", payload.message)}
      </table>
      <div style="height:24px;"></div>
      <h2 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:30px;font-weight:600;color:#112031;">Submitted form answers</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #edf1f5;border-radius:22px;background:#ffffff;padding:0 18px;">
        ${renderFormDataHtml(payload.formData)}
      </table>
    `,
  });
}

function renderCustomerConfirmationHtml(payload: LeadEmailPayload) {
  const trackingLink = getTrackingLink(payload);

  return renderEmailShell({
    eyebrow: "Request received",
    title: "We have your request",
    intro: `Hello ${payload.fullName}, Liberty Digital Consulting has received your ${payload.serviceName} request.`,
    children: `
      <p style="margin:0 0 18px;font-size:15px;line-height:26px;color:#3f5266;">
        Thank you for contacting ${escapeHtml(BUSINESS_DETAILS.name)}. The team will review your details and contact you with the next step.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:18px 20px;border:1px solid #ead9bc;border-radius:24px;background:#fff7e8;">
            <div style="font-size:11px;line-height:16px;letter-spacing:0.18em;text-transform:uppercase;color:#b18a51;font-weight:800;">Your tracking reference</div>
            <div style="padding-top:8px;font-size:26px;line-height:32px;font-weight:800;color:#112031;">${escapeHtml(payload.trackingReference)}</div>
            <div style="padding-top:8px;font-size:13px;line-height:22px;color:#3f5266;">Keep this reference safe. You will need it with the phone number submitted on the form.</div>
          </td>
        </tr>
      </table>
      <div style="height:22px;"></div>
      ${renderButton("Track your request", trackingLink)}
      <div style="height:28px;"></div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #edf1f5;border-radius:22px;background:#ffffff;padding:0 18px;">
        ${renderDetailRow("Service", payload.serviceName)}
        ${renderDetailRow("Submitted phone", payload.phone || payload.whatsapp)}
        ${renderDetailRow("Next step", "The team will review your details and contact you with guidance.")}
      </table>
    `,
  });
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
    return {
      status: "skipped",
      context: "admin notification",
      reason: !process.env.RESEND_API_KEY
        ? "RESEND_API_KEY is missing."
        : "ADMIN_NOTIFICATION_EMAIL is missing.",
    } satisfies EmailDeliveryResult;
  }

  const dashboardLink = getDashboardLink(payload.leadId);
  const trackingLink = getTrackingLink(payload);

  const result = await resend.emails.send({
    from: getEmailFromAddress(),
    replyTo: payload.email || getReplyToAddress(),
    to: notificationEmail,
    subject: `New Lead: ${payload.serviceName} Request`,
    html: renderAdminNotificationHtml(payload),
    text: [
      `A new service request has been submitted on the website.`,
      "",
      `Full name: ${payload.fullName}`,
      `Email: ${payload.email ?? "Not provided"}`,
      `Phone: ${payload.phone ?? "Not provided"}`,
      `WhatsApp: ${payload.whatsapp ?? "Not provided"}`,
      `Preferred contact method: ${payload.preferredContactMethod ?? "Not provided"}`,
      `Service requested: ${payload.serviceName}`,
      `Tracking reference: ${payload.trackingReference}`,
      `Message: ${payload.message ?? "Not provided"}`,
      "",
      "Service-specific answers:",
      serializeFormData(payload.formData),
      dashboardLink ? "" : null,
      dashboardLink ? `Login and review this request: ${dashboardLink}` : null,
      trackingLink ? `Public tracking page: ${trackingLink}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  const sendResult = assertEmailSendResult(result, "admin-notification");

  return {
    status: "sent",
    context: "admin notification",
    emailId: sendResult.data?.id ?? null,
  } satisfies EmailDeliveryResult;
}

export async function sendCustomerConfirmationEmail(payload: LeadEmailPayload) {
  const resend = getResend();

  if (!resend || !payload.email) {
    return {
      status: "skipped",
      context: "customer confirmation",
      reason: !process.env.RESEND_API_KEY
        ? "RESEND_API_KEY is missing."
        : "Customer email address was not provided.",
    } satisfies EmailDeliveryResult;
  }

  const trackingLink = getTrackingLink(payload);

  const result = await resend.emails.send({
    from: getEmailFromAddress(),
    replyTo: getReplyToAddress(),
    to: payload.email,
    subject: "We received your request",
    html: renderCustomerConfirmationHtml(payload),
    text: `Hello ${payload.fullName},

Thank you for contacting ${BUSINESS_DETAILS.name}.

We have received your request for ${payload.serviceName}. The team will review your details and contact you with the next steps.

Your tracking reference is: ${payload.trackingReference}

You can check your request update here:
${trackingLink}

Please keep this reference safe and use the same phone number you submitted with your request when checking the tracker.

Regards,
${BUSINESS_DETAILS.name}`,
  });

  const sendResult = assertEmailSendResult(result, "customer-confirmation");

  return {
    status: "sent",
    context: "customer confirmation",
    emailId: sendResult.data?.id ?? null,
  } satisfies EmailDeliveryResult;
}
