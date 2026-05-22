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

const contactOptions = ["Phone", "WhatsApp", "Email", "Any"] as const;

const inputStyles =
  "w-full rounded-[20px] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-sm text-[var(--color-navy)] shadow-sm outline-none placeholder:text-[var(--color-navy-soft)] focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[rgba(179,135,64,0.15)]";

const fileInputStyles =
  "w-full rounded-[20px] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-sm text-[var(--color-navy)] shadow-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-navy)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[rgba(17,32,49,0.92)] focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[rgba(179,135,64,0.15)]";

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
    <div className="surface-card rounded-[32px] p-6 sm:p-8">
      <div className="space-y-3">
        <p className="section-kicker">Complete and submit</p>
        <h3 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
          {service.title} form
        </h3>
        <p className="text-sm leading-7 text-[var(--color-navy-soft)]">
          Enter the document details below exactly as they should appear for review and backend processing.
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
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
          <div className="rounded-[24px] border border-[var(--color-line)] bg-white/70 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Applicant details
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <FormField error={errors.fullName?.message} htmlFor="fullName" label="Full name" required>
              <input className={inputStyles} id="fullName" {...register("fullName")} />
            </FormField>
            <FormField error={errors.email?.message} htmlFor="email" label="Email">
              <input className={inputStyles} id="email" type="email" {...register("email")} />
            </FormField>
            <FormField error={errors.phone?.message} htmlFor="phone" label="Phone">
              <input className={inputStyles} id="phone" type="tel" {...register("phone")} />
            </FormField>
            <FormField error={errors.whatsapp?.message} htmlFor="whatsapp" label="WhatsApp">
              <input className={inputStyles} id="whatsapp" type="tel" {...register("whatsapp")} />
            </FormField>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2 rounded-[24px] border border-[var(--color-line)] bg-white/70 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Form details
            </p>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <FormField
                error={errors.preferredContactMethod?.message}
                htmlFor="preferredContactMethod"
                label="Preferred contact method"
              >
                <select className={inputStyles} id="preferredContactMethod" {...register("preferredContactMethod")}>
                  {contactOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        </div>

        {service.slug === "court-e-affidavit" ? (
          <div className="rounded-[24px] border border-[rgba(179,135,64,0.25)] bg-[rgba(234,216,183,0.18)] px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
            This service does not replace legal advice. For complex or significant legal matters, consult a qualified Nigerian lawyer.
          </div>
        ) : null}

        {service.slug === "nigeria-e-visa" ? (
          <div className="rounded-[24px] border border-[rgba(179,135,64,0.25)] bg-[rgba(234,216,183,0.18)] px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
            Visa eligibility and processing times may vary. Approval is not guaranteed.
          </div>
        ) : null}

        {service.slug === "national-population-commission-digital-certificate" ? (
          <div className="rounded-[24px] border border-[rgba(157,185,222,0.4)] bg-[rgba(220,232,247,0.38)] px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
            <p>The old website states that the NPC Digital Certificate is compulsory for NIN registration.</p>
            <p>For children under 16, please call the centre before booking.</p>
            <p>Have required documents ready before attending enrolment-related appointments.</p>
          </div>
        ) : null}

        <div className="rounded-[24px] border border-[var(--color-line)] bg-white/70 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Service document details
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
          {service.formFields.map((field) => {
            if (field.name === "internationalPassportDataPage") {
              return null;
            }

            if (field.name === "familyMembers") {
              const familyMemberError =
                (errors.familyMembers as { message?: string } | undefined)?.message ??
                undefined;

              return (
                <div className="md:col-span-2" key={field.name}>
                  <FormField
                    description={field.description}
                    error={familyMemberError}
                    htmlFor={field.name}
                    label={field.label}
                    required={field.required}
                  >
                    <div className="space-y-4">
                      {familyMemberFields.map((member, index) => {
                        const rowErrors = Array.isArray(errors.familyMembers)
                          ? errors.familyMembers[index]
                          : undefined;

                        return (
                          <div
                            className="rounded-[22px] border border-[var(--color-line)] bg-[rgba(17,32,49,0.03)] p-4"
                            key={member.id}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                                Family member {index + 1}
                              </p>
                              {familyMemberFields.length > 1 ? (
                                <button
                                  className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)] transition hover:text-[var(--color-navy)]"
                                  onClick={() => remove(index)}
                                  type="button"
                                >
                                  Remove
                                </button>
                              ) : null}
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              <FormField
                                error={rowErrors?.memberFullName?.message as string | undefined}
                                htmlFor={`familyMembers.${index}.memberFullName`}
                                label="Surname and name"
                                required
                              >
                                <input
                                  className={inputStyles}
                                  id={`familyMembers.${index}.memberFullName`}
                                  {...register(`familyMembers.${index}.memberFullName` as const)}
                                />
                              </FormField>
                              <FormField
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
                              </FormField>
                              <FormField
                                error={rowErrors?.dateOfBirth?.message as string | undefined}
                                htmlFor={`familyMembers.${index}.dateOfBirth`}
                                label="Date of birth"
                                required
                              >
                                <input
                                  className={inputStyles}
                                  id={`familyMembers.${index}.dateOfBirth`}
                                  type="date"
                                  {...register(`familyMembers.${index}.dateOfBirth` as const)}
                                />
                              </FormField>
                              <FormField
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
                              </FormField>
                            </div>
                          </div>
                        );
                      })}
                      <button
                        className="inline-flex rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                        onClick={() => append({ ...defaultFamilyMember })}
                        type="button"
                      >
                        Add family member
                      </button>
                    </div>
                  </FormField>
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

            return (
              <FormField
                description={field.description}
                error={error}
                htmlFor={field.name}
                key={field.name}
                label={field.label}
                required={field.required}
              >
                {field.type === "textarea" ? (
                  <textarea
                    className={inputStyles}
                    id={field.name}
                    rows={5}
                    {...registeredField}
                  />
                ) : field.type === "select" ? (
                  <select className={inputStyles} id={field.name} {...registeredField}>
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "file" && dualUploadConfig ? (
                    <div className="relative space-y-3">
                      <button
                        className="w-full rounded-[20px] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-left text-sm font-medium text-[var(--color-navy)] shadow-sm transition hover:border-[var(--color-gold)]"
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

                      {dualUploadCount > 0 ? (
                        <p className="text-xs leading-6 text-[var(--color-navy-soft)]">
                          Uploaded:{" "}
                          {[dualUploadSlots?.front, dualUploadSlots?.back]
                            .filter(isUploadedPhoto)
                            .map((file) => file.originalName ?? file.name)
                            .join(", ")}
                        </p>
                      ) : null}

                      {openUploadField === field.name ? (
                        <div className="absolute z-20 mt-2 w-full rounded-[24px] border border-[var(--color-line)] bg-white p-4 shadow-[0_18px_50px_rgba(17,32,49,0.18)]">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[20px] border border-dashed border-[var(--color-line)] bg-[rgba(17,32,49,0.03)] p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                                {dualUploadConfig.labels[0]}
                              </p>
                              <input
                                accept={getFileInputAcceptValue(
                                  dualUploadConfig.fieldNames[0],
                                )}
                                className={`${fileInputStyles} mt-3`}
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
                            <div className="rounded-[20px] border border-dashed border-[var(--color-line)] bg-[rgba(17,32,49,0.03)] p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                                {dualUploadConfig.labels[1]}
                              </p>
                              <input
                                accept={getFileInputAcceptValue(
                                  dualUploadConfig.fieldNames[1],
                                )}
                                className={`${fileInputStyles} mt-3`}
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
                        </div>
                      ) : null}

                      {uploadFieldErrors[field.name] ? (
                        <p className="text-sm text-red-600">{uploadFieldErrors[field.name]}</p>
                      ) : null}
                    </div>
                ) : field.type === "file" ? (
                    <div className="space-y-3">
                      <input
                        accept={getFileInputAcceptValue(field.name)}
                        className={fileInputStyles}
                        id={field.name}
                        multiple
                        onChange={(event) => {
                          void handlePhotoUpload(field.name, event.target.files);
                        }}
                        type="file"
                      />
                      {uploadedPhotosByField[field.name]?.length ? (
                        <p className="text-xs leading-6 text-[var(--color-navy-soft)]">
                          Uploaded:{" "}
                          {uploadedPhotosByField[field.name]
                            .map((file) => file.originalName ?? file.name)
                            .join(", ")}
                        </p>
                      ) : null}
                      {uploadFieldErrors[field.name] ? (
                        <p className="text-sm text-red-600">{uploadFieldErrors[field.name]}</p>
                      ) : null}
                    </div>
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
              </FormField>
            );
          })}
          </div>
        </div>

        {service.slug === "national-identification-number" &&
        applicantAgeGroup === "Child under 16" ? (
          <p className="rounded-[20px] border border-[rgba(179,135,64,0.25)] bg-[rgba(234,216,183,0.18)] px-4 py-3 text-sm text-[var(--color-navy-soft)]">
            For children under 16, please call the centre before booking.
          </p>
        ) : null}

        <div className="rounded-[24px] border border-[var(--color-line)] bg-white/70 px-4 py-4">
          <label className="flex items-start gap-3 text-sm leading-7 text-[var(--color-navy-soft)]">
            <input className="mt-2 size-4 rounded border-[var(--color-line)]" type="checkbox" {...register("consent")} />
            <span>
              I confirm that the details entered on this form are correct and that Liberty Digital Consulting Services may use them to review and process this submission.
            </span>
          </label>
          <p aria-live="polite" className="mt-2 min-h-5 text-sm text-red-600">
            {errors.consent?.message}
          </p>
        </div>

        {serverMessage ? (
          <div
            className={`rounded-[22px] px-4 py-4 text-sm leading-7 ${
              serverSuccess
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {serverMessage}
          </div>
        ) : null}

        <Button className="w-full sm:w-auto" disabled={isPending} type="submit">
          {isPending ? "Submitting form..." : "Submit completed form"}
        </Button>
      </form>
    </div>
  );
}
