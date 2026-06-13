import type { Metadata } from "next";

import { CTASection } from "@/components/sections/cta-section";
import { ServiceGrid } from "@/components/services/service-grid";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES } from "@/lib/services";

export const metadata: Metadata = {
  title: "Nigerian Document Support Services in Rome",
  description:
    "Explore passport, NIN, BVN, eVisa, legalization, affidavit, ETC, and Questura-related document preparation support in Rome.",
  alternates: { canonical: "/services" },
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
          <div className="mt-6 flex justify-center" data-animate-cta>
            <ButtonLink
              className="border border-[rgba(17,32,49,0.12)] bg-[var(--color-navy)] text-white shadow-[0_16px_30px_rgba(17,32,49,0.16)] hover:border-[rgba(17,32,49,0.18)] hover:bg-[rgba(17,32,49,0.92)]"
              href="/how-to-enroll"
              variant="secondary"
            >
              See how to enroll
            </ButtonLink>
          </div>
          <div className="mt-12" data-animate-cta>
            <ServiceGrid services={SERVICES} />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
