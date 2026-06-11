import type { ReactNode } from "react";

interface DocumentFormUploadProps {
  label?: string;
  description?: string;
  children: ReactNode;
  error?: string;
  errorId?: string;
  required?: boolean;
  fullWidth?: boolean;
}

/**
 * DocumentFormUpload - Professional document-style upload area
 * 
 * Creates upload zones that look like official document sections with clear
 * borders and professional styling appropriate for official documents.
 * 
 * Note: Label and description are optional. If used inside DocumentFormField,
 * omit label/description as DocumentFormField handles them.
 */
export function DocumentFormUpload({
  label,
  description,
  children,
  error,
  errorId,
  required,
  fullWidth = true,
}: DocumentFormUploadProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-navy)]">
          {label}
          {required ? <span className="ml-1 text-[var(--color-gold)]">*</span> : null}
        </label>
      )}
      {description ? (
        <p className={`${label ? "mt-1" : ""} text-xs leading-5 text-[var(--color-navy-soft)]`}>{description}</p>
      ) : null}
      <div className={`${label || description ? "mt-3" : ""} rounded-lg border-2 border-dashed border-[rgba(17,32,49,0.2)] bg-[rgba(17,32,49,0.02)] p-4 transition hover:border-[var(--color-gold)] hover:bg-[rgba(179,135,64,0.05)]`}>
        {children}
      </div>
      <p
        aria-live="polite"
        className={`min-h-5 mt-2 text-xs ${error ? "text-red-600" : "text-transparent"}`}
        id={errorId}
      >
        {error}
      </p>
    </div>
  );
}
