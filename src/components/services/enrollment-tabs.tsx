"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle2, PlayCircle } from "lucide-react";

import { EnrollmentWorkflowGraphic } from "@/components/services/enrollment-workflow-graphic";
import { ButtonLink } from "@/components/ui/button";
import type { ServiceContent, ServiceSlug } from "@/lib/services";
import { cn } from "@/lib/utils";

type EnrollmentTabsProps = {
  services: ServiceContent[];
  initialSlug?: string;
};

function buildEnrollmentNotes(service: ServiceContent) {
  const notes = [
    `Use the same identity details shown on your supporting records for ${service.title.toLowerCase()}.`,
    `Prepare your documents before you open the form so the review can move faster.`,
    service.importantNotes[0],
  ];

  return notes.filter(Boolean).slice(0, 3);
}

function buildQuickPrep(service: ServiceContent) {
  return service.requiredDocuments.slice(0, 4);
}

export function EnrollmentTabs({
  services,
  initialSlug,
}: EnrollmentTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const defaultSlug = services[0]?.slug;
  const [activeSlug, setActiveSlug] = useState<ServiceSlug>(
    services.find((service) => service.slug === initialSlug)?.slug ?? defaultSlug,
  );

  useEffect(() => {
    const applyHashSlug = () => {
      const hashSlug = window.location.hash.replace(/^#/, "");

      if (services.some((service) => service.slug === hashSlug)) {
        setActiveSlug(hashSlug as ServiceSlug);
      }
    };

    applyHashSlug();
    window.addEventListener("hashchange", applyHashSlug);

    return () => window.removeEventListener("hashchange", applyHashSlug);
  }, [services]);

  const activeService = useMemo(
    () => services.find((service) => service.slug === activeSlug) ?? services[0],
    [activeSlug, services],
  );

  if (!activeService) {
    return null;
  }

  const prepItems = buildQuickPrep(activeService);
  const enrollmentNotes = buildEnrollmentNotes(activeService);

  return (
    <div className="space-y-8">
      <div className="sticky top-[5.9rem] z-20 -mx-4 overflow-hidden rounded-[28px] border border-[rgba(17,32,49,0.08)] bg-[rgba(247,242,234,0.86)] px-4 py-4 shadow-[0_18px_40px_rgba(7,16,26,0.08)] backdrop-blur-xl sm:mx-0 sm:px-5">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {services.map((service) => {
            const isActive = service.slug === activeSlug;

            return (
              <button
                className={cn(
                  "min-w-[13rem] rounded-[22px] border px-4 py-3 text-left transition",
                  isActive
                    ? "border-[rgba(177,138,81,0.34)] bg-[var(--color-navy)] text-white shadow-[0_16px_34px_rgba(7,16,26,0.16)]"
                    : "border-[rgba(17,32,49,0.08)] bg-white/78 text-[var(--color-navy)] hover:border-[rgba(177,138,81,0.22)] hover:bg-white",
                )}
                key={service.slug}
                onClick={() => {
                  setActiveSlug(service.slug);
                  router.replace(`${pathname}#${service.slug}`, { scroll: false });
                }}
                type="button"
              >
                <p
                  className={cn(
                    "text-[0.62rem] font-semibold uppercase tracking-[0.26em]",
                    isActive ? "text-[var(--color-gold-soft)]" : "text-[var(--color-gold)]",
                  )}
                >
                  {service.highlight}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6">
                  {service.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <section
            className="surface-card rounded-[34px] p-7 sm:p-8"
            data-animate-section
          >
            <p className="section-kicker">{activeService.highlight}</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-[var(--color-navy)] sm:text-5xl">
              How to enroll for {activeService.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--color-navy-soft)]">
              {activeService.longDescription}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row" data-animate-cta>
              <ButtonLink href={`/services/${activeService.slug}`}>
                Open {activeService.title} form
              </ButtonLink>
              <ButtonLink
                href={`/services/${activeService.slug}`}
                variant="outline"
              >
                View service details
              </ButtonLink>
            </div>
          </section>

          <section className="surface-card rounded-[34px] p-7 sm:p-8" data-animate-list>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-[var(--color-gold)]" />
              <p className="section-kicker !mb-0">What to prepare first</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {prepItems.map((item) => (
                <div
                  className="rounded-[24px] border border-[rgba(17,32,49,0.08)] bg-white/82 px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]"
                  data-animate-card
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card rounded-[34px] p-7 sm:p-8" data-animate-list>
            <p className="section-kicker">Enrollment steps</p>
            <div className="mt-6 space-y-4">
              {activeService.processSteps.map((step, index) => (
                <article
                  className="rounded-[26px] border border-[rgba(17,32,49,0.08)] bg-white/82 px-5 py-5"
                  data-animate-card
                  key={step}
                >
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                    Step {index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                    {step}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <EnrollmentWorkflowGraphic
            className="surface-card"
            highlight={activeService.highlight}
            stepsCount={activeService.processSteps.length}
            title={activeService.title}
          />

          <section className="surface-card rounded-[34px] p-7 sm:p-8" data-animate-list>
            <p className="section-kicker">Enrollment reminders</p>
            <div className="mt-6 space-y-4">
              {enrollmentNotes.map((note) => (
                <div
                  className="rounded-[24px] border border-[rgba(17,32,49,0.08)] bg-white/82 px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]"
                  data-animate-card
                  key={note}
                >
                  {note}
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card rounded-[34px] p-4 sm:p-5" data-animate-visual>
            <div className="overflow-hidden rounded-[28px] border border-[rgba(17,32,49,0.08)] bg-[var(--color-navy)]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
                <div>
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">
                    Walkthrough video
                  </p>
                  <p className="mt-1 text-sm text-white/72">
                    Watch the in-office enrollment process used across selected Liberty services.
                  </p>
                </div>
                <PlayCircle className="size-8 text-[var(--color-gold-soft)]" />
              </div>
              <video
                className="aspect-video w-full bg-black"
                controls
                preload="metadata"
                src="/service-enrollment-walkthrough.mp4"
              >
                Your browser does not support the enrollment walkthrough video.
              </video>
            </div>
          </section>

          <section className="surface-card rounded-[34px] p-7 sm:p-8" data-animate-card>
            <p className="section-kicker">Need the official form?</p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
              Use the service page to complete the exact request form for{" "}
              {activeService.title.toLowerCase()}, then submit it for review.
            </p>
            <div className="mt-5">
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-navy)]"
                href={`/services/${activeService.slug}`}
              >
                Go to {activeService.title} <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
