import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ScrollReset } from "@/components/layout/scroll-reset";
import { getSiteUrl } from "@/lib/site-url";

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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  title: {
    default:
      "Liberty Digital Consulting Services | Nigerian Documentation Support in Rome",
    template: "%s | Liberty Digital Consulting Services",
  },
  description:
    "Get guided support in Rome for Nigerian passport online registration, NIN, BVN, Nigeria eVisa, court e-affidavit, and NPC digital certificate requests.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Liberty Digital Consulting Services",
    title:
      "Liberty Digital Consulting Services | Nigerian Documentation Support in Rome",
    description:
      "Guided support in Rome for Nigerian passport online registration, NIN, BVN, Nigeria eVisa, court e-affidavit, and NPC digital certificate requests.",
    images: [
      {
        url: "/hero-premium-generated.png",
        width: 1600,
        height: 1200,
        alt: "Liberty Digital Consulting Services premium documentation support hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Liberty Digital Consulting Services | Nigerian Documentation Support in Rome",
    description:
      "Guided support in Rome for Nigerian documentation and digital registration requests.",
    images: ["/hero-premium-generated.png"],
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
