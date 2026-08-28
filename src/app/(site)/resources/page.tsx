import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileCheck2 } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getPublishedGuides } from "@/lib/guides";
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
 const guides = getPublishedGuides();

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
         <h1 className="mt-5 section-title text-balance">Practical document checklists before you submit.</h1>
         <p className="mt-6 section-description">Use these guides as a preparation starting point. Always confirm current official requirements with the relevant authority.</p>
       </div>
       <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
         {guides.map((guide) => (
           <article className="surface-card rounded-[28px] p-6" key={guide.slug}>
             <FileCheck2 className="size-5 text-[var(--color-gold)]" />
             <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight text-[var(--color-navy)]">{guide.title}</h2>
             <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">{guide.description}</p>
             <Link className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-navy)]" href={`/resources/${guide.slug}`}>
               Read guide <ArrowUpRight className="size-4" />
             </Link>
           </article>
         ))}
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
