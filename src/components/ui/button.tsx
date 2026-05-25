import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "group inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(135deg,#fff8ec_0%,#e9d4ab_48%,#c89f63_100%)] text-[var(--color-navy)] shadow-[0_20px_42px_rgba(4,10,18,0.28)] hover:-translate-y-0.5 hover:shadow-[0_26px_52px_rgba(4,10,18,0.34)] hover:brightness-105",
        secondary:
          "border border-white/14 bg-white/6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl hover:-translate-y-0.5 hover:border-[rgba(234,217,188,0.36)] hover:bg-white/10",
        ghost:
          "text-[var(--color-paper)] underline underline-offset-4 hover:text-[var(--color-gold-soft)]",
        dark:
          "border border-[rgba(17,32,49,0.12)] bg-[var(--color-navy)] text-white shadow-[0_16px_34px_rgba(17,32,49,0.2)] hover:-translate-y-0.5 hover:bg-[rgba(17,32,49,0.92)]",
        glass:
          "border border-white/14 bg-white/10 text-white shadow-[0_18px_36px_rgba(4,10,18,0.2)] backdrop-blur-xl hover:-translate-y-0.5 hover:bg-white/14",
      },
      size: {
        default: "min-h-12 px-5 py-3",
        sm: "min-h-10 px-4 py-2 text-xs",
        lg: "min-h-14 px-6 py-4 text-[0.95rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants>;

type ButtonLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant = "primary",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
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
  size = "default",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
