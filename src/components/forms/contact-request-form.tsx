"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  submitContactInquiryAction,
  type ActionState,
} from "@/actions/lead-actions";
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
        console.log("📝 [Contact Form] Submit handler called");
        setMessage(null);
        setSuccess(false);
        startTransition(async () => {
          try {
            console.log("🔵 [Contact Form] Submitting inquiry action...");
            const startTime = Date.now();
            
            let response: ActionState | undefined;
            let retryCount = 0;
            const maxRetries = 2;
            
            while (retryCount <= maxRetries) {
              try {
                if (retryCount > 0) {
                  console.log(`🔄 [Contact Form] Retry attempt ${retryCount}/${maxRetries}...`);
                }
                
                // Wrap server action in timeout to catch hanging requests on slow networks
                const timeoutPromise = new Promise<never>((_, reject) => {
                  setTimeout(() => {
                    reject(new Error("Request timeout after 25 seconds. Your connection may be too slow. Please try again or use WiFi."));
                  }, 25000);
                });
                
                response = await Promise.race([
                  submitContactInquiryAction(values),
                  timeoutPromise,
                ]);
                
                const duration = Date.now() - startTime;
                console.log(`✅ [Contact Form] Response received after ${duration}ms (retry ${retryCount}):`, { response, type: typeof response });
                break; // Success, exit retry loop
              } catch (submitError) {
                const duration = Date.now() - startTime;
                const errorMsg = submitError instanceof Error ? submitError.message : String(submitError);
                
                console.error(`❌ [Contact Form] Attempt ${retryCount + 1} failed after ${duration}ms:`, {
                  error: submitError,
                  message: errorMsg,
                  type: typeof submitError,
                });
                
                // Only retry on transient errors
                const isTransientError = errorMsg.includes("timeout") || errorMsg.includes("connection") || errorMsg.includes("network");
                
                if (isTransientError && retryCount < maxRetries) {
                  retryCount++;
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  continue;
                }
                
                // Give up - show error
                setMessage(errorMsg || "Server error during submission. Please check your connection and try again.");
                return;
              }
            }
            
            if (!response) {
              console.error("⚠️ [Contact Form] No response after retries");
              setMessage("Could not reach server. Please check your connection and try again.");
              return;
            }
            
            if (!response.success) {
              setMessage(response.message);
              Object.entries(response.fieldErrors ?? {}).forEach(([field, issues]) => {
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
            console.error("🔴 [Contact Form] Submission failed with error:", {
              error,
              type: typeof error,
              message: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            });
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
