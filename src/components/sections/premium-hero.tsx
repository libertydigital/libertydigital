import Image from "next/image";
import { ArrowUpRight, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { TrackedAnchor, TrackedLink } from "@/components/analytics/tracked-link";
import { BUSINESS_DETAILS } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/utils";

const servicePaths = [
  { label: "Passport", caption: "Renewal & application preparation", slug: "nigeria-passport-online-registration" },
  { label: "NIN", caption: "Identity enrolment guidance", slug: "national-identification-number" },
  { label: "BVN", caption: "Bank identity and diaspora support", slug: "bank-verification-number" },
  { label: "NPC", caption: "Birth attestation & certificates", slug: "national-population-commission-digital-certificate" },
] as const;

const whatsappLink = buildWhatsAppLink(
  BUSINESS_DETAILS.phone,
  "Hello Liberty Digital Consulting, I need help with a Nigerian document request in Italy.",
);

export function PremiumHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#10211c] text-white" data-premium-hero>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_16%,rgba(217,189,124,0.19),transparent_30%),linear-gradient(115deg,#10211c_0%,#0a1713_100%)]" />
      <div className="passport-security-pattern pointer-events-none absolute inset-0 opacity-20" />
      <div className="container-premium relative grid gap-10 py-16 sm:py-20 lg:min-h-[760px] lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-14 lg:py-24">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9bd7c]/30 bg-[#d9bd7c]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ead7a4]">
            <MapPin aria-hidden="true" className="size-4" /> Rome, Italy · Independent document support
          </div>
          <h1 className="mt-8 max-w-[15ch] font-serif text-[clamp(3rem,6.3vw,6.15rem)] font-semibold leading-[0.94] tracking-[-0.03em] text-[#fff9ed]">
            Nigerian documents. <span className="text-[#d9bd7c]">Clear next steps.</span>
          </h1>
          <p className="mt-6 max-w-[55ch] text-base leading-8 text-white/80 sm:text-lg">
            Need help with Nigerian passport renewal, NIN, BVN or NPC birth records in Rome or elsewhere in Italy? Tell us what you need. We will help you prepare for the relevant official process.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedLink
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ead7a4] px-7 text-sm font-bold text-[#10211c] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ead7a4]"
              eventData={{ page: "/", placement: "hero_primary" }}
              eventName="service_cta_click"
              href="/contact#contact-form"
            >
              Request document support <ArrowUpRight aria-hidden="true" className="size-4" />
            </TrackedLink>
            {whatsappLink ? (
              <TrackedAnchor
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ead7a4]"
                eventData={{ page: "/", placement: "hero_whatsapp" }}
                eventName="whatsapp_click"
                href={whatsappLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle aria-hidden="true" className="size-4" /> WhatsApp us
              </TrackedAnchor>
            ) : null}
          </div>
          <div className="mt-9 flex items-start gap-3 border-l-2 border-[#d9bd7c]/65 pl-4 text-sm leading-7 text-white/70">
            <ShieldCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-[#d9bd7c]" />
            Independent preparation and consulting. Applications and approvals remain with the relevant authorities.
          </div>
          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ead7a4]">Choose what you need help with</p>
            <nav aria-label="Popular document services" className="mt-4 grid gap-3 sm:grid-cols-2">
              {servicePaths.map((service) => (
                <TrackedLink
                  className="group flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.065] px-5 py-4 transition hover:border-[#d9bd7c]/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#d9bd7c]"
                  eventData={{ page: "/", placement: "hero_service", serviceSlug: service.slug }}
                  eventName="service_cta_click"
                  href={`/services/${service.slug}`}
                  key={service.slug}
                >
                  <span>
                    <strong className="block font-serif text-2xl leading-7 text-[#fff9ed]">{service.label}</strong>
                    <span className="mt-1 block text-xs leading-5 text-white/70">{service.caption}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-[#d9bd7c] transition group-hover:translate-x-1" />
                </TrackedLink>
              ))}
            </nav>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -inset-5 rounded-[3rem] border border-[#ead7a4]/15" />
          <div className="relative mx-auto aspect-[0.73] max-w-[33rem] rotate-[3deg] overflow-hidden rounded-[2.5rem] border border-white/20 shadow-[0_35px_85px_rgba(0,0,0,0.35)]">
            <Image
              alt="Nigerian passport and document preparation service"
              className="object-cover object-top"
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 0px"
              src="/nigeria-passport-service-cover-v2.webp"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#081811] via-[#081811]/65 to-transparent p-8 pt-28">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ead7a4]">Liberty Digital Consulting</p>
              <p className="mt-3 font-serif text-3xl font-semibold leading-tight text-white">Prepare first. Proceed with clarity.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
