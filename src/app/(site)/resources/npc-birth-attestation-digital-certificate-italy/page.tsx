import type { Metadata } from "next";

import {
  GrowthGuidePage,
  type GrowthGuideContent,
} from "@/components/resources/growth-guide-page";
import { buildPageMetadata } from "@/lib/seo";

const guide: GrowthGuideContent = {
  slug: "npc-birth-attestation-digital-certificate-italy",
  title: "NPC Birth Attestation & Digital Birth Certificate: Guide for Nigerians in Italy",
  description:
    "Understand the current NPC birth attestation, child birth registration and digital certificate reissuance routes before you apply from Italy.",
  excerpt:
    "A current 2026 guide to choosing the right National Population Commission birth-record route, preparing NIN-linked details and avoiding outdated instructions.",
  publishedAt: "2026-09-15",
  readingTime: "7 min read",
  primaryServiceSlug: "national-population-commission-digital-certificate",
  checklist: [
    "Identify whether the person is 18 or older or aged 0 to 17, because NPC currently separates Birth Attestation from Birth Registration by age.",
    "Check the names and date-of-birth details connected to the relevant NIN before creating or using an NPC self-service account.",
    "If you already have an older NPC birth certificate, review the Certificate Reissuance route instead of starting a completely unrelated application.",
    "Keep the current NPC FAQ open while you apply, because the self-service sequence and requirements can change.",
    "Do not send identity-document scans to an independent support provider before it has confirmed why the document is needed.",
  ],
  commonMistakes: [
    "Using an old paper-process checklist without checking NPC's current self-service guidance.",
    "Choosing Birth Attestation for a child or Birth Registration for an adult without checking the current age rules.",
    "Entering a name that does not match the NIN-linked identity when NPC asks for NIN-based account verification.",
    "Assuming an independent consultant can issue, approve, modify or validate an NPC record.",
    "Uploading sensitive identity records before confirming the correct official service route.",
  ],
  sections: [
    {
      heading: "Start by choosing the correct NPC service",
      paragraphs: [
        "The most important first step is not uploading documents. It is identifying which official NPC service fits the person and the existing record. NPC's current FAQ states that Birth Attestation is for individuals aged 18 and above, while Birth Registration is for children aged 0 to 17. That distinction matters because the supporting information and account journey are not identical.",
        "For a Nigerian living in Italy, this means you should first write down the person's age, whether a previous NPC record exists, whether the request is connected to NIN or passport work, and whether you are trying to obtain a first record, reprint an attestation or convert an older certificate into the current digital system. A short case summary prevents you from starting the wrong online path.",
      ],
    },
    {
      heading: "Birth Attestation for adults aged 18 and above",
      paragraphs: [
        "NPC currently lists a National Identification Number and a court-sworn affidavit among the requirements for Birth Attestation. Its self-service account process also uses NIN-linked identity verification, so consistency in names and other identity details is important before you begin.",
        "If your NIN, passport, affidavit or older birth record uses different spellings or dates, do not quietly choose whichever version seems convenient. Record the discrepancy and establish which official identity data should be used. That preparation may save you from repeating payment or verification steps later.",
        "After an attestation application is approved, NPC says the certificate download option becomes available through the applicant dashboard. Approval and certificate generation remain entirely within the NPC system; Liberty can only help you understand and prepare for the process.",
      ],
    },
    {
      heading: "Birth Registration for children aged 0 to 17",
      paragraphs: [
        "NPC's current FAQ treats Birth Registration as the route for children from birth to age 17. It describes the child's NIN and the parent's attestation number as part of the requirements, while also providing guidance for a child who does not yet have a NIN. In that situation, NPC says registration can still proceed, but the parent or guardian must provide a valid NIN.",
        "Parents should therefore confirm which parent's identity is linked to the child's record and check the spelling of the child's name before proceeding. NPC also says both parents do not need to register the same child separately once either parent's NIN is linked to the child's record.",
        "If the birth record will later support a passport or NIN process, preserve the approved digital certificate and keep the identity details consistent across those later applications.",
      ],
    },
    {
      heading: "How to move an old birth certificate into the digital system",
      paragraphs: [
        "People who already hold an older NPC birth certificate should not assume they need a completely new birth record. NPC's current guidance directs these applicants to Certificate Reissuance. The current flow starts from the NPC website, uses an account linked to NIN and then allows the applicant to continue with the digital-certificate request.",
        "Before starting reissuance, make a clear scan or record of the old certificate for your own reference, but do not distribute it unnecessarily. Check whether the name, date and place of birth on the older record match the identity information now linked to your NIN. If they do not, identify the discrepancy before you pay for a new request.",
      ],
    },
    {
      heading: "Temporary attestation numbers and NIN-related questions",
      paragraphs: [
        "NPC's vital-registration FAQ notes that a temporary attestation number is not the same thing as a permanent record that can be validated everywhere. It specifically says the NPC Temporary Attestation Number cannot be validated on the NIMC web modification portal and is intended for applicants without a NIN for use during NIN enrolment.",
        "That is one reason to avoid treating every NPC number as interchangeable. If your birth-record request is being made specifically for NIN enrolment, passport renewal or another identity process, state that purpose clearly when you ask for preparation support so the route can be checked against the current official instructions.",
      ],
    },
    {
      heading: "Use official NPC guidance as the final authority",
      paragraphs: [
        "The National Population Commission can change account flows, verification steps, payment requirements and service rules. Any independent guide, including this one, should be treated as preparation help rather than a substitute for the live NPC system.",
        "Before you submit or pay, check the current NPC website and FAQs. If you are uncertain which service applies, Liberty can help you organise the facts of your case and point you toward the relevant official route, but it cannot approve an application, alter an NPC record or guarantee certificate issuance.",
      ],
    },
  ],
  faqs: [
    {
      question: "Who should use NPC Birth Attestation?",
      answer:
        "NPC currently states that Birth Attestation is for individuals aged 18 and above. Check the current NPC FAQ before applying because service rules can change.",
    },
    {
      question: "Who should use NPC Birth Registration?",
      answer:
        "NPC currently states that Birth Registration covers children aged 0 to 17. Parent or guardian identity information is part of the process.",
    },
    {
      question: "Can I get a digital version of an old NPC birth certificate?",
      answer:
        "NPC currently directs holders of older birth certificates to its Certificate Reissuance service, which uses an NPC account and NIN-linked setup.",
    },
    {
      question: "Can a child without a NIN still be registered?",
      answer:
        "NPC currently says yes, but the parent or guardian must provide a valid NIN to complete the process. Confirm the latest requirement on the NPC website.",
    },
    {
      question: "Can Liberty issue an NPC certificate?",
      answer:
        "No. Liberty provides independent preparation support only. NPC controls official records, verification, approvals, reissuance and certificates.",
    },
  ],
  relatedGuideLinks: [
    {
      href: "/resources/nin-document-support-rome",
      label: "NIN document support in Rome",
    },
    {
      href: "/resources/nigerian-passport-support-rome",
      label: "Nigerian passport preparation in Rome",
    },
  ],
};

export const metadata: Metadata = buildPageMetadata({
  title: "NPC Birth Attestation & Digital Certificate Italy",
  description: guide.description,
  path: `/resources/${guide.slug}`,
  type: "article",
});

export default function NpcBirthAttestationGuidePage() {
  return <GrowthGuidePage guide={guide} />;
}
