"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_SELECTOR = [
  "[data-animate-section]",
  "[data-animate-dark-section]",
  "[data-animate-card]",
  "[data-animate-visual]",
  "[data-animate-cta]",
  "[data-animate-text]",
  "[data-animate-footer]",
].join(", ");

type RootElement = HTMLElement | null;

function isEligibleElement(element: HTMLElement) {
  return !element.closest("[data-no-public-animate]");
}

function setVisibleState(root: RootElement) {
  if (!root) return;

  const elements = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
  elements.forEach((element) => {
    if (!isEligibleElement(element)) return;
    gsap.set(element, {
      autoAlpha: 1,
      clearProps: "transform,opacity,visibility",
    });
  });
}

export function usePublicPageAnimations(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const shouldKeepContentStatic = window.matchMedia(
      "(max-width: 767px), (prefers-reduced-motion: reduce)",
    ).matches;

    if (shouldKeepContentStatic) {
      setVisibleState(root);
      return;
    }

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            setVisibleState(root);
            return;
          }

          const sectionY = isMobile ? 32 : 48;
          const cardY = isMobile ? 24 : 36;
          const textY = isMobile ? 16 : 22;
          const visualY = isMobile ? 28 : 48;
          const visualRotate = isMobile ? -1 : -2;
          const stagger = isMobile ? 0.08 : 0.12;

          const sections = Array.from(
            root.querySelectorAll<HTMLElement>("[data-animate-section], [data-animate-dark-section]"),
          ).filter(isEligibleElement);

          sections.forEach((section) => {
            gsap.fromTo(
              section,
              { autoAlpha: 0, y: sectionY },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 82%",
                  once: true,
                },
              },
            );
          });

          const textBlocks = Array.from(root.querySelectorAll<HTMLElement>("[data-animate-text]")).filter(
            isEligibleElement,
          );

          textBlocks.forEach((textBlock) => {
            gsap.fromTo(
              textBlock,
              { autoAlpha: 0, y: textY },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: textBlock,
                  start: "top 86%",
                  once: true,
                },
              },
            );
          });

          const ctaBlocks = Array.from(root.querySelectorAll<HTMLElement>("[data-animate-cta]")).filter(
            isEligibleElement,
          );

          ctaBlocks.forEach((ctaBlock) => {
            gsap.fromTo(
              ctaBlock,
              { autoAlpha: 0, y: 20 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                ease: "power2.out",
                delay: 0.08,
                scrollTrigger: {
                  trigger: ctaBlock,
                  start: "top 88%",
                  once: true,
                },
              },
            );
          });

          const visualBlocks = Array.from(root.querySelectorAll<HTMLElement>("[data-animate-visual]")).filter(
            isEligibleElement,
          );

          visualBlocks.forEach((visualBlock) => {
            gsap.fromTo(
              visualBlock,
              { autoAlpha: 0, y: visualY, scale: 0.96, rotate: visualRotate },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: visualBlock,
                  start: "top 82%",
                  once: true,
                },
              },
            );
          });

          const listCards = new Set<HTMLElement>();
          const lists = Array.from(root.querySelectorAll<HTMLElement>("[data-animate-list]")).filter(
            isEligibleElement,
          );

          lists.forEach((list) => {
            const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-animate-card]")).filter(
              (card) => isEligibleElement(card) && card.closest("[data-animate-list]") === list,
            );

            cards.forEach((card) => listCards.add(card));

            if (!cards.length) return;

            gsap.fromTo(
              cards,
              { autoAlpha: 0, y: cardY, scale: 0.98 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.65,
                ease: "power3.out",
                stagger,
                scrollTrigger: {
                  trigger: list,
                  start: "top 84%",
                  once: true,
                },
              },
            );
          });

          const standaloneCards = Array.from(root.querySelectorAll<HTMLElement>("[data-animate-card]")).filter(
            (card) => isEligibleElement(card) && !listCards.has(card),
          );

          standaloneCards.forEach((card) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: cardY, scale: 0.98 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.65,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 86%",
                  once: true,
                },
              },
            );
          });

          const footers = Array.from(root.querySelectorAll<HTMLElement>("[data-animate-footer]")).filter(
            isEligibleElement,
          );

          footers.forEach((footer) => {
            gsap.fromTo(
              footer,
              { autoAlpha: 0, y: 40 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: footer,
                  start: "top 92%",
                  once: true,
                },
              },
            );
          });

          ScrollTrigger.refresh();
        },
      );
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [rootRef]);
}
