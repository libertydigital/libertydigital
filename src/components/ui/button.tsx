import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]";

const variants = {
  primary:
    "bg-[linear-gradient(135deg,#f6efe4_0%,#e8d5b4_100%)] text-[var(--color-navy)] shadow-[0_20px_36px_rgba(9,14,22,0.24)] hover:-translate-y-0.5 hover:brightness-105",
  secondary:
    "border border-white/14 bg-white/6 text-white hover:-translate-y-0.5 hover:border-[rgba(234,217,188,0.3)] hover:bg-white/10",
  ghost:
    "text-[var(--color-paper)] underline underline-offset-4 hover:text-[var(--color-gold-soft)]",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: keyof typeof variants;
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      type={type}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link className={cn(baseStyles, variants[variant], className)} href={href}>
      {children}
    </Link>
  );
}
