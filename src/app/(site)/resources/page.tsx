import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, FileCheck2 } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getPublishedGuides } from "@/lib/guides";
import { SERVICES } from "@/lib/services";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

const npcGuide = {
  slug: "npc-birth-attestation-digital-certificate-italy",
  title: "NPC Birth Attestation & Digital Birth Certificate in Italy",
  excerpt:
    "Choose the correct adult attestation, child birth-registration or certificate-reissuance route using current NPC guidance.",
  readingTime: "7 min read",
};

export const metadata: Metadata = buildPageMetadata({
  title: "Nigerian Document Guides for Italy",
  description:
    "Practical 2026 guides for Nigerian passport renewal, NIN, BVN, NPC birth records, legalization and document preparation in Rome and Italy.",
  path: "/resources",
});

export default function ResourcesPage() {
  const guides = getPublishedGuides();

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createWebPageSchema({
              title: "Nigerian Document Guides for Italy",
              description:
                "Practical 2026 guides for Nigerian passport renewal, NIN, BVN, NPC birth records, legalization and document preparation in Rome and Italy.",
              path: "/resources",
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
              { name: "Resources", path: "/resources" },
            ]),
          ),
        }}
        type="application/ld+json"
      />

      <section className="surface-base py-[var(--section-py)] lg:py-[var(--section-py-lg)]">
        <div className="container-premium">
          <div className="max-w-4xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Resources" },
              ]}
            />
            <p className="section-kicker">Preparation library</p>
            <h1 className="mt-5 section-title text-balance">
              Nigerian document guides for Rome and Italy.
            </h1>
            <p className="mt-6 section-description">
              Start with a practical guide before you submit an enquiry. These
              articles explain preparation steps, common mistakes and where the
              official authority takes over. Requirements can change, so each
              guide keeps independent support separate from official approval.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <article className="surface-card rounded-[28px] p-6">
              <BookOpenCheck className="size-5 text-[var(--color-gold)]" />
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                Current 2026 guide · {npcGuide.readingTime}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[var(--color-navy)]">
                {npcGuide.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                {npcGuide.excerpt}
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-navy)]"
                href={`/resources/${npcGuide.slug}`}
              >
                Read guide <ArrowUpRight className="size-4" />
              </Link>
            </article>

            {guides.map((guide) => (
              <article className="surface-card rounded-[28px] p-6" key={guide.slug}>
                <BookOpenCheck className="size-5 text-[var(--color-gold)]" />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                  Preparation guide · {guide.readingTime}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-[var(--color-navy)]">
                  {guide.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                  {guide.excerpt}
                </p>
                <Link
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-navy)]"
                  href={`/resources/${guide.slug}`}
                >
                  Read guide <ArrowUpRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-16 max-w-4xl">
            <p className="section-kicker">Service checklists</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-[var(--color-navy)]">
              Already know the service you need?
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
              Go directly to the relevant service page for current preparation
              notes and a low-friction enquiry form. You will not be asked to
              upload sensitive documents just to ask for help.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => (
              <article
                className="rounded-[24px] border border-[var(--color-line)] bg-white/70 p-5"
                key={service.slug}
              >
                <FileCheck2 className="size-5 text-[var(--color-gold)]" />
                <h3 className="mt-4 font-serif text-2xl font-semibold text-[var(--color-navy)]">
                  {service.shortLabel}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                  {service.shortDescription}
                </p>
                <Link
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-navy)]"
                  href={`/services/${service.slug}`}
                >
                  View service <ArrowUpRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
