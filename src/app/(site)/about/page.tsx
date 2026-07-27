import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CTASection } from "@/components/sections/cta-section";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { BUSINESS_DETAILS, SERVICES } from "@/lib/services";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Liberty Digital in Rome",
  description:
    "Learn about Liberty Digital Consulting's Rome-based document preparation and digital support services for Nigerians in Italy.",
  path: "/about",
});

const supportPrinciples = [
  {
    title: "Guidance before submission",
    description:
      "The service pages are built to help visitors understand what they may need before continuing with the relevant official or institution-led process.",
  },
  {
    title: "Service-specific handling",
    description:
      "Each request type has its own form and preparation flow so enquiries can be reviewed with the right context from the start.",
  },
  {
    title: "Follow-up after review",
    description:
      "Once a request is submitted, Liberty reviews the details and contacts the applicant with practical next steps.",
  },
];

const supportAreas = [
  "Nigeria Passport Online Registration support",
  "Court E-Affidavit preparation support",
  "National Identification Number (NIN) preparation support",
  "Bank Verification Number (BVN) preparation support",
  "Nigeria E-Visa preparation support",
  "National Population Commission Digital Certificate support",
];

export default function AboutPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createWebPageSchema({
              title: "About Liberty Digital in Rome",
              description:
                "Learn about Liberty Digital Consulting's Rome-based document preparation and digital support services for Nigerians in Italy.",
              path: "/about",
              type: "AboutPage",
            }),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <section className="section-band relative overflow-hidden py-18" data-animate-section>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[8%] top-12 h-40 w-40 rounded-full bg-[rgba(234,217,188,0.05)] blur-3xl" />
          <div className="absolute right-[10%] top-10 h-48 w-48 rounded-full bg-[rgba(109,132,153,0.06)] blur-3xl" />
          <div className="absolute left-[16%] top-[24%] h-24 w-24 rounded-full border border-[rgba(177,138,81,0.16)]" />
          <div className="absolute right-[18%] bottom-[18%] h-28 w-28 rounded-full border border-[rgba(109,132,153,0.14)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,32,49,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(17,32,49,0.02)_1px,transparent_1px)] bg-[size:140px_140px] opacity-15" />
        </div>
        <div className="container-shell relative">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <Breadcrumbs
                items={[
                  { label: "Home", href: "/" },
                  { label: "About" },
                ]}
              />
              <SectionHeading
                description="Liberty Digital Consulting Services provides digital documentation and registration support for individuals who need Nigeria-related administrative assistance in Rome, Italy."
                kicker="About Liberty Digital"
                level={1}
                title="Documentation support built around clear preparation and practical follow-up"
              />
              <div className="flex flex-col gap-4 sm:flex-row" data-animate-cta>
                <ButtonLink href="/services">Browse Services</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Contact the Team
                </ButtonLink>
              </div>
            </div>
            <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-visual>
              <p className="section-kicker">What Liberty does</p>
              <p className="mt-5 text-base leading-8 text-[var(--color-navy-soft)]">
                The business is positioned as a support service for preparation,
                guidance, and request handling. It does not replace the official
                processes run by government agencies, banks, embassies, or other
                issuing institutions.
              </p>
              <div className="mt-8 grid gap-4" data-animate-list>
                {supportPrinciples.map((item) => (
                  <div
                    className="rounded-[24px] border border-[rgba(17,32,49,0.08)] bg-white/72 px-5 py-5"
                    data-animate-card
                    key={item.title}
                  >
                    <h2 className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band-deep relative overflow-hidden py-18" data-animate-dark-section>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[10%] top-10 h-44 w-44 rounded-full bg-[rgba(177,138,81,0.06)] blur-3xl" />
          <div className="absolute right-[8%] bottom-10 h-48 w-48 rounded-full bg-[rgba(109,132,153,0.06)] blur-3xl" />
          <div className="absolute right-[16%] top-[24%] h-24 w-24 rounded-full border border-[rgba(177,138,81,0.15)]" />
          <div className="absolute left-[18%] bottom-[18%] h-32 w-32 rounded-full border border-[rgba(109,132,153,0.14)]" />
        </div>
        <div className="container-shell relative">
          <SectionHeading
            description="The service focus stays practical and specific, covering passport registration support, identity-document preparation, travel documentation support, and affidavit preparation."
            kicker="Support areas"
            title="The service focus stays practical and specific"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3" data-animate-list>
            {supportAreas.map((item) => (
              <div
                className="rounded-[28px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(244,238,229,0.88))] p-6 text-sm leading-7 text-[color:rgba(17,32,49,0.82)] shadow-[0_18px_42px_rgba(4,10,18,0.1)] backdrop-blur-sm"
                data-animate-card
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band py-18" data-animate-section>
        <div className="container-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-card>
            <p className="section-kicker">How requests are handled</p>
            <div className="mt-6 space-y-5">
              {[
                "Visitors choose the service that matches their request.",
                "Each service page presents preparation notes, important documents, and a dedicated request form.",
                "Submitted requests are reviewed so Liberty can follow up with the next practical step.",
                "The process is designed for support and guidance rather than direct issuance of official documents.",
              ].map((item, index) => (
                <div className="flex items-start gap-4" key={item}>
                  <div className="flex size-10 items-center justify-center rounded-full border border-[rgba(177,138,81,0.24)] bg-[rgba(177,138,81,0.08)] text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                    0{index + 1}
                  </div>
                  <p className="flex-1 pt-1 text-sm leading-7 text-[var(--color-navy-soft)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-[32px] p-7 sm:p-8" data-animate-visual>
            <p className="section-kicker">Rome contact point</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-[var(--color-navy)]">
              Office-based support in Rome, Italy
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-7 text-[var(--color-navy-soft)]">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 size-4 text-[var(--color-gold)]" />
                <span>{BUSINESS_DETAILS.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 size-4 text-[var(--color-gold)]" />
                <a className="hover:text-[var(--color-navy)]" href={`mailto:${BUSINESS_DETAILS.email}`}>
                  {BUSINESS_DETAILS.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 size-4 text-[var(--color-gold)]" />
                <a className="hover:text-[var(--color-navy)]" href={`tel:${BUSINESS_DETAILS.phone}`}>
                  {BUSINESS_DETAILS.phone}
                </a>
              </div>
            </div>
            <div className="mt-8 rounded-[24px] border border-[rgba(17,32,49,0.08)] bg-white/70 px-5 py-5 text-sm leading-7 text-[var(--color-navy-soft)]">
              Need help choosing the right request? Start with the service list or
              contact Liberty Digital Consulting Services directly for guidance on
              the next step.
            </div>
          </div>
        </div>
      </section>

      <section className="section-band relative overflow-hidden py-18" data-animate-section>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[8%] top-12 h-40 w-40 rounded-full bg-[rgba(234,217,188,0.06)] blur-3xl" />
          <div className="absolute right-[12%] bottom-10 h-48 w-48 rounded-full bg-[rgba(109,132,153,0.06)] blur-3xl" />
        </div>
        <div className="container-shell relative">
          <SectionHeading
            description="These office images show a real working support environment in Rome where document review, registration handling, and practical client guidance happen face to face."
            kicker="Inside the office"
            title="A closer look at the people and workspace behind each client request"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]" data-animate-list>
            <article
              className="surface-card overflow-hidden rounded-[32px] p-3 sm:p-4"
              data-animate-card
            >
              <div className="relative h-[22rem] overflow-hidden rounded-[26px] sm:h-[28rem]">
                <Image
                  alt="Liberty Digital Consulting Services team member assisting a client in the office"
                  className="h-full w-full object-cover object-[center_28%]"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src="/liberty-office-about-1.jpeg"
                />
              </div>
              <div className="px-2 pb-2 pt-5">
                <p className="section-kicker">Client-facing support</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                  Real office handling matters for trust. Visitors can see a working support environment instead of a generic stock-photo business front.
                </p>
              </div>
            </article>

            <div className="grid gap-6">
              {[
                {
                  src: "/liberty-office-about-2.jpeg",
                  alt: "Liberty Digital Consulting Services desk with registration tools and printer setup",
                  title: "Working tools and daily process",
                  body: "The office setup reflects the practical side of the service: document handling, printing, device support, and preparation work that helps requests move faster.",
                  imageClassName: "object-[center_18%]",
                },
                {
                  src: "/liberty-office-about-3.jpeg",
                  alt: "Liberty Digital Consulting Services office desk with workstation and camera light setup",
                  title: "A visible, client-facing workspace",
                  body: "The office environment helps reinforce trust by showing that support is handled in a real workspace, with real equipment, real people, and clear in-person interaction.",
                  imageClassName: "object-[38%_24%]",
                },
              ].map((item) => (
                <article
                  className="surface-card overflow-hidden rounded-[32px] p-3 sm:p-4"
                  data-animate-card
                  key={item.src}
                >
                  <div className="relative h-56 overflow-hidden rounded-[24px] sm:h-64">
                    <Image
                      alt={item.alt}
                      className={`h-full w-full object-cover ${item.imageClassName}`}
                      fill
                      sizes="(min-width: 1024px) 34vw, 100vw"
                      src={item.src}
                    />
                  </div>
                  <div className="px-2 pb-2 pt-5">
                    <h3 className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                      {item.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band-deep relative overflow-hidden py-18" data-animate-dark-section>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[8%] top-16 h-40 w-40 rounded-full bg-[rgba(177,138,81,0.05)] blur-3xl" />
          <div className="absolute right-[10%] top-10 h-48 w-48 rounded-full bg-[rgba(109,132,153,0.05)] blur-3xl" />
          <div className="absolute left-[14%] top-[30%] h-20 w-20 rounded-full border border-[rgba(177,138,81,0.14)]" />
          <div className="absolute right-[16%] bottom-[16%] h-28 w-28 rounded-full border border-[rgba(109,132,153,0.14)]" />
        </div>
        <div className="container-shell relative">
          <SectionHeading
            description="These confirmed service pages are the public-facing support areas currently presented by Liberty Digital Consulting Services."
            kicker="Current services"
            title="Browse the verified service offer"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-animate-list>
            {SERVICES.map((service) => (
              <div
                className="rounded-[26px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(244,238,229,0.88))] px-5 py-5 backdrop-blur-sm"
                data-animate-card
                key={service.slug}
              >
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                  {service.highlight}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-[var(--color-navy)]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:rgba(17,32,49,0.82)]">
                  {service.shortDescription}
                </p>
                <ButtonLink
                  className="mt-5 border-[rgba(17,32,49,0.1)] bg-white/72 text-[var(--color-navy)] hover:border-[rgba(177,138,81,0.34)] hover:bg-white"
                  href={`/services/${service.slug}`}
                  variant="secondary"
                >
                  View service
                </ButtonLink>
              </div>
            ))}
          </div>
          <Link
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-navy)]"
            data-animate-cta
            href="/services"
          >
            See all service pages <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
