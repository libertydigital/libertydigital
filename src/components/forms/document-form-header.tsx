interface DocumentFormHeaderProps {
  title: string;
  subtitle?: string;
  referenceNumber?: string;
  icon?: React.ReactNode;
}

/**
 * DocumentFormHeader - Professional document header
 * 
 * Displays the form title, optional subtitle, and reference number at the top
 * of the document form with professional styling.
 */
export function DocumentFormHeader({
  title,
  subtitle,
  referenceNumber,
  icon,
}: DocumentFormHeaderProps) {
  return (
    <div className="border-b border-[var(--color-line)] px-6 sm:px-8 py-8 sm:py-10 text-center">
      {icon && (
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-navy)] tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm leading-6 text-[var(--color-navy-soft)]">
          {subtitle}
        </p>
      )}
      {referenceNumber && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">
          Reference: {referenceNumber}
        </p>
      )}
    </div>
  );
}
