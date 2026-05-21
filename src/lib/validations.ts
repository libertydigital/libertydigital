import { z } from "zod";

import {
  getAcceptedMimeTypesForField,
  getMaxFileCountForField,
  validateUploadedFile,
} from "@/lib/upload-security";
import { SERVICES_BY_SLUG, type ServiceSlug } from "@/lib/services";
import { isNonEmptyString } from "@/lib/utils";

const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const minSubmissionDurationMs = 3_000;
const maxSubmissionAgeMs = 12 * 60 * 60 * 1_000;
const maxFutureSubmissionOffsetMs = 30_000;

const serviceSlugSchema = z.custom<ServiceSlug>(
  (value) =>
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(SERVICES_BY_SLUG, value),
  "Invalid service selection",
);

const leadIdSchema = z.string().cuid("Invalid lead reference.");

const uploadedFileSchema = z
  .object({
    name: z.string().trim().min(1, "Stored file name is required."),
    originalName: z.string().trim().max(120).optional(),
    type: z.string().trim().min(1, "File type is required."),
    size: z.number().nonnegative(),
    dataUrl: z.string().trim().min(1, "File data is required."),
  })
  .superRefine((file, ctx) => {
    const match = file.dataUrl.match(/^data:([a-z0-9.+-]+\/[a-z0-9.+-]+);base64,/i);

    if (!match) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dataUrl"],
        message: "Invalid upload data.",
      });
      return;
    }

    if (match[1].toLowerCase() !== file.type.trim().toLowerCase()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["type"],
        message: "Upload type does not match file content.",
      });
    }
  });

function buildUploadArraySchema(options: {
  fieldName: string;
  min?: number;
  max?: number;
  requiredMessage?: string;
}) {
  const {
    fieldName,
    min = 0,
    max = getMaxFileCountForField(fieldName),
    requiredMessage = "Upload at least one file.",
  } = options;

  return z.array(uploadedFileSchema).superRefine((files, ctx) => {
    if (files.length < min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: requiredMessage,
      });
    }

    if (files.length > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `You can upload up to ${max} files.`,
      });
    }

    files.forEach((file, index) => {
      const validationError = validateUploadedFile(fieldName, file);

      if (validationError) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index],
          message: validationError,
        });
      }
    });
  });
}

const imageUploadSchema = (fieldName: string, min = 1, max = getMaxFileCountForField(fieldName), requiredMessage?: string) =>
  buildUploadArraySchema({ fieldName, min, max, requiredMessage });

const optionalDocumentUploadSchema = (fieldName: string) =>
  buildUploadArraySchema({ fieldName, min: 0, max: getMaxFileCountForField(fieldName) }).optional();

const sharedLeadShape = {
  fullName: z.string().trim().min(2, "Full name is required."),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || z.string().email().safeParse(value).success,
      "Enter a valid email address.",
    ),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  preferredContactMethod: z.enum(["Phone", "WhatsApp", "Email", "Any"]).optional(),
  message: z
    .string()
    .trim()
    .max(3000)
    .refine((value) => !value || !controlCharacterPattern.test(value), "Message contains invalid characters.")
    .optional()
    .or(z.literal("")),
  website: z.literal("").optional(),
  formStartedAt: z.string().trim().regex(/^\d{10,16}$/, "Invalid submission state."),
  consent: z.literal(true, {
    message:
      "You must agree before Liberty Digital Consulting Services can contact you.",
  }),
};

function addSubmissionTimingChecks(
  formStartedAt: string,
  ctx: z.RefinementCtx,
) {
  const startedAt = Number(formStartedAt);

  if (!Number.isFinite(startedAt)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["formStartedAt"],
      message: "Invalid submission state.",
    });
    return;
  }

  const now = Date.now();
  const elapsedMs = now - startedAt;

  if (startedAt > now + maxFutureSubmissionOffsetMs) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["formStartedAt"],
      message: "Invalid submission timing.",
    });
  }

  if (elapsedMs < minSubmissionDurationMs) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["formStartedAt"],
      message: "Submission was too fast. Please try again.",
    });
  }

  if (elapsedMs > maxSubmissionAgeMs) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["formStartedAt"],
      message: "This form has expired. Refresh the page and try again.",
    });
  }
}

const serviceSchemas: Record<ServiceSlug, z.ZodObject<Record<string, z.ZodTypeAny>>> = {
  "nigeria-passport-online-registration": z.object({
    applicationType: z.string().min(1, "Choose an application type."),
    passportPages: z.string().min(1, "Choose a passport booklet option."),
    hasPreviousPassport: z.string().min(1, "Choose an option."),
    preferredAppointmentDate: z.string().optional().or(z.literal("")),
    passportPhotographs: imageUploadSchema(
      "passportPhotographs",
      1,
      2,
      "Upload at least one passport photograph.",
    ),
    hasSupportingDocuments: z.string().min(1, "Choose an option."),
  }),
  "court-e-affidavit": z.object({
    affidavitPurpose: z.string().trim().min(2, "Purpose is required."),
    jurisdictionOrState: z.string().trim().min(2, "Jurisdiction or state is required."),
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
    surname: z.string().trim().min(1, "Surname is required."),
    firstName: z.string().trim().min(1, "First name is required."),
    middleName: z.string().trim().optional().or(z.literal("")),
    customerId: z.string().trim().optional().or(z.literal("")),
    nationalIdentityNumber: z.string().trim().optional().or(z.literal("")),
    title: z.string().min(1, "Choose a title."),
    maritalStatus: z.string().min(1, "Choose a marital status."),
    gender: z.string().min(1, "Choose a gender."),
    dateOfBirth: z.string().min(1, "Date of birth is required."),
    nationality: z.string().trim().min(1, "Nationality is required."),
    stateOfOrigin: z.string().trim().min(1, "State of origin is required."),
    lgaOfOrigin: z.string().trim().min(1, "LGA of origin is required."),
    residentialAddress: z.string().trim().min(1, "Residential address is required."),
    lgaOfResidence: z.string().trim().min(1, "LGA of residence is required."),
    stateOfResidence: z.string().trim().min(1, "State of residence is required."),
    landmarks: z.string().trim().optional().or(z.literal("")),
    phoneNumber1: z.string().trim().min(1, "Phone number 1 is required."),
    phoneNumber2: z.string().trim().optional().or(z.literal("")),
    emailAddress: z.string().trim().optional().or(z.literal("")),
    locationOfCardCollection: z.string().trim().min(1, "Location of card collection is required."),
    signatureDate: z.string().min(1, "Date is required."),
  }),
  "nigeria-e-visa": z.object({
    visaType: z.string().min(1, "Choose a visa type."),
    nationality: z.string().trim().min(2, "Nationality is required."),
    travelPurpose: z.string().trim().min(2, "Travel purpose is required."),
    expectedTravelDate: z.string().optional().or(z.literal("")),
    passportExpiryDate: z.string().min(1, "Passport expiry date is required."),
    passportPhotographs: imageUploadSchema(
      "passportPhotographs",
      1,
      2,
      "Upload at least one passport photograph.",
    ),
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
    passportPhotographs: imageUploadSchema(
      "passportPhotographs",
      1,
      2,
      "Upload at least one passport photograph.",
    ),
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
    passportOrCertificateOfNationality: z
      .string()
      .trim()
      .min(1, "Passport or certificate number is required."),
    dateIssued: z.string().optional().or(z.literal("")),
    placeOfIssue: z.string().trim().optional().or(z.literal("")),
    expiryDate: z.string().optional().or(z.literal("")),
    passportPhotographWhiteBackground: imageUploadSchema(
      "passportPhotographWhiteBackground",
      1,
      1,
      "Upload the passport photograph with white background.",
    ),
    internationalPassportDataPage: imageUploadSchema(
      "internationalPassportDataPage",
      1,
      1,
      "Upload the international passport data page.",
    ),
    addressInNigeria: z.string().trim().min(1, "Address in Nigeria is required."),
    addressInItaly: z.string().trim().min(1, "Address in Italy is required."),
    profession: z.string().trim().optional().or(z.literal("")),
    civilStatus: z.string().trim().optional().or(z.literal("")),
    partnerSurname: z.string().trim().min(1, "Partner surname is required."),
    partnerNames: z.string().trim().min(1, "Partner name(s) are required."),
    partnerPlaceOfBirth: z.string().trim().min(1, "Partner place of birth is required."),
    partnerDateOfBirth: z.string().min(1, "Partner date of birth is required."),
    partnerValidIdCard: imageUploadSchema(
      "partnerValidIdCard",
      2,
      2,
      "Upload both the front and back of the valid ID card.",
    ),
  }),
  "document-legalization-at-nigerian-embassy": z.object({
    documentType: z.string().trim().min(2, "Document type is required."),
    legalizationPurpose: z.string().trim().min(2, "Purpose is required."),
    destinationInstitutionOrCountry: z.string().trim().optional().or(z.literal("")),
    documentsToLegalize: optionalDocumentUploadSchema("documentsToLegalize"),
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
    passportPhotographs: imageUploadSchema(
      "passportPhotographs",
      1,
      2,
      "Upload at least one passport photograph.",
    ),
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
  "family-income-document": z.object({
    applicantDateOfBirth: z.string().min(1, "Applicant date of birth is required."),
    applicantPlaceOfBirth: z.string().trim().min(1, "Applicant place of birth is required."),
    declarationYear: z.string().trim().min(4, "Declaration year is required."),
    familyMembers: z
      .array(
        z.object({
          memberFullName: z.string().trim().min(1, "Family member full name is required."),
          relationship: z.string().trim().min(1, "Relationship is required."),
          dateOfBirth: z.string().min(1, "Date of birth is required."),
          occupation: z.string().trim().min(1, "Occupation is required."),
        }),
      )
      .min(1, "Add at least one family member."),
  }),
  "letter-of-single": z.object({
    surnameAndNames: z.string().trim().min(1, "Surname and names are required."),
    placeOfBirth: z.string().trim().min(1, "Place of birth is required."),
    dateOfBirth: z.string().min(1, "Date of birth is required."),
    nationality: z.string().trim().min(1, "Nationality is required."),
    sex: z.string().min(1, "Choose a sex."),
    paternity: z.string().trim().min(1, "Paternity is required."),
    maternity: z.string().trim().min(1, "Maternity is required."),
    residence: z.string().trim().min(1, "Residence is required."),
    civilStatus: z.string().min(1, "Choose a civil status."),
  }),
  "newspaper-publication": z.object({
    oldSurname: z.string().trim().min(1, "Old surname is required."),
    oldName: z.string().trim().min(1, "Old name is required."),
    oldMiddleName: z.string().trim().optional().or(z.literal("")),
    oldDateOfBirth: z.string().min(1, "Old date of birth is required."),
    oldPlaceOfBirth: z.string().trim().min(1, "Old place of birth is required."),
    newSurname: z.string().trim().min(1, "New surname is required."),
    newName: z.string().trim().min(1, "New name is required."),
    newDateOfBirth: z.string().min(1, "New date of birth is required."),
    newPlaceOfBirth: z.string().trim().min(1, "New place of birth is required."),
  }),
  "letter-to-prison": z.object({
    applicantNameOnId: z.string().trim().min(1, "Applicant name is required."),
    applicantValidIdCard: imageUploadSchema(
      "applicantValidIdCard",
      1,
      1,
      "Upload the applicant's valid ID card.",
    ),
    detainedPersonFullName: z.string().trim().min(1, "Detained person's full name is required."),
    prisonName: z.string().trim().min(1, "Prison name is required."),
    prisonLocation: z.string().trim().optional().or(z.literal("")),
    relationshipToDetainedPerson: z
      .string()
      .trim()
      .min(1, "Relationship to the detained person is required."),
    requestPurpose: z.string().trim().min(1, "Purpose of the prison-related letter is required."),
  }),
  "child-recognition-of-the-father-or-mother": z.object({
    childFullName: z.string().trim().min(1, "Child full name is required."),
    childDateOfBirth: z.string().min(1, "Child date of birth is required."),
    childPlaceOfBirth: z.string().trim().min(1, "Child place of birth is required."),
    fatherFullName: z.string().trim().min(1, "Father's full name is required."),
    motherFullName: z.string().trim().min(1, "Mother's full name is required."),
    recognizingParent: z.string().min(1, "Choose an option."),
    currentChildStatus: z.string().trim().min(1, "Current child-record status is required."),
    supportingDocumentsReady: z.string().min(1, "Choose an option."),
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
  leadId: leadIdSchema,
  note: z
    .string()
    .trim()
    .min(3, "Note is required.")
    .max(2000, "Note is too long.")
    .refine((value) => !controlCharacterPattern.test(value), "Note contains invalid characters."),
});

export const followUpDateSchema = z.object({
  leadId: leadIdSchema,
  followUpDate: z
    .string()
    .trim()
    .regex(isoDatePattern, "Enter a valid follow-up date.")
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime()), "Enter a valid follow-up date."),
});

export const leadStatusUpdateSchema = z.object({
  leadId: leadIdSchema,
  status: leadStatusSchema,
});

export const adminAccountCreateSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
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
      addSubmissionTimingChecks(value.formStartedAt, ctx);

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
    addSubmissionTimingChecks(value.formStartedAt, ctx);

    if (!isNonEmptyString(value.phone) && !isNonEmptyString(value.whatsapp)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Enter a phone number or WhatsApp number.",
      });
    }
  });

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
export { leadIdSchema, serviceSlugSchema };

export function validateServiceLeadInput<TSlug extends ServiceSlug>(
  serviceSlug: TSlug,
  input: unknown,
) {
  return getLeadFormSchema(serviceSlug).safeParse(input);
}

export function getAllowedUploadMimeTypesForField(fieldName: string) {
  return getAcceptedMimeTypesForField(fieldName);
}
