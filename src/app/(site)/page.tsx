import type { Metadata } from "next";

import { CTASection } from "@/components/sections/cta-section";
import { HeroSection } from "@/components/sections/hero-section";
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
      <HeroSection />
      <section className="section-band py-20">
        <div className="container-shell">
          <SectionHeading
            description="Browse the confirmed services from the existing Liberty Digital Consulting offer and start with the request that matches your situation."
            kicker="Services"
            title="Six core services presented with a clearer path to request support"
          />
          <div className="mt-12">
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
