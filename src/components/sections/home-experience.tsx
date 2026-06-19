import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Landmark,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { ServiceGrid } from "@/components/services/service-grid";
import { ButtonLink } from "@/components/ui/button";
import { BUSINESS_DETAILS, SERVICES } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/utils";

const featuredServices = SERVICES.filter((service) =>
  [
    "nigeria-passport-online-registration",
    "national-identification-number",
    "bank-verification-number",
    "nigeria-e-visa",
    "emergency-travel-certificate",
    "document-legalization-at-nigerian-embassy",
    "court-e-affidavit",
    "citizenship-letter-to-questura",
    "certificate-of-nationality",
  ].includes(service.slug),
);

const process = [
  ["Tell us what you need", "Choose a service or send a WhatsApp message so we can understand your situation."],
  ["Prepare the right records", "We help you identify, organise, and check the documents relevant to your request."],
  ["Review before submission", "Details are reviewed for consistency before you continue with the appropriate official process."],
  ["Move forward clearly", "You receive practical next-step guidance and follow-up from the Rome support team."],
];

const documents = [
  "Valid identification and previous passport, where relevant",
  "Birth, marriage, or nationality records required for the request",
  "Proof of address and contact details",
  "Case-specific declarations, letters, receipts, or appointment records",
];

const faqs = [
  ["Is Liberty Digital Consulting a government agency?", "No. Liberty Digital Consulting provides document preparation and digital consulting support. It is not a government agency, embassy, consulate, NIMC, NIS, bank, or official issuing authority."],
  ["Can you issue a passport, NIN, BVN, eVisa, or legalized document?", "No. Issuance and approval remain with the relevant government agency, bank, embassy, consulate, court, or other official authority."],
  ["Can I start on WhatsApp?", "Yes. WhatsApp is the quickest way to explain what you need and receive guidance on the most suitable service."],
  ["Do I need to visit the Rome office?", "Some requests can begin remotely. The team will confirm whether an office visit is useful or required for your specific support request."],
  ["What should I bring to a consultation?", "Bring any current identification, previous documents, correspondence, and records connected to the request. The service page will also show a practical checklist."],
];

const whatsappLink = buildWhatsAppLink(
  BUSINESS_DETAILS.phone,
  "Hello Liberty Digital Consulting, I need help preparing documents in Rome.",
);

export function HomeExperience() {
  return (
    <>
      <section className="premium-light-section py-20 sm:py-28" id="services">
        <div className="container-premium">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div data-animate-text>
              <p className="section-kicker">Nine core support areas</p>
              <h2 className="mt-5 section-title text-balance">One trusted preparation desk for complex documents.</h2>
            </div>
            <div className="lg:ml-auto lg:max-w-xl" data-animate-text>
              <p className="section-description">
                Get help understanding what to prepare, checking details, and organising your application before submission to the relevant authority.
              </p>
              <ButtonLink className="mt-6" href="/services" variant="dark">
                Explore Every Service <ArrowUpRight className="ml-2 size-4" />
              </ButtonLink>
            </div>
          </div>
          <div className="mt-12" data-animate-list>
            <ServiceGrid services={featuredServices} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#07130f] py-20 text-white sm:py-28">
        <Image alt="" className="object-cover opacity-25" fill sizes="100vw" src="/assets/images/document-flatlay.webp" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07130f_0%,rgba(7,19,15,0.92)_48%,rgba(7,19,15,0.55)_100%)]" />
        <div className="passport-security-pattern absolute inset-0 opacity-30" />
        <div className="container-premium relative">
          <div className="max-w-3xl" data-animate-text>
            <p className="section-kicker text-[#d9bd7c]">How we help</p>
            <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-[#fff9ed] sm:text-7xl">
              Calm, structured support before the official process begins.
            </h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[32px] border border-white/10 bg-white/10 lg:grid-cols-4" data-animate-list>
            {process.map(([title, description], index) => (
              <article className="bg-[#091a14]/90 p-7 backdrop-blur-sm sm:p-8" data-animate-card key={title}>
                <span className="font-serif text-4xl text-[#d9bd7c]">0{index + 1}</span>
                <h3 className="mt-12 text-lg font-bold text-[#fff9ed]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-light-section py-20 sm:py-28">
        <div className="container-premium grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative min-h-[32rem] overflow-hidden rounded-[36px] shadow-[0_36px_100px_rgba(5,16,12,0.2)]" data-animate-visual>
            <Image
              alt="Illustrative professional document consultation in a refined office"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              src="/assets/images/consultation-office.webp"
            />
            <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-white/20 bg-[#07130f]/82 p-5 text-white backdrop-blur-xl">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#d9bd7c]">Illustrative consultation scene</p>
              <p className="mt-2 text-sm leading-6 text-white/68">Private, practical support focused on clarity and preparation.</p>
            </div>
          </div>
          <div data-animate-text>
            <p className="section-kicker">Trust without confusion</p>
            <h2 className="mt-5 section-title text-balance">Professional support. Clear boundaries.</h2>
            <p className="mt-6 section-description">
              Liberty Digital Consulting helps people prepare documents and navigate digital processes. We explain the next step without pretending to control approvals or official timelines.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                [ShieldCheck, "Clear non-governmental disclaimer on every page"],
                [FileSearch, "Service-specific document and preparation guidance"],
                [Landmark, "Rome-based office and clickable contact details"],
              ].map(([Icon, text]) => {
                const ItemIcon = Icon as typeof ShieldCheck;
                return (
                  <div className="flex items-center gap-4 rounded-[22px] border border-[var(--color-line)] bg-white/72 p-4" key={String(text)}>
                    <span className="flex size-11 items-center justify-center rounded-full bg-[#0f3829] text-[#ead7a4]"><ItemIcon className="size-5" /></span>
                    <p className="text-sm font-semibold text-[var(--color-navy)]">{String(text)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-band-deep py-20 sm:py-28">
        <div className="container-premium grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start" data-animate-text>
            <p className="section-kicker">Required documents preview</p>
            <h2 className="mt-5 section-title text-balance">Arrive prepared. Avoid preventable back-and-forth.</h2>
            <p className="mt-6 section-description">Requirements vary by service and authority. These are common starting points, not a final official checklist.</p>
            <ButtonLink className="mt-7" href="/resources" variant="dark">Open Preparation Resources</ButtonLink>
          </div>
          <div className="grid gap-5" data-animate-list>
            {documents.map((document, index) => (
              <article className="premium-panel flex items-start gap-5 rounded-[28px] p-6" data-animate-card key={document}>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#0e3527] text-[#ead7a4]"><ClipboardCheck className="size-5" /></span>
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">Preparation item 0{index + 1}</p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-[var(--color-navy)]">{document}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#07130f] py-20 text-white sm:py-28">
        <Image alt="" className="object-cover opacity-34" fill sizes="100vw" src="/assets/images/rome-diaspora.webp" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07130f_0%,rgba(7,19,15,0.88)_58%,rgba(7,19,15,0.52)_100%)]" />
        <div className="container-premium relative grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div data-animate-text>
            <p className="section-kicker text-[#d9bd7c]">Why Liberty Digital</p>
            <h2 className="mt-5 max-w-3xl font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.04em] text-[#fff9ed] sm:text-7xl">
              Rome-based guidance built around your real situation.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Direct WhatsApp access", "Service-specific intake", "Document-first preparation", "Transparent support boundaries"].map((item) => (
                <div className="flex items-center gap-3 border-b border-white/12 py-4 text-sm font-semibold text-white/76" key={item}>
                  <CheckCircle2 className="size-4 text-[#d9bd7c]" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div className="luxury-glass rounded-[34px] p-7 sm:p-9" data-animate-card>
            <MapPin className="size-6 text-[#d9bd7c]" />
            <h3 className="mt-5 font-serif text-4xl font-semibold text-[#fff9ed]">Visit the Rome office</h3>
            <p className="mt-4 text-sm leading-7 text-white/62">{BUSINESS_DETAILS.address}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact">Book a Consultation</ButtonLink>
              {whatsappLink ? (
                <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/14 px-5 text-sm font-semibold text-white" href={whatsappLink} rel="noopener noreferrer" target="_blank">
                  <MessageCircle className="size-4" /> WhatsApp
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="premium-light-section py-20 sm:py-28">
        <div className="container-premium grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
          <div data-animate-text>
            <p className="section-kicker">Frequently asked questions</p>
            <h2 className="mt-5 section-title text-balance">Clear answers before you start.</h2>
          </div>
          <div className="grid gap-3" data-animate-list>
            {faqs.map(([question, answer]) => (
              <details className="group rounded-[24px] border border-[var(--color-line)] bg-white/72 p-5 shadow-sm open:bg-white" data-animate-card key={question}>
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-[var(--color-navy)]">{question}</summary>
                <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
