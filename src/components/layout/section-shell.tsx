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
        "relative overflow-hidden py-[var(--section-py)] lg:py-[var(--section-py-lg)]",
        tone === "dark" && "surface-brand text-white",
        tone === "light" && "surface-base text-[var(--color-navy)]",
        tone === "premium-light" && "surface-base text-[var(--color-navy)]",
        className,
      )}
      id={id}
    >
      <div className={cn("container-premium relative z-10", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
