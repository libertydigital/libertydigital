"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, CheckCircle2, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { BUSINESS_DETAILS } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const whatsappLink = buildWhatsAppLink(
  BUSINESS_DETAILS.phone,
  "Hello Liberty Digital Consulting, I would like to book document support in Rome.",
);

export function PremiumHero() {
  const journeyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey) return;

    const matchMedia = gsap.matchMedia();
    const context = gsap.context(() => {
      matchMedia.add(
        {
          desktop: "(min-width: 900px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          const { desktop, reduced } = conditions as { desktop: boolean; reduced: boolean };
          if (reduced) return;

          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from("[data-passport-kicker]", { opacity: 0, y: 16, duration: 0.65 })
            .from("[data-passport-title]", { opacity: 0, yPercent: 24, duration: 0.95 }, 0.12)
            .from("[data-passport-copy]", { opacity: 0, y: 22, duration: 0.7 }, 0.32)
            .from("[data-passport-actions]", { opacity: 0, y: 16, duration: 0.65 }, 0.48)
            .from("[data-passport-proof]", { opacity: 0, x: -18, duration: 0.7 }, 0.62)
            .from("[data-passport-stage]", {
              opacity: 0,
              x: desktop ? 90 : 20,
              y: desktop ? 30 : 15,
              rotate: desktop ? 5 : 2,
              scale: 0.92,
              duration: 1.25,
              ease: "expo.out",
            }, 0.18);

          if (!desktop) return;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: journey,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.1,
                invalidateOnRefresh: true,
              },
            })
            .to("[data-passport-intro]", {
              opacity: 0.12,
              y: -70,
              duration: 0.22,
              ease: "power2.in",
            }, 0.22)
            .to("[data-passport-closed]", {
              opacity: 0,
              rotate: -9,
              scale: 0.9,
              xPercent: -5,
              duration: 0.12,
              ease: "power2.inOut",
            }, 0.28)
            .fromTo("[data-passport-open]", {
              opacity: 0,
              rotate: 8,
              scale: 0.86,
              xPercent: 8,
            }, {
              opacity: 1,
              rotate: -3,
              scale: 1.05,
              xPercent: 0,
              duration: 0.22,
              ease: "power3.out",
            }, 0.41)
            .to("[data-passport-stage]", {
              xPercent: -42,
              yPercent: 9,
              scale: 0.88,
              duration: 0.24,
              ease: "power2.inOut",
            }, 0.52)
            .fromTo("[data-holder-image]", {
              opacity: 0.35,
              scale: 1.07,
            }, {
              opacity: 1,
              scale: 1,
              duration: 0.28,
              ease: "power2.out",
            }, 0.58)
            .fromTo("[data-holder-copy]", {
              opacity: 0,
              y: 42,
            }, {
              opacity: 1,
              y: 0,
              duration: 0.2,
              ease: "power3.out",
            }, 0.62)
            .to("[data-passport-stage]", {
              opacity: 0,
              scale: 0.8,
              yPercent: 18,
              duration: 0.2,
              ease: "power2.in",
            }, 0.76);
        },
      );
    }, journey);

    return () => {
      matchMedia.revert();
      context.revert();
    };
  }, []);

  return (
    <div className="relative bg-[#06110e]" data-no-public-animate ref={journeyRef}>
      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="absolute right-[2%] top-1/2 h-[min(66vw,46rem)] w-[min(58vw,52rem)] -translate-y-1/2 [mask-image:radial-gradient(ellipse_at_64%_50%,black_24%,transparent_65%)] [-webkit-mask-image:radial-gradient(ellipse_at_64%_50%,black_24%,transparent_65%)]"
            data-passport-stage
          >
            <div className="absolute inset-[3%] rounded-full bg-[#b99352]/14 blur-[110px]" />
            <Image
              alt="Closed fictional international travel document booklet"
              className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_40px_90px_rgba(0,0,0,0.7)]"
              data-passport-closed
              fill
              priority
              sizes="58vw"
              src="/assets/images/passport-closed-sync.webp"
            />
            <Image
              alt="Open fictional travel document booklet with abstract security-pattern data pages"
              className="absolute inset-0 h-full w-full object-contain opacity-0 drop-shadow-[0_40px_90px_rgba(0,0,0,0.7)]"
              data-passport-open
              fill
              priority
              sizes="58vw"
              src="/assets/images/passport-open-sync.webp"
            />
          </div>
        </div>
      </div>

      <section className="passport-hero relative z-10 min-h-[100svh] overflow-hidden text-white">
        <div className="absolute inset-0">
          <video
            aria-hidden="true"
            autoPlay
            className="hero-security-video absolute inset-0 hidden h-full w-full object-cover opacity-35 mix-blend-screen lg:block"
            loop
            muted
            playsInline
            poster="/assets/video/security-shimmer-poster.webp"
            preload="metadata"
            suppressHydrationWarning
          >
            <source src="/assets/video/security-shimmer-web.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,13,11,0.98)_0%,rgba(4,13,11,0.92)_42%,rgba(4,13,11,0.35)_74%,rgba(4,13,11,0.74)_100%)]" />
          <div className="passport-security-pattern absolute inset-0 opacity-40" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,rgba(6,17,14,0),#06110e)]" />
        </div>

        <div className="container-premium relative grid min-h-[100svh] items-center gap-8 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="relative z-30 max-w-3xl" data-passport-intro>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9bd7c]/25 bg-[#d9bd7c]/8 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#ead7a4]" data-passport-kicker>
              <MapPin className="size-3.5" />
              Rome-based document preparation
            </div>
            <h1 className="mt-7 max-w-3xl font-serif text-[clamp(3.15rem,7.3vw,7.5rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-[#fff9ed]" data-passport-title>
              Nigerian Passport, NIN &amp; BVN Support in Rome
            </h1>
            <div className="relative mt-6 h-48 overflow-hidden rounded-[24px] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.36)] lg:hidden">
              <Image alt="Closed fictional international travel document booklet" className="object-cover object-[70%_center]" fill priority sizes="90vw" src="/assets/images/passport-closed-sync.webp" />
            </div>
            <p className="mt-7 max-w-xl text-base font-medium leading-8 text-white/70 sm:text-lg" data-passport-copy>
              Professional document preparation and digital consulting support for Nigerians in Italy.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-passport-actions>
              <ButtonLink href="/contact" size="lg">Book Document Support <ArrowUpRight className="ml-2 size-4" /></ButtonLink>
              <ButtonLink href="/services" size="lg" variant="glass">View Services</ButtonLink>
              {whatsappLink ? (
                <Link className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/12 px-6 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-500/18" href={whatsappLink} rel="noopener noreferrer" target="_blank">
                  <MessageCircle className="size-4" /> WhatsApp Us
                </Link>
              ) : null}
            </div>
            <div className="mt-8 flex max-w-xl items-start gap-3 border-l border-[#d9bd7c]/35 pl-4 text-sm leading-7 text-white/58" data-passport-proof>
              <ShieldCheck className="mt-1 size-4 shrink-0 text-[#d9bd7c]" />
              <p>Clear preparation, document checks, and practical next-step guidance before you approach the relevant issuing authority.</p>
            </div>
          </div>

          <a aria-label="Scroll to see the passport open" className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.24em] text-white/45 lg:flex" href="#passport-open-story">
            Scroll into the next section <ArrowDown className="size-3.5" />
          </a>
        </div>
      </section>

      <section className="relative z-10 min-h-[108svh] overflow-hidden bg-[#07130f] text-white" id="passport-open-story">
        <Image
          alt="Illustrative Nigerian diaspora professional in Rome reviewing a fictional travel document"
          className="object-cover object-[62%_center] lg:opacity-35"
          data-holder-image
          fill
          sizes="100vw"
          src="/assets/images/passport-holder-rome-v2.webp"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#06110e_0%,rgba(6,17,14,0.96)_42%,rgba(6,17,14,0.24)_78%,rgba(6,17,14,0.08)_100%)]" />
        <div className="passport-security-pattern absolute inset-0 opacity-30" />

        <div className="container-premium relative flex min-h-[108svh] items-center py-24">
          <div className="relative z-30 max-w-xl" data-holder-copy>
            <div className="relative mb-7 h-44 overflow-hidden rounded-[24px] border border-white/12 bg-[#07130f]/72 shadow-[0_24px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl lg:hidden">
              <Image alt="Open fictional travel document data page" className="object-cover" fill sizes="90vw" src="/assets/images/passport-open-sync.webp" />
            </div>
            <p className="section-kicker text-[#d9bd7c]">Open the right way forward</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.92] tracking-[-0.045em] text-[#fff9ed] sm:text-7xl">
              Prepared documents make the next step clearer.
            </h2>
            <p className="mt-6 text-base leading-8 text-white/68">
              From passport renewal to NIN, BVN, eVisa and legal documents, we help you organise the details correctly before submission.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-white/72 sm:grid-cols-2">
              {["Review requirements", "Check identity details", "Organise supporting records", "Understand the next step"].map((item) => (
                <div className="flex items-center gap-3 border-b border-white/12 py-3" key={item}>
                  <CheckCircle2 className="size-4 text-[#d9bd7c]" /> {item}
                </div>
              ))}
            </div>
            <ButtonLink className="mt-8" href="/services">Explore Support Services <ArrowUpRight className="ml-2 size-4" /></ButtonLink>
          </div>

        </div>
      </section>
    </div>
  );
}
