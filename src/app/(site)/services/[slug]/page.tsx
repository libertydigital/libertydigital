import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ServiceLeadForm } from "@/components/forms/service-lead-form";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { BUSINESS_DETAILS, getServiceBySlug, SERVICES } from "@/lib/services";
import {
  absoluteUrl,
  buildPageMetadata,
  createBreadcrumbSchema,
  createFAQPageSchema,
  createProfessionalServiceSchema,
  createWebPageSchema,
} from "@/lib/seo";
import { buildWhatsAppLink } from "@/lib/utils";

const serviceIntentClusters: Partial<
  Record<
    string,
    {
      localHeading: string;
      localIntro: string;
      locationJourney: string[];
      relatedSlugs: string[];
    }
  >
> = {
  "document-legalization-at-nigerian-embassy": {
    localHeading: "Nigerian Embassy Rome legalization support",
    localIntro:
      "This page is tuned for Nigerians in Rome and across Italy who need to move documents from personal preparation into the official Nigerian Embassy Rome legalization path.",
    locationJourney: [
      "Confirm the exact document type, destination institution, and why the document will be used in Italy or abroad.",
      "Match the legalization request with supporting documents such as affidavits, nationality declarations, or identity records before approaching the embassy stage.",
      "Use the contact page or WhatsApp route if you need help deciding whether the next step is affidavit preparation, embassy legalization, or Questura-facing support.",
    ],
    relatedSlugs: [
      "court-e-affidavit",
      "certificate-of-nationality",
      "citizenship-letter-to-questura",
    ],
  },
  "court-e-affidavit": {
    localHeading: "Affidavit preparation for Rome and Italy-based applicants",
    localIntro:
      "This page helps Nigerians in Rome and elsewhere in Italy prepare affidavit facts cleanly before they move into embassy, legalization, or other formal submission requirements.",
    locationJourney: [
      "Clarify the exact affidavit purpose, especially where the document will later support an embassy legalization request or Italian administrative process.",
      "Prepare deponent facts and annexures in a way that can be reviewed before the final oath, attestation, or related legalization step.",
      "If the affidavit connects to embassy or Questura paperwork, move next to the legalization or citizenship-letter service instead of treating the affidavit as the final step.",
    ],
    relatedSlugs: [
      "document-legalization-at-nigerian-embassy",
      "certificate-of-nationality",
      "citizenship-letter-to-questura",
    ],
  },
  "citizenship-letter-to-questura": {
    localHeading: "Questura support for Nigerians living in Rome and Italy",
    localIntro:
      "This page is structured for Nigerians in Rome and across Italy who have been asked for a citizenship declaration, nationality support letter, or identity clarification for a Questura-related process.",
    locationJourney: [
      "Check whether the Questura or Italian authority requested a citizenship letter, nationality declaration, affidavit, or legalized supporting record.",
      "Prepare residence history, passport details, and Nigerian identity information so the declaration can be reviewed in a cleaner order.",
      "Where the Questura journey also depends on embassy legalization or an affidavit, move through those related pages before the final official submission stage.",
    ],
    relatedSlugs: [
      "certificate-of-nationality",
      "document-legalization-at-nigerian-embassy",
      "court-e-affidavit",
    ],
  },
  "certificate-of-nationality": {
    localHeading: "Nationality proof for embassy and Questura journeys in Italy",
    localIntro:
      "This page supports Nigerians in Rome and across Italy who need nationality-confirmation documents before embassy, Questura, or legalization follow-up.",
    locationJourney: [
      "Identify whether the request is for embassy review, Questura paperwork, or another Italian administrative use case.",
      "Prepare identity details consistently so nationality confirmation does not conflict with affidavit, legalization, or citizenship-letter paperwork.",
      "If the next authority asks for supporting letters or legalization, move directly into the related cluster pages below.",
    ],
    relatedSlugs: [
      "citizenship-letter-to-questura",
      "document-legalization-at-nigerian-embassy",
      "court-e-affidavit",
    ],
  },
};

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return buildPageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
    keywords: [service.title, service.shortLabel, "document support Rome", "Nigeria documents Italy"],
  });
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceCluster = serviceIntentClusters[service.slug];
  const whatsappLink = buildWhatsAppLink(
    BUSINESS_DETAILS.phone,
    `Hello Liberty Digital Consulting, I need fast guidance for ${service.title} in Rome or elsewhere in Italy.`,
  );

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    serviceType: service.title,
    provider: createProfessionalServiceSchema(false),
    areaServed: [
      { "@type": "City", name: "Rome" },
      { "@type": "Country", name: "Italy" },
      {
        "@type": "AdministrativeArea",
        name: "Lazio",
      },
    ],
    serviceArea: [
      { "@type": "Place", name: "Rome, Italy" },
      { "@type": "Place", name: "Italy" },
    ],
    audience: [
      { "@type": "Audience", audienceType: "Nigerians living in Italy" },
      { "@type": "Audience", audienceType: "Africans living in Italy" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      name: "WhatsApp and online service request form",
      servicePhone: BUSINESS_DETAILS.phone,
      serviceUrl: absoluteUrl(`/services/${service.slug}`),
    },
    termsOfService: absoluteUrl("/terms-of-service"),
    url: absoluteUrl(`/services/${service.slug}`),
  };
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ];
  const prioritizedRelatedServices = serviceCluster?.relatedSlugs
    ?.map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((candidate): candidate is NonNullable<ReturnType<typeof getServiceBySlug>> => Boolean(candidate));
  const fallbackRelatedServices = SERVICES.filter(
    (candidate) =>
      candidate.slug !== service.slug &&
      !(serviceCluster?.relatedSlugs ?? []).includes(candidate.slug),
  );
  const relatedServices = [...(prioritizedRelatedServices ?? []), ...fallbackRelatedServices].slice(0, 3);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createFAQPageSchema(service.faqs)) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebPageSchema({
        title: service.seoTitle,
        description: service.seoDescription,
        path: `/services/${service.slug}`,
        type: "ItemPage",
      })) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbSchema(breadcrumbItems)) }} type="application/ld+json" />
      <section className="surface-base py-[var(--section-py)] lg:py-[var(--section-py-lg)]" data-animate-section>
        <div className="container-shell">
          <div className="space-y-10">
            <div className="surface-card rounded-[32px] p-6 sm:p-8" data-animate-visual>
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: service.shortLabel },
                ]}
              />
              <p className="section-kicker">{service.highlight}</p>
              <h1 className="mt-4 max-w-4xl font-serif text-[2.5rem] font-semibold leading-[0.98] text-[var(--color-navy)] sm:text-5xl sm:leading-tight" data-animate-text>
                {service.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-navy-soft)] sm:text-lg" data-animate-text>
                {service.longDescription}
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-navy-soft)]" data-animate-text>
                Liberty Digital supports Nigerians in Rome and Africans living across Italy who need cleaner preparation before embassy, legalization, or administrative next steps.
              </p>
              <div
                className="mt-8 flex flex-col gap-4 rounded-[24px] border border-[var(--color-line)] bg-white/75 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                data-animate-cta
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--color-navy)]">
                    Review the service details first, then complete the form below.
                  </p>
                  <p className="text-sm leading-7 text-[var(--color-navy-soft)]">
                    The form is placed at the center of the page so it reads like a proper submission document.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <ButtonLink
                    className="w-full justify-center sm:w-auto"
                    href={`/how-to-enroll#${service.slug}`}
                    variant="outline"
                  >
                    How to enroll
                  </ButtonLink>
                  <ButtonLink
                    className="w-full justify-center sm:w-auto"
                    href="#service-form"
                    variant="outline"
                  >
                    Start this form
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
                  <p className="section-kicker">Who this is for in Rome and across Italy</p>
                  <ul className="prose-copy mt-5">
                    {service.whoThisIsFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
                  <p className="section-kicker">What Liberty helps with before the official step</p>
                  <ul className="prose-copy mt-5">
                    {service.whatWeHelpWith.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
                  <p className="section-kicker">Required documents to prepare in Italy</p>
                  <ul className="prose-copy mt-5">
                    {service.requiredDocuments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="surface-card rounded-[32px] p-7 sm:p-8">
                  <p className="section-kicker">Process steps for Rome and Italy-based applicants</p>
                  <div className="mt-6 space-y-4" data-animate-list>
                    {service.processSteps.map((step, index) => (
                      <div
                        className="rounded-[24px] border border-[var(--color-line)] bg-white/75 px-4 py-4"
                        data-animate-card
                        key={step}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                          Step {index + 1}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-navy-soft)]">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
                  <p className="section-kicker">Important notes for Rome and Italy submissions</p>
                  <ul className="prose-copy mt-5">
                    {service.importantNotes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[32px] border border-[rgba(177,138,81,0.2)] bg-[rgba(177,138,81,0.08)] p-7 text-sm leading-7 text-[var(--color-navy-soft)]" data-animate-card>
                  Liberty Digital Consulting provides preparation and consulting support only. Final requirements, appointments, approval, and issuance remain with the relevant authority or institution.
                </div>

                <div className="rounded-[32px] border border-emerald-500/20 bg-[linear-gradient(135deg,rgba(236,253,245,0.9),rgba(255,255,255,0.82))] p-7" data-animate-card>
                  <p className="section-kicker">Need quick triage?</p>
                  <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                    Ask on WhatsApp before you complete the full form
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                    If you are on mobile or unsure whether this request belongs under embassy, Questura, legalization, affidavit, or another Rome support path, send a short WhatsApp message first.
                  </p>
                  {whatsappLink ? (
                    <ButtonLink
                      className="mt-5 border-emerald-600/20 bg-emerald-700 text-white hover:bg-emerald-800"
                      href={whatsappLink}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Message on WhatsApp
                    </ButtonLink>
                  ) : null}
                </div>

                {serviceCluster ? (
                  <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
                    <p className="section-kicker">Location support content</p>
                    <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                      {serviceCluster.localHeading}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                      {serviceCluster.localIntro}
                    </p>
                    <ul className="prose-copy mt-5">
                      {serviceCluster.locationJourney.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-raised-band py-[var(--section-py)] lg:py-[var(--section-py-lg)]" id="service-form" data-animate-section>
        <div className="container-shell space-y-8">
          <div className="mx-auto max-w-4xl space-y-6 text-center" data-animate-text>
            <p className="section-kicker">Document form</p>
            <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">
              Complete the {service.title.toLowerCase()} form for Rome, Italy support
            </h2>
            <p className="text-base leading-8 text-[var(--color-navy-soft)]">
              Fill in the required details carefully, then submit the completed form for review and structured follow-up from Liberty Digital&apos;s Rome support desk.
            </p>
          </div>

          <div className="mx-auto max-w-4xl" data-animate-visual>
            <div className="rounded-[36px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(255,255,255,0.96))] p-4 shadow-[0_24px_70px_rgba(17,32,49,0.08)] sm:p-5">
              <ServiceLeadForm service={service} />
            </div>
          </div>

          <div className="mx-auto max-w-4xl" data-animate-card>
            <div className="surface-card rounded-[32px] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Frequently asked questions from Nigerians in Rome and across Italy
              </p>
              <div className="mt-5 space-y-4" data-animate-list>
                {service.faqs.map((item) => (
                  <details
                    className="rounded-[24px] border border-[var(--color-line)] bg-white/80 px-4 py-4"
                    data-animate-card
                    key={item.question}
                  >
                    <summary className="cursor-pointer text-sm font-semibold text-[var(--color-navy)]">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                      {item.answer} For applicants in Rome and elsewhere in Italy, Liberty can help you prepare the information before the official embassy, legalization, or administrative step.
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]" data-animate-card>
            <div className="surface-card rounded-[32px] p-7">
              <p className="section-kicker">Related help</p>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                Keep moving with the next useful Rome and Italy support page
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {relatedServices.map((relatedService) => (
                  <ButtonLink
                    className="justify-center text-center"
                    href={`/services/${relatedService.slug}`}
                    key={relatedService.slug}
                    variant="outline"
                  >
                    {relatedService.shortLabel}
                  </ButtonLink>
                ))}
              </div>
            </div>
            <div className="surface-card rounded-[32px] p-7">
              <p className="section-kicker">Preparation links</p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                <p>
                  If your request involves the Nigerian Embassy Rome, Questura follow-up, or a document legalization journey, use the linked cluster pages here so your preparation path stays consistent.
                </p>
                <p>
                  Review the full{" "}
                  <Link
                    className="font-semibold text-[var(--color-navy)] underline"
                    href="/services"
                  >
                    services directory
                  </Link>{" "}
                  if you need a different request.
                </p>
                <p>
                  Use the{" "}
                  <Link
                    className="font-semibold text-[var(--color-navy)] underline"
                    href={`/how-to-enroll#${service.slug}`}
                  >
                    how-to-enroll guide
                  </Link>{" "}
                  before you submit.
                </p>
                <p>
                  Visit the{" "}
                  <Link
                    className="font-semibold text-[var(--color-navy)] underline"
                    href="/resources"
                  >
                    resources page
                  </Link>{" "}
                  for quick preparation checklists.
                </p>
                <p>
                  Need clarification first?{" "}
                  <Link
                    className="font-semibold text-[var(--color-navy)] underline"
                    href="/contact"
                  >
                    Contact the team
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
