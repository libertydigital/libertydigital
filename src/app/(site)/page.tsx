import type { Metadata } from "next";

import { CTASection } from "@/components/sections/cta-section";
import { PremiumHero } from "@/components/sections/premium-hero";
import { ProcessSection } from "@/components/sections/process-section";
import { TrustSection } from "@/components/sections/trust-section";
import { ServiceGrid } from "@/components/services/service-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES } from "@/lib/services";

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
            <ServiceGrid services={SERVICES} />
          </div>
        </div>
      </section>
      <ProcessSection />
      <TrustSection />
      <CTASection />
    </>
  );
}
