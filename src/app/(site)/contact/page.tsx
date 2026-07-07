import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContactRequestForm } from "@/components/forms/contact-request-form";
import { ButtonLink } from "@/components/ui/button";
import { BUSINESS_DETAILS } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/utils";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

const whatsappLink = buildWhatsAppLink(
  BUSINESS_DETAILS.phone,
  "Hello Liberty Digital Consulting, I need help with a Nigerian Embassy Rome, Questura, legalization, or affidavit request.",
) ?? `https://wa.me/${BUSINESS_DETAILS.phone.replace(/[^\d]/g, "")}`;

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Liberty Digital in Rome",
  description:
    "Contact Liberty Digital Consulting for Nigerian passport, NIN, BVN, eVisa, legalization, and document preparation support in Rome.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebPageSchema({
        title: "Contact Liberty Digital in Rome",
        description:
          "Contact Liberty Digital Consulting for Nigerian passport, NIN, BVN, eVisa, legalization, and document preparation support in Rome.",
        path: "/contact",
        type: "ContactPage",
      })) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ])) }} type="application/ld+json" />
      <section className="section-band py-18" data-animate-section>
        <div className="container-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6" data-animate-text>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Contact" },
            ]}
          />
          <p className="section-kicker">Contact</p>
          <h1 className="font-serif text-[2.45rem] font-semibold leading-[0.98] text-[var(--color-navy)] sm:text-5xl sm:leading-tight">
            Need help choosing the right service?
          </h1>
          <p className="text-base leading-8 text-[var(--color-navy-soft)]">
            Contact Liberty Digital Consulting Services and the Rome team will guide you on the next steps for embassy, Questura, legalization, affidavit, passport, NIN, or BVN preparation support.
          </p>
          <div className="surface-card rounded-[32px] p-6" data-animate-card>
            <div className="space-y-5 text-sm leading-7 text-[var(--color-navy-soft)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  Address
                </p>
                <p className="mt-2">{BUSINESS_DETAILS.address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  Email
                </p>
                <a className="mt-2 block" href={`mailto:${BUSINESS_DETAILS.email}`}>
                  {BUSINESS_DETAILS.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  Phone
                </p>
                <a className="mt-2 block" href={`tel:${BUSINESS_DETAILS.phone}`}>
                  {BUSINESS_DETAILS.phone}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  Opening cadence
                </p>
                <p className="mt-2">
                  WhatsApp and online request follow-up can start throughout the week, while office visits in Rome should be arranged after the team confirms the right service path.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-animate-cta>
              <ButtonLink href={whatsappLink}>
                Contact on WhatsApp
              </ButtonLink>
              <ButtonLink className="border-[rgba(17,32,49,0.1)] bg-white/80 text-[var(--color-navy)] hover:bg-white" href="/services" variant="secondary">
                Browse services
              </ButtonLink>
            </div>
          </div>
          <div className="surface-card rounded-[32px] p-6" data-animate-card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Best way to reach the team
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-navy-soft)]">
              <p>
                WhatsApp is the fastest option when you are not yet sure whether your case belongs under embassy legalization, Questura support, affidavit preparation, or another Rome-based service page.
              </p>
              <p>
                Include your document type, the authority involved, and whether you are in Rome or another city in Italy so the team can point you to the right form quickly.
              </p>
              <p>
                If you already know the service you need, you can still use the contact form here and the team will route you into the correct service-specific workflow.
              </p>
            </div>
          </div>
          <div className="surface-card rounded-[32px] p-6" data-animate-visual>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Map
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
              The office location in Via Orazio, Rome gives clients a clear physical contact point in Italy even when the first conversation starts on WhatsApp.
            </p>
            <div className="mt-4 overflow-hidden rounded-[26px] border border-[var(--color-line)]">
              <iframe
                title="Liberty Digital Consulting Services map location"
                src="https://www.google.com/maps?q=Via%20Orazio%2019%2C%2000193%2C%20Rome%2C%20Italy&z=15&output=embed"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        <div data-animate-visual>
          <ContactRequestForm />
        </div>
        </div>
      </section>
    </>
  );
}
