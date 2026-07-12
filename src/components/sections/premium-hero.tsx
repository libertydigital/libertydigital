import Image from "next/image";
import Link from "next/link";
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
    description:
      "Get guided help with passport registration preparation, document review, and next-step readiness before you continue with the official process. Liberty Digital Consulting also supports Nigerian passport, NIN, BVN, and e-visa preparation requests for clients who need structured guidance in Rome, Italy.",
    imageSrc: "/nigeria-passport-service-cover-v2.webp",
    imageAlt: "Nigerian passport service visual for Liberty Digital Consulting",
  },
  {
    key: "nin",
    word: "NIN",
    description:
      "Get clear preparation support for NIN requirements, identity details, and supporting records so your request is organised properly from the start. Liberty Digital Consulting also supports Nigerian passport, NIN, BVN, and e-visa preparation requests for clients who need structured guidance in Rome, Italy.",
    imageSrc: "/nin-service-cover-v2.webp",
    imageAlt: "National Identification Number support visual for Liberty Digital Consulting",
  },
  {
    key: "bvn",
    word: "BVN",
    description:
      "Get guided help with BVN preparation, identity verification details, and supporting information before you continue with the relevant bank or authorised provider. Liberty Digital Consulting also supports Nigerian passport, NIN, BVN, and e-visa preparation requests for clients who need structured guidance in Rome, Italy.",
    imageSrc: "/bank-verification-number-bvn-service-cover-v2.webp",
    imageAlt: "Bank Verification Number support visual for Liberty Digital Consulting",
  },
  {
    key: "e-visa",
    word: "E-Visa",
    description:
      "Get preparation support for Nigeria e-visa requests, travel document checks, and submission readiness before you move to the formal application stage. Liberty Digital Consulting also supports Nigerian passport, NIN, BVN, and e-visa preparation requests for clients who need structured guidance in Rome, Italy.",
    imageSrc: "/e-visa-service-cover-v2.webp",
    imageAlt: "Nigeria e-visa support visual for Liberty Digital Consulting",
  },
] as const;

const heroScript = `
(() => {
  const root = document.querySelector('[data-premium-hero]');
  if (!root) return;

  const words = Array.from(root.querySelectorAll('[data-hero-word]'));
  const copies = Array.from(root.querySelectorAll('[data-hero-copy]'));
  const images = Array.from(root.querySelectorAll('[data-hero-image]'));
  const tabs = Array.from(root.querySelectorAll('[data-hero-tab]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  const hoverCard = root.querySelector('[data-hero-visual-card]');
  const hoverTarget = root.querySelector('[data-hero-visual-target]');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let rotationTimer = null;
  let startTimer = null;
  let hoverFrame = null;

  const updateTabs = (isActive, element) => {
    element.style.borderColor = isActive ? 'rgba(217,189,124,0.55)' : 'rgba(255,255,255,0.12)';
    element.style.background = isActive ? 'rgba(217,189,124,0.14)' : 'rgba(255,255,255,0.05)';
    element.style.color = isActive ? '#fff5dd' : 'rgba(255,255,255,0.55)';
  };

  const applySlide = (index) => {
    activeIndex = index;

    words.forEach((element, wordIndex) => {
      const isActive = wordIndex === index;
      element.setAttribute('aria-hidden', String(!isActive));
      element.style.opacity = isActive ? '1' : '0';
      element.style.transform = isActive
        ? 'translateY(0)'
        : wordIndex < index
          ? 'translateY(-2rem)'
          : 'translateY(2rem)';
    });

    copies.forEach((element, copyIndex) => {
      const isActive = copyIndex === index;
      element.setAttribute('aria-hidden', String(!isActive));
      element.style.opacity = isActive ? '1' : '0';
      element.style.transform = isActive ? 'translateY(0)' : 'translateY(1rem)';
      element.style.pointerEvents = isActive ? 'auto' : 'none';
    });

    images.forEach((element, imageIndex) => {
      const isActive = imageIndex === index;
      element.setAttribute('aria-hidden', String(!isActive));
      element.style.opacity = isActive ? '1' : '0';
      element.style.pointerEvents = isActive ? 'auto' : 'none';
    });

    tabs.forEach((element, tabIndex) => {
      const isActive = tabIndex === index;
      element.setAttribute('aria-pressed', String(isActive));
      updateTabs(isActive, element);
    });

    dots.forEach((element, dotIndex) => {
      const isActive = dotIndex === index;
      element.style.width = isActive ? '2.5rem' : '0.75rem';
      element.style.background = isActive ? '#d9bd7c' : 'rgba(255,255,255,0.22)';
    });
  };

  const restartRotation = () => {
    if (media.matches) return;
    if (startTimer) window.clearTimeout(startTimer);
    if (rotationTimer) window.clearInterval(rotationTimer);
    startTimer = window.setTimeout(() => {
      rotationTimer = window.setInterval(() => {
        applySlide((activeIndex + 1) % words.length);
      }, 3600);
    }, 4200);
  };

  tabs.forEach((element, index) => {
    element.addEventListener('click', () => {
      applySlide(index);
      restartRotation();
    });
  });

  if (hoverCard && hoverTarget && !media.matches) {
    hoverTarget.addEventListener('mousemove', (event) => {
      const rect = hoverTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const offsetX = (x - 0.5) * 14;
      const offsetY = (y - 0.5) * 18;
      const rotateX = (0.5 - y) * 6;
      const rotateY = (x - 0.5) * 6;

      if (hoverFrame) window.cancelAnimationFrame(hoverFrame);
      hoverFrame = window.requestAnimationFrame(() => {
        hoverCard.style.transform =
          'perspective(1400px) translate3d(' +
          offsetX +
          'px, ' +
          offsetY +
          'px, 0) rotateX(' +
          rotateX +
          'deg) rotateY(' +
          rotateY +
          'deg)';
      });
    });

    hoverTarget.addEventListener('mouseleave', () => {
      if (hoverFrame) window.cancelAnimationFrame(hoverFrame);
      hoverFrame = window.requestAnimationFrame(() => {
        hoverCard.style.transform =
          'perspective(1400px) translate3d(0px, 0px, 0) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  applySlide(0);
  restartRotation();
})();
`;

export function PremiumHero() {
  const rotatingVisual = (
    <div className="relative w-full max-w-[36rem] lg:pr-6">
      <div className="absolute inset-x-[16%] top-[8%] h-24 rounded-b-[999px] bg-[#b99352]/18 blur-3xl" />
      <div
        className="relative mx-auto flex w-full max-w-[27rem] justify-center lg:max-w-[29rem] lg:justify-end"
        data-hero-visual-target
      >
        <div className="absolute left-[6%] top-[16%] h-[76%] w-[78%] rounded-[3rem] bg-black/18 blur-2xl" />
        <div className="absolute right-[6%] top-[6%] h-[82%] w-[72%] rounded-[2.5rem] border border-white/10 bg-white/[0.05]" />
        <div
          className="relative aspect-[0.72] w-full max-w-[27rem] transition-transform duration-200 ease-out motion-reduce:transition-none lg:max-w-[29rem]"
          data-hero-visual-card
          style={{ transform: "perspective(1400px) translate3d(0px, 0px, 0) rotateX(0deg) rotateY(0deg)" }}
        >
          {heroSlides.map((slide, index) => (
            <div
              aria-hidden={index === 0 ? "false" : "true"}
              className="absolute inset-0 rotate-[6deg] transition-opacity duration-500 motion-reduce:transition-none lg:rotate-[8deg]"
              data-hero-image
              key={`${slide.key}-image`}
              style={{
                opacity: index === 0 ? 1 : 0,
                pointerEvents: index === 0 ? "auto" : "none",
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/14 shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
                <Image
                  alt={slide.imageAlt}
                  className="h-full w-full object-cover object-top"
                  fill
                  loading={index === 0 ? undefined : "lazy"}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 32rem, 84vw"
                  src={slide.imageSrc}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,7,0.02)_0%,rgba(4,8,7,0.06)_38%,rgba(4,8,7,0.34)_100%)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-2 lg:justify-end">
        {heroSlides.map((slide, index) => (
          <span
            className="h-1.5 rounded-full transition-all duration-500"
            data-hero-dot
            key={`${slide.key}-dot`}
            style={{
              width: index === 0 ? "2.5rem" : "0.75rem",
              background: index === 0 ? "#d9bd7c" : "rgba(255,255,255,0.22)",
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-[#10211c] text-white" data-premium-hero>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,189,124,0.22),transparent_26%),linear-gradient(90deg,rgba(16,33,28,0.92)_0%,rgba(16,33,28,0.82)_40%,rgba(16,33,28,0.46)_72%,rgba(16,33,28,0.68)_100%)]" />
        <div className="passport-security-pattern absolute inset-0 opacity-24" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,rgba(16,33,28,0),#10211c)]" />
      </div>

      <div className="container-premium relative grid min-h-[100svh] items-start gap-8 py-18 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="relative z-20 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9bd7c]/25 bg-[#d9bd7c]/8 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.24em] text-[#ead7a4]">
            <MapPin className="size-3.5" />
            Rome-based document preparation
          </div>

          <h1 className="mt-7">
            <span className="block max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.9rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[#fff9ed]">
              Get help with Nigerian
            </span>
            <span className="relative block h-[4.2rem] overflow-hidden sm:h-[5.6rem] lg:h-[6.6rem]">
              {heroSlides.map((slide, index) => (
                <span
                  aria-hidden={index === 0 ? "false" : "true"}
                  className="absolute inset-0 block font-serif text-[clamp(3.3rem,8.6vw,7.25rem)] font-semibold leading-[0.86] tracking-[-0.06em] text-[#d9bd7c] transition-all duration-700 motion-reduce:transition-none"
                  data-hero-word
                  key={slide.key}
                  style={{
                    opacity: index === 0 ? 1 : 0,
                    transform: index === 0 ? "translateY(0)" : "translateY(2rem)",
                  }}
                >
                  {slide.word}
                </span>
              ))}
            </span>
            <span className="block max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.9rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[#fff9ed]">
              support in Rome, Italy
            </span>
          </h1>

          <div className="mt-6 max-w-2xl text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#ead7a4]/78 sm:text-sm">
            Passport registration, NIN, BVN, and Nigeria e-visa document preparation
          </div>

          <div className="relative mt-6 min-h-[10.5rem] max-w-2xl sm:min-h-[8.5rem]">
            {heroSlides.map((slide, index) => (
              <p
                aria-hidden={index === 0 ? "false" : "true"}
                className="absolute inset-0 text-base font-medium leading-8 text-white/72 transition-all duration-700 sm:text-lg motion-reduce:transition-none"
                data-hero-copy
                key={`${slide.key}-copy`}
                style={{
                  opacity: index === 0 ? 1 : 0,
                  pointerEvents: index === 0 ? "auto" : "none",
                  transform: index === 0 ? "translateY(0)" : "translateY(1rem)",
                }}
              >
                {slide.description}
              </p>
            ))}
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
            {heroSlides.map((slide, index) => (
              <button
                aria-label={`Show ${slide.word} hero`}
                aria-pressed={index === 0}
                className="rounded-full border px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.22em] transition sm:min-w-[8.5rem]"
                data-hero-tab
                key={`${slide.key}-tab`}
                style={{
                  background: index === 0 ? "rgba(217,189,124,0.14)" : "rgba(255,255,255,0.05)",
                  borderColor: index === 0 ? "rgba(217,189,124,0.55)" : "rgba(255,255,255,0.12)",
                  color: index === 0 ? "#fff5dd" : "rgba(255,255,255,0.55)",
                }}
                type="button"
              >
                {slide.word}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-20 items-center justify-center lg:flex lg:justify-end">
          {rotatingVisual}
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: heroScript }} />
    </section>
  );
}
