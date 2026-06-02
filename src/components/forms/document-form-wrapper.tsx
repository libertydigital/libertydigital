import type { ReactNode } from "react";

/**
 * DocumentFormWrapper - Professional document-style form container
 * 
 * Creates a centered, fixed-width form container that resembles an official application document.
 * Includes proper spacing, subtle borders, and a clean paper-like appearance.
 */
export function DocumentFormWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-[var(--color-navy)] via-[rgba(17,32,49,0.95)] to-[var(--color-navy)] px-4 py-8 sm:py-12">
      <div className="w-full max-w-[900px]">
        <div className="rounded-lg border border-[var(--color-line)] bg-white shadow-[0_20px_60px_rgba(17,32,49,0.12)] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
