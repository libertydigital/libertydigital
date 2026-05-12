import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceLeadForm } from "@/components/forms/service-lead-form";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { getServiceBySlug, SERVICES } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";

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
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <section className="py-18">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-8">
              <div className="surface-card rounded-[32px] p-7 sm:p-8">
                <p className="section-kicker">{service.highlight}</p>
                <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-[var(--color-navy)]">
                  {service.title}
                </h1>
                <p className="mt-5 text-lg leading-8 text-[var(--color-navy-soft)]">
                  {service.longDescription}
                </p>
                <div className="mt-8 flex items-center justify-between rounded-[24px] border border-[var(--color-line)] bg-white/75 px-5 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                      Service fee
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--color-navy)]">
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                  <ButtonLink href="#service-form" variant="secondary">
                    {service.ctaLabel}
                  </ButtonLink>
                </div>
              </div>

              <div className="surface-card rounded-[32px] p-7 sm:p-8">
                <p className="section-kicker">Who this is for</p>
                <ul className="prose-copy mt-5">
                  {service.whoThisIsFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="surface-card rounded-[32px] p-7 sm:p-8">
                <p className="section-kicker">What Liberty helps with</p>
                <ul className="prose-copy mt-5">
                  {service.whatWeHelpWith.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="surface-card rounded-[32px] p-7 sm:p-8">
                <p className="section-kicker">Required documents</p>
                <ul className="prose-copy mt-5">
                  {service.requiredDocuments.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="surface-card rounded-[32px] p-7 sm:p-8">
                <p className="section-kicker">Process steps</p>
                <div className="mt-6 space-y-4">
                  {service.processSteps.map((step, index) => (
                    <div className="rounded-[24px] border border-[var(--color-line)] bg-white/75 px-4 py-4" key={step}>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                        Step {index + 1}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-navy-soft)]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card rounded-[32px] p-7 sm:p-8">
                <p className="section-kicker">Important notes</p>
                <ul className="prose-copy mt-5">
                  {service.importantNotes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-18" id="service-form">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="section-kicker">Request form</p>
            <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">
              Start your {service.title.toLowerCase()} request
            </h2>
            <p className="text-base leading-8 text-[var(--color-navy-soft)]">
              Liberty Digital Consulting Services will review your details and contact you with the next steps.
            </p>
            <div className="surface-card rounded-[32px] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Source note
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                {service.oldWebsiteSourceSummary}
              </p>
            </div>
            <div className="surface-card rounded-[32px] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Frequently asked questions
              </p>
              <div className="mt-5 space-y-4">
                {service.faqs.map((item) => (
                  <details
                    className="rounded-[24px] border border-[var(--color-line)] bg-white/80 px-4 py-4"
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
          <ServiceLeadForm service={service} />
        </div>
      </section>
      <CTASection />
    </>
  );
}
