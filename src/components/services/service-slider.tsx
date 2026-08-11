"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ServiceCard } from "@/components/services/service-card";
import type { ServiceContent } from "@/lib/services";

const AUTO_ADVANCE_MS = 4200;

function getSlidesPerView(width: number) {
  if (width >= 1280) {
    return 3;
  }

  if (width >= 768) {
    return 2;
  }

  return 1;
}

export function ServiceSlider({ services }: { services: ServiceContent[] }) {
  const shouldReduceMotion = useReducedMotion();
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(getSlidesPerView(window.innerWidth));
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const maxIndex = Math.max(0, services.length - slidesPerView);
  const activeIndex = Math.min(currentIndex, maxIndex);

  useEffect(() => {
    const measureOffsets = () => {
      setOffsets(
        slideRefs.current.map((slide) => slide?.offsetLeft ?? 0),
      );
    };

    measureOffsets();
    window.addEventListener("resize", measureOffsets);

    return () => window.removeEventListener("resize", measureOffsets);
  }, [services.length, slidesPerView]);

  const activeOffset = offsets[activeIndex] ?? 0;
  const maxOffset = offsets[maxIndex] ?? 0;

  const pagination = useMemo(
    () => Array.from({ length: maxIndex + 1 }, (_, index) => index),
    [maxIndex],
  );

  useEffect(() => {
    if (shouldReduceMotion || isPaused || maxIndex === 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((previousIndex) =>
        previousIndex >= maxIndex ? 0 : previousIndex + 1,
      );
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(intervalId);
  }, [isPaused, maxIndex, shouldReduceMotion]);

  const goTo = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const goToPrevious = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex <= 0 ? maxIndex : previousIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex >= maxIndex ? 0 : previousIndex + 1,
    );
  };

  return (
    <div
      className="relative"
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {pagination.map((index) => (
            // The dot stays 10px, but the button carries a 24px target so it
            // clears the WCAG minimum on touch.
            <button
              aria-current={activeIndex === index ? "true" : undefined}
              aria-label={`Go to slide ${index + 1}`}
              className={`group inline-flex h-6 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] ${
                activeIndex === index ? "w-11" : "w-6"
              }`}
              key={index}
              onClick={() => goTo(index)}
              type="button"
            >
              <span
                className={`block h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-10 bg-[var(--color-navy)]"
                    : "w-2.5 bg-[rgba(17,32,49,0.18)] group-hover:bg-[rgba(17,32,49,0.34)]"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous services"
            className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--color-line)] bg-white text-[var(--color-navy)] shadow-[0_18px_40px_rgba(17,32,49,0.08)] hover:-translate-y-0.5 hover:bg-white"
            onClick={goToPrevious}
            type="button"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            aria-label="Next services"
            className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-navy)] text-white shadow-[0_18px_40px_rgba(17,32,49,0.16)] hover:-translate-y-0.5 hover:bg-[#193147]"
            onClick={goToNext}
            type="button"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-[34px]"
        data-animate-list
      >
        <motion.div
          animate={{ x: -activeOffset }}
          className="flex gap-6"
          drag={maxIndex > 0 ? "x" : false}
          dragConstraints={{ left: -maxOffset, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            const swipeDistance = info.offset.x;
            const swipeVelocity = info.velocity.x;

            if (swipeDistance <= -80 || swipeVelocity <= -500) {
              goToNext();
              return;
            }

            if (swipeDistance >= 80 || swipeVelocity >= 500) {
              goToPrevious();
            }
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 220, damping: 28 }
          }
        >
          {services.map((service, index) => {
            const isActive =
              index >= activeIndex && index < activeIndex + slidesPerView;

            return (
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0.72,
                  scale: isActive ? 1 : 0.96,
                  y: isActive ? 0 : 10,
                }}
                className="min-w-0 shrink-0 basis-full md:basis-[calc((100%-1.5rem)/2)] xl:basis-[calc((100%-3rem)/3)]"
                key={service.slug}
                ref={(element) => {
                  slideRefs.current[index] = element;
                }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.45, ease: "easeOut" }
                }
              >
                <ServiceCard service={service} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
