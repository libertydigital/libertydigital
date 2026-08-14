import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, FileCheck2 } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { getGuideBySlug, getPublishedGuides } from "@/lib/guides";
import {
  buildPageMetadata,
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQPageSchema,
  createWebPageSchema,
} from "@/lib/seo";
import { getServiceBySlug } from "@/lib/services";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/resources/${guide.slug}`,
    type: "article",
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const primaryService = getServiceBySlug(guide.primaryServiceSlug);
  const relatedServices = guide.relatedServiceSlugs
    .map((serviceSlug) => getServiceBySlug(serviceSlug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(createFAQPageSchema(guide.faqs)) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createBreadcrumbSchema(breadcrumbItems),
          ),
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
            <p className="section-kicker mt-8">Preparation guide · {guide.readingTime}</p>
            <h1 className="section-title mt-5 text-balance">{guide.title}</h1>
            <p className="section-description mt-6">{guide.excerpt}</p>
            {primaryService ? (
              <ButtonLink className="mt-8" href={`/services/${primaryService.slug}`}>
                Start your {primaryService.shortLabel} request <ArrowRight className="size-4" />
              </ButtonLink>
            ) : null}
          </header>

          <section className="mx-auto mt-12 max-w-4xl surface-card rounded-[32px] p-6 sm:p-8">
            <p className="section-kicker">Before you start</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
              A practical preparation checklist
            </h2>
            <ul className="mt-6 space-y-4">
              {guide.checklist.map((item) => (
                <li className="flex gap-3 text-sm leading-7 text-[var(--color-navy-soft)]" key={item}>
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-[var(--color-gold)]" aria-hidden="true" />
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

          {primaryService ? (
            <section className="mx-auto mt-12 max-w-4xl rounded-[32px] border border-[rgba(177,138,81,0.24)] bg-[rgba(177,138,81,0.08)] p-6 sm:p-8">
              <p className="section-kicker">Ready for the next step?</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                Check what you need before submitting
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                Review the service details, then send a structured request when you are ready for independent preparation support.
              </p>
              <ButtonLink className="mt-6" href={`/services/${primaryService.slug}`} variant="outline">
                Review {primaryService.shortLabel} support <ArrowRight className="size-4" />
              </ButtonLink>
            </section>
          ) : null}

          <section className="mx-auto mt-12 max-w-4xl surface-card rounded-[32px] p-6 sm:p-8">
            <p className="section-kicker">Avoidable delays</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
              Common preparation mistakes
            </h2>
            <ul className="mt-6 space-y-4">
              {guide.commonMistakes.map((mistake) => (
                <li className="flex gap-3 text-sm leading-7 text-[var(--color-navy-soft)]" key={mistake}>
                  <FileCheck2 className="mt-1 size-4 shrink-0 text-[var(--color-gold)]" aria-hidden="true" />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>

          <aside className="mx-auto mt-8 max-w-4xl rounded-[28px] border border-[var(--color-line)] bg-white/70 p-6 text-sm leading-7 text-[var(--color-navy-soft)]">
            Liberty Digital Consulting provides independent document-preparation support only. Relevant official authorities control their own requirements, appointments, approvals, and outcomes.
          </aside>

          <section className="mx-auto mt-12 max-w-4xl" aria-labelledby="guide-faq-heading">
            <p className="section-kicker">Helpful answers</p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]" id="guide-faq-heading">
              Frequently asked questions
            </h2>
            <div className="mt-6 space-y-4">
              {guide.faqs.map((faq) => (
                <details className="surface-card rounded-[24px] px-5 py-4" key={faq.question}>
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--color-navy)]">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {relatedServices.length > 0 ? (
            <section className="mx-auto mt-12 max-w-4xl" aria-labelledby="related-services-heading">
              <p className="section-kicker">Related support</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]" id="related-services-heading">
                Continue with the right preparation path
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {relatedServices.map((service) => (
                  <Link
                    className="surface-card rounded-[24px] p-5 transition hover:-translate-y-1"
                    href={`/services/${service.slug}`}
                    key={service.slug}
                  >
                    <p className="font-serif text-xl font-semibold text-[var(--color-navy)]">{service.shortLabel}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-navy-soft)]">{service.shortDescription}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-navy)]">
                      View support <ArrowRight className="size-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {primaryService ? (
            <section className="mx-auto mt-12 max-w-4xl rounded-[32px] bg-[var(--color-navy)] p-7 text-white sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">Preparation support</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold">Start with a clear request</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                When you are ready, share your situation through the {primaryService.shortLabel} request page so Liberty can review the preparation support you need.
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
