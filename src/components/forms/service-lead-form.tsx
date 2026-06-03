"use client";

import { useMemo, useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitLeadAction } from "@/actions/lead-actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import type { ServiceContent } from "@/lib/services";
import { getLeadFormSchema } from "@/lib/validations";
import {
  buildStoredUploadFileName,
  getFileInputAcceptValue,
  getMaxFileCountForField,
  sanitizeDisplayFileName,
  validateUploadedFile,
} from "@/lib/upload-security";
import { DocumentFormWrapper } from "./document-form-wrapper";
import { DocumentFormHeader } from "./document-form-header";
import { DocumentFormSection } from "./document-form-section";
import { DocumentFormField } from "./document-form-field";
import { DocumentFormUpload } from "./document-form-upload";
import { DocumentFormDeclaration } from "./document-form-declaration";
import {
  documentInputStyles,
  documentFileInputStyles,
  documentTextareaStyles,
  documentSelectStyles,
} from "./document-form-styles";

const contactOptions = ["Phone", "WhatsApp", "Email", "Any"] as const;

// Legacy styles for backward compatibility - now using document styles
const inputStyles = documentInputStyles;
const fileInputStyles = documentFileInputStyles;

type UploadedPhoto = {
  name: string;
  originalName?: string;
  type: string;
  size: number;
  dataUrl: string;
};

type DualUploadSlots = {
  front?: UploadedPhoto;
  back?: UploadedPhoto;
};

type DualUploadConfig = {
  fieldNames: [string, string];
  labels: [string, string];
  triggerLabel: string;
  successLabel: string;
};

function parseIsoDateAsUtc(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function isPassportAppointmentDateAllowed(value: string) {
  if (!value) {
    return true;
  }

  const parsedDate = parseIsoDateAsUtc(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const day = parsedDate.getUTCDay();

  return day >= 1 && day <= 3;
}

function getNextAllowedPassportAppointmentDate() {
  const currentDate = new Date();
  const candidate = new Date(
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
    ),
  );

  for (let index = 0; index < 14; index += 1) {
    const day = candidate.getUTCDay();

    if (day >= 1 && day <= 3) {
      return candidate.toISOString().slice(0, 10);
    }

    candidate.setUTCDate(candidate.getUTCDate() + 1);
  }

  return currentDate.toISOString().slice(0, 10);
}

function isUploadedPhoto(value: UploadedPhoto | undefined): value is UploadedPhoto {
  return Boolean(value);
}

const DUAL_UPLOAD_CONFIGS: Record<string, DualUploadConfig> = {
  partnerValidIdCard: {
    fieldNames: ["partnerValidIdCard", "partnerValidIdCard"],
    labels: ["Front", "Back"],
    triggerLabel: "Click to upload valid ID front and back",
    successLabel: "Valid ID front and back uploaded",
  },
  passportPhotographWhiteBackground: {
    fieldNames: [
      "passportPhotographWhiteBackground",
      "internationalPassportDataPage",
    ],
    labels: ["Passport photo", "Passport data page"],
    triggerLabel: "Click to upload passport photo and passport data page",
    successLabel: "Passport photo and passport data page uploaded",
  },
};

const DUAL_UPLOAD_ERROR_ALIASES: Record<string, string> = {
  internationalPassportDataPage: "passportPhotographWhiteBackground",
};

const defaultFamilyMember = {
  memberFullName: "",
  relationship: "",
  dateOfBirth: "",
  occupation: "",
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export function ServiceLeadForm({ service }: { service: ServiceContent }) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState(false);
  const [uploadFieldErrors, setUploadFieldErrors] = useState<Record<string, string | null>>({});
  const [uploadedPhotosByField, setUploadedPhotosByField] = useState<
    Record<string, UploadedPhoto[]>
  >({});
  const [dualUploadSlotsByField, setDualUploadSlotsByField] = useState<
    Record<string, DualUploadSlots>
  >({});
  const [openUploadField, setOpenUploadField] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(() => getLeadFormSchema(service.slug), [service.slug]);
  const [initialFormStartedAt] = useState(() => String(Date.now()));
  const passportAppointmentMinDate = useMemo(
    () =>
      service.slug === "nigeria-passport-online-registration"
        ? getNextAllowedPassportAppointmentDate()
        : undefined,
    [service.slug],
  );

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceSlug: service.slug,
      preferredContactMethod: "Any",
      website: "",
      formStartedAt: initialFormStartedAt,
      familyMembers: [defaultFamilyMember],
    },
  });

  const { fields: familyMemberFields, append, remove } = useFieldArray({
    control: control as never,
    name: "familyMembers" as never,
  });

  const applicantAgeGroup = useWatch({
    control,
    name: "applicantAgeGroup",
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerMessage(null);
    setServerSuccess(false);
    setUploadFieldErrors({});

    // Collect validation errors from schema validation
    const validationErrors: Record<string, string> = {};
    Object.entries(errors).forEach(([fieldName, error]) => {
      if (error?.message && DUAL_UPLOAD_CONFIGS[fieldName]) {
        validationErrors[fieldName] = error.message;
      }
      // Also check for internationalPassportDataPage errors
      if (fieldName === "internationalPassportDataPage" && error?.message) {
        validationErrors["passportPhotographWhiteBackground"] = error.message;
      }
    });
    
    if (Object.keys(validationErrors).length > 0) {
      setUploadFieldErrors(validationErrors);
    }

    startTransition(async () => {
      const mergedDualUploadValues = Object.entries(dualUploadSlotsByField).reduce<
        Record<string, UploadedPhoto[]>
      >((accumulator, [fieldName, slots]) => {
        const config = DUAL_UPLOAD_CONFIGS[fieldName];

        if (!config) {
          accumulator[fieldName] = [slots.front, slots.back].filter(isUploadedPhoto);
          return accumulator;
        }

        if (config.fieldNames[0] === config.fieldNames[1]) {
          accumulator[config.fieldNames[0]] = [slots.front, slots.back].filter(
            isUploadedPhoto,
          );
          return accumulator;
        }

        accumulator[config.fieldNames[0]] = slots.front ? [slots.front] : [];
        accumulator[config.fieldNames[1]] = slots.back ? [slots.back] : [];
        return accumulator;
      }, {});

      const response = await submitLeadAction(service.slug, {
        ...values,
        ...uploadedPhotosByField,
        ...mergedDualUploadValues,
      });

      if (!response.success) {
        setServerMessage(response.message);
        setServerSuccess(false);

        Object.entries(response.fieldErrors ?? {}).forEach(([field, issues]) => {
          if (issues.length > 0) {
            const resolvedField = DUAL_UPLOAD_ERROR_ALIASES[field] ?? field;

            setError(resolvedField, {
              message: issues[0],
            });

            if (resolvedField !== field) {
              setUploadFieldErrors((current) => ({
                ...current,
                [resolvedField]: issues[0],
              }));
            }
          }
        });
        return;
      }

      reset({
        serviceSlug: service.slug,
        preferredContactMethod: "Any",
        website: "",
        formStartedAt: String(Date.now()),
        familyMembers: [defaultFamilyMember],
      });
      setUploadedPhotosByField({});
      setDualUploadSlotsByField({});
      setOpenUploadField(null);
      setServerSuccess(true);
      setServerMessage(response.message);
    });
  });

  async function handlePhotoUpload(
    fieldName: string,
    fileList: FileList | null,
  ) {
    const maxUploads = getMaxFileCountForField(fieldName);

    setUploadFieldErrors((current) => ({
      ...current,
      [fieldName]: null,
    }));

    if (!fileList || fileList.length === 0) {
      setUploadedPhotosByField((current) => ({
        ...current,
        [fieldName]: [],
      }));
      setValue(fieldName, [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    const files = Array.from(fileList);

    if (files.length > maxUploads) {
      setUploadFieldErrors((current) => ({
        ...current,
        [fieldName]: `You can upload up to ${maxUploads} files.`,
      }));
      return;
    }

    for (const file of files) {
      const validationError = validateUploadedFile(fieldName, file);

      if (validationError) {
        setUploadFieldErrors((current) => ({
          ...current,
          [fieldName]: validationError,
        }));
        return;
      }
    }

    const uploadedPhotos = await Promise.all(
      files.map(async (file) => ({
        name: buildStoredUploadFileName(file.name, file.type),
        originalName: sanitizeDisplayFileName(file.name),
        type: file.type,
        size: file.size,
        dataUrl: await readFileAsDataUrl(file),
      })),
    );

    setUploadedPhotosByField((current) => ({
      ...current,
      [fieldName]: uploadedPhotos,
    }));
    setValue(fieldName, uploadedPhotos, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors(fieldName);
  }

  async function handleDualSideUpload(
    groupKey: string,
    fieldName: string,
    sideIndex: number,
    fileList: FileList | null,
  ) {
    setUploadFieldErrors((current) => ({
      ...current,
      [groupKey]: null,
    }));

    if (!fileList || fileList.length === 0) {
      return;
    }

    const file = fileList[0];

    const validationError = validateUploadedFile(fieldName, file);

    if (validationError) {
      setUploadFieldErrors((current) => ({
        ...current,
        [groupKey]: validationError,
      }));
      return;
    }

    const uploadedFile = {
      name: buildStoredUploadFileName(file.name, file.type),
      originalName: sanitizeDisplayFileName(file.name),
      type: file.type,
      size: file.size,
      dataUrl: await readFileAsDataUrl(file),
    };

    setDualUploadSlotsByField((current) => {
      const nextSlots = {
        front: sideIndex === 0 ? uploadedFile : current[groupKey]?.front,
        back: sideIndex === 1 ? uploadedFile : current[groupKey]?.back,
      };
      const config = DUAL_UPLOAD_CONFIGS[groupKey];

      if (config.fieldNames[0] === config.fieldNames[1]) {
        setValue(
          config.fieldNames[0],
          [nextSlots.front, nextSlots.back].filter(isUploadedPhoto),
          {
            shouldDirty: true,
            shouldValidate: true,
          },
        );
        clearErrors(config.fieldNames[0]);
      } else {
        setValue(config.fieldNames[0], nextSlots.front ? [nextSlots.front] : [], {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue(config.fieldNames[1], nextSlots.back ? [nextSlots.back] : [], {
          shouldDirty: true,
          shouldValidate: true,
        });
        clearErrors(config.fieldNames[0]);
        clearErrors(config.fieldNames[1]);
      }

      return {
        ...current,
        [groupKey]: nextSlots,
      };
    });
  }

  return (
    <DocumentFormWrapper>
      <form onSubmit={onSubmit}>
      <DocumentFormHeader
        title={`Application for ${service.title}`}
        subtitle="Complete this form with accurate information for processing"
      />

      {/* Hidden anti-spam fields */}
      <input
        autoComplete="off"
        className="hidden"
        tabIndex={-1}
        type="text"
        {...register("website")}
      />
      <input
        className="hidden"
        type="hidden"
        {...register("formStartedAt")}
      />

      {/* Section 1: Applicant Information */}
      <DocumentFormSection sectionNumber={1} title="Applicant Information">
        <div className="grid gap-6 md:grid-cols-2">
          <DocumentFormField error={errors.fullName?.message} htmlFor="fullName" label="Full Name" required>
            <input className={inputStyles} id="fullName" {...register("fullName")} />
          </DocumentFormField>
          <DocumentFormField error={errors.email?.message} htmlFor="email" label="Email">
            <input className={inputStyles} id="email" type="email" {...register("email")} />
          </DocumentFormField>
          <DocumentFormField error={errors.phone?.message} htmlFor="phone" label="Phone">
            <input className={inputStyles} id="phone" type="tel" {...register("phone")} />
          </DocumentFormField>
          <DocumentFormField error={errors.whatsapp?.message} htmlFor="whatsapp" label="WhatsApp">
            <input className={inputStyles} id="whatsapp" type="tel" {...register("whatsapp")} />
          </DocumentFormField>
        </div>
      </DocumentFormSection>

      {/* Section 2: Preferred Contact & Service Notes */}
      <DocumentFormSection sectionNumber={2} title="Service Details & Contact Method">
        <div className="grid gap-6 md:grid-cols-2">
          <DocumentFormField
            error={errors.preferredContactMethod?.message}
            htmlFor="preferredContactMethod"
            label="Preferred Contact Method"
          >
            <select className={documentSelectStyles} id="preferredContactMethod" {...register("preferredContactMethod")}>
              {contactOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </DocumentFormField>
        </div>

        {/* Service-specific notices */}
        {(service.slug === "court-e-affidavit" ||
          service.slug === "nigeria-e-visa" ||
          service.slug === "national-population-commission-digital-certificate") && (
          <div className="mt-6 rounded-lg border-l-4 border-l-[var(--color-gold)] bg-[rgba(234,216,183,0.08)] px-4 py-3 text-xs leading-6 text-[var(--color-navy-soft)]">
            {service.slug === "court-e-affidavit" && (
              <p>
                <span className="font-semibold">Legal Notice:</span> This service does not replace legal advice. For complex or significant legal
                matters, consult a qualified Nigerian lawyer.
              </p>
            )}
            {service.slug === "nigeria-e-visa" && (
              <p>
                <span className="font-semibold">Important:</span> Visa eligibility and processing times may vary. Approval is not
                guaranteed.
              </p>
            )}
            {service.slug === "national-population-commission-digital-certificate" && (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Note:</span> The NPC Digital Certificate is compulsory for NIN registration.
                </p>
                <p>For children under 16, please call the centre before booking.</p>
                <p>Have required documents ready before attending enrolment-related appointments.</p>
              </div>
            )}
          </div>
        )}
      </DocumentFormSection>
      {/* Section 3: Service-Specific Information */}
      <DocumentFormSection sectionNumber={3} title="Service-Specific Information">
        <div className="space-y-8">
          {service.formFields.map((field) => {
            if (field.name === "internationalPassportDataPage") {
              return null;
            }

            if (field.name === "familyMembers") {
              const familyMemberError =
                (errors.familyMembers as { message?: string } | undefined)?.message ??
                undefined;

              return (
                <div key={field.name}>
                  <DocumentFormField
                    description={field.description}
                    error={familyMemberError}
                    htmlFor={field.name}
                    label={field.label}
                    required={field.required}
                    fullWidth
                  >
                    <div className="space-y-4">
                      {familyMemberFields.map((member, index) => {
                        const rowErrors = Array.isArray(errors.familyMembers)
                          ? errors.familyMembers[index]
                          : undefined;

                        return (
                          <div
                            className="rounded-lg border border-[var(--color-line)] bg-[rgba(17,32,49,0.03)] p-4"
                            key={member.id}
                          >
                            <div className="flex items-center justify-between gap-3 mb-4">
                              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                                Family Member {index + 1}
                              </p>
                              {familyMemberFields.length > 1 ? (
                                <button
                                  className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-navy-soft)] transition hover:text-red-600"
                                  onClick={() => remove(index)}
                                  type="button"
                                >
                                  Remove
                                </button>
                              ) : null}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                              <DocumentFormField
                                error={rowErrors?.memberFullName?.message as string | undefined}
                                htmlFor={`familyMembers.${index}.memberFullName`}
                                label="Full Name"
                                required
                              >
                                <input
                                  className={inputStyles}
                                  id={`familyMembers.${index}.memberFullName`}
                                  {...register(`familyMembers.${index}.memberFullName` as const)}
                                />
                              </DocumentFormField>
                              <DocumentFormField
                                error={rowErrors?.relationship?.message as string | undefined}
                                htmlFor={`familyMembers.${index}.relationship`}
                                label="Relationship"
                                required
                              >
                                <input
                                  className={inputStyles}
                                  id={`familyMembers.${index}.relationship`}
                                  {...register(`familyMembers.${index}.relationship` as const)}
                                />
                              </DocumentFormField>
                              <DocumentFormField
                                error={rowErrors?.dateOfBirth?.message as string | undefined}
                                htmlFor={`familyMembers.${index}.dateOfBirth`}
                                label="Date of Birth"
                                required
                              >
                                <input
                                  className={inputStyles}
                                  id={`familyMembers.${index}.dateOfBirth`}
                                  type="date"
                                  {...register(`familyMembers.${index}.dateOfBirth` as const)}
                                />
                              </DocumentFormField>
                              <DocumentFormField
                                error={rowErrors?.occupation?.message as string | undefined}
                                htmlFor={`familyMembers.${index}.occupation`}
                                label="Occupation"
                                required
                              >
                                <input
                                  className={inputStyles}
                                  id={`familyMembers.${index}.occupation`}
                                  {...register(`familyMembers.${index}.occupation` as const)}
                                />
                              </DocumentFormField>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        className="inline-flex items-center justify-center rounded-lg border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                        onClick={() => append({ ...defaultFamilyMember })}
                        type="button"
                      >
                        + Add Family Member
                      </button>
                    </div>
                  </DocumentFormField>
                </div>
              );
            }

            const error = errors[field.name]?.message as string | undefined;
            const registeredField = register(field.name);
            const { onChange: registeredOnChange, ...registeredFieldProps } =
              registeredField;
            const dualUploadConfig = DUAL_UPLOAD_CONFIGS[field.name];
            const dualUploadSlots = dualUploadConfig
              ? dualUploadSlotsByField[field.name]
              : undefined;
            const dualUploadCount = dualUploadSlots
              ? [dualUploadSlots.front, dualUploadSlots.back].filter(isUploadedPhoto).length
              : 0;

            const isTwoColumnField = field.type !== "textarea" && field.type !== "file";

            return (
              <div key={field.name} className={isTwoColumnField ? "md:grid md:grid-cols-2 md:gap-6" : ""}>
                <DocumentFormField
                  description={field.description}
                  error={error}
                  htmlFor={field.name}
                  label={field.label}
                  required={field.required}
                  fullWidth
                >
                  {field.type === "textarea" ? (
                    <textarea
                      className={documentTextareaStyles}
                      id={field.name}
                      rows={5}
                      {...registeredField}
                    />
                  ) : field.type === "select" ? (
                    <select className={documentSelectStyles} id={field.name} {...registeredField}>
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "file" && dualUploadConfig ? (
                    <DocumentFormUpload
                      error={uploadFieldErrors[field.name] ?? undefined}
                      fullWidth
                    >
                      <button
                        className="w-full rounded-lg border border-[var(--color-line)] bg-white px-4 py-3 text-left text-sm font-medium text-[var(--color-navy)] transition hover:border-[var(--color-gold)]"
                        onClick={(event) => {
                          event.preventDefault();
                          setOpenUploadField((current) =>
                            current === field.name ? null : field.name,
                          );
                        }}
                        type="button"
                      >
                        {dualUploadCount === 2
                          ? dualUploadConfig.successLabel
                          : dualUploadConfig.triggerLabel}
                      </button>

                      {openUploadField === field.name ? (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-lg border border-dashed border-[var(--color-line)] bg-[rgba(17,32,49,0.03)] p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-gold)] mb-3">
                              {dualUploadConfig.labels[0]}
                            </p>
                            <input
                              accept={getFileInputAcceptValue(
                                dualUploadConfig.fieldNames[0],
                              )}
                              className={`${documentFileInputStyles}`}
                              id={`${field.name}-front`}
                              onChange={(event) => {
                                void handleDualSideUpload(
                                  field.name,
                                  dualUploadConfig.fieldNames[0],
                                  0,
                                  event.target.files,
                                );
                              }}
                              type="file"
                            />
                            {dualUploadSlots?.front ? (
                              <p className="mt-2 text-xs leading-6 text-[var(--color-navy-soft)]">
                                {dualUploadSlots.front.originalName ?? dualUploadSlots.front.name}
                              </p>
                            ) : null}
                          </div>
                          <div className="rounded-lg border border-dashed border-[var(--color-line)] bg-[rgba(17,32,49,0.03)] p-4">
                            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-gold)] mb-3">
                              {dualUploadConfig.labels[1]}
                            </p>
                            <input
                              accept={getFileInputAcceptValue(
                                dualUploadConfig.fieldNames[1],
                              )}
                              className={`${documentFileInputStyles}`}
                              id={`${field.name}-back`}
                              onChange={(event) => {
                                void handleDualSideUpload(
                                  field.name,
                                  dualUploadConfig.fieldNames[1],
                                  1,
                                  event.target.files,
                                );
                              }}
                              type="file"
                            />
                            {dualUploadSlots?.back ? (
                              <p className="mt-2 text-xs leading-6 text-[var(--color-navy-soft)]">
                                {dualUploadSlots.back.originalName ?? dualUploadSlots.back.name}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </DocumentFormUpload>
                  ) : field.type === "file" ? (
                    <DocumentFormUpload
                      error={uploadFieldErrors[field.name] ?? undefined}
                      fullWidth
                    >
                      <input
                        accept={getFileInputAcceptValue(field.name)}
                        className={documentFileInputStyles}
                        id={field.name}
                        multiple
                        onChange={(event) => {
                          void handlePhotoUpload(field.name, event.target.files);
                        }}
                        type="file"
                      />
                      {uploadedPhotosByField[field.name]?.length ? (
                        <p className="mt-2 text-xs leading-6 text-[var(--color-navy-soft)]">
                          {uploadedPhotosByField[field.name]
                            .map((file) => file.originalName ?? file.name)
                            .join(", ")}
                        </p>
                      ) : null}
                    </DocumentFormUpload>
                  ) : (
                    <input
                      className={inputStyles}
                      id={field.name}
                      min={
                        service.slug === "nigeria-passport-online-registration" &&
                        field.name === "preferredAppointmentDate"
                          ? passportAppointmentMinDate
                          : undefined
                      }
                      onChange={(event) => {
                        if (
                          service.slug === "nigeria-passport-online-registration" &&
                          field.name === "preferredAppointmentDate"
                        ) {
                          const nextValue = event.target.value;

                          if (nextValue && !isPassportAppointmentDateAllowed(nextValue)) {
                            event.target.value = "";
                            setValue(field.name, "", {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setError(field.name, {
                              message:
                                "Choose a Monday, Tuesday, or Wednesday appointment date.",
                            });
                            event.target.setCustomValidity(
                              "Choose a Monday, Tuesday, or Wednesday appointment date.",
                            );
                            event.target.reportValidity();
                            return;
                          }

                          clearErrors(field.name);
                          event.target.setCustomValidity("");
                        }

                        registeredOnChange(event);
                      }}
                      placeholder={field.placeholder}
                      type={field.type}
                      {...registeredFieldProps}
                    />
                  )}
                </DocumentFormField>
              </div>
            );
          })}
        </div>
      </DocumentFormSection>

      {/* Age-related notice for NIN service */}
      {service.slug === "national-identification-number" && applicantAgeGroup === "Child under 16" && (
        <DocumentFormSection title="Important Notice">
          <div className="rounded-lg border-l-4 border-l-[var(--color-gold)] bg-[rgba(234,216,183,0.08)] px-4 py-3 text-xs leading-6 text-[var(--color-navy-soft)]">
            For children under 16, please call the centre before booking.
          </div>
        </DocumentFormSection>
      )}

      {/* Declaration & Consent Section */}
      <DocumentFormDeclaration>
        <label className="flex items-start gap-3 text-sm leading-6 text-[var(--color-navy)]">
          <input
            className="mt-1 size-4 rounded border border-[var(--color-line)] cursor-pointer"
            type="checkbox"
            {...register("consent")}
          />
          <span className="text-xs leading-6 text-[var(--color-navy-soft)]">
            I confirm that the information provided in this form is accurate and complete. I authorize Liberty Digital Consulting Services to review and process this submission for the selected service.
          </span>
        </label>
        <p aria-live="polite" className="min-h-5 text-xs text-red-600">
          {errors.consent?.message}
        </p>

        {/* Server Message */}
        {serverMessage && (
          <div
            className={`rounded-lg px-4 py-3 text-xs leading-6 ${
              serverSuccess
                ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {serverMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center gap-3 pt-2">
          <Button disabled={isPending} type="submit" className="px-6">
            {isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </DocumentFormDeclaration>
      </form>
    </DocumentFormWrapper>
  );
}
