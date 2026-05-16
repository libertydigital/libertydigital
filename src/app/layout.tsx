import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { ScrollReset } from "@/components/layout/scroll-reset";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  icons: {
    icon: "/liberty-logo-light.png",
    shortcut: "/liberty-logo-light.png",
    apple: "/liberty-logo-light.png",
  },
  title: {
    default:
      "Liberty Digital Consulting Services | Nigerian Documentation Support in Rome",
    template: "%s | Liberty Digital Consulting Services",
  },
  description:
    "Get guided support in Rome for Nigerian passport online registration, NIN, BVN, Nigeria eVisa, court e-affidavit, and NPC digital certificate requests.",
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
      </body>
    </html>
  );
}
