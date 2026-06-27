import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer",
  description:
    "Important service and non-governmental disclaimer for Liberty Digital Consulting.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return <>
    <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createWebPageSchema({
      title: "Disclaimer",
      description:
        "Important service and non-governmental disclaimer for Liberty Digital Consulting.",
      path: "/disclaimer",
    })) }} type="application/ld+json" />
    <script dangerouslySetInnerHTML={{ __html: JSON.stringify(createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Disclaimer", path: "/disclaimer" },
    ])) }} type="application/ld+json" />
    <LegalPage title="Disclaimer" intro="Please read this important clarification before using Liberty Digital Consulting Services." sections={[
      { title: "Independent consulting service", paragraphs: ["Liberty Digital Consulting provides document preparation and digital consulting support. We are not a government agency, embassy, consulate, NIMC, NIS, bank, or official issuing authority."] },
      { title: "No guaranteed outcome", paragraphs: ["Approvals, appointments, processing times, and issuance decisions remain solely with the relevant official authority or institution. Information can change, so applicants should confirm current official requirements before submission."] },
      { title: "Informational content", paragraphs: ["Website content is general information and preparation guidance. It does not replace official instructions, professional legal advice, or advice from the relevant issuing authority."] },
      { title: "Generated visuals", paragraphs: ["Travel documents and consultation scenes used in the cinematic website design are fictional or illustrative. They do not depict official documents, government branding, or a guaranteed service outcome."] },
    ]} />
  </>;
}
