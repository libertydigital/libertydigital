import { MotionValue, motion, useSpring, useTransform } from "framer-motion";
import { PropsWithChildren, useRef } from "react";

type FramerMagneticCardProps = PropsWithChildren & {
  mouseProgress: MotionValue<number>;
  rotationProgress: MotionValue<number>;
};

export function FramerMagneticCard({ children, mouseProgress, rotationProgress }: FramerMagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useTransform(mouseProgress, [0, 1], [-10, 10]);
  const rotateY = useTransform(rotationProgress, [0, 1], [-10, 10]);

  const springConfig = { stiffness: 100, damping: 20 };

  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      className="relative transition-transform duration-300 ease-out"
    >
      {children}
    </motion.div>
  );
}
