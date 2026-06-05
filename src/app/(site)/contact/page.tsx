import type { Metadata } from "next";

import { ContactRequestForm } from "@/components/forms/contact-request-form";
import { ButtonLink } from "@/components/ui/button";
import { BUSINESS_DETAILS } from "@/lib/services";

export const metadata: Metadata = {
  title: "Contact NIN Centre & BVN Centre in Rome | Liberty Digital",
  description:
    "Contact our NIN Centre in Rome and BVN Centre in Rome. Questions about Nigerian passport, NIN, or BVN services? Our Rome team is here to guide you.",
};

export default function ContactPage() {
  return (
    <section className="section-band py-18" data-animate-section>
      <div className="container-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6" data-animate-text>
          <p className="section-kicker">Contact</p>
          <h1 className="font-serif text-[2.45rem] font-semibold leading-[0.98] text-[var(--color-navy)] sm:text-5xl sm:leading-tight">
            Need help choosing the right service?
          </h1>
          <p className="text-base leading-8 text-[var(--color-navy-soft)]">
            Contact Liberty Digital Consulting Services and the team will guide you on the next steps.
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
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-animate-cta>
              <ButtonLink href={`https://wa.me/${BUSINESS_DETAILS.phone.replace(/[^\d]/g, "")}`}>
                Contact on WhatsApp
              </ButtonLink>
              <ButtonLink className="border-[rgba(17,32,49,0.1)] bg-white/80 text-[var(--color-navy)] hover:bg-white" href="/services" variant="secondary">
                Browse services
              </ButtonLink>
            </div>
          </div>
          <div className="surface-card rounded-[32px] p-6" data-animate-visual>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Map
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
  );
}
