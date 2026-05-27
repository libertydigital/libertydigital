import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
  variant?: "default" | "soft" | "dark";
  animation?: "section" | "cards" | "visual" | "cta" | "none";
};

const variantClasses: Record<NonNullable<AnimatedSectionProps["variant"]>, string> = {
  default: "",
  soft: "section-band",
  dark: "section-band-deep",
};

const animationAttributes: Record<
  NonNullable<AnimatedSectionProps["animation"]>,
  Record<string, string | undefined>
> = {
  section: { "data-animate-section": "" },
  cards: { "data-animate-list": "" },
  visual: { "data-animate-visual": "" },
  cta: { "data-animate-cta": "" },
  none: {},
};

export function AnimatedSection({
  children,
  className,
  as = "section",
  variant = "default",
  animation = "section",
}: AnimatedSectionProps) {
  const Component = as as ElementType;

  return (
    <Component
      className={cn(variantClasses[variant], className)}
      {...animationAttributes[animation]}
    >
      {children}
    </Component>
  );
}
