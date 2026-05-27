import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/animations/reveal";
import { SectionShell } from "@/components/layout/section-shell";
import { SERVICES_BY_SLUG, getServiceBySlug } from "@/lib/services";

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

  return {
    title: `${service.seoTitle} | Liberty Digital Rome`,
    description: service.seoDescription,
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
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
      <SectionShell tone="dark" className="pt-32 pb-20">
        <div className="max-w-4xl">
          <Reveal>
            <p className="section-kicker text-[var(--color-gold-soft)]">Documentation Service</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-7xl">
              {service.title}
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-white/70">
              {service.longDescription}
            </p>
          </Reveal>
        </div>
      </SectionShell>

      <SectionShell tone="premium-light">
        <div className="grid gap-12 lg:grid-cols-2">
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

          {/* Additional sections for Requirements, Process, etc. */}
        </div>
      </SectionShell>
    </main>
  );
}