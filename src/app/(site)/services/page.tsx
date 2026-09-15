import type { Metadata } from "next";
import Link from "next/link";

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

const priorityServices = [
  {
    href: "/services/nigeria-passport-online-registration",
    label: "Nigerian passport renewal in Rome & Italy",
    description:
      "Prepare for renewal, reissue, fresh applications, data changes and biometric enrolment.",
  },
  {
    href: "/services/bank-verification-number",
    label: "BVN support in Rome & Italy",
    description:
      "Understand the current diaspora enrolment and NRBVN routes before you start.",
  },
  {
    href: "/services/national-population-commission-digital-certificate",
    label: "NPC birth attestation & digital certificate",
    description:
      "Prepare for birth attestation, child registration or certificate reissuance using current NPC guidance.",
  },
  {
    href: "/services/national-identification-number",
    label: "NIN registration support in Italy",
    description:
      "Organise identity details and verify the current licensed NIMC diaspora route.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: "Nigerian Document Support Services Rome",
  description:
    "Explore Nigerian passport renewal, NIN, BVN, NPC birth records, eVisa, legalization, affidavit and Questura document support in Rome and Italy.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createWebPageSchema({
              title: "Nigerian Document Support Services Rome",
              description:
                "Explore Nigerian passport renewal, NIN, BVN, NPC birth records, eVisa, legalization, affidavit and Questura document support in Rome and Italy.",
              path: "/services",
              type: "CollectionPage",
            }),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
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
            description="Choose the preparation service that matches your situation. Liberty provides independent support in Rome and across Italy; official authorities remain responsible for enrolment, appointments, approvals and issuance."
            kicker="Nigerian document support in Italy"
            level={1}
            title="Passport, NIN, BVN, NPC and document preparation support"
          />

          <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-2">
            {priorityServices.map((item) => (
              <Link
                className="surface-card rounded-[26px] p-6 transition hover:-translate-y-1 hover:border-[rgba(177,138,81,0.28)]"
                href={item.href}
                key={item.href}
              >
                <h2 className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                  {item.label}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" data-animate-cta>
            <ButtonLink href="/resources" variant="outline">
              Browse preparation guides
            </ButtonLink>
            <ButtonLink href="/how-to-enroll" variant="outline">
              See how to enroll
            </ButtonLink>
          </div>

          <div className="mt-14" data-animate-cta>
            <ServiceGrid services={SERVICES} />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
