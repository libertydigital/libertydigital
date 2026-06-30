import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description:
    "Cookie policy for Liberty Digital Consulting Services, including essential, translation, and analytics cookies.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createWebPageSchema({
              title: "Cookie Policy",
              description:
                "Cookie policy for Liberty Digital Consulting Services, including essential, translation, and analytics cookies.",
              path: "/cookie-policy",
            }),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Cookie Policy", path: "/cookie-policy" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <LegalPage
        intro="This policy explains how Liberty Digital Consulting Services uses cookies and similar technologies on this website."
        sections={[
          {
            title: "What cookies are used for",
            paragraphs: [
              "Cookies are small text files stored in your browser to remember preferences, support website functionality, and measure how the website is used.",
              "This website uses a limited number of cookies to support language preferences, website analytics, and performance monitoring.",
            ],
          },
          {
            title: "Essential and functional cookies",
            paragraphs: [
              "Some cookies are necessary for the website to function properly. These may include cookies related to session handling, security, or saving choices such as cookie preferences.",
              "If you use the website translation feature, a language preference cookie may be stored so the selected language can be remembered across pages.",
            ],
          },
          {
            title: "Analytics and performance cookies",
            paragraphs: [
              "With your consent, the website may load Vercel Analytics and Vercel Speed Insights to understand visits, page performance, and general website usage patterns.",
              "These cookies and scripts are used only to improve the website experience and are not required for the core browsing experience.",
            ],
          },
          {
            title: "Your choices",
            paragraphs: [
              "When you first visit the website, you can accept or reject optional analytics and performance cookies through the cookie banner.",
              "Rejecting optional cookies will not prevent you from using the website's main pages and services.",
            ],
          },
          {
            title: "Managing cookies",
            paragraphs: [
              "You can also manage or clear cookies through your browser settings at any time.",
              "If you clear cookies in your browser, the website may ask for your preferences again on a future visit.",
            ],
          },
        ]}
        title="Cookie Policy"
      />
    </>
  );
}
