import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2 } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQPageSchema,
  createWebPageSchema,
} from "@/lib/seo";
import { getServiceBySlug, type ServiceSlug } from "@/lib/services";

export type GrowthGuideContent = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  primaryServiceSlug: ServiceSlug;
  checklist: string[];
  commonMistakes: string[];
  sections: Array<{ heading: string; paragraphs: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
  relatedGuideLinks: Array<{ href: string; label: string }>;
};

export function GrowthGuidePage({ guide }: { guide: GrowthGuideContent }) {
  const primaryService = getServiceBySlug(guide.primaryServiceSlug);
  const guidePath = `/resources/${guide.slug}`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: guide.title, path: guidePath },
  ];

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createArticleSchema({
              title: guide.title,
              description: guide.description,
              path: guidePath,
              publishedAt: guide.publishedAt,
            }),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createFAQPageSchema(guide.faqs)),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createBreadcrumbSchema(breadcrumbItems)),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createWebPageSchema({
              title: guide.title,
              description: guide.description,
              path: guidePath,
              type: "ItemPage",
            }),
          ),
        }}
        type="application/ld+json"
      />

      <article className="surface-base py-[var(--section-py)] lg:py-[var(--section-py-lg)]">
        <div className="container-premium">
          <header className="mx-auto max-w-4xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Resources", href: "/resources" },
                { label: guide.title },
              ]}
            />
            <p className="section-kicker mt-8">
              2026 preparation guide · {guide.readingTime}
            </p>
            <h1 className="section-title mt-5 text-balance">{guide.title}</h1>
            <p className="section-description mt-6">{guide.excerpt}</p>
            {primaryService ? (
              <ButtonLink className="mt-8" href={`/services/${primaryService.slug}`}>
                Request {primaryService.shortLabel} support
                <ArrowRight className="size-4" />
              </ButtonLink>
            ) : null}
          </header>

          <section className="mx-auto mt-12 max-w-4xl surface-card rounded-[32px] p-6 sm:p-8">
            <p className="section-kicker">Before you start</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
              Preparation checklist
            </h2>
            <ul className="mt-6 space-y-4">
              {guide.checklist.map((item) => (
                <li
                  className="flex gap-3 text-sm leading-7 text-[var(--color-navy-soft)]"
                  key={item}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-[var(--color-gold)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mx-auto mt-10 max-w-4xl space-y-10">
            {guide.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-[var(--color-navy-soft)]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mx-auto mt-12 max-w-4xl surface-card rounded-[32px] p-6 sm:p-8">
            <p className="section-kicker">Avoidable delays</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
              Common mistakes
            </h2>
            <ul className="mt-6 space-y-4">
              {guide.commonMistakes.map((mistake) => (
                <li
                  className="flex gap-3 text-sm leading-7 text-[var(--color-navy-soft)]"
                  key={mistake}
                >
                  <FileCheck2
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-[var(--color-gold)]"
                  />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>

          <aside className="mx-auto mt-8 max-w-4xl rounded-[28px] border border-[var(--color-line)] bg-white/70 p-6 text-sm leading-7 text-[var(--color-navy-soft)]">
            Liberty Digital Consulting provides independent preparation support only. The National Population Commission controls its own records, requirements, approvals and certificates. Verify the current official process before paying, travelling or submitting sensitive documents.
          </aside>

          <section className="mx-auto mt-12 max-w-4xl" aria-labelledby="growth-guide-faq-heading">
            <p className="section-kicker">Helpful answers</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]" id="growth-guide-faq-heading">
              Frequently asked questions
            </h2>
            <div className="mt-6 space-y-4">
              {guide.faqs.map((faq) => (
                <details className="surface-card rounded-[24px] px-5 py-4" key={faq.question}>
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--color-navy)]">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="mx-auto mt-12 max-w-4xl" aria-labelledby="related-guide-heading">
            <p className="section-kicker">Related identity guides</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]" id="related-guide-heading">
              Continue with the connected document path
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {guide.relatedGuideLinks.map((item) => (
                <Link
                  className="surface-card rounded-[24px] p-5 font-semibold text-[var(--color-navy)] transition hover:-translate-y-1"
                  href={item.href}
                  key={item.href}
                >
                  {item.label} <ArrowRight className="ml-2 inline size-4" />
                </Link>
              ))}
            </div>
          </section>

          {primaryService ? (
            <section className="mx-auto mt-12 max-w-4xl rounded-[32px] bg-[var(--color-navy)] p-7 text-white sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
                Preparation support
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold">
                Start with a low-friction enquiry
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                You do not need to upload sensitive identity documents to ask for help. Send a short enquiry first and Liberty will confirm what preparation is relevant.
              </p>
              <ButtonLink className="mt-6" href={`/services/${primaryService.slug}`}>
                Start your request <ArrowRight className="size-4" />
              </ButtonLink>
            </section>
          ) : null}
        </div>
      </article>
    </>
  );
}
