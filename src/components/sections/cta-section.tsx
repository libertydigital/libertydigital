"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ButtonLink } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scope = panelRef.current;
    if (media.matches || !scope) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        scope,
        { opacity: 0, y: 26, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope,
            start: "top 82%",
          },
        },
      );
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20">
      <div className="container-shell">
        <div
          className="premium-panel relative overflow-hidden rounded-[40px] px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-14"
          ref={panelRef}
        >
          <div className="absolute left-[-4rem] top-[-4rem] h-40 w-40 rounded-full bg-[rgba(234,217,188,0.16)] blur-3xl" />
          <div className="absolute right-[-2rem] top-10 h-52 w-52 rounded-full bg-[rgba(109,132,153,0.16)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02),transparent_34%,rgba(255,255,255,0.03)_64%,transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:140px_140px] opacity-20" />
          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="section-kicker !text-[var(--color-gold-soft)]">Next step</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-[0.98] sm:text-5xl lg:text-[3.65rem]">
                Need help with a Nigerian documentation request?
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/78">
                Start with the service that matches your request and the team will review your details before following up with next steps.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ButtonLink
                  className="bg-[linear-gradient(135deg,#f7efe4_0%,#e7d3ad_100%)] text-[var(--color-navy)] hover:brightness-105"
                  href="/services"
                >
                  Start Your Request
                </ButtonLink>
                <p className="text-sm leading-7 text-white/66">
                  Service-specific request forms. Structured follow-up. Rome office contact details.
                </p>
              </div>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 backdrop-blur-sm">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">
                What happens next
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "Choose the service that matches your request.",
                  "Submit your details through the service-specific form.",
                  "Liberty reviews your request and contacts you with next steps.",
                ].map((item, index) => (
                  <div
                    className="flex items-start gap-4 rounded-[22px] border border-white/8 bg-white/5 px-4 py-4"
                    key={item}
                  >
                    <div className="flex size-9 items-center justify-center rounded-full border border-[rgba(234,217,188,0.28)] bg-[rgba(234,217,188,0.08)] text-xs font-semibold text-[var(--color-gold-soft)]">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-7 text-white/76">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
