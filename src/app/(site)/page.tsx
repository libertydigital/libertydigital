import type { Metadata } from "next";
import Image from "next/image";

import { CTASection } from "@/components/sections/cta-section";
import { PremiumHero } from "@/components/sections/premium-hero";
import { ProcessSection } from "@/components/sections/process-section";
import { TrustSection } from "@/components/sections/trust-section";
import { ServiceGrid } from "@/components/services/service-grid";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES, type ServiceSlug } from "@/lib/services";

const HOMEPAGE_SERVICE_SLUGS: ReadonlySet<ServiceSlug> = new Set([
  "nigeria-passport-online-registration",
  "court-e-affidavit",
  "national-identification-number",
  "bank-verification-number",
  "nigeria-e-visa",
  "national-population-commission-digital-certificate",
] as const);

const HOMEPAGE_SERVICES = SERVICES.filter((service) =>
  HOMEPAGE_SERVICE_SLUGS.has(service.slug),
);

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
      <section className="section-band relative overflow-hidden py-14 sm:py-20" data-animate-section>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-75">
          <div className="absolute left-[7%] top-12 h-44 w-44 rounded-full bg-[rgba(177,138,81,0.08)] blur-3xl" />
          <div className="absolute right-[10%] top-16 h-52 w-52 rounded-full bg-[rgba(109,132,153,0.08)] blur-3xl" />
          <div className="absolute left-[18%] top-[22%] h-24 w-24 rounded-full border border-[rgba(177,138,81,0.16)]" />
          <div className="absolute right-[18%] bottom-[18%] h-28 w-28 rounded-full border border-[rgba(109,132,153,0.14)]" />
          <div className="absolute inset-y-0 right-[28%] w-px bg-[linear-gradient(180deg,transparent,rgba(17,32,49,0.08),transparent)]" />
        </div>
        <div className="container-shell relative">
          <SectionHeading
            description="Browse the confirmed services from the existing Liberty Digital Consulting offer and start with the request that matches your situation."
            kicker="Services"
            title="Six core services presented with a clearer path to request support"
          />
          <div className="mt-8 sm:mt-12" data-animate-cta>
            <ServiceGrid services={HOMEPAGE_SERVICES} />
          </div>
          <div className="mt-8 flex justify-center sm:mt-10" data-animate-cta>
            <ButtonLink
              className="border border-[rgba(17,32,49,0.12)] bg-[var(--color-navy)] text-white shadow-[0_16px_30px_rgba(17,32,49,0.16)] hover:border-[rgba(17,32,49,0.18)] hover:bg-[rgba(17,32,49,0.92)]"
              href="/services"
              variant="secondary"
            >
              View all services
            </ButtonLink>
          </div>
        </div>
      </section>
      <ProcessSection />
      <TrustSection />
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
      <CTASection />
    </>
  );
}
