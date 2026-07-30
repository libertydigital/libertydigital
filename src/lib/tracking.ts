import type { PublicTrackingStatus, TrackingCategory } from "@prisma/client";

export const TRACKING_LOOKUP_FIELDS = [
  {
    name: "referenceNumber",
    label: "Request reference number",
    placeholder: "Example: LDC-24081",
  },
  {
    name: "phoneNumber",
    label: "Phone number",
    placeholder: "Use the phone number submitted with your request",
  },
] as const;

export const TRACKING_SERVICE_RULES = [
  {
    key: "PASSPORT_URGENT" satisfies TrackingCategory,
    label: "Nigeria Passport - Urgent",
    options: ["5 years", "10 years"],
    timeline: "Ready in about 1 month",
    note: "Fast-track processing",
  },
  {
    key: "PASSPORT_STANDARD" satisfies TrackingCategory,
    label: "Nigeria Passport - Standard",
    options: ["5 years", "10 years"],
    timeline: "About 8 weeks after biometric appointment",
    note: "Includes appointment booking and guidance",
  },
  {
    key: "OTHER_DOCUMENTS" satisfies TrackingCategory,
    label: "Other Documents",
    options: ["General request"],
    timeline: "24 to 72 hours",
    note: "Depends on complete and correct document submission",
  },
] as const;

export const PUBLIC_TRACKING_STATUS_OPTIONS = [
  "REQUEST_RECEIVED",
  "DOCUMENTS_UNDER_REVIEW",
  "READY_FOR_APPOINTMENT_BOOKING",
  "BIOMETRIC_APPOINTMENT_SCHEDULED",
  "PROCESSING_WITH_AUTHORITY",
  "READY_FOR_COLLECTION",
  "IN_PROCESSING",
  "READY",
] as const satisfies readonly PublicTrackingStatus[];

export const PUBLIC_TRACKING_STATUSES = {
  passport: [
    "Request Received",
    "Documents Under Review",
    "Ready for Appointment Booking",
    "Biometric Appointment Scheduled",
    "Processing with Authority",
    "Ready for Collection",
  ],
  otherDocuments: [
    "Request Received",
    "Documents Under Review",
    "In Processing",
    "Ready",
  ],
} as const;

export const TRACKING_RESULT_FIELDS = [
  "Service",
  "Request type",
  "Current status",
  "Estimated timeline",
  "Last updated",
  "Note",
] as const;

export const TRACKING_EXAMPLE_RESULT = {
  requestId: "LDC-24081",
  service: "Nigeria Passport - Urgent",
  option: "10 years",
  status: "Processing with Authority",
  estimatedTimeline: "Ready in about 1 month",
  lastUpdated: "July 29, 2026",
  note: "Biometric completed. Request is currently in processing.",
} as const;

export function getTrackingCategoryLabel(category: TrackingCategory | null | undefined) {
  if (!category) {
    return "Not set";
  }

  return TRACKING_SERVICE_RULES.find((rule) => rule.key === category)?.label ?? category;
}

export function getTrackingTimeline(category: TrackingCategory | null | undefined) {
  if (!category) {
    return "Timeline will be confirmed after the team reviews the request.";
  }

  return (
    TRACKING_SERVICE_RULES.find((rule) => rule.key === category)?.timeline ??
    "Timeline not set yet"
  );
}

export function getTrackingCategoryNote(category: TrackingCategory | null | undefined) {
  if (!category) {
    return "Your request has been received. Liberty Digital Consulting Services is reviewing the details before the next public update is added.";
  }

  return (
    TRACKING_SERVICE_RULES.find((rule) => rule.key === category)?.note ??
    "Tracking note not set yet."
  );
}

export function getPublicTrackingStatusLabel(
  status: PublicTrackingStatus | null | undefined,
) {
  if (!status) {
    return "Request Received";
  }

  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function buildTrackingLookupPath(
  trackingReference: string,
  phoneNumber: string | null | undefined,
) {
  const params = new URLSearchParams({
    referenceNumber: trackingReference,
  });

  if (phoneNumber) {
    params.set("phoneNumber", phoneNumber);
  }

  return `/track-request?${params.toString()}`;
}

export function getPublicTrackingStatusesForCategory(
  category: TrackingCategory | null | undefined,
) {
  if (category === "OTHER_DOCUMENTS") {
    return [
      "REQUEST_RECEIVED",
      "DOCUMENTS_UNDER_REVIEW",
      "IN_PROCESSING",
      "READY",
    ] as const satisfies readonly PublicTrackingStatus[];
  }

  return [
    "REQUEST_RECEIVED",
    "DOCUMENTS_UNDER_REVIEW",
    "READY_FOR_APPOINTMENT_BOOKING",
    "BIOMETRIC_APPOINTMENT_SCHEDULED",
    "PROCESSING_WITH_AUTHORITY",
    "READY_FOR_COLLECTION",
  ] as const satisfies readonly PublicTrackingStatus[];
}
