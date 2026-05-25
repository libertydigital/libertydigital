import type { Variants } from "framer-motion";

export const premiumEase = [0.16, 1, 0.3, 1] as const;

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: premiumEase },
  },
};

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: premiumEase },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export const floatingMotion = {
  y: [-8, 8, -8],
  transition: {
    duration: 6,
    ease: "easeInOut",
    repeat: Infinity,
  },
};
