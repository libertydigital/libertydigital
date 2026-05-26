import { motion, type MotionProps } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CreditCard,
  FileCheck2,
  Fingerprint,
  Plane,
} from "lucide-react";

import type { ServiceContent } from "@/lib/services";
import { cn } from "@/lib/utils";

const SHORT_LABELS: Record<ServiceContent["slug"], string> = {
  "nigeria-passport-online-registration": "Passport",
  "court-e-affidavit": "E-Affidavit",
  "national-identification-number": "NIN",
  "bank-verification-number": "BVN",
  "nigeria-e-visa": "E-Visa",
  "national-population-commission-digital-certificate": "NPC Certificate",
  "emergency-travel-certificate": "ETC",
  "nulla-osta-for-marriage": "Marriage",
  "document-legalization-at-nigerian-embassy": "Legalization",
  "certificate-of-nationality": "Nationality",
  "citizenship-letter-to-questura": "Citizenship",
  "same-person-letter": "Same Person",
  "family-income-document": "Family Income",
  "letter-of-single": "Single Letter",
  "newspaper-publication": "Publication",
  "letter-to-prison": "Prison Letter",
  "child-recognition-of-the-father-or-mother": "Child Recognition",
};

const ICONS: Record<ServiceContent["slug"], typeof FileCheck2> = {
  "nigeria-passport-online-registration": FileCheck2,
  "court-e-affidavit": BriefcaseBusiness,
  "national-identification-number": Fingerprint,
  "bank-verification-number": CreditCard,
  "nigeria-e-visa": Plane,
  "national-population-commission-digital-certificate": BadgeCheck,
  "emergency-travel-certificate": Plane,
  "nulla-osta-for-marriage": BriefcaseBusiness,
  "document-legalization-at-nigerian-embassy": FileCheck2,
  "certificate-of-nationality": BadgeCheck,
  "citizenship-letter-to-questura": BriefcaseBusiness,
  "same-person-letter": FileCheck2,
  "family-income-document": FileCheck2,
  "letter-of-single": FileCheck2,
  "newspaper-publication": FileCheck2,
  "letter-to-prison": FileCheck2,
  "child-recognition-of-the-father-or-mother": FileCheck2,
};

type HeroServiceTileProps = {
  service: ServiceContent;
  className?: string;
  style?: MotionProps["style"];
};

export function HeroServiceTile({ service, className, style }: HeroServiceTileProps) {
  const Icon = ICONS[service.slug];
  const shortLabel = SHORT_LABELS[service.slug];

  return (
    <motion.article
      className={cn(
        "group rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,20,29,0.92),rgba(9,14,21,0.86))] p-3 shadow-[0_18px_36px_rgba(3,7,13,0.2)] ring-1 ring-white/5 transition hover:-translate-y-1 hover:border-[rgba(233,212,171,0.34)] hover:shadow-[0_24px_48px_rgba(4,9,16,0.26)] sm:rounded-[20px] sm:p-3.5",
        className,
      )}
      data-hero-tile
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-9 items-center justify-center rounded-[18px] border border-white/10 bg-white/8 text-[var(--color-gold-soft)]">
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)] sm:text-[0.64rem] sm:tracking-[0.24em]">
          {shortLabel}
        </p>
        <p className="mt-1.5 text-[0.74rem] font-semibold leading-5 text-white/92 sm:text-[0.82rem]">
          {service.highlight}
        </p>
      </div>
    </motion.article>
  );
}
