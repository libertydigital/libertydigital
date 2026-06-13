import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceLeadForm } from "@/components/forms/service-lead-form";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { getServiceBySlug, SERVICES } from "@/lib/services";
import { getSiteUrl } from "@/lib/site-url";

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

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    provider: {
      "@type": "ProfessionalService",
      name: "Liberty Digital Consulting Services",
      url: getSiteUrl(),
    },
    areaServed: { "@type": "Country", name: "Italy" },
    url: `${getSiteUrl()}/services/${service.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} type="application/ld+json" />
      <section className="py-18" data-animate-section>
        <div className="container-shell">
          <div className="space-y-10">
            <div className="surface-card rounded-[32px] p-6 sm:p-8" data-animate-visual>
              <p className="section-kicker">{service.highlight}</p>
              <h1 className="mt-4 max-w-4xl font-serif text-[2.5rem] font-semibold leading-[0.98] text-[var(--color-navy)] sm:text-5xl sm:leading-tight" data-animate-text>
                {service.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-navy-soft)] sm:text-lg" data-animate-text>
                {service.longDescription}
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
                    className="w-full justify-center border-[rgba(17,32,49,0.1)] bg-white/80 text-[var(--color-navy)] hover:bg-white sm:w-auto"
                    href={`/how-to-enroll?service=${service.slug}`}
                    variant="secondary"
                  >
                    How to enroll
                  </ButtonLink>
                  <ButtonLink
                    className="w-full justify-center border-[rgba(17,32,49,0.1)] bg-white/80 text-[var(--color-navy)] hover:bg-white sm:w-auto"
                    href="#service-form"
                    variant="secondary"
                  >
                    Start this form
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
                  <p className="section-kicker">Who this is for</p>
                  <ul className="prose-copy mt-5">
                    {service.whoThisIsFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
                  <p className="section-kicker">What Liberty helps with</p>
                  <ul className="prose-copy mt-5">
                    {service.whatWeHelpWith.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
                  <p className="section-kicker">Required documents</p>
                  <ul className="prose-copy mt-5">
                    {service.requiredDocuments.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="surface-card rounded-[32px] p-7 sm:p-8">
                  <p className="section-kicker">Process steps</p>
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
                  <p className="section-kicker">Important notes</p>
                  <ul className="prose-copy mt-5">
                    {service.importantNotes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[32px] border border-[rgba(177,138,81,0.2)] bg-[rgba(177,138,81,0.08)] p-7 text-sm leading-7 text-[var(--color-navy-soft)]" data-animate-card>
                  Liberty Digital Consulting provides preparation and consulting support only. Final requirements, appointments, approval, and issuance remain with the relevant authority or institution.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-18" id="service-form" data-animate-section>
        <div className="container-shell space-y-8">
          <div className="mx-auto max-w-4xl space-y-6 text-center" data-animate-text>
            <p className="section-kicker">Document form</p>
            <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">
              Complete the {service.title.toLowerCase()} form
            </h2>
            <p className="text-base leading-8 text-[var(--color-navy-soft)]">
              Fill in the required details carefully, then submit the completed form for review and processing.
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
                Frequently asked questions
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
                    <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
