import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[var(--color-navy)]" htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-1 text-[var(--color-gold)]">*</span> : null}
      </label>
      {description ? (
        <p className="text-xs leading-6 text-[var(--color-navy-soft)]">{description}</p>
      ) : null}
      {children}
      <p
        aria-live="polite"
        className={`min-h-5 text-sm ${error ? "text-red-600" : "text-transparent"}`}
        id={`${htmlFor}-error`}
      >
        {error}
      </p>
    </div>
  );
}
