import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how Liberty Digital Consulting collects, uses, stores, and protects personal information submitted through service and contact forms.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <>
    <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebPageSchema({
      title: "Privacy Policy",
      description:
        "Read how Liberty Digital Consulting collects, uses, stores, and protects personal information submitted through service and contact forms.",
      path: "/privacy-policy",
    })) }} type="application/ld+json" />
    <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy" },
    ])) }} type="application/ld+json" />
    <LegalPage title="Privacy Policy" intro="This policy explains how Liberty Digital Consulting Services handles information submitted through this website." sections={[
      { title: "Information we collect", paragraphs: ["We may collect contact details, service selections, messages, and documents you intentionally submit through service request forms.", "The website may also collect limited technical analytics and performance information through Vercel Analytics and Speed Insights."] },
      { title: "How information is used", paragraphs: ["Submitted information is used to review your request, contact you, provide document preparation support, maintain service records, prevent abuse, and improve the website.", "We do not sell personal information."] },
      { title: "Sensitive documents and retention", paragraphs: ["Only submit documents relevant to your request. Access should be limited to personnel supporting the request and service providers needed to operate the website.", "Information should be retained only as long as reasonably necessary for the request, legal obligations, security, and record keeping."] },
      { title: "Your choices", paragraphs: ["You may ask about, correct, or request deletion of information by contacting Liberty Digital Consulting. Some records may need to be retained where required by law or legitimate business obligations."] },
    ]} />
  </>;
}
