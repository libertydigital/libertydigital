"use client";

import { useEffect, useRef } from "react";
import { LockKeyhole, MapPinned, MessageSquareMore, ScrollText, Shield } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SectionHeading } from "@/components/ui/section-heading";

gsap.registerPlugin(ScrollTrigger);

const trustItems = [
  {
    icon: ScrollText,
    title: "Clear service-by-service guidance",
    description:
      "Each request is presented with practical preparation notes, document expectations, and clearer next-step direction before you proceed.",
  },
  {
    icon: MessageSquareMore,
    title: "Structured request capture",
    description:
      "Every core service has its own intake flow, helping Liberty review enquiries with the right context from the start.",
  },
  {
    icon: MapPinned,
    title: "Visible Rome contact details",
    description:
      "The Rome address, email, and phone details stay easy to verify so visitors know exactly who they are contacting.",
  },
  {
    icon: Shield,
    title: "Support positioning that stays credible",
    description:
      "Liberty is framed as a documentation support service with guidance and preparation help, not as a government issuing authority.",
  },
  {
    icon: LockKeyhole,
    title: "Protected request handling",
    description:
      "Submitted enquiries are validated server-side and routed into a protected admin workflow for practical follow-up.",
  },
];

export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scope = sectionRef.current;
    if (media.matches || !scope) return;

    const cleanupFns: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".trust-card");

      gsap.fromTo(
        ".trust-card",
        {
          opacity: 0,
          y: 34,
          rotateX: -8,
          rotateY: (index) => (index % 2 === 0 ? -4 : 4),
          transformPerspective: 1200,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope,
            start: "top 78%",
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

          setRotateY(x * 8);
          setRotateX(y * -8);
          setY(-4);
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
    <section className="section-band relative overflow-hidden py-20" ref={sectionRef}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[6%] top-12 h-44 w-44 rounded-full bg-[rgba(234,217,188,0.05)] blur-3xl" />
        <div className="absolute right-[8%] top-8 h-52 w-52 rounded-full bg-[rgba(109,132,153,0.05)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:132px_132px] opacity-15" />
      </div>
      <div className="container-shell">
        <SectionHeading
          description="The experience is designed to feel verified, practical, and respectful of documentation-sensitive requests from the first click to the follow-up."
          kicker="Trust signals"
          title="Built to feel credible, careful, and properly handled"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                className="trust-card relative flex h-full flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-7 shadow-[0_22px_50px_rgba(4,10,18,0.14)] backdrop-blur-sm will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
                key={item.title}
              >
                <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(234,217,188,0.18),rgba(255,255,255,0.04))] text-[var(--color-gold-soft)] shadow-[0_14px_32px_rgba(4,10,18,0.18)]">
                  <Icon className="size-5" />
                </div>
                <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">
                  Trust point
                </p>
                <h3 className="mt-4 max-w-[15rem] font-serif text-[1.9rem] font-semibold leading-[0.98] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/72">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
