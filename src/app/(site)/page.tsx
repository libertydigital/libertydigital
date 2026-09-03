import type { Metadata } from "next";

import { CTASection } from "@/components/sections/cta-section";
import { HomeExperience } from "@/components/sections/home-experience";
import { HomeRequestSection } from "@/components/sections/home-request-section";
import { PremiumHero } from "@/components/sections/premium-hero";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TrustSection } from "@/components/sections/trust-section";
import {
  buildPageMetadata,
  createOrganizationSchema,
  createProfessionalServiceSchema,
  createWebPageSchema,
  createWebSiteSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Nigerian Document Support in Rome",
  description:
    "Rome-based support for Nigerian passport registration, NIN, BVN, eVisa, legalization, affidavits, and related document requests.",
  path: "/",
  keywords: [
    "Nigerian passport support Rome",
    "NIN Rome",
    "BVN Rome",
    "Nigeria eVisa Italy",
    "document legalization Rome",
  ],
});

export default function HomePage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createOrganizationSchema()) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createProfessionalServiceSchema()) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebSiteSchema()) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebPageSchema({
        title: "Nigerian Document Support in Rome",
        description:
          "Rome-based support for Nigerian passport registration, NIN, BVN, eVisa, legalization, affidavits, and related document requests.",
        path: "/",
      })) }} type="application/ld+json" />
      <PremiumHero />
      <HomeExperience />
      <TrustSection />
      <TestimonialsSection />
      <HomeRequestSection />
      <CTASection />
    </>
  );
}
