import { z } from "zod";

import { SERVICES_BY_SLUG, type ServiceSlug } from "@/lib/services";
import { isNonEmptyString } from "@/lib/utils";

const serviceSlugSchema = z.custom<ServiceSlug>(
  (value) =>
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(SERVICES_BY_SLUG, value),
  "Invalid service selection",
);

const uploadedPhotoSchema = z.object({
  name: z.string().min(1, "File name is required."),
  type: z.string().min(1, "File type is required."),
  size: z.number().nonnegative(),
  dataUrl: z.string().min(1, "Image data is required."),
});

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
      passportPhotographs: z
        .array(uploadedPhotoSchema)
        .min(1, "Upload at least one passport photograph.")
        .max(2),
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
      surname: z.string().trim().min(1, "Surname is required."),
      firstName: z.string().trim().min(1, "First name is required."),
      middleName: z.string().trim().optional().or(z.literal("")),
      dateOfBirth: z.string().min(1, "Date of birth is required."),
      placeOfBirth: z.string().trim().min(1, "Place of birth is required."),
      residentAddress: z.string().trim().min(1, "Resident address is required."),
      stateOfOrigin: z.string().trim().min(1, "State of origin is required."),
      lgaOfState: z.string().trim().min(1, "LGA of state is required."),
      gender: z.string().min(1, "Choose a gender."),
      height: z.string().trim().min(1, "Height is required."),
      maritalStatus: z.string().trim().min(1, "Marital status is required."),
      passportNumber: z.string().trim().min(1, "Passport details are required."),
      nextOfKin: z.string().trim().min(1, "Next of kin is required."),
      fatherFullName: z.string().trim().min(1, "Father full name is required."),
      motherFullName: z.string().trim().min(1, "Mother full name is required."),
      declarationDate: z.string().optional().or(z.literal("")),
      neverDoneNinBefore: z.string().min(1, "Choose an option."),
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
      passportExpiryDate: z.string().min(1, "Passport expiry date is required."),
      passportPhotographs: z
        .array(uploadedPhotoSchema)
        .min(1, "Upload at least one passport photograph.")
        .max(2),
      hasInvitationLetter: z.string().min(1, "Choose an option."),
      hasValidPassportSixMonths: z.string().min(1, "Choose an option."),
    }),
    "national-population-commission-digital-certificate": z.object({
      certificateType: z.string().min(1, "Choose a certificate type."),
      applicantAgeGroup: z.string().min(1, "Choose an age group."),
      isForNINRegistration: z.string().min(1, "Choose an option."),
      preferredAppointmentDate: z.string().optional().or(z.literal("")),
    }),
    "emergency-travel-certificate": z.object({
      declarantTitle: z.string().min(1, "Choose a title."),
      declarantFullName: z.string().trim().min(2, "Full name is required."),
      birthPlace: z.string().trim().min(2, "Place of birth is required."),
      birthDate: z.string().min(1, "Date of birth is required."),
      residentCityInItaly: z.string().trim().min(2, "Resident city is required."),
      residentStreetInItaly: z.string().trim().min(2, "Street is required."),
      streetNumber: z.string().trim().optional().or(z.literal("")),
      lostPassportNumber: z.string().trim().min(1, "Lost passport number is required."),
      passportIssuePlace: z.string().trim().optional().or(z.literal("")),
      passportIssueDate: z.string().optional().or(z.literal("")),
      passportLostLocation: z.string().trim().min(2, "Lost location is required."),
      passportLostDate: z.string().optional().or(z.literal("")),
      policeReportDate: z.string().optional().or(z.literal("")),
      flightName: z.string().trim().optional().or(z.literal("")),
      flightNumber: z.string().trim().optional().or(z.literal("")),
      travelDate: z.string().optional().or(z.literal("")),
      declarationDate: z.string().optional().or(z.literal("")),
      hasTwoPhotographs: z.string().min(1, "Choose an option."),
      passportPhotographs: z
        .array(uploadedPhotoSchema)
        .min(1, "Upload at least one passport photograph.")
        .max(2),
    }),
    "nulla-osta-for-marriage": z.object({
      neverPreviouslyMarried: z.string().min(1, "Choose an option."),
      previouslyMarriedDivorcedOrWidow: z.string().min(1, "Choose an option."),
      declarationNeededForRecordPurposes: z.string().min(1, "Choose an option."),
      surname: z.string().trim().min(1, "Surname is required."),
      names: z.string().trim().min(1, "Name(s) are required."),
      dateOfBirth: z.string().min(1, "Date of birth is required."),
      placeOfBirth: z.string().trim().min(1, "Place of birth is required."),
      sex: z.string().min(1, "Choose a sex."),
      nationality: z.string().trim().min(1, "Nationality is required."),
      fatherNames: z.string().trim().min(1, "Father's names are required."),
      motherNames: z.string().trim().min(1, "Mother's names are required."),
      passportOrCertificateOfNationality: z.string().trim().min(1, "Passport or certificate number is required."),
      dateIssued: z.string().optional().or(z.literal("")),
      placeOfIssue: z.string().trim().optional().or(z.literal("")),
      expiryDate: z.string().optional().or(z.literal("")),
      addressInNigeria: z.string().trim().min(1, "Address in Nigeria is required."),
      addressInItaly: z.string().trim().min(1, "Address in Italy is required."),
      profession: z.string().trim().optional().or(z.literal("")),
      civilStatus: z.string().trim().optional().or(z.literal("")),
      partnerSurname: z.string().trim().min(1, "Partner surname is required."),
      partnerNames: z.string().trim().min(1, "Partner name(s) are required."),
      partnerPlaceOfBirth: z.string().trim().min(1, "Partner place of birth is required."),
      partnerDateOfBirth: z.string().min(1, "Partner date of birth is required."),
    }),
    "document-legalization-at-nigerian-embassy": z.object({
      documentType: z.string().trim().min(2, "Document type is required."),
      legalizationPurpose: z.string().trim().min(2, "Purpose is required."),
      destinationInstitutionOrCountry: z.string().trim().optional().or(z.literal("")),
      documentCount: z.string().min(1, "Choose the number of documents."),
      hasOriginalDocumentsReady: z.string().min(1, "Choose an option."),
    }),
    "certificate-of-nationality": z.object({
      surname: z.string().trim().min(1, "Surname is required."),
      names: z.string().trim().min(1, "Name(s) are required."),
      dateOfBirth: z.string().min(1, "Date of birth is required."),
      placeOfBirth: z.string().trim().min(1, "Place of birth is required."),
      sex: z.string().min(1, "Choose a sex."),
      fatherNames: z.string().trim().min(1, "Father's names are required."),
      motherNames: z.string().trim().min(1, "Mother's names are required."),
      addressInNigeria: z.string().trim().min(1, "Address in Nigeria is required."),
      addressInItalyAndPhone: z.string().trim().min(1, "Address in Italy and phone are required."),
      profession: z.string().trim().optional().or(z.literal("")),
      civilStatus: z.string().trim().optional().or(z.literal("")),
      hasTwoPassportPhotographs: z.string().min(1, "Choose an option."),
      passportPhotographs: z
        .array(uploadedPhotoSchema)
        .min(1, "Upload at least one passport photograph.")
        .max(2),
    }),
    "citizenship-letter-to-questura": z.object({
      surname: z.string().trim().min(1, "Surname is required."),
      names: z.string().trim().min(1, "Name(s) are required."),
      birthPlaceInNigeria: z.string().trim().min(1, "Birth place is required."),
      dateOfBirth: z.string().min(1, "Date of birth is required."),
      passportNumber: z.string().trim().min(1, "Passport number is required."),
      passportIssuePlace: z.string().trim().min(1, "Passport issue place is required."),
      passportIssueDate: z.string().min(1, "Passport issue date is required."),
      residentCityInItaly: z.string().trim().min(1, "Resident city is required."),
      residentStreetInItaly: z.string().trim().min(1, "Street is required."),
      streetNumber: z.string().trim().optional().or(z.literal("")),
    }),
    "same-person-letter": z.object({
      firstPersonName: z.string().trim().min(1, "First person's name is required."),
      firstPersonBirthPlace: z.string().trim().min(1, "First person's birthplace is required."),
      firstPersonBirthDate: z.string().min(1, "First person's date of birth is required."),
      secondPersonName: z.string().trim().min(1, "Second person's name is required."),
      secondPersonBirthPlace: z.string().trim().min(1, "Second person's birthplace is required."),
      secondPersonBirthDate: z.string().min(1, "Second person's date of birth is required."),
      correctSurname: z.string().trim().min(1, "Correct surname is required."),
      correctName: z.string().trim().min(1, "Correct name is required."),
      correctBirthPlace: z.string().trim().min(1, "Correct birthplace is required."),
      correctBirthDate: z.string().min(1, "Correct date of birth is required."),
      passportNumber: z.string().trim().min(1, "Passport number is required."),
      passportIssuedBy: z.string().trim().min(1, "Issuing authority is required."),
      passportIssueDate: z.string().min(1, "Passport issue date is required."),
      passportExpiryDate: z.string().min(1, "Passport expiry date is required."),
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
