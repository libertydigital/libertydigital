import type { Metadata } from "next";
import Image from "next/image";

import { AboutSection } from "@/components/sections/about-section";
import { CTASection } from "@/components/sections/cta-section";
import { PremiumHero } from "@/components/sections/premium-hero";
import { ProcessSection } from "@/components/sections/process-section";
import { ServicesShowcaseSection } from "@/components/sections/services-showcase-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";

export const metadata: Metadata = {
  title:
    "Liberty Digital Consulting Services | Nigerian Documentation Support in Rome",
  description:
    "Get guided support in Rome for Nigerian passport online registration, NIN, BVN, Nigeria eVisa, court e-affidavit, and NPC digital certificate requests.",
};

export default function HomePage() {
  return (
    <>
      <PremiumHero />
      <AboutSection />
      <ServicesShowcaseSection />
      <ProcessSection />
      <section
        className="relative overflow-hidden py-18 sm:py-24"
        data-animate-dark-section
      >
        <div className="absolute inset-0">
          <Image
            alt="Liberty Digital Consulting Services office support in Rome"
            className="h-full w-full object-cover object-[center_20%]"
            fill
            sizes="100vw"
            src="/liberty-office-hero.jpeg"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,14,21,0.86)_0%,rgba(8,14,21,0.68)_45%,rgba(8,14,21,0.45)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,217,188,0.12),transparent_32%)]" />
        </div>
        <div className="container-shell relative">
          <div className="max-w-2xl rounded-[34px] border border-white/10 bg-[rgba(8,14,21,0.72)] p-7 text-white shadow-[0_28px_80px_rgba(4,10,18,0.22)] backdrop-blur-md sm:p-9">
            <p className="section-kicker text-[var(--color-gold-soft)]">
              Office-based support
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Real people handling real Nigeria-related document requests in Rome
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/76 sm:text-base">
              Liberty Digital Consulting Services works from a real office environment, helping applicants prepare forms, review details, and move through documentation steps with more clarity.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-white/78 sm:grid-cols-3">
              <div className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-4">
                Form review
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-4">
                Appointment guidance
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/8 px-4 py-4">
                In-office support
              </div>
            </div>
          </div>
        </div>
      </section>
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
