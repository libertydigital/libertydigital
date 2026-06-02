import type { ReactNode } from "react";

type DocumentFormFieldProps = {
  label: string;
  htmlFor: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
  inline?: boolean;
};

/**
 * DocumentFormField - Official document-style form field
 * 
 * Replaces the modern card-style fields with a cleaner, more official look.
 * Features subtle underlines and professional typography.
 */
export function DocumentFormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  fullWidth = false,
  inline = false,
}: DocumentFormFieldProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      <label
        className="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-navy)]"
        htmlFor={htmlFor}
      >
        {label}
        {required ? <span className="ml-1 text-[var(--color-gold)]">*</span> : null}
      </label>
      {description ? (
        <p className="mt-1 text-xs leading-5 text-[var(--color-navy-soft)]">{description}</p>
      ) : null}
      <div className="mt-3">{children}</div>
      <p
        aria-live="polite"
        className={`min-h-5 mt-2 text-xs ${error ? "text-red-600" : "text-transparent"}`}
      >
        {error || "placeholder"}
      </p>
    </div>
  );
}
