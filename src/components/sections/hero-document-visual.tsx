"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, CheckCheck, MapPin, Sparkles } from "lucide-react";

import { HeroServiceTile } from "@/components/sections/hero-service-tile";
import type { ServiceContent } from "@/lib/services";

type HeroDocumentVisualProps = {
  services: ServiceContent[];
};

export function HeroDocumentVisual({ services }: HeroDocumentVisualProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const isHovered = useMotionValue(0);

  // Calculate spotlight position based on mouse movement
  const spotlightX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightOpacity = useSpring(isHovered, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    isHovered.set(1);
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    isHovered.set(0);
    x.set(0);
    y.set(0);
  };

  const featuredServices = services.slice(0, 2);

  return (
    <motion.div
      className="relative mx-auto w-full max-w-full sm:max-w-[560px]"
      data-hero-visual
      data-hero-visual-card
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Independent Background Pulse */}
      <motion.div 
        className="absolute -left-4 top-6 h-16 w-16 rounded-full bg-[rgba(95,137,182,0.18)] blur-3xl sm:-left-10 sm:top-8 sm:h-24 sm:w-24"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -right-3 top-16 h-16 w-16 rounded-full bg-[rgba(232,195,133,0.18)] blur-3xl sm:-right-6 sm:top-20 sm:h-24 sm:w-24"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-8 -top-6 h-10 rounded-full bg-[rgba(255,255,255,0.08)] blur-3xl sm:inset-x-10 sm:-top-8 sm:h-14" />

      <motion.div 
        className="relative flex h-full overflow-hidden rounded-[22px] border border-white/14 bg-[linear-gradient(180deg,rgba(17,24,34,0.72),rgba(8,13,20,0.76))] p-1.5 shadow-[0_30px_74px_rgba(2,6,12,0.28)] backdrop-blur-md sm:rounded-[32px] sm:p-3.5 lg:p-4"
        style={{ z: 20, transformStyle: "preserve-3d" }}
      >
        {/* Procedural Lighting: Spotlight effect that follows mouse */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50"
          style={{
            opacity: spotlightOpacity,
            background: useTransform(
              [spotlightX, spotlightY],
              ([sx, sy]) => `radial-gradient(600px circle at ${sx} ${sy}, rgba(255,255,255,0.08), transparent 40%)`
            ),
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,222,194,0.16),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(114,150,188,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />

        <motion.div 
          className="relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[16px] border border-white/14 bg-[linear-gradient(180deg,rgba(248,243,235,0.8),rgba(237,231,222,0.7))] p-2 text-[var(--color-navy)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md sm:rounded-[22px] sm:p-3.5"
          style={{ z: 30, transformStyle: "preserve-3d" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                Service request
              </p>
              <h2 className="mt-1 text-[0.88rem] font-semibold leading-tight sm:text-[1.08rem]">
                Liberty Digital support desk
              </h2>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-[rgba(17,32,49,0.08)] bg-white/72 px-2 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-[color:rgba(17,32,49,0.8)] sm:flex">
              <Sparkles className="size-3.5 text-[var(--color-gold)]" />
              Request Support
            </div>
          </div>

          <div className="mt-3 grid gap-2 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[18px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(246,240,231,0.56))] p-2 shadow-[0_16px_28px_rgba(8,14,22,0.06)] backdrop-blur-sm sm:rounded-[20px] sm:p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="rounded-full border border-[rgba(17,32,49,0.08)] bg-white/74 px-2.5 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[color:rgba(17,32,49,0.8)]">
                  Office-based support
                </div>
                <div className="rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                  Lead captured
                </div>
              </div>

              <div className="mt-2 rounded-[16px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(251,248,243,0.7)_0%,rgba(242,236,228,0.6)_100%)] p-2 backdrop-blur-sm sm:rounded-[18px] sm:p-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
                      Current request flow
                    </p>
                    <p className="mt-1 text-[0.74rem] font-semibold leading-5 text-[var(--color-navy)] sm:text-[0.84rem]">
                      NIN, Passport, and BVN registration assistance.
                    </p>
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-[16px] bg-[var(--color-navy)] text-[var(--color-paper)] shadow-[0_10px_20px_rgba(17,32,49,0.16)]">
                    <ArrowUpRight className="size-3.5" />
                  </div>
                </div>

                <div className="mt-2 space-y-2">
                  {[
                    "Professional preparation for Passport, NIN, and eVisa portals.",
                  ].map((item) => (
                    <div
                      className="flex items-start gap-2.5 rounded-[18px] border border-[rgba(17,32,49,0.06)] bg-white/56 px-2.5 py-2 backdrop-blur-sm"
                      key={item}
                    >
                      <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-[rgba(177,138,81,0.12)] text-[var(--color-gold)]">
                        <CheckCheck className="size-3" />
                      </div>
                      <p className="text-[0.68rem] leading-5 text-[color:rgba(17,32,49,0.82)]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[18px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(246,240,232,0.54))] p-2.5 shadow-[0_14px_24px_rgba(8,14,22,0.05)] backdrop-blur-sm">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold)]">
                  Rome, Italy
                </p>
                <div className="mt-2 flex items-center gap-2.5 text-[0.72rem] font-medium text-[color:rgba(17,32,49,0.8)]">
                  <MapPin className="size-3.5 text-[var(--color-gold)]" />
                  Via Orazio 19
                </div>
              </div>

              <div className="rounded-[18px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(17,32,49,0.96),rgba(13,23,34,0.92))] p-2.5 text-white shadow-[0_18px_34px_rgba(6,12,20,0.2)]">
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-soft)]">
                  Service coverage
                </p>
                <div className="mt-2 grid gap-1.5">
                  <div className="rounded-[16px] border border-white/10 bg-white/6 px-2.5 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[0.72rem] font-medium text-white/82">Core services</span>
                      <span className="rounded-full bg-white/8 px-2 py-1 text-[0.56rem] font-semibold tracking-[0.12em] text-white/72">
                        6
                      </span>
                    </div>
                  </div>
                  <div className="rounded-[16px] border border-white/10 bg-white/6 px-2.5 py-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[0.72rem] font-medium text-white/82">Request handling</span>
                      <span className="rounded-full bg-emerald-400/14 px-2 py-1 text-[0.56rem] font-semibold tracking-[0.1em] text-emerald-200">
                        active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {featuredServices.map((service) => (
              <HeroServiceTile 
                key={service.slug} 
                service={service} 
                style={{ z: 50 }}
              />
            ))}
          </div>

          <div className="mt-auto pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[16px] border border-[rgba(17,32,49,0.08)] bg-white/56 px-2.5 py-2 text-[0.66rem] leading-5 text-[color:rgba(17,32,49,0.8)] backdrop-blur-sm">
              <span className="font-medium text-[var(--color-navy)]">
                Request types are reviewed before the team follows up.
              </span>
              <span className="rounded-full border border-[rgba(17,32,49,0.08)] bg-white px-2 py-1 font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
                Rome support desk
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute -left-4 bottom-12 hidden rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,30,42,0.96),rgba(12,18,28,0.92))] px-3 py-2.5 shadow-[0_18px_36px_rgba(4,8,14,0.26)] lg:block"
          data-hero-float
          style={{ z: 60 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-soft)]">
            Request status
          </p>
          <p className="mt-1 text-[0.78rem] font-semibold text-white/88">Preparation in progress</p>
        </motion.div>

        <motion.div
          className="absolute right-0 top-8 hidden rounded-full border border-white/12 bg-[rgba(255,255,255,0.08)] px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-white/74 shadow-[0_16px_28px_rgba(4,8,14,0.2)] backdrop-blur-xl sm:block"
          data-hero-float
          style={{ z: 40 }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          Rome support desk
        </motion.div>

        <motion.div
          className="absolute right-4 top-[34%] hidden rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(244,237,226,0.96),rgba(230,222,211,0.92))] px-3 py-2.5 text-[var(--color-navy)] shadow-[0_20px_36px_rgba(4,8,14,0.2)] xl:block"
          data-hero-float
          style={{ z: 70 }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <p className="text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold)]">
            Follow-up
          </p>
          <p className="mt-1 text-[0.72rem] font-semibold">Clear next steps after submission</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
