"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapHero(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = rootRef.current;
    if (!scope) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add(
        {
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(
              [
                "[data-hero-eyebrow]",
                "[data-hero-line]",
                "[data-hero-subtext]",
                "[data-hero-cta]",
                "[data-hero-trust]",
                "[data-hero-visual]",
                "[data-hero-tile]",
                "[data-hero-float]",
              ],
              { clearProps: "all" },
            );
            return;
          }

          const eyebrowY = isMobile ? 10 : 18;
          const subtextY = isMobile ? 14 : 24;
          const ctaY = isMobile ? 14 : 22;
          const trustY = isMobile ? 12 : 18;
          const visualY = isMobile ? 18 : 28;
          const visualScale = isMobile ? 0.985 : 0.96;
          const visualRotate = isMobile ? -1 : -3;
          const tileY = isMobile ? 14 : 26;
          const tileScale = isMobile ? 0.985 : 0.97;
          const tileStagger = isMobile ? 0.05 : 0.08;
          const floatY = isMobile ? 10 : 16;
          const visualScrollY = isMobile ? -2 : -4;
          const tileScrollA = isMobile ? -4 : -10;
          const tileScrollB = isMobile ? -6 : -16;
          const floatDriftYEven = isMobile ? -4 : -8;
          const floatDriftYOdd = isMobile ? -7 : -14;
          const floatDriftXEven = isMobile ? 2 : 4;
          const floatDriftXOdd = isMobile ? -2 : -4;

          gsap.fromTo(
            "[data-hero-eyebrow]",
            { opacity: 0, y: eyebrowY },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          );

          gsap.fromTo(
            "[data-hero-line]",
            { opacity: 0, yPercent: 110 },
            {
              opacity: 1,
              yPercent: 0,
              duration: isMobile ? 0.78 : 0.9,
              ease: "power3.out",
              stagger: isMobile ? 0.08 : 0.12,
              delay: 0.08,
            },
          );

          gsap.fromTo(
            "[data-hero-subtext]",
            { opacity: 0, y: subtextY },
            { opacity: 1, y: 0, duration: isMobile ? 0.72 : 0.85, ease: "power3.out", delay: 0.24 },
          );

          gsap.fromTo(
            "[data-hero-cta]",
            { opacity: 0, y: ctaY },
            {
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.68 : 0.8,
              ease: "power3.out",
              stagger: isMobile ? 0.08 : 0.1,
              delay: 0.34,
            },
          );

          gsap.fromTo(
            "[data-hero-trust]",
            { opacity: 0, y: trustY },
            { opacity: 1, y: 0, duration: isMobile ? 0.62 : 0.7, ease: "power3.out", delay: 0.44 },
          );

          gsap.fromTo(
            "[data-hero-visual]",
            { opacity: 0, y: visualY, scale: visualScale, rotate: visualRotate },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotate: 0,
              duration: isMobile ? 0.88 : 1.05,
              ease: "power3.out",
              delay: 0.18,
            },
          );

          gsap.fromTo(
            "[data-hero-tile]",
            { opacity: 0, y: tileY, scale: tileScale },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: isMobile ? 0.62 : 0.75,
              ease: "power3.out",
              stagger: tileStagger,
              delay: 0.48,
            },
          );

          gsap.fromTo(
            "[data-hero-float]",
            { opacity: 0, y: floatY },
            {
              opacity: 1,
              y: 0,
              duration: isMobile ? 0.62 : 0.75,
              ease: "power2.out",
              stagger: tileStagger,
              delay: 0.54,
            },
          );

          gsap.to("[data-hero-visual-card]", {
            yPercent: visualScrollY,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: "top top",
              end: "bottom top",
              scrub: isMobile ? 0.9 : 1.15,
            },
          });

          gsap.utils.toArray<HTMLElement>("[data-hero-tile]").forEach((tile, index) => {
            gsap.to(tile, {
              y: index % 2 === 0 ? tileScrollA : tileScrollB,
              ease: "none",
              scrollTrigger: {
                trigger: scope,
                start: "top bottom",
                end: "bottom top",
                scrub: isMobile ? 0.9 : 1.2,
              },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-hero-float]").forEach((item, index) => {
            gsap.to(item, {
              y: index % 2 === 0 ? floatDriftYEven : floatDriftYOdd,
              x: index % 2 === 0 ? floatDriftXEven : floatDriftXOdd,
              duration: (isMobile ? 3.1 : 3.6) + index * 0.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          });
        },
      );
    }, scope);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [rootRef]);
}
