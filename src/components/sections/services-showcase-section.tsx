import { ArrowUpRight, FileCheck2, Sparkles } from "lucide-react";

import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { SectionShell } from "@/components/layout/section-shell";
import { ServiceGrid } from "@/components/services/service-grid";
import { ButtonLink } from "@/components/ui/button";
import { SERVICES, type ServiceSlug } from "@/lib/services";

const featuredSlugs: ReadonlySet<ServiceSlug> = new Set([
  "nigeria-passport-online-registration",
  "court-e-affidavit",
  "national-identification-number",
  "bank-verification-number",
  "nigeria-e-visa",
  "national-population-commission-digital-certificate",
] as const);

const featuredServices = SERVICES.filter((service) =>
  featuredSlugs.has(service.slug),
);

export function ServicesShowcaseSection() {
  return (
    <SectionShell
      className="bg-[linear-gradient(180deg,#080d14_0%,#101a27_48%,#070b10_100%)]"
      id="services"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-soft)] backdrop-blur-xl">
              <Sparkles className="size-4" />
              Featured services
            </div>
            <h2 className="mt-5 font-serif text-[2.65rem] font-semibold leading-[0.96] text-white sm:text-6xl">
              Service pages built to convert confused visitors into clear requests.
            </h2>
          </div>
        </Reveal>
        <Reveal className="max-w-md">
          <p className="text-sm leading-7 text-white/66 sm:text-base sm:leading-8">
            Each card pushes one next action and leads into a service-specific
            intake form, reducing friction before Liberty follows up.
          </p>
          <ButtonLink className="mt-5" href="/services" variant="glass">
            View all services
            <ArrowUpRight className="ml-2 size-4" />
          </ButtonLink>
        </Reveal>
      </div>

      <StaggerReveal className="mt-10 sm:mt-14">
        <ServiceGrid services={featuredServices} />
      </StaggerReveal>

      <Reveal className="mt-10">
        <div className="luxury-glass grid gap-5 rounded-[30px] p-5 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(233,212,171,0.12)] text-[var(--color-gold-soft)]">
            <FileCheck2 className="size-5" />
          </span>
          <p className="text-sm leading-7 text-white/72">
            This service architecture favors paid delivery: clear offers,
            focused forms, fewer vague enquiries, and a cleaner path to
            follow-up.
          </p>
          <ButtonLink href="/contact" size="sm">
            Request support
          </ButtonLink>
        </div>
      </Reveal>
    </SectionShell>
  );
}
