import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Disclaimer", description: "Important service and non-governmental disclaimer for Liberty Digital Consulting.", alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return <LegalPage title="Disclaimer" intro="Please read this important clarification before using Liberty Digital Consulting Services." sections={[
    { title: "Independent consulting service", paragraphs: ["Liberty Digital Consulting provides document preparation and digital consulting support. We are not a government agency, embassy, consulate, NIMC, NIS, bank, or official issuing authority."] },
    { title: "No guaranteed outcome", paragraphs: ["Approvals, appointments, processing times, and issuance decisions remain solely with the relevant official authority or institution. Information can change, so applicants should confirm current official requirements before submission."] },
    { title: "Informational content", paragraphs: ["Website content is general information and preparation guidance. It does not replace official instructions, professional legal advice, or advice from the relevant issuing authority."] },
    { title: "Generated visuals", paragraphs: ["Travel documents and consultation scenes used in the cinematic website design are fictional or illustrative. They do not depict official documents, government branding, or a guaranteed service outcome."] },
  ]} />;
}
