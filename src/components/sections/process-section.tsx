"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SectionHeading } from "@/components/ui/section-heading";

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    title: "Choose your service",
    description: "Select the documentation support request that matches your situation.",
  },
  {
    title: "Submit your request",
    description: "Complete the service-specific form with the details Liberty needs to review.",
  },
  {
    title: "Internal review",
    description: "Liberty Digital Consulting checks the request, documents, and preparation needs.",
  },
  {
    title: "Get next-step guidance",
    description: "The team contacts you with practical instructions and follow-up direction.",
  },
  {
    title: "Prepare and proceed",
    description: "You organise the required documents and continue with the relevant process.",
  },
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scope = sectionRef.current;
    if (media.matches || !scope) return;

    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".process-card");

      gsap.fromTo(
        ".process-card",
        { opacity: 0, y: 42, rotateX: -10, rotateY: (index) => (index % 2 === 0 ? -5 : 5), transformPerspective: 1200 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope,
            start: "top 76%",
          },
        },
      );

      cards.forEach((card) => {
        const setRotateY = gsap.quickTo(card, "rotateY", {
          duration: 0.35,
          ease: "power3.out",
        });
        const setRotateX = gsap.quickTo(card, "rotateX", {
          duration: 0.35,
          ease: "power3.out",
        });
        const setY = gsap.quickTo(card, "y", {
          duration: 0.35,
          ease: "power3.out",
        });

        const handleMove = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;

          setRotateY(x * 10);
          setRotateX(y * -10);
          setY(-6);
        };

        const handleLeave = () => {
          setRotateY(0);
          setRotateX(0);
          setY(0);
        };

        card.addEventListener("pointermove", handleMove);
        card.addEventListener("pointerleave", handleLeave);

        cleanupFns.push(() => {
          card.removeEventListener("pointermove", handleMove);
          card.removeEventListener("pointerleave", handleLeave);
        });
      });
    }, scope);

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <section className="section-band-deep relative overflow-hidden py-14 sm:py-20" ref={sectionRef}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
      >
        <div className="absolute left-[8%] top-10 h-40 w-40 rounded-full bg-[rgba(234,217,188,0.06)] blur-3xl" />
        <div className="absolute right-[10%] top-16 h-48 w-48 rounded-full bg-[rgba(109,132,153,0.06)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.02))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.014)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />
      </div>
      <div className="container-shell">
        <SectionHeading
          description="A straightforward request flow built for clear guidance, clean handover, and follow-up after submission."
          kicker="How it works"
          title="Simple request handling with clear next steps"
        />
        <div className="relative mt-8 sm:mt-14">
          <div
            aria-hidden="true"
            className="absolute left-6 right-6 top-8 hidden h-px bg-[linear-gradient(90deg,rgba(234,217,188,0.08),rgba(234,217,188,0.4),rgba(234,217,188,0.08))] lg:block"
          />
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-5">
            {processSteps.map((step, index) => (
              <article
                className="process-card relative flex h-full flex-col rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 shadow-[0_20px_45px_rgba(4,10,18,0.12)] backdrop-blur-sm will-change-transform sm:rounded-[30px] sm:p-6"
                style={{ transformStyle: "preserve-3d" }}
                key={step.title}
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full border border-[rgba(234,217,188,0.28)] bg-[linear-gradient(135deg,rgba(234,217,188,0.18),rgba(255,255,255,0.04))] text-xs font-semibold tracking-[0.14em] text-[var(--color-gold-soft)] shadow-[0_12px_30px_rgba(4,10,18,0.18)] sm:size-12 sm:text-sm">
                    0{index + 1}
                  </div>
                  <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(234,217,188,0.28),rgba(255,255,255,0))] lg:hidden" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-soft)] sm:mt-6 sm:tracking-[0.28em]">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 max-w-[13rem] font-serif text-[1.55rem] font-semibold leading-[0.98] text-white sm:mt-4 sm:text-[1.9rem]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/72 sm:mt-4 sm:leading-7">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
