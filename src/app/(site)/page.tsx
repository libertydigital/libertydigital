import type { Metadata } from "next";

import { HomeExperience } from "@/components/sections/home-experience";
import { PremiumHero } from "@/components/sections/premium-hero";
import {
  buildPageMetadata,
  createOrganizationSchema,
  createProfessionalServiceSchema,
  createWebPageSchema,
  createWebSiteSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Nigerian Passport, NIN & BVN Support in Rome",
  description:
    "Professional document preparation support in Rome for Nigerian passport renewal, NIN, BVN, eVisa, legalization, affidavits, and more.",
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
        title: "Nigerian Passport, NIN & BVN Support in Rome",
        description:
          "Professional document preparation support in Rome for Nigerian passport renewal, NIN, BVN, eVisa, legalization, affidavits, and more.",
        path: "/",
      })) }} type="application/ld+json" />
      <PremiumHero />
      <HomeExperience />
    </>
  );
}
