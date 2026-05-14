import type { Lead } from "@prisma/client";

import { getServiceBySlug } from "@/lib/services";
import {
  formatDate,
  formatDateTime,
  summarizeStoredUploadFiles,
  toTitleCase,
} from "@/lib/utils";

function getReadableFieldLabel(key: string, configuredLabel?: string) {
  if (configuredLabel) {
    return configuredLabel;
  }

  return toTitleCase(
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"),
  );
}

function formatFieldValue(value: unknown, fieldType?: string) {
  if (value == null || value === "") {
    return "Not provided";
  }

  if (fieldType === "date" && typeof value === "string") {
    return formatDate(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return summarizeStoredUploadFiles(value);
  }

  return String(value);
}

export function buildLeadDownloadContent(lead: Lead) {
  const service = getServiceBySlug(lead.serviceSlug);
  const fieldMap = new Map(
    service?.formFields.map((field) => [field.name, field]) ?? [],
  );

  const lines = [
    "LIBERTY DIGITAL CONSULTING SERVICES",
    "SERVICE REQUEST EXPORT",
    "",
    `Lead ID: ${lead.id}`,
    `Service: ${lead.serviceName}`,
    `Status: ${lead.status}`,
    `Created: ${formatDateTime(lead.createdAt)}`,
    `Updated: ${formatDateTime(lead.updatedAt)}`,
    `Follow-up Date: ${formatDate(lead.followUpDate)}`,
    "",
    "CONTACT DETAILS",
    `Full Name: ${lead.fullName}`,
    `Email: ${lead.email || "Not provided"}`,
    `Phone: ${lead.phone || "Not provided"}`,
    `WhatsApp: ${lead.whatsapp || "Not provided"}`,
    `Preferred Contact Method: ${lead.preferredContactMethod || "Not specified"}`,
    "",
    "MESSAGE",
    lead.message || "No message provided.",
    "",
    "SUBMITTED FORM ANSWERS",
  ];

  Object.entries((lead.formData ?? {}) as Record<string, unknown>).forEach(
    ([key, value]) => {
      const configuredField = fieldMap.get(key);
      lines.push(
        `${getReadableFieldLabel(key, configuredField?.label)}: ${formatFieldValue(
          value,
          configuredField?.type,
        )}`,
      );
    },
  );

  lines.push("", "END OF EXPORT");

  return lines.join("\n");
}

export function buildLeadDownloadFilename(lead: Lead) {
  const safeName = lead.fullName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${lead.serviceSlug}-${safeName || "lead"}-${lead.id}.txt`;
}
