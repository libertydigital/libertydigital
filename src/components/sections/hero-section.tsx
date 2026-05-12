"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import gsap from "gsap";

import { AnimatedDocumentCard } from "@/components/sections/animated-document-card";
import { ButtonLink } from "@/components/ui/button";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scope = sectionRef.current;
    if (media.matches || !scope) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero='headline']",
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      );
      gsap.fromTo(
        "[data-hero='subcopy'], [data-hero='actions'], [data-hero='trust']",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.25,
        },
      );
      gsap.fromTo(
        "[data-doc-card]",
        { opacity: 0, y: 32, rotate: (index) => (index % 2 === 0 ? -3 : 3) },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 1,
          stagger: 0.18,
          ease: "power3.out",
          delay: 0.35,
        },
      );
      gsap.fromTo(
        "[data-hero='visual']",
        { opacity: 0, y: 24, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", delay: 0.25 },
      );
      gsap.to("[data-doc-card]", {
        y: "-=6",
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-22" ref={sectionRef}>
      <div className="absolute inset-0 -z-20">
        <Image
          alt="Editorial background texture for Liberty Digital Consulting Services hero"
          className="h-full w-full object-cover"
          fill
          priority
          sizes="100vw"
          src="/hero-side-background-dark-editorial.png.png"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,9,13,0.62)_0%,rgba(6,9,13,0.4)_26%,rgba(6,9,13,0.24)_52%,rgba(6,9,13,0.38)_76%,rgba(6,9,13,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,9,13,0.18)_0%,rgba(6,9,13,0.08)_24%,rgba(6,9,13,0.22)_100%)]" />
      </div>
      <div className="container-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch lg:gap-12">
        <div className="relative flex h-full max-w-2xl flex-col overflow-hidden rounded-[32px] border border-white/8 bg-[rgba(8,11,15,0.42)] p-5 backdrop-blur-[2px] sm:rounded-[36px] sm:p-8">
          <p className="section-kicker">Rome-based support</p>
          <h1
            className="mt-5 text-balance font-serif text-[3.15rem] font-semibold leading-[0.94] text-white sm:mt-6 sm:text-[4.5rem] sm:leading-[0.98] lg:text-[4.6rem]"
            data-hero="headline"
          >
            Nigerian Documentation &amp; Digital Registration Support in Rome
          </h1>
          <p
            className="mt-5 max-w-xl text-base leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8"
            data-hero="subcopy"
          >
            Get guided support for Nigerian passport online registration, NIN, BVN,
            Nigeria eVisa, court e-affidavit, and National Population Commission
            digital certificate requests.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4" data-hero="actions">
            <ButtonLink href="/services">
              Choose a Service <ArrowRight className="ml-2 size-4" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Request Support
            </ButtonLink>
          </div>
          <div className="mt-auto pt-8 sm:pt-10">
            <div className="grid gap-3 sm:max-w-xl sm:grid-cols-2" data-hero="trust">
              <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-gold-soft)]">
                  Office
                </p>
                <div className="mt-3 flex items-start gap-3 text-sm leading-6 text-white/72">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-soft)]" />
                  <span>Office-based support in Rome, Italy.</span>
                </div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.26em] text-[var(--color-gold-soft)]">
                  Request flow
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Structured service forms, document guidance, and admin follow-up.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="premium-panel relative flex h-full flex-col overflow-hidden rounded-[34px] p-3 sm:rounded-[40px] sm:p-5"
          data-hero="visual"
        >
          <div className="absolute inset-x-10 top-0 h-28 rounded-b-[999px] bg-[rgba(234,217,188,0.1)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/20">
            <Image
              alt="Hero image for Liberty Digital Consulting Services"
              className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[560px]"
              height={1200}
              priority
              src="/hero-document-support-rome.png.png"
              width={1600}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,12,0.08)_0%,rgba(5,8,12,0.22)_56%,rgba(5,8,12,0.62)_100%)]" />
            <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-[rgba(10,14,19,0.46)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/78 backdrop-blur-sm">
              Premium request support
            </div>
          </div>
          <div className="relative -mt-6 grid items-stretch gap-4 px-1 pb-1 sm:-mt-10 sm:grid-cols-2 sm:gap-5 sm:px-2 sm:pb-2">
            <div className="h-full" data-doc-card>
              <AnimatedDocumentCard
                badge="Passport"
                imageSrc="/card-passport-preparation.png"
                subtitle="Registration guidance, renewals, and appointment readiness."
                title="Passport preparation"
              />
            </div>
            <div className="h-full" data-doc-card>
              <AnimatedDocumentCard
                badge="Identity"
                imageSrc="/card-identity-documents.png.png"
                subtitle="NIN, BVN, and certificate support with clear next steps."
                title="Identity documents"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
