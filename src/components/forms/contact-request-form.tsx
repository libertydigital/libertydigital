"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitContactInquiryAction } from "@/actions/lead-actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { SERVICES } from "@/lib/services";
import {
  contactInquirySchema,
  type ContactInquiryInput,
} from "@/lib/validations";

const inputStyles =
  "w-full rounded-[20px] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-sm text-[var(--color-navy)] shadow-sm outline-none placeholder:text-[var(--color-navy-soft)] focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[rgba(179,135,64,0.15)]";

export function ContactRequestForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [initialFormStartedAt] = useState(() => String(Date.now()));
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactInquirySchema),
    defaultValues: {
      serviceSlug: SERVICES[0].slug,
      preferredContactMethod: "Any",
      website: "",
      formStartedAt: initialFormStartedAt,
    },
  });

  return (
    <form
      className="surface-card rounded-[32px] p-6 sm:p-8"
      onSubmit={handleSubmit((values) => {
        setMessage(null);
        setSuccess(false);
        startTransition(async () => {
          try {
            // Add timeout to prevent mobile connections from hanging indefinitely
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timeout - please check your connection and try again")), 30000)
            );

            const submitPromise = submitContactInquiryAction(values);

            const response = await Promise.race([submitPromise, timeoutPromise]) as any;
            
            if (!response || !response.success) {
              setMessage(response?.message || "An unexpected error occurred. Please try again.");
              const fieldErrors = response?.fieldErrors as Record<string, string[]> | undefined;
              Object.entries(fieldErrors ?? {}).forEach(([field, issues]) => {
                if (Array.isArray(issues) && issues.length > 0) {
                  setError(field as keyof ContactInquiryInput, { message: issues[0] });
                }
              });
              return;
            }

            reset({
              serviceSlug: SERVICES[0].slug,
              preferredContactMethod: "Any",
              website: "",
              formStartedAt: String(Date.now()),
            });
            setSuccess(true);
            setMessage(response.message);
          } catch (error) {
            console.error("Form submission error:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
            setMessage(errorMessage);
            setSuccess(false);
          }
        });
      })}
    >
      <input autoComplete="off" className="hidden" tabIndex={-1} type="text" {...register("website")} />
      <input className="hidden" type="hidden" {...register("formStartedAt")} />
      <div className="grid gap-5 md:grid-cols-2">
        <FormField error={errors.fullName?.message} htmlFor="contact-fullName" label="Full name" required>
          <input className={inputStyles} id="contact-fullName" {...register("fullName")} />
        </FormField>
        <FormField error={errors.email?.message} htmlFor="contact-email" label="Email">
          <input className={inputStyles} id="contact-email" type="email" {...register("email")} />
        </FormField>
        <FormField error={errors.phone?.message} htmlFor="contact-phone" label="Phone">
          <input className={inputStyles} id="contact-phone" type="tel" {...register("phone")} />
        </FormField>
        <FormField error={errors.whatsapp?.message} htmlFor="contact-whatsapp" label="WhatsApp">
          <input className={inputStyles} id="contact-whatsapp" type="tel" {...register("whatsapp")} />
        </FormField>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <FormField error={errors.serviceSlug?.message} htmlFor="contact-service" label="Which service do you need?" required>
          <select className={inputStyles} id="contact-service" {...register("serviceSlug")}>
            {SERVICES.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
          </select>
        </FormField>
        <FormField error={errors.preferredContactMethod?.message} htmlFor="contact-method" label="Preferred contact method">
          <select className={inputStyles} id="contact-method" {...register("preferredContactMethod")}>
            <option value="Any">Any</option>
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
          </select>
        </FormField>
      </div>
      <div className="mt-5">
        <FormField error={errors.message?.message} htmlFor="contact-message" label="Message">
          <textarea className={inputStyles} id="contact-message" rows={5} {...register("message")} />
        </FormField>
      </div>
      <div className="mt-5 rounded-[24px] border border-[var(--color-line)] bg-white/70 px-4 py-4">
        <label className="flex items-start gap-3 text-sm leading-7 text-[var(--color-navy-soft)]">
          <input className="mt-2 size-4" type="checkbox" {...register("consent")} />
          <span>
            I agree that Liberty Digital Consulting Services may contact me about this service request using the details I provided.
          </span>
        </label>
        <p aria-live="polite" className="mt-2 min-h-5 text-sm text-red-600">
          {errors.consent?.message}
        </p>
      </div>
      {message ? (
        <div
          className={`mt-5 rounded-[22px] px-4 py-4 text-sm leading-7 ${
            success
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      ) : null}
      <div className="mt-5">
        <Button disabled={isPending} type="submit">
          {isPending ? "Submitting..." : "Request Support"}
        </Button>
      </div>
    </form>
  );
}
