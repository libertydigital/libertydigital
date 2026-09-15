"use client";

import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitContactInquiryAction } from "@/actions/lead-actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { trackGrowthEvent } from "@/lib/analytics";
import type { ServiceContent } from "@/lib/services";
import { buildTrackingLookupPath } from "@/lib/tracking";
import {
  contactInquirySchema,
  type ContactInquiryInput,
} from "@/lib/validations";

const inputStyles =
  "w-full rounded-[20px] border border-[var(--color-line)] bg-white/90 px-4 py-3 text-sm text-[var(--color-navy)] shadow-sm outline-none placeholder:text-[var(--color-navy-soft)] focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[rgba(179,135,64,0.15)]";

export function ServiceInquiryForm({ service }: { service: ServiceContent }) {
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [trackingLink, setTrackingLink] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [initialFormStartedAt] = useState(() => String(Date.now()));
  const startedTracked = useRef(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactInquiryInput>({
    resolver: zodResolver(contactInquirySchema),
    defaultValues: {
      serviceSlug: service.slug,
      preferredContactMethod: "Any",
      website: "",
      formStartedAt: initialFormStartedAt,
    },
  });

  function trackStart() {
    if (startedTracked.current) {
      return;
    }

    startedTracked.current = true;
    trackGrowthEvent("form_start", {
      serviceSlug: service.slug,
      page: `/services/${service.slug}`,
      placement: "service_enquiry",
    });
  }

  return (
    <form
      className="surface-card rounded-[32px] p-6 sm:p-8"
      onFocusCapture={trackStart}
      onSubmit={handleSubmit(
        (values) => {
          setMessage(null);
          setSuccess(false);
          setTrackingLink(null);
          trackGrowthEvent("form_submit", {
            serviceSlug: service.slug,
            page: `/services/${service.slug}`,
            placement: "service_enquiry",
          });

          startTransition(async () => {
            try {
              const response = await submitContactInquiryAction(values);

              if (!response.success) {
                trackGrowthEvent("form_error", {
                  serviceSlug: service.slug,
                  page: `/services/${service.slug}`,
                  placement: "server_validation",
                });
                setMessage(
                  response.fieldErrors?.formStartedAt?.[0] ?? response.message,
                );
                Object.entries(response.fieldErrors ?? {}).forEach(
                  ([field, issues]) => {
                    if (Array.isArray(issues) && issues.length > 0) {
                      setError(field as keyof ContactInquiryInput, {
                        message: issues[0],
                      });
                    }
                  },
                );
                return;
              }

              const phoneForTracking = values.phone?.trim()
                ? values.phone
                : values.whatsapp ?? "";

              trackGrowthEvent("form_success", {
                serviceSlug: service.slug,
                page: `/services/${service.slug}`,
                placement: "service_enquiry",
              });
              reset({
                serviceSlug: service.slug,
                preferredContactMethod: "Any",
                website: "",
                formStartedAt: String(Date.now()),
              });
              setValue("formStartedAt", String(Date.now()));
              startedTracked.current = false;
              setSuccess(true);
              setMessage(response.message);
              setTrackingLink(
                buildTrackingLookupPath(
                  response.trackingReference,
                  phoneForTracking,
                ),
              );
            } catch (error) {
              console.error("Service enquiry submission failed:", error);
              trackGrowthEvent("form_error", {
                serviceSlug: service.slug,
                page: `/services/${service.slug}`,
                placement: "submission_exception",
              });
              setMessage(
                "We could not confirm whether your request was received. Please contact us before submitting again.",
              );
              setSuccess(false);
            }
          });
        },
        (validationErrors) => {
          trackGrowthEvent("form_error", {
            serviceSlug: service.slug,
            page: `/services/${service.slug}`,
            placement: "client_validation",
          });
          setSuccess(false);
          setMessage(
            validationErrors.formStartedAt?.message ??
              "Please review the highlighted fields and try again.",
          );
        },
      )}
    >
      <input
        autoComplete="off"
        className="hidden"
        tabIndex={-1}
        type="text"
        {...register("website")}
      />
      <input className="hidden" type="hidden" {...register("formStartedAt")} />
      <input type="hidden" {...register("serviceSlug")} />

      <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/80 px-4 py-4 text-sm leading-7 text-emerald-900">
        <strong>Start with a simple enquiry.</strong> Do not upload passports,
        birth certificates, NIN/BVN records, bank details, or other sensitive
        documents here. The team will confirm what is actually needed after
        reviewing your request.
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <FormField
          error={errors.fullName?.message}
          htmlFor="service-fullName"
          label="Full name"
          required
        >
          <input
            aria-describedby="service-fullName-error"
            aria-invalid={Boolean(errors.fullName)}
            className={inputStyles}
            id="service-fullName"
            required
            {...register("fullName")}
          />
        </FormField>
        <FormField error={errors.email?.message} htmlFor="service-email" label="Email">
          <input
            aria-describedby="service-email-error"
            aria-invalid={Boolean(errors.email)}
            className={inputStyles}
            id="service-email"
            type="email"
            {...register("email")}
          />
        </FormField>
        <FormField error={errors.phone?.message} htmlFor="service-phone" label="Phone">
          <input
            aria-describedby="service-phone-error"
            aria-invalid={Boolean(errors.phone)}
            className={inputStyles}
            id="service-phone"
            type="tel"
            {...register("phone")}
          />
        </FormField>
        <FormField
          error={errors.whatsapp?.message}
          htmlFor="service-whatsapp"
          label="WhatsApp"
        >
          <input
            aria-describedby="service-whatsapp-error"
            aria-invalid={Boolean(errors.whatsapp)}
            className={inputStyles}
            id="service-whatsapp"
            type="tel"
            {...register("whatsapp")}
          />
        </FormField>
      </div>

      <div className="mt-5">
        <FormField
          error={errors.preferredContactMethod?.message}
          htmlFor="service-contact-method"
          label="Preferred contact method"
        >
          <select
            aria-describedby="service-contact-method-error"
            aria-invalid={Boolean(errors.preferredContactMethod)}
            className={inputStyles}
            id="service-contact-method"
            {...register("preferredContactMethod")}
          >
            <option value="Any">Any</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Phone">Phone</option>
            <option value="Email">Email</option>
          </select>
        </FormField>
      </div>

      <div className="mt-5">
        <FormField
          error={errors.message?.message}
          htmlFor="service-message"
          label="What do you need help with?"
        >
          <textarea
            aria-describedby="service-message-error"
            aria-invalid={Boolean(errors.message)}
            className={inputStyles}
            id="service-message"
            placeholder="Briefly describe the service you need, your current stage, and any deadline. Please do not include document numbers or bank credentials."
            rows={5}
            {...register("message")}
          />
        </FormField>
      </div>

      <div className="mt-5 rounded-[24px] border border-[var(--color-line)] bg-white/70 px-4 py-4">
        <label className="flex items-start gap-3 text-sm leading-7 text-[var(--color-navy-soft)]">
          <input
            aria-describedby="service-consent-error"
            aria-invalid={Boolean(errors.consent)}
            className="mt-2 size-4"
            required
            type="checkbox"
            {...register("consent")}
          />
          <span>
            I agree that Liberty Digital Consulting Services may contact me
            about this service request using the details I provided.
          </span>
        </label>
        <p
          aria-live="polite"
          className="mt-2 min-h-5 text-sm text-red-600"
          id="service-consent-error"
        >
          {errors.consent?.message}
        </p>
      </div>

      {message ? (
        <div
          aria-live="polite"
          className={`mt-5 rounded-[22px] px-4 py-4 text-sm leading-7 ${
            success
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <p>{message}</p>
          {success && trackingLink ? (
            <a
              className="mt-3 inline-flex font-semibold underline underline-offset-4"
              href={trackingLink}
            >
              Track this request
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5">
        <Button disabled={isPending} type="submit">
          {isPending ? "Submitting..." : `Request ${service.shortLabel} Support`}
        </Button>
      </div>
    </form>
  );
}
