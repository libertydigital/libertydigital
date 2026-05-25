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
    <SectionShell id="services" tone="premium-light">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(17,32,49,0.08)] bg-white/76 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)] shadow-[0_14px_30px_rgba(17,32,49,0.08)] backdrop-blur-xl">
              <Sparkles className="size-4" />
              Featured services
            </div>
            <h2 className="mt-5 font-serif text-[2.65rem] font-semibold leading-[0.96] text-[var(--color-navy)] sm:text-6xl">
              Service pages built to convert confused visitors into clear requests.
            </h2>
          </div>
        </Reveal>
        <Reveal className="max-w-md">
          <p className="text-sm leading-7 text-[rgba(17,32,49,0.68)] sm:text-base sm:leading-8">
            Each card pushes one next action and leads into a service-specific
            intake form, reducing friction before Liberty follows up.
          </p>
          <ButtonLink className="mt-5" href="/services" variant="dark">
            View all services
            <ArrowUpRight className="ml-2 size-4" />
          </ButtonLink>
        </Reveal>
      </div>

      <StaggerReveal className="mt-10 sm:mt-14">
        <ServiceGrid services={featuredServices} />
      </StaggerReveal>

      <Reveal className="mt-10">
        <div className="grid gap-5 rounded-[30px] border border-[rgba(17,32,49,0.08)] bg-white/76 p-5 shadow-[0_24px_60px_rgba(17,32,49,0.1)] backdrop-blur-xl sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(177,138,81,0.12)] text-[var(--color-gold)]">
            <FileCheck2 className="size-5" />
          </span>
          <p className="text-sm leading-7 text-[rgba(17,32,49,0.72)]">
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
