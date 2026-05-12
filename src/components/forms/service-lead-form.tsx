"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitLeadAction } from "@/actions/lead-actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import type { ServiceContent } from "@/lib/services";
import { getLeadFormSchema } from "@/lib/validations";

const contactOptions = ["Phone", "WhatsApp", "Email", "Any"] as const;

const inputStyles =
  "w-full rounded-[20px] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-sm text-[var(--color-navy)] shadow-sm outline-none placeholder:text-[var(--color-navy-soft)] focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[rgba(179,135,64,0.15)]";

export function ServiceLeadForm({ service }: { service: ServiceContent }) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const schema = useMemo(() => getLeadFormSchema(service.slug), [service.slug]);

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceSlug: service.slug,
      preferredContactMethod: "Any",
    },
  });

  const applicantAgeGroup = useWatch({
    control,
    name: "applicantAgeGroup",
  });

  const onSubmit = handleSubmit((values) => {
    setServerMessage(null);
    setServerSuccess(false);

    startTransition(async () => {
      const response = await submitLeadAction(service.slug, values);

      if (!response.success) {
        setServerMessage(response.message);
        setServerSuccess(false);

        Object.entries(response.fieldErrors ?? {}).forEach(([field, issues]) => {
          if (issues.length > 0) {
            setError(field, {
              message: issues[0],
            });
          }
        });
        return;
      }

      reset({
        serviceSlug: service.slug,
        preferredContactMethod: "Any",
      });
      setServerSuccess(true);
      setServerMessage(response.message);
    });
  });

  return (
    <div className="surface-card rounded-[32px] p-6 sm:p-8">
      <p className="text-sm leading-7 text-[var(--color-navy-soft)]">
        {service.formIntro}
      </p>
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
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

        <div className="grid gap-5 md:grid-cols-2">
          {service.formFields.map((field) => {
            const error = errors[field.name]?.message as string | undefined;
            const sharedProps = {
              id: field.name,
              ...register(field.name),
            };

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
                  <textarea className={inputStyles} rows={5} {...sharedProps} />
                ) : field.type === "select" ? (
                  <select className={inputStyles} {...sharedProps}>
                    <option value="">Select an option</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={inputStyles}
                    placeholder={field.placeholder}
                    type={field.type}
                    {...sharedProps}
                  />
                )}
              </FormField>
            );
          })}
        </div>

        {service.slug === "national-identification-number" &&
        applicantAgeGroup === "Child under 16" ? (
          <p className="rounded-[20px] border border-[rgba(179,135,64,0.25)] bg-[rgba(234,216,183,0.18)] px-4 py-3 text-sm text-[var(--color-navy-soft)]">
            For children under 16, please call the centre before booking.
          </p>
        ) : null}

        <FormField error={errors.message?.message} htmlFor="message" label="Message">
          <textarea className={inputStyles} id="message" rows={5} {...register("message")} />
        </FormField>

        <div className="rounded-[24px] border border-[var(--color-line)] bg-white/70 px-4 py-4">
          <label className="flex items-start gap-3 text-sm leading-7 text-[var(--color-navy-soft)]">
            <input className="mt-2 size-4 rounded border-[var(--color-line)]" type="checkbox" {...register("consent")} />
            <span>
              I agree that Liberty Digital Consulting Services may contact me about this service request using the details I provided.
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
          {isPending ? "Submitting request..." : service.ctaLabel}
        </Button>
      </form>
    </div>
  );
}
