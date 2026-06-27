import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileCheck2 } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SERVICES } from "@/lib/services";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Document Preparation Resources",
  description:
    "Practical preparation checklists for Nigerian passport, NIN, BVN, eVisa, legalization, and related document support in Italy.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebPageSchema({
        title: "Document Preparation Resources",
        description:
          "Practical preparation checklists for Nigerian passport, NIN, BVN, eVisa, legalization, and related document support in Italy.",
        path: "/resources",
        type: "CollectionPage",
      })) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
      ])) }} type="application/ld+json" />
      <section className="premium-light-section py-20 sm:py-28">
      <div className="container-premium">
        <div className="max-w-4xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Resources" },
            ]}
          />
          <p className="section-kicker">Preparation library</p>
          <h1 className="mt-5 section-title text-balance">Practical document checklists before you submit.</h1>
          <p className="mt-6 section-description">Use these service guides as a preparation starting point. Always confirm current official requirements with the relevant authority.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => (
            <article className="surface-card rounded-[28px] p-6" key={service.slug}>
              <FileCheck2 className="size-5 text-[var(--color-gold)]" />
              <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[var(--color-navy)]">{service.shortLabel} preparation guide</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">{service.shortDescription}</p>
              <Link className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-navy)]" href={`/services/${service.slug}`}>
                View checklist <ArrowUpRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
      </section>
    </>
  );
}
