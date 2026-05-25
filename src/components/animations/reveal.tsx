"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { revealUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  variants = revealUp,
  once = true,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={variants}
      viewport={{ once, amount: 0.22 }}
      whileInView="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerReveal({
  children,
  className,
  once = true,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      variants={staggerContainer}
      viewport={{ once, amount: 0.18 }}
      whileInView="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}
