import type { ReactNode } from "react";

interface DocumentFormDeclarationProps {
  children: ReactNode;
  title?: string;
}

/**
 * DocumentFormDeclaration - Professional declaration/consent section
 * 
 * Styled to match official document declarations with proper typography
 * and spacing for legal text and signature areas.
 */
export function DocumentFormDeclaration({
  children,
  title = "DECLARATION",
}: DocumentFormDeclarationProps) {
  return (
    <div className="border-t border-[var(--color-line)] px-6 sm:px-8 py-7 sm:py-8">
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-navy)]">
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
