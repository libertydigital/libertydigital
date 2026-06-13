import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms of Service", description: "Terms for using Liberty Digital Consulting document preparation services.", alternates: { canonical: "/terms-of-service" } };

export default function TermsPage() {
  return <LegalPage title="Terms of Service" intro="These terms describe the basis on which Liberty Digital Consulting Services provides document preparation and digital consulting support." sections={[
    { title: "Scope of support", paragraphs: ["Liberty Digital Consulting provides preparation, administrative, and digital consulting support. We do not issue official documents, control approvals, or act as a government agency, embassy, consulate, NIMC, NIS, bank, court, or other issuing authority."] },
    { title: "Client responsibilities", paragraphs: ["You are responsible for providing accurate, complete, and lawful information and for reviewing documents before official submission.", "You remain responsible for official fees, appointments, submissions, and compliance with the relevant authority's requirements."] },
    { title: "Timelines and outcomes", paragraphs: ["Official timelines and decisions are controlled by third parties. No approval, issuance date, appointment, or outcome is guaranteed."] },
    { title: "Professional and legal advice", paragraphs: ["Support provided through this website is not legal advice. For complex legal matters, consult a qualified lawyer or the relevant official authority."] },
  ]} />;
}
