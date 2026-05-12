"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ServiceCard } from "@/components/services/service-card";
import type { ServiceContent } from "@/lib/services";

gsap.registerPlugin(ScrollTrigger);

export function ServiceGrid({ services }: { services: ServiceContent[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scope = gridRef.current;
    if (media.matches || !scope) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { opacity: 0, y: 48, rotate: -4, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: scope,
            start: "top 78%",
          },
        },
      );
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" ref={gridRef}>
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}
