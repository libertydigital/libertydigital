import { z } from "zod";

import { SERVICES_BY_SLUG, type ServiceSlug } from "@/lib/services";
import { isNonEmptyString } from "@/lib/utils";

const serviceSlugSchema = z.custom<ServiceSlug>(
  (value) =>
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(SERVICES_BY_SLUG, value),
  "Invalid service selection",
);

const sharedLeadShape = {
  fullName: z.string().trim().min(2, "Full name is required."),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || z.email().safeParse(value).success,
      "Enter a valid email address.",
    ),
  phone: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  preferredContactMethod: z
    .enum(["Phone", "WhatsApp", "Email", "Any"])
    .optional(),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
  consent: z.literal(true, {
    message:
      "You must agree before Liberty Digital Consulting Services can contact you.",
  }),
};

const serviceSchemas: Record<ServiceSlug, z.ZodObject<Record<string, z.ZodTypeAny>>> =
  {
    "nigeria-passport-online-registration": z.object({
      applicationType: z.string().min(1, "Choose an application type."),
      passportPages: z.string().min(1, "Choose a passport booklet option."),
      hasPreviousPassport: z.string().min(1, "Choose an option."),
      preferredAppointmentDate: z.string().optional().or(z.literal("")),
      hasSupportingDocuments: z.string().min(1, "Choose an option."),
    }),
    "court-e-affidavit": z.object({
      affidavitPurpose: z.string().trim().min(2, "Purpose is required."),
      jurisdictionOrState: z
        .string()
        .trim()
        .min(2, "Jurisdiction or state is required."),
      deponentName: z.string().trim().min(2, "Deponent name is required."),
      needsLegalReview: z.string().min(1, "Choose an option."),
      hasSupportingDocuments: z.string().min(1, "Choose an option."),
      preferredCompletionDate: z.string().optional().or(z.literal("")),
    }),
    "national-identification-number": z.object({
      requestType: z.string().min(1, "Choose a request type."),
      hasNigerianId: z.string().min(1, "Choose an option."),
      hasNPCDigitalCertificate: z.string().min(1, "Choose an option."),
      applicantAgeGroup: z.string().min(1, "Choose an age group."),
      preferredAppointmentDate: z.string().optional().or(z.literal("")),
    }),
    "bank-verification-number": z.object({
      requestType: z.string().min(1, "Choose a request type."),
      hasNigerianBankAccount: z.string().min(1, "Choose an option."),
      bankName: z.string().trim().optional().or(z.literal("")),
      hasValidIdentification: z.string().min(1, "Choose an option."),
      preferredAppointmentDate: z.string().optional().or(z.literal("")),
    }),
    "nigeria-e-visa": z.object({
      visaType: z.string().min(1, "Choose a visa type."),
      nationality: z.string().trim().min(2, "Nationality is required."),
      travelPurpose: z.string().trim().min(2, "Travel purpose is required."),
      expectedTravelDate: z.string().optional().or(z.literal("")),
      hasInvitationLetter: z.string().min(1, "Choose an option."),
      hasValidPassportSixMonths: z.string().min(1, "Choose an option."),
    }),
    "national-population-commission-digital-certificate": z.object({
      certificateType: z.string().min(1, "Choose a certificate type."),
      applicantAgeGroup: z.string().min(1, "Choose an age group."),
      isForNINRegistration: z.string().min(1, "Choose an option."),
      preferredAppointmentDate: z.string().optional().or(z.literal("")),
    }),
  };

export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "WAITING_FOR_DOCUMENTS",
  "APPOINTMENT_SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "LOST",
]);

export const adminNoteSchema = z.object({
  leadId: z.string().min(1),
  note: z.string().trim().min(2, "Note is required."),
});

export const followUpDateSchema = z.object({
  leadId: z.string().min(1),
  followUpDate: z.string().min(1, "Follow-up date is required."),
});

export const leadStatusUpdateSchema = z.object({
  leadId: z.string().min(1),
  status: leadStatusSchema,
});

export const adminAccountCreateSchema = z.object({
  email: z.email("Enter a valid email address.").trim(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .max(128, "Password is too long."),
});

export function getLeadFormSchema(serviceSlug: ServiceSlug) {
  return z
    .object({
      serviceSlug: z.literal(serviceSlug),
      ...sharedLeadShape,
    })
    .and(serviceSchemas[serviceSlug])
    .superRefine((value, ctx) => {
      if (!isNonEmptyString(value.phone) && !isNonEmptyString(value.whatsapp)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Enter a phone number or WhatsApp number.",
        });
      }
    });
}

export const contactInquirySchema = z
  .object({
    serviceSlug: serviceSlugSchema,
    ...sharedLeadShape,
  })
  .superRefine((value, ctx) => {
    if (!isNonEmptyString(value.phone) && !isNonEmptyString(value.whatsapp)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Enter a phone number or WhatsApp number.",
      });
    }
  });

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

export function validateServiceLeadInput<TSlug extends ServiceSlug>(
  serviceSlug: TSlug,
  input: unknown,
) {
  return getLeadFormSchema(serviceSlug).safeParse(input);
}
