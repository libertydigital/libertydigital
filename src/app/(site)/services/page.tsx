import type { Metadata } from "next";

import { CTASection } from "@/components/sections/cta-section";
import { ServiceGrid } from "@/components/services/service-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Liberty Digital Consulting Services support for passport registration, NIN, BVN, Nigeria eVisa, court e-affidavit, and NPC digital certificate requests.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="section-band py-18" data-animate-section>
        <div className="container-shell">
          <SectionHeading
            align="center"
            description="Each service has its own landing page, request form, and preparation notes so enquiries can be handled clearly."
            kicker="All services"
            title="Choose the Nigerian documentation support request you need"
          />
          <div className="mt-12" data-animate-cta>
            <ServiceGrid services={SERVICES} />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
