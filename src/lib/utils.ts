import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "Not set";
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "Not set";
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}

export function toTitleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function sanitizePhoneNumber(value: string | null | undefined) {
  if (!value) return "";
  return value.replace(/[^\d]/g, "");
}

export function buildWhatsAppLink(
  phone: string | null | undefined,
  message: string,
) {
  const sanitized = sanitizePhoneNumber(phone);
  if (!sanitized) return null;
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`;
}

export function objectEntries<T extends Record<string, unknown>>(value: T) {
  return Object.entries(value) as [keyof T, T[keyof T]][];
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export type StoredUploadFile = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

export type FamilyMemberEntry = {
  memberFullName: string;
  relationship: string;
  dateOfBirth: string;
  occupation: string;
};

export function isStoredUploadFileArray(value: unknown): value is StoredUploadFile[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.name === "string" &&
        typeof item.type === "string" &&
        typeof item.size === "number" &&
        typeof item.dataUrl === "string",
    )
  );
}

export function summarizeStoredUploadFiles(value: unknown) {
  if (!isStoredUploadFileArray(value) || value.length === 0) {
    return "No files uploaded";
  }

  return value.map((file) => file.name).join(", ");
}

export function isFamilyMemberEntryArray(value: unknown): value is FamilyMemberEntry[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.memberFullName === "string" &&
        typeof item.relationship === "string" &&
        typeof item.dateOfBirth === "string" &&
        typeof item.occupation === "string",
    )
  );
}

export function formatFamilyMemberSummary(value: unknown) {
  if (!isFamilyMemberEntryArray(value) || value.length === 0) {
    return "No family members added";
  }

  return value
    .map(
      (member, index) =>
        `${index + 1}. ${member.memberFullName} - ${member.relationship} - ${formatDate(
          member.dateOfBirth,
        )} - ${member.occupation || "Not provided"}`,
    )
    .join("; ");
}
