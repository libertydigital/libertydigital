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

const serviceIcons: Record<ServiceContent["slug"], LucideIcon> = {
  "nigeria-passport-online-registration": FileText,
  "court-e-affidavit": FileText,
  "national-identification-number": ShieldCheck,
  "bank-verification-number": ShieldCheck,
  "nigeria-e-visa": Landmark,
  "national-population-commission-digital-certificate": FileText,
  "emergency-travel-certificate": Landmark,
  "nulla-osta-for-marriage": FileText,
  "document-legalization-at-nigerian-embassy": FileText,
  "certificate-of-nationality": FileText,
  "citizenship-letter-to-questura": FileText,
  "same-person-letter": FileText,
  "family-income-document": FileText,
  "letter-of-single": FileText,
  "newspaper-publication": FileText,
  "letter-to-prison": FileText,
  "child-recognition-of-the-father-or-mother": FileText,
};

const serviceBackgrounds: Record<ServiceContent["slug"], string> = {
  "nigeria-passport-online-registration": "/nigeria-passport-service-cover-v2.png",
  "court-e-affidavit": "/court-e-affidavit-service-cover-v3.png",
  "national-identification-number": "/nin-service-cover-v3.png",
  "bank-verification-number": "/bank-verification-number-bvn-service-cover-v3.png",
  "nigeria-e-visa": "/e-visa-service-cover-v3.png",
  "national-population-commission-digital-certificate":
    "/national-population-commission-digital-certificate-service-cover-v3.png",
  "emergency-travel-certificate": "/emergency-travel-certificate-service-cover-v5.webp",
  "nulla-osta-for-marriage": "/nulla-osta-for-marriage-service-cover-v5.webp",
  "document-legalization-at-nigerian-embassy": "/document-legalization-service-cover-v5.webp",
  "certificate-of-nationality": "/certificate-of-nationality-service-cover-v5.webp",
  "citizenship-letter-to-questura": "/citizenship-letter-to-questura-service-cover-v5.webp",
  "same-person-letter": "/same-person-letter-service-cover-v5.webp",
  "family-income-document": "/family-income-document-service-cover-v5.webp",
  "letter-of-single": "/letter-of-single-service-cover-v5.webp",
  "newspaper-publication": "/newspaper-publication-service-cover-v5.webp",
  "letter-to-prison": "/letter-to-prison-service-cover-v5.webp",
  "child-recognition-of-the-father-or-mother":
    "/child-recognition-of-the-father-or-mother-service-cover-v5.webp",
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
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,14,21,0.01)_0%,rgba(9,14,21,0.03)_28%,rgba(9,14,21,0.08)_50%,rgba(9,14,21,0.42)_74%,rgba(9,14,21,0.72)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(9,14,21,0.18),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(9,14,21,0)_0%,rgba(9,14,21,0.36)_34%,rgba(9,14,21,0.74)_100%)]" />
      </div>
      <div className="relative flex items-start justify-between px-5 pt-5 sm:px-7 sm:pt-7">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-[linear-gradient(135deg,rgba(234,217,188,0.72),rgba(220,229,237,0.82))] text-[var(--color-navy)] shadow-[0_12px_24px_rgba(4,10,18,0.14)] sm:size-12">
          <Icon className="size-4 sm:size-5" />
        </span>
      </div>
      <div className="relative mt-auto flex flex-col gap-4 rounded-t-[26px] border-t border-white/18 bg-[linear-gradient(180deg,rgba(18,27,38,0.12),rgba(18,27,38,0.24)_18%,rgba(18,27,38,0.62)_100%)] px-5 pb-5 pt-5 backdrop-blur-md sm:gap-5 sm:rounded-t-[30px] sm:px-7 sm:pb-7 sm:pt-6" data-animate-text>
        <div className="flex flex-wrap gap-2">
          {service.requiredDocuments.slice(0, 2).map((item) => (
            <span
              className="rounded-full border border-white/22 bg-white/18 px-3 py-1 text-xs text-white backdrop-blur-sm"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-sm leading-6 text-white sm:leading-7">{service.shortDescription}</p>
          <ButtonLink
            className="w-full justify-center border-white bg-white text-[var(--color-navy)] shadow-[0_10px_24px_rgba(0,0,0,0.14)] hover:border-[rgba(234,217,188,0.9)] hover:bg-[var(--color-sand)] sm:w-auto"
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
