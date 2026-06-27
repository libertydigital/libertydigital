import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ScrollReset } from "@/components/layout/scroll-reset";
import { getSiteUrl } from "@/lib/site-url";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_PATH,
  SITE_NAME,
} from "@/lib/seo";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-v2.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/assets/icons/apple-touch-icon-v2.png",
  },
  title: {
    default:
      "Nigerian Document Support in Rome | Liberty Digital Consulting",
    template: "%s | Liberty Digital Consulting",
  },
  description:
    "Professional document preparation support in Rome for Nigerian passport renewal, NIN, BVN, eVisa, legalization, affidavits, and related requests.",
  alternates: { canonical: "/" },
  category: "document support",
  keywords: [
    "Nigerian passport renewal Rome",
    "NIN support Rome",
    "BVN support Rome",
    "Nigeria eVisa support Italy",
    "document preparation Rome",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title:
      "Nigerian Document Support in Rome | Liberty Digital Consulting",
    description:
      "Professional document preparation support in Rome for Nigerian passport renewal, NIN, BVN, eVisa, legalization, affidavits, and related requests.",
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        width: 1536,
        height: 1024,
        alt: "Liberty Digital Consulting workspace for document support in Rome",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Nigerian Document Support in Rome | Liberty Digital Consulting",
    description:
      "Professional document preparation support in Rome for Nigerian passport renewal, NIN, BVN, eVisa, legalization, affidavits, and related requests.",
    images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-[var(--color-cream)] text-[var(--color-navy)] antialiased">
        <ScrollReset />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
