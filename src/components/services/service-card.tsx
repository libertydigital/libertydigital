import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Landmark,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import type { ServiceContent } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";

const serviceIcons: Record<ServiceContent["slug"], LucideIcon> = {
  "nigeria-passport-online-registration": FileText,
  "court-e-affidavit": FileText,
  "national-identification-number": ShieldCheck,
  "bank-verification-number": ShieldCheck,
  "nigeria-e-visa": Landmark,
  "national-population-commission-digital-certificate": FileText,
};

const serviceBackgrounds: Record<ServiceContent["slug"], string> = {
  "nigeria-passport-online-registration": "/Nigeria Passport Online Registration.png",
  "court-e-affidavit": "/Court E-Affidavit.png",
  "national-identification-number": "/National Identification Number (NIN).png",
  "bank-verification-number": "/Bank Verification Number (BVN).png",
  "nigeria-e-visa": "/Nigeria E-Visa.png",
  "national-population-commission-digital-certificate":
    "/National Population Commission Digital Certificate.png",
};

export function ServiceCard({ service }: { service: ServiceContent }) {
  const Icon = serviceIcons[service.slug];
  const backgroundSrc = serviceBackgrounds[service.slug];

  return (
    <article className="service-card group relative flex h-full min-h-[32rem] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,22,31,0.92),rgba(11,17,25,0.9))] text-white shadow-[0_24px_60px_rgba(4,10,18,0.18)] transition-transform hover:-translate-y-1 hover:border-[rgba(177,138,81,0.34)] hover:shadow-[var(--shadow-card)] sm:min-h-[35rem] sm:rounded-[32px] xl:min-h-[38rem]" data-animate-card>
      <h3 className="sr-only">{service.title}</h3>
      <div className="absolute inset-0" data-animate-visual>
        <Image
          alt={`${service.title} card background`}
          className="h-full w-full object-cover"
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
          src={backgroundSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,14,21,0.04)_0%,rgba(9,14,21,0.08)_30%,rgba(9,14,21,0.18)_52%,rgba(9,14,21,0.78)_76%,rgba(9,14,21,0.97)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(9,14,21,0.18),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(9,14,21,0)_0%,rgba(9,14,21,0.74)_38%,rgba(9,14,21,0.96)_100%)]" />
      </div>
      <div className="relative flex items-start justify-between px-5 pt-5 sm:px-7 sm:pt-7">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-[linear-gradient(135deg,rgba(234,217,188,0.72),rgba(220,229,237,0.82))] text-[var(--color-navy)] shadow-[0_12px_24px_rgba(4,10,18,0.14)] sm:size-12">
          <Icon className="size-4 sm:size-5" />
        </span>
        <span className="rounded-full border border-white/12 bg-[rgba(255,255,255,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm shadow-[0_10px_24px_rgba(4,10,18,0.12)]">
          {formatCurrency(service.price)}
        </span>
      </div>
      <div className="relative mt-auto flex flex-col gap-4 rounded-t-[26px] border-t border-white/10 bg-[linear-gradient(180deg,rgba(9,14,21,0.18),rgba(9,14,21,0.46)_18%,rgba(9,14,21,0.88)_100%)] px-5 pb-5 pt-5 backdrop-blur-md sm:gap-5 sm:rounded-t-[30px] sm:px-7 sm:pb-7 sm:pt-6" data-animate-text>
        <div className="flex flex-wrap gap-2">
          {service.requiredDocuments.slice(0, 2).map((item) => (
            <span
              className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs text-white/74 backdrop-blur-sm"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-sm leading-6 text-white/76 sm:leading-7">{service.shortDescription}</p>
          <ButtonLink
            className="w-full justify-center border-white/12 bg-white/10 text-white hover:border-[rgba(234,217,188,0.34)] hover:bg-white/14 sm:w-auto"
            href={`/services/${service.slug}`}
            variant="secondary"
          >
            {service.ctaLabel}
          </ButtonLink>
          <Link
            className="flex items-center justify-center gap-2 pt-1 text-center text-sm font-semibold text-white sm:inline-flex sm:justify-start sm:text-left"
            href={`/services/${service.slug}`}
          >
            View service details <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
