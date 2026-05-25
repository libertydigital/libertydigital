import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  tone?: "dark" | "light" | "premium-light";
};

export function SectionShell({
  children,
  className,
  innerClassName,
  id,
  tone = "dark",
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 sm:py-24 lg:py-28",
        tone === "dark" && "luxury-section text-white",
        tone === "light" && "section-band text-[var(--color-navy)]",
        tone === "premium-light" &&
          "premium-light-section text-[var(--color-navy)]",
        className,
      )}
      id={id}
    >
      {tone === "dark" ? (
        <div
          aria-hidden="true"
          className="premium-grid-overlay pointer-events-none absolute inset-0 opacity-40"
        />
      ) : null}
      {tone === "premium-light" ? (
        <div
          aria-hidden="true"
          className="premium-light-grid pointer-events-none absolute inset-0 opacity-60"
        />
      ) : null}
      <div className={cn("container-premium relative z-10", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
