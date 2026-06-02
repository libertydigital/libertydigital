import type { ReactNode } from "react";

interface DocumentFormSectionProps {
  sectionNumber?: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  isLast?: boolean;
}

/**
 * DocumentFormSection - Organized form section with document-style header
 * 
 * Sections are numbered and have uppercase titles with subtle divider lines.
 * Creates clear visual hierarchy for different parts of the form.
 */
export function DocumentFormSection({
  sectionNumber,
  title,
  subtitle,
  children,
  isLast = false,
}: DocumentFormSectionProps) {
  return (
    <div className={`border-b border-[var(--color-line)] px-6 sm:px-8 py-7 sm:py-8 ${isLast ? "border-b-0" : ""}`}>
      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-3">
          {sectionNumber !== undefined && (
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-gold)] text-xs font-bold text-[var(--color-navy)]">
              {sectionNumber}
            </span>
          )}
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-navy)]">
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-xs leading-5 text-[var(--color-navy-soft)] pl-9">{subtitle}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
