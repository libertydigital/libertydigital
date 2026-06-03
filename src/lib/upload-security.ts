const IMAGE_UPLOAD_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const DOCUMENT_UPLOAD_MIME_TYPES = [
  ...IMAGE_UPLOAD_MIME_TYPES,
  "application/pdf",
] as const;

const DOCUMENT_UPLOAD_FIELDS = new Set([
  "invitationLetterNigeria",
  "nigerianPassportHostResidencyPermit",
  "validPassportCopy",
  "returnTicketEvidence",
  "hotelReservationHostAddress",
  "bankStatement180Days",
  "documentsToLegalize",
  "passportDataPage",
  "birthCertificate",
  "localStateOfOrigin",
]);

export const IMAGE_UPLOAD_ACCEPT = ".jpg,.jpeg,.png,.webp";
export const DOCUMENT_UPLOAD_ACCEPT = `${IMAGE_UPLOAD_ACCEPT},.pdf`;
export const MAX_IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_DOCUMENT_UPLOAD_BYTES = 4 * 1024 * 1024;
export const DEFAULT_MAX_UPLOADS = 2;

function normalizeMimeType(value: string) {
  return value.trim().toLowerCase();
}

function normalizeExtension(value: string) {
  return value.trim().toLowerCase();
}

function getMimeTypeExtension(mimeType: string) {
  switch (normalizeMimeType(mimeType)) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

export function isDocumentUploadField(fieldName: string) {
  return DOCUMENT_UPLOAD_FIELDS.has(fieldName);
}

export function getAcceptedMimeTypesForField(fieldName: string) {
  return isDocumentUploadField(fieldName)
    ? [...DOCUMENT_UPLOAD_MIME_TYPES]
    : [...IMAGE_UPLOAD_MIME_TYPES];
}

export function getFileInputAcceptValue(fieldName: string) {
  return isDocumentUploadField(fieldName)
    ? DOCUMENT_UPLOAD_ACCEPT
    : IMAGE_UPLOAD_ACCEPT;
}

export function getMaxFileCountForField(fieldName: string) {
  if (fieldName === "documentsToLegalize") {
    return 4;
  }

  if (
    fieldName === "invitationLetterNigeria" ||
    fieldName === "nigerianPassportHostResidencyPermit" ||
    fieldName === "validPassportCopy" ||
    fieldName === "returnTicketEvidence" ||
    fieldName === "hotelReservationHostAddress" ||
    fieldName === "bankStatement180Days" ||
    fieldName === "passportDataPage" ||
    fieldName === "birthCertificate" ||
    fieldName === "localStateOfOrigin"
  ) {
    return 1;
  }

  return DEFAULT_MAX_UPLOADS;
}

export function getMaxFileSizeForMimeType(mimeType: string) {
  return normalizeMimeType(mimeType) === "application/pdf"
    ? MAX_DOCUMENT_UPLOAD_BYTES
    : MAX_IMAGE_UPLOAD_BYTES;
}

export function sanitizeDisplayFileName(fileName: string) {
  const trimmed = fileName.trim();
  const sanitized = trimmed
    .replace(/[^a-zA-Z0-9._ -]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/-+/g, "-")
    .slice(0, 120)
    .trim();

  return sanitized || "upload";
}

export function buildStoredUploadFileName(fileName: string, mimeType: string) {
  const safeOriginalName = sanitizeDisplayFileName(fileName);
  const segments = safeOriginalName.split(".");
  const originalExtension =
    segments.length > 1 ? normalizeExtension(segments.pop() ?? "") : "";
  const fallbackExtension = getMimeTypeExtension(mimeType);
  const extension = originalExtension || fallbackExtension;
  const baseName = segments.join(".") || "upload";
  const safeBaseName = baseName
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "upload";
  const uniqueId =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  return `${safeBaseName}-${uniqueId}.${extension}`;
}

export function getUploadTypeErrorMessage(fieldName: string) {
  return isDocumentUploadField(fieldName)
    ? "Only JPG, PNG, WEBP, and PDF files are allowed."
    : "Only JPG, PNG, and WEBP files are allowed.";
}

export function getUploadSizeErrorMessage(mimeType: string) {
  return normalizeMimeType(mimeType) === "application/pdf"
    ? "Each file must be 4MB or smaller."
    : "Each file must be 4MB or smaller.";
}

export function validateUploadedFile(
  fieldName: string,
  file: { type: string; size: number },
) {
  const normalizedMimeType = normalizeMimeType(file.type);
  const acceptedMimeTypes = getAcceptedMimeTypesForField(fieldName).map(normalizeMimeType);

  if (!acceptedMimeTypes.includes(normalizedMimeType)) {
    return getUploadTypeErrorMessage(fieldName);
  }

  if (file.size > getMaxFileSizeForMimeType(normalizedMimeType)) {
    return getUploadSizeErrorMessage(normalizedMimeType);
  }

  return null;
}
