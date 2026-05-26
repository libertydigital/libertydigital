"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowUpRight, CheckCheck, MapPin } from "lucide-react";

import { HeroDocumentVisual } from "@/components/sections/hero-document-visual";
import { ButtonLink } from "@/components/ui/button";
import { useGsapHero } from "@/hooks/use-gsap-hero";
import { BUSINESS_DETAILS, SERVICES } from "@/lib/services";

const HERO_LINES = ["Nigerian Documentation", "Support in Rome"];

export function PremiumHero() {
  const sectionRef = useRef<HTMLElement>(null);
  useGsapHero(sectionRef);

  return (
    <section
      className="relative overflow-hidden bg-[linear-gradient(180deg,#081018_0%,#0b1420_42%,#111d2b_100%)] py-3 sm:py-8 lg:-mt-3 lg:pt-6 lg:pb-8"
      data-no-public-animate
      ref={sectionRef}
    >
      <div className="absolute inset-0 z-0">
        {/* Pure CSS/SVG Background Layer for improved LCP and control */}
        <div className="absolute inset-0 bg-[#081018]" />
        <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        <Image
          alt="Abstract dark editorial background with gold and blue light leaks"
          className="object-cover object-[68%_50%] opacity-78"
          fill
          priority
          sizes="100vw"
          src="/hero-premium-generated.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,16,24,0.9)_0%,rgba(8,16,24,0.82)_20%,rgba(8,16,24,0.64)_38%,rgba(8,16,24,0.24)_58%,rgba(8,16,24,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_80%,rgba(215,178,117,0.18),transparent_18%),radial-gradient(circle_at_82%_20%,rgba(111,147,187,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_24%)]" />
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(8,16,24,0.68))]" />
      </div>

      <div className="relative z-10 container-shell">
        <div className="grid items-stretch gap-3 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6">
          <div className="relative z-10 flex h-full min-w-0 max-w-2xl flex-col rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012))] p-2.5 shadow-[0_22px_42px_rgba(3,8,15,0.14)] backdrop-blur-sm sm:p-4 lg:rounded-[28px] lg:p-4.5">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-soft)] shadow-[0_14px_24px_rgba(4,10,18,0.14)] backdrop-blur-xl"
              data-hero-eyebrow
            >
              <MapPin className="size-3.5 text-[var(--color-gold)]" />
              Office-based support in Rome
            </div>

            <h1 className="mt-3 text-[1.5rem] font-black uppercase leading-[0.9] tracking-[-0.05em] text-[var(--color-paper)] sm:text-[3rem] lg:text-[3.45rem] xl:text-[3.8rem]">
              {HERO_LINES.map((line) => (
                <span className="block overflow-hidden" key={line}>
                  <span className="block" data-hero-line>
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="mt-2 max-w-xl text-[0.74rem] leading-5 text-white/72 sm:text-[0.9rem] sm:leading-6 lg:max-w-lg"
              data-hero-subtext
            >
              Guided support for Nigerian passport online registration, NIN, BVN,
              Nigeria eVisa, court e-affidavit, and National Population Commission
              digital certificate requests.
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap" data-hero-actions>
              <ButtonLink className="justify-center sm:justify-start" href="/services" data-hero-cta>
                Start Your Request
                <ArrowUpRight className="ml-2 size-4" />
              </ButtonLink>
              <ButtonLink
                className="justify-center border-white/14 bg-white/8 text-white hover:bg-white/12 sm:justify-start"
                href="/services"
                variant="secondary"
                data-hero-cta
              >
                View Services
              </ButtonLink>
            </div>

            <div
              className="mt-3 flex min-w-0 items-start gap-2.5 rounded-[16px] border border-white/10 bg-white/5 px-2.5 py-2.5 text-sm leading-5 text-white/72 shadow-[0_16px_28px_rgba(4,10,18,0.12)] backdrop-blur-xl sm:max-w-xl sm:px-3"
              data-hero-trust
            >
              <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-[rgba(233,212,171,0.1)] text-[var(--color-gold-soft)]">
                <MapPin className="size-4" />
              </div>
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                  Location
                </p>
                <p className="mt-1 break-words text-[0.72rem] leading-5 text-white/72 sm:text-[0.78rem]">
                  Office-based support at {BUSINESS_DETAILS.address}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-3 py-2.5 text-white/78 shadow-[0_14px_24px_rgba(4,10,18,0.12)]">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[rgba(233,212,171,0.1)] text-[var(--color-gold-soft)]">
                      <CheckCheck className="size-4" />
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                        Request flow
                      </p>
                      <p className="mt-1 text-[0.72rem] font-medium leading-5 text-white/84">
                        Structured review before follow-up
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[16px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-3 py-2.5 text-white/78 shadow-[0_14px_24px_rgba(4,10,18,0.12)]">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[rgba(233,212,171,0.1)] text-[var(--color-gold-soft)]">
                      <CheckCheck className="size-4" />
                    </div>
                    <div>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                        Support desk
                      </p>
                      <p className="mt-1 text-[0.72rem] font-medium leading-5 text-white/84">
                        Clear next-step guidance from Rome
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HeroDocumentVisual services={SERVICES} />
        </div>
      </div>
    </section>
  );
}
