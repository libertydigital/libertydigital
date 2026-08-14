import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CTASection } from "@/components/sections/cta-section";
import { ServiceGrid } from "@/components/services/service-grid";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES } from "@/lib/services";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Document Support Services in Rome",
  description:
    "Explore passport, NIN, BVN, eVisa, legalization, affidavit, ETC, and Questura-related document preparation support in Rome.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebPageSchema({
        title: "Document Support Services in Rome",
        description:
          "Explore passport, NIN, BVN, eVisa, legalization, affidavit, ETC, and Questura-related document preparation support in Rome.",
        path: "/services",
        type: "CollectionPage",
      })) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ])) }} type="application/ld+json" />
      <section className="surface-base py-[var(--section-py)] lg:py-[var(--section-py-lg)]" data-animate-section>
        <div className="container-shell">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services" },
            ]}
          />
          <SectionHeading
            align="center"
            description="Each service has its own landing page, request form, and preparation notes so enquiries can be handled clearly."
            kicker="All services"
            level={1}
            title="Choose the Nigerian documentation support request you need"
          />
          <div className="mt-6 flex justify-center" data-animate-cta>
            <ButtonLink
              href="/how-to-enroll"
              variant="outline"
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
