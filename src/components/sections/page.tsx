import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, ShieldCheck, FileText, ArrowRight } from "lucide-react";

import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { SectionShell } from "@/components/layout/section-shell";
import { SERVICES_BY_SLUG, getServiceBySlug } from "@/lib/services";
import { ButtonLink } from "@/components/ui/button";

interface ServicePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return Object.keys(SERVICES_BY_SLUG).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  const title = `${service.seoTitle} | Liberty Digital Rome`;
  const description = service.seoDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main>
      {/* Hero Header */}
      <SectionShell tone="dark" className="pt-32 pb-20">
        <div className="max-w-4xl">
          <Reveal>
            <p className="section-kicker text-[var(--color-gold-soft)]">Strategic Consultancy</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-7xl">
              {service.title}
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-white/70">
              {service.longDescription}
            </p>
            <div className="mt-10">
               <ButtonLink href={`/services/${service.slug}/apply`} size="lg">
                 {service.ctaLabel}
               </ButtonLink>
            </div>
          </Reveal>
        </div>
      </SectionShell>

      {/* Service Details Grid */}
      <SectionShell tone="premium-light">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left Column: Requirements & Audit */}
          <div className="space-y-16">
            <Reveal>
              <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
                What We Audit & Prepare
              </h2>
              <div className="mt-8 space-y-4">
                {service.whatWeHelpWith.map((item) => (
                  <div key={item} className="flex gap-4 rounded-2xl border border-black/5 bg-white/50 p-4 backdrop-blur-sm">
                    <CheckCircle2 className="size-5 shrink-0 text-[var(--color-gold)]" />
                    <p className="text-sm leading-relaxed text-[var(--color-navy)]/80">{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
                Prerequisites
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {service.requiredDocuments.map((doc) => (
                  <div key={doc} className="flex items-center gap-3 rounded-xl border border-black/5 p-3 text-xs font-medium text-[var(--color-navy)]/70">
                    <FileText className="size-4 text-[var(--color-gold)]" />
                    {doc}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right Column: The Process */}
          <Reveal>
            <div className="sticky top-32 rounded-[32px] border border-black/5 bg-[linear-gradient(180deg,white,rgba(248,243,235,0.4))] p-8 shadow-[0_24px_64px_rgba(17,32,49,0.06)]">
              <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
                Consultancy Workflow
              </h2>
              <div className="mt-8 space-y-8">
                {service.processSteps.map((step, idx) => (
                  <div key={step} className="relative flex gap-6">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--color-navy)]/80">{step}</p>
                    {idx < service.processSteps.length - 1 && (
                      <div className="absolute left-4 top-10 h-6 w-px bg-black/10" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-10 rounded-2xl bg-[var(--color-navy)]/5 p-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="mt-1 size-5 text-[var(--color-gold)]" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-navy)]">Important Note</p>
                    <p className="mt-2 text-xs leading-5 text-[var(--color-navy)]/60">
                      {service.importantNotes[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionShell>
    </main>
  );
}