import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { CookieConsentManager } from "@/components/layout/cookie-consent-manager";
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
  const scrollResetScript = `
    (() => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      const navigationEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
      if (navigationEntry && navigationEntry.type === 'reload') {
        window.scrollTo(0, 0);
      }

      window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
      });

      window.addEventListener('pageshow', (event) => {
        const currentEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
        if (event.persisted || (currentEntry && currentEntry.type === 'reload')) {
          window.scrollTo(0, 0);
        }
      });
    })();
  `;

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-[var(--color-cream)] text-[var(--color-navy)] antialiased">
        <script dangerouslySetInnerHTML={{ __html: scrollResetScript }} />
        {children}
        <CookieConsentManager />
      </body>
    </html>
  );
}
