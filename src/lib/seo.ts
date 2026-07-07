import type { Metadata } from "next";

import { BUSINESS_DETAILS } from "@/lib/services";
import { getSiteUrl } from "@/lib/site-url";

export const SITE_NAME = "Liberty Digital Consulting";
export const BUSINESS_NAME = BUSINESS_DETAILS.name;
export const DEFAULT_OG_IMAGE_PATH = "/assets/og/liberty-digital-og.webp";
const DEFAULT_OG_IMAGE_ALT =
  "Liberty Digital Consulting workspace for document support in Rome";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

type WebPageSchemaInput = {
  title: string;
  description: string;
  path: string;
  type?:
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "CollectionPage"
    | "ItemPage";
};

export function absoluteUrl(path = "/") {
  const siteUrl = getSiteUrl();

  if (!path || path === "/") {
    return new URL("/", `${siteUrl}/`).toString();
  }

  return new URL(path, `${siteUrl}/`).toString();
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
          width: 1536,
          height: 1024,
          alt: DEFAULT_OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : undefined,
  };
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getSiteUrl()}#organization`,
    name: BUSINESS_NAME,
    url: getSiteUrl(),
    email: BUSINESS_DETAILS.email,
    telephone: BUSINESS_DETAILS.phone,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/liberty-logo-light.png"),
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Orazio 19",
      postalCode: "00193",
      addressLocality: "Rome",
      addressCountry: "IT",
    },
  };
}

export function createProfessionalServiceSchema(includeContext = true) {
  return {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": "ProfessionalService",
    "@id": `${getSiteUrl()}#professional-service`,
    name: BUSINESS_NAME,
    url: getSiteUrl(),
    email: BUSINESS_DETAILS.email,
    telephone: BUSINESS_DETAILS.phone,
    areaServed: [
      { "@type": "City", name: "Rome" },
      { "@type": "Country", name: "Italy" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Orazio 19",
      postalCode: "00193",
      addressLocality: "Rome",
      addressCountry: "IT",
    },
    serviceType: "Document preparation and digital consulting support",
    provider: {
      "@id": `${getSiteUrl()}#organization`,
    },
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}#website`,
    name: SITE_NAME,
    url: getSiteUrl(),
    publisher: {
      "@id": `${getSiteUrl()}#organization`,
    },
    inLanguage: "en",
  };
}

export function createWebPageSchema({
  title,
  description,
  path,
  type = "WebPage",
}: WebPageSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@id": `${getSiteUrl()}#website`,
    },
    about: {
      "@id": `${getSiteUrl()}#professional-service`,
    },
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
