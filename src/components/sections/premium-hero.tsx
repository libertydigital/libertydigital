"use client";

import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { BUSINESS_DETAILS } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/utils";

const whatsappLink = buildWhatsAppLink(
  BUSINESS_DETAILS.phone,
  "Hello Liberty Digital Consulting, I would like to book document support in Rome.",
);

const heroSlides = [
  {
    key: "passport",
    word: "Passport",
    titleLead: "Get help with Nigerian",
    titleTail: "support in Rome, Italy",
    description:
      "Get guided help with passport registration preparation, document review, and next-step readiness before you continue with the official process.",
    imageSrc: "/nigeria-passport-service-cover-v2.png",
    imageAlt: "Nigerian passport service visual for Liberty Digital Consulting",
    badge: "Passport support",
  },
  {
    key: "nin",
    word: "NIN",
    titleLead: "Get help with Nigerian",
    titleTail: "support in Rome, Italy",
    description:
      "Get clear preparation support for NIN requirements, identity details, and supporting records so your request is organised properly from the start.",
    imageSrc: "/nin-service-cover-v2.png",
    imageAlt: "National Identification Number support visual for Liberty Digital Consulting",
    badge: "NIN support",
  },
  {
    key: "bvn",
    word: "BVN",
    titleLead: "Get help with Nigerian",
    titleTail: "support in Rome, Italy",
    description:
      "Get guided help with BVN preparation, identity verification details, and supporting information before you continue with the relevant bank or authorised provider.",
    imageSrc: "/bank-verification-number-bvn-service-cover-v2.png",
    imageAlt: "Bank Verification Number support visual for Liberty Digital Consulting",
    badge: "BVN support",
  },
  {
    key: "e-visa",
    word: "E-Visa",
    titleLead: "Get help with Nigerian",
    titleTail: "support in Rome, Italy",
    description:
      "Get preparation support for Nigeria e-visa requests, travel document checks, and submission readiness before you move to the formal application stage.",
    imageSrc: "/e-visa-service-cover-v2.png",
    imageAlt: "Nigeria e-visa support visual for Liberty Digital Consulting",
    badge: "E-Visa support",
  },
] as const;

const ROTATION_MS = 3600;

export function PremiumHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHeroVideo, setShowHeroVideo] = useState(false);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const hoverFrameRef = useRef<number | null>(null);
  const rotationStartRef = useRef<number | null>(null);
  const rotationIntervalRef = useRef<number | null>(null);
  const videoIdleRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    rotationStartRef.current = window.setTimeout(() => {
      rotationIntervalRef.current = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % heroSlides.length);
      }, ROTATION_MS);
    }, 4200);

    return () => {
      if (rotationStartRef.current !== null) {
        window.clearTimeout(rotationStartRef.current);
      }
      if (rotationIntervalRef.current !== null) {
        window.clearInterval(rotationIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hoverFrameRef.current !== null) {
        window.cancelAnimationFrame(hoverFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!media.matches) {
      return;
    }

    const startVideo = () => setShowHeroVideo(true);
    const browserWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof browserWindow.requestIdleCallback === "function") {
      videoIdleRef.current = browserWindow.requestIdleCallback(startVideo, {
        timeout: 2400,
      });
    } else {
      videoIdleRef.current = window.setTimeout(startVideo, 1800);
    }

    return () => {
      if (videoIdleRef.current === null) {
        return;
      }

      if (typeof browserWindow.cancelIdleCallback === "function") {
        browserWindow.cancelIdleCallback(videoIdleRef.current);
      } else {
        window.clearTimeout(videoIdleRef.current);
      }
    };
  }, []);

  const activeSlide = heroSlides[activeIndex];

  function handleHeroVisualMove(event: MouseEvent<HTMLDivElement>) {
    if (!heroVisualRef.current) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const offsetX = (x - 0.5) * 14;
    const offsetY = (y - 0.5) * 18;
    const rotateX = (0.5 - y) * 6;
    const rotateY = (x - 0.5) * 6;

    if (hoverFrameRef.current !== null) {
      window.cancelAnimationFrame(hoverFrameRef.current);
    }

    hoverFrameRef.current = window.requestAnimationFrame(() => {
      heroVisualRef.current?.style.setProperty(
        "transform",
        `perspective(1400px) translate3d(${offsetX}px, ${offsetY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      );
    });
  }

  function resetHeroVisualMove() {
    if (hoverFrameRef.current !== null) {
      window.cancelAnimationFrame(hoverFrameRef.current);
    }

    hoverFrameRef.current = window.requestAnimationFrame(() => {
      heroVisualRef.current?.style.setProperty(
        "transform",
        "perspective(1400px) translate3d(0px, 0px, 0) rotateX(0deg) rotateY(0deg)",
      );
    });
  }

  const rotatingVisual = (
    <div className="relative w-full max-w-[36rem] lg:pr-6">
      <div className="absolute inset-x-[16%] top-[8%] h-24 rounded-b-[999px] bg-[#b99352]/18 blur-3xl" />
        <div
          className="relative mx-auto flex w-full max-w-[29rem] justify-center lg:max-w-[31rem] lg:justify-end"
          onMouseLeave={resetHeroVisualMove}
          onMouseMove={handleHeroVisualMove}
        >
        <div className="absolute left-[6%] top-[16%] h-[76%] w-[78%] rounded-[3rem] bg-black/18 blur-2xl" />
        <div className="absolute right-[6%] top-[6%] h-[82%] w-[72%] rounded-[2.5rem] border border-white/10 bg-white/[0.05]" />
          <div
            ref={heroVisualRef}
            className="relative aspect-[0.72] w-full max-w-[29rem] transition-transform duration-200 ease-out motion-reduce:transition-none lg:max-w-[31rem]"
            style={{ transform: "perspective(1400px) translate3d(0px, 0px, 0) rotateX(0deg) rotateY(0deg)" }}
          >
          <div
            className="absolute inset-0 translate-y-0 rotate-[6deg] scale-100 opacity-100 transition-opacity duration-500 motion-reduce:transition-none lg:rotate-[8deg]"
            key={`${activeSlide.key}-image`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/14 shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
              <Image
                alt={activeSlide.imageAlt}
                className="h-full w-full object-cover object-top"
                fill
                priority={activeIndex === 0}
                sizes="(min-width: 1024px) 34rem, 88vw"
                src={activeSlide.imageSrc}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,7,0.02)_0%,rgba(4,8,7,0.06)_38%,rgba(4,8,7,0.34)_100%)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2 lg:justify-end">
        {heroSlides.map((slide, index) => (
          <span
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === activeIndex ? "w-10 bg-[#d9bd7c]" : "w-3 bg-white/22"
            }`}
            key={`${slide.key}-dot`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-[#10211c] text-white">
      <div className="absolute inset-0">
        {showHeroVideo ? (
          <video
            aria-hidden="true"
            autoPlay
            className="absolute inset-0 hidden h-full w-full object-cover opacity-36 mix-blend-screen lg:block"
            loop
            muted
            playsInline
            poster="/assets/video/security-shimmer-poster.webp"
            preload="metadata"
            suppressHydrationWarning
          >
            <source src="/assets/video/security-shimmer-web.mp4" type="video/mp4" />
          </video>
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,189,124,0.26),transparent_28%),linear-gradient(90deg,rgba(16,33,28,0.92)_0%,rgba(16,33,28,0.82)_40%,rgba(16,33,28,0.46)_72%,rgba(16,33,28,0.68)_100%)]" />
        <div className="passport-security-pattern absolute inset-0 opacity-24" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,rgba(16,33,28,0),#10211c)]" />
      </div>

      <div className="container-premium relative grid min-h-[100svh] items-start gap-8 py-18 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="relative z-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9bd7c]/25 bg-[#d9bd7c]/8 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#ead7a4]">
            <MapPin className="size-3.5" />
            Rome-based document preparation
          </div>

          <div className="mt-7 space-y-3">
            <p className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.9rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[#fff9ed]">
              {activeSlide.titleLead}
            </p>
            <div className="relative h-[4.2rem] overflow-hidden sm:h-[5.6rem] lg:h-[6.6rem]">
              {heroSlides.map((slide, index) => {
                const isActive = index === activeIndex;

                return (
                  <p
                    aria-hidden={!isActive}
                    className={`absolute inset-0 font-serif text-[clamp(3.3rem,8.6vw,7.25rem)] font-semibold leading-[0.86] tracking-[-0.06em] text-[#d9bd7c] transition-all duration-700 ${
                      isActive
                        ? "translate-y-0 opacity-100"
                        : index < activeIndex
                          ? "-translate-y-8 opacity-0"
                          : "translate-y-8 opacity-0"
                    } motion-reduce:transition-none`}
                    key={slide.key}
                  >
                    {slide.word}
                  </p>
                );
              })}
            </div>
            <p className="max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.9rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[#fff9ed]">
              {activeSlide.titleTail}
            </p>
          </div>

          <div className="mt-6 max-w-2xl text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#ead7a4]/78 sm:text-sm">
            Passport registration, NIN, BVN, and Nigeria e-visa document preparation
          </div>

          <div className="relative mt-6 min-h-[10.5rem] max-w-2xl sm:min-h-[8.5rem]">
            {heroSlides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <p
                  aria-hidden={!isActive}
                  className={`absolute inset-0 text-base font-medium leading-8 text-white/72 transition-all duration-700 sm:text-lg ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  } motion-reduce:transition-none`}
                  key={`${slide.key}-copy`}
                >
                  {slide.description} Liberty Digital Consulting also supports Nigerian
                  passport, NIN, BVN, and e-visa preparation requests for clients who
                  need structured guidance in Rome, Italy.
                </p>
              );
            })}
          </div>

          <div className="mt-7 lg:hidden">
            {rotatingVisual}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/contact" size="lg">
              Book Document Support <ArrowUpRight className="ml-2 size-4" />
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="glass">
              View Services
            </ButtonLink>
            {whatsappLink ? (
              <Link
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/12 px-6 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-500/18"
                href={whatsappLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="size-4" /> WhatsApp Us
              </Link>
            ) : null}
          </div>

          <div className="mt-8 flex max-w-xl items-start gap-3 border-l border-[#d9bd7c]/35 pl-4 text-sm leading-7 text-white/58">
            <ShieldCheck className="mt-1 size-4 shrink-0 text-[#d9bd7c]" />
            <p>
              Clear preparation, document checks, and practical next-step guidance before
              you approach the relevant issuing authority.
            </p>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:flex sm:max-w-none sm:flex-wrap">
            {heroSlides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  aria-label={`Show ${slide.word} hero`}
                  className={`rounded-full border px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.22em] transition sm:min-w-[8.5rem] ${
                    isActive
                      ? "border-[#d9bd7c]/55 bg-[#d9bd7c]/14 text-[#fff5dd]"
                      : "border-white/12 bg-white/5 text-white/55 hover:border-white/22 hover:text-white/78"
                  }`}
                  key={`${slide.key}-tab`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  {slide.word}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-20 hidden items-center justify-center lg:flex lg:justify-end">
          {rotatingVisual}
        </div>
      </div>
    </section>
  );
}
