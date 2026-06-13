import type { Metadata } from "next";

import { HomeExperience } from "@/components/sections/home-experience";
import { PremiumHero } from "@/components/sections/premium-hero";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Nigerian Passport, NIN & BVN Support in Rome",
  description: "Professional document preparation support in Rome for Nigerian passport renewal, NIN, BVN, eVisa, legalization, affidavits, and more.",
  alternates: { canonical: "/" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Liberty Digital Consulting a government agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Liberty Digital Consulting provides document preparation and digital consulting support and is not an official issuing authority.",
      },
    },
    {
      "@type": "Question",
      name: "Can I start my document support request on WhatsApp?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Visitors can contact the Rome team on WhatsApp to explain what they need and receive guidance on the appropriate support service.",
      },
    },
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Liberty Digital Consulting Services",
  url: getSiteUrl(),
  email: "contact@libertydigitalconsulting.com",
  telephone: "+393533903464",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Orazio 19",
    postalCode: "00193",
    addressLocality: "Rome",
    addressCountry: "IT",
  },
  areaServed: ["Rome", "Italy"],
  description: "Document preparation and digital consulting support for Nigerians and African diaspora residents in Italy.",
};

export default function HomePage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} type="application/ld+json" />
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} type="application/ld+json" />
      <PremiumHero />
      <HomeExperience />
    </>
  );
}
