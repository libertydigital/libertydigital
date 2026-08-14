import type { ServiceSlug } from "./services";

export type GuideSection = { heading: string; paragraphs: string[] };
export type GuideFaq = { question: string; answer: string };
export type Guide = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  primaryServiceSlug: ServiceSlug;
  relatedServiceSlugs: ServiceSlug[];
  relatedGuideSlugs: string[];
  checklist: string[];
  commonMistakes: string[];
  sections: GuideSection[];
  faqs: GuideFaq[];
};

const OFFICIAL_VERIFICATION_NOTE =
  "Official requirements, appointment rules, processing times, and decisions can change. Confirm the current requirements with the relevant official authority before you travel or submit documents.";

export const GUIDES: Guide[] = [
  {
    slug: "nigerian-passport-support-rome",
    title: "Nigerian Passport Support in Rome: What to Prepare Before Your Appointment",
    description:
      "Use this practical preparation guide to organise your Nigerian passport documents before an appointment in Rome.",
    excerpt:
      "A calm, practical checklist for preparing your passport-support request and checking your records before the official appointment.",
    publishedAt: "2026-08-14",
    readingTime: "6 min read",
    primaryServiceSlug: "nigeria-passport-online-registration",
    relatedServiceSlugs: [
      "emergency-travel-certificate",
      "document-legalization-at-nigerian-embassy",
    ],
    relatedGuideSlugs: [
      "nigerian-embassy-document-legalization-rome",
      "questura-support-letter-italy",
    ],
    checklist: [
      "Check that your name, date of birth, and other personal details match across the records you plan to use.",
      "Keep clear copies of your current passport and any supporting identity documents available for review.",
      "Record your appointment details and keep any official confirmation in an easy-to-find place.",
      "List any missing, damaged, or changed details before asking for document-preparation support.",
    ],
    commonMistakes: [
      "Using different spellings or dates across documents without explaining the difference.",
      "Waiting until the appointment day to check whether supporting records are readable and complete.",
      "Assuming a preparation service can change an official appointment, approval, or issuance decision.",
    ],
    sections: [
      {
        heading: "Start with consistent identity details",
        paragraphs: [
          "Passport applications often depend on details being presented consistently. Before you begin, compare the spelling of your names, your date of birth, and other key details across the documents you hold.",
          "If you notice a difference, do not guess which record will be accepted. Make a note of it and prepare to ask the relevant official authority how it should be handled.",
        ],
      },
      {
        heading: "Prepare for the appointment, not just the form",
        paragraphs: [
          "A good preparation file makes it easier to explain your situation and locate the right record when asked. Keep appointment information, identity copies, and any previous passport details together before you travel.",
          "Liberty can help organise your information for the next step, but does not control appointment availability, official requirements, passport approval, or issuance.",
        ],
      },
      {
        heading: "Verify current instructions before you go",
        paragraphs: [
          OFFICIAL_VERIFICATION_NOTE,
          "If your case involves lost documents, urgent travel, or a change to your personal details, seek guidance early so you can follow the correct official route.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Liberty issue or approve a Nigerian passport?",
        answer:
          "No. Liberty provides independent document-preparation support. Official authorities control appointments, approvals, and passport issuance.",
      },
      {
        question: "What should I check before my appointment?",
        answer:
          "Check that your identity details are consistent, your supporting records are clear, and your official appointment information is available.",
      },
      {
        question: "What if my passport details do not match another document?",
        answer:
          "Keep a clear record of the difference and confirm the correct next step with the relevant official authority before submitting your documents.",
      },
    ],
  },
  {
    slug: "bvn-support-italy",
    title: "BVN Support in Italy: What to Organise Before You Start",
    description:
      "Prepare your Bank Verification Number support request in Italy with a clear identity-record checklist.",
    excerpt:
      "Organise the identity information and bank-related details you may need before following the appropriate BVN process.",
    publishedAt: "2026-08-14",
    readingTime: "5 min read",
    primaryServiceSlug: "bank-verification-number",
    relatedServiceSlugs: [
      "national-identification-number",
      "same-person-letter",
    ],
    relatedGuideSlugs: [
      "nin-document-support-rome",
      "nigerian-passport-support-rome",
    ],
    checklist: [
      "Write your full name exactly as it appears on your relevant bank and identity records.",
      "Keep a clear copy of the identity document you expect to use.",
      "Note any old phone number, email address, or identity detail that may affect your case.",
      "Prepare questions for your bank or the official BVN channel if your information has changed.",
    ],
    commonMistakes: [
      "Submitting a name variation without first understanding how the bank records it.",
      "Treating a preparation checklist as confirmation that a bank will update or verify a record.",
      "Sharing sensitive banking details through an unverified channel.",
    ],
    sections: [
      {
        heading: "Make your identity record easy to review",
        paragraphs: [
          "BVN support starts with accurate information. Collect the identity details you use with your bank and compare them with your current supporting documents before you make a request.",
          "If an old phone number, name spelling, or date of birth is involved, record the difference clearly instead of trying to hide it.",
        ],
      },
      {
        heading: "Protect your personal information",
        paragraphs: [
          "BVN-related information is sensitive. Use only the bank or official channel for account-specific instructions, and do not send passwords, PINs, or other information that should remain private.",
          "Liberty can help you organise the document side of a request, but does not access bank accounts or decide whether a bank verifies, changes, or accepts a record.",
        ],
      },
      {
        heading: "Confirm the current process with the right authority",
        paragraphs: [
          OFFICIAL_VERIFICATION_NOTE,
          "For bank-specific questions, confirm the required route directly with the bank or authorised BVN channel before taking the next step.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Liberty change my BVN or bank record?",
        answer:
          "No. Banks and authorised BVN channels control verification and record changes. Liberty provides independent preparation support only.",
      },
      {
        question: "Should I share my bank password or PIN?",
        answer:
          "No. Do not share passwords or PINs as part of a document-preparation request.",
      },
      {
        question: "Why should I check my name spelling first?",
        answer:
          "A clear record of any difference helps you ask the appropriate authority what supporting documents may be needed.",
      },
    ],
  },
  {
    slug: "nin-document-support-rome",
    title: "NIN Document Support in Rome: Prepare Your Details Before the Next Step",
    description:
      "A practical guide for organising National Identification Number supporting documents in Rome.",
    excerpt:
      "Check the consistency of your identity details and prepare a simple record before you follow the current NIN process.",
    publishedAt: "2026-08-14",
    readingTime: "5 min read",
    primaryServiceSlug: "national-identification-number",
    relatedServiceSlugs: [
      "bank-verification-number",
      "national-population-commission-digital-certificate",
    ],
    relatedGuideSlugs: ["bvn-support-italy", "nigerian-passport-support-rome"],
    checklist: [
      "Compare your name, date of birth, and place of birth across your identity records.",
      "Keep clear copies of the documents relevant to your NIN question.",
      "Write down any correction, update, or missing-detail issue before making a request.",
      "Confirm the current official NIN route before booking travel or relying on a deadline.",
    ],
    commonMistakes: [
      "Assuming a document-preparation service can enrol, issue, or correct a NIN.",
      "Overlooking a difference between birth, passport, and bank-related identity records.",
      "Relying on outdated instructions shared informally.",
    ],
    sections: [
      {
        heading: "Compare the details that identify you",
        paragraphs: [
          "Before you follow an NIN-related process, make a short comparison of the details shown on your available records. Names, dates of birth, and places of birth should be easy to explain if they differ.",
          "This preparation does not replace the official process. It simply helps you identify questions before you reach the relevant authority.",
        ],
      },
      {
        heading: "Separate preparation from official action",
        paragraphs: [
          "A well-organised file can make a request clearer, especially where you are unsure which supporting document relates to your situation. Keep original records secure and use copies only where appropriate.",
          "Liberty can help you prepare and organise your information. It does not issue NINs, approve updates, or control the official enrolment process.",
        ],
      },
      {
        heading: "Check official instructions at the right time",
        paragraphs: [
          OFFICIAL_VERIFICATION_NOTE,
          "If your NIN question connects to a bank, passport, birth record, or another identity document, ask the relevant official channel which route applies to your circumstances.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Liberty issue a NIN?",
        answer:
          "No. Liberty provides independent preparation support; the relevant official authority controls NIN enrolment, updates, and issuance.",
      },
      {
        question: "What details should I compare?",
        answer:
          "Start with your names, date of birth, place of birth, and the identifying details shown on the records connected to your request.",
      },
      {
        question: "Can old advice still be correct?",
        answer:
          "Processes can change, so confirm the current requirements with the relevant official authority before acting on older advice.",
      },
    ],
  },
  {
    slug: "nigerian-embassy-document-legalization-rome",
    title: "Nigerian Embassy Document Legalization in Rome: Preparation Checklist",
    description:
      "Prepare documents for a Nigerian Embassy legalization journey in Rome with a clear, authority-aware checklist.",
    excerpt:
      "Organise the document, identity details, and questions you need before you follow the Embassy's current legalization instructions.",
    publishedAt: "2026-08-14",
    readingTime: "6 min read",
    primaryServiceSlug: "document-legalization-at-nigerian-embassy",
    relatedServiceSlugs: [
      "court-e-affidavit",
      "same-person-letter",
      "letter-of-single",
    ],
    relatedGuideSlugs: [
      "questura-support-letter-italy",
      "nigerian-passport-support-rome",
    ],
    checklist: [
      "Identify the exact document you need to present and keep it separate from copies.",
      "Check that names, dates, and document numbers are readable and consistent.",
      "Write down the receiving organisation's reason for requesting legalization, if known.",
      "Confirm the latest legalization instructions, appointment rules, and fees with the relevant official authority.",
    ],
    commonMistakes: [
      "Assuming all documents follow the same legalization route.",
      "Bringing unclear copies without checking whether originals or additional steps are required.",
      "Treating preparation support as a guarantee of legalization or acceptance by another organisation.",
    ],
    sections: [
      {
        heading: "Identify the purpose before you prepare",
        paragraphs: [
          "Legalization requests are easier to organise when you know why the receiving organisation needs the document. Note whether the document is for a school, employer, family matter, legal process, or another administrative use.",
          "This context can help you prepare useful questions, but the relevant authority decides the applicable official requirements.",
        ],
      },
      {
        heading: "Check the document and its supporting records",
        paragraphs: [
          "Review the document for readable names, dates, signatures, and stamps. If there is a mismatch with your identity records, record it before you proceed so you can seek the correct guidance.",
          "Liberty can provide independent document-preparation support. It does not legalize documents, control Embassy appointments, or decide whether a receiving body accepts a document.",
        ],
      },
      {
        heading: "Use current official instructions",
        paragraphs: [
          OFFICIAL_VERIFICATION_NOTE,
          "Requirements may differ by document type and intended use, so confirm the instructions for your specific case before paying, travelling, or submitting originals.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Liberty legalize my document?",
        answer:
          "No. Liberty provides independent preparation support. The relevant official authority controls legalization and any related appointment or acceptance decision.",
      },
      {
        question: "Do all documents need the same steps?",
        answer:
          "Not necessarily. Confirm the route for your exact document and intended use with the relevant official authority.",
      },
      {
        question: "Should I bring originals?",
        answer:
          "Follow the current official instructions for your case. Keep original documents secure and prepare clear copies where appropriate.",
      },
    ],
  },
  {
    slug: "questura-support-letter-italy",
    title: "Questura Support Letter in Italy: How to Prepare Your Information",
    description:
      "Prepare clear identity and document information before seeking a Questura-related support letter in Italy.",
    excerpt:
      "A practical way to organise your details, supporting records, and official questions before a Questura-related document step.",
    publishedAt: "2026-08-14",
    readingTime: "5 min read",
    primaryServiceSlug: "citizenship-letter-to-questura",
    relatedServiceSlugs: [
      "family-income-document",
      "same-person-letter",
      "document-legalization-at-nigerian-embassy",
    ],
    relatedGuideSlugs: [
      "nigerian-embassy-document-legalization-rome",
      "nin-document-support-rome",
    ],
    checklist: [
      "Write the purpose of the Questura-related request in plain language.",
      "Prepare clear identity details and copies of the records connected to your case.",
      "Check that names and dates match the documents you plan to use.",
      "Confirm with the relevant official authority which letter or supporting evidence is currently required.",
    ],
    commonMistakes: [
      "Using a generic letter without confirming whether it fits the official request.",
      "Leaving out a relevant identity difference or document history.",
      "Assuming Liberty can influence a Questura decision or immigration outcome.",
    ],
    sections: [
      {
        heading: "Describe your request clearly",
        paragraphs: [
          "Start by writing a short explanation of the administrative purpose of your request. Clear context helps you organise the documents and questions that belong to your case.",
          "If you received a request from an official body, keep that notice with your records so you can check the wording carefully.",
        ],
      },
      {
        heading: "Prepare an accurate supporting record",
        paragraphs: [
          "Collect the identity details and supporting documents that relate to the request. Review their names and dates before you rely on them, especially where records were issued at different times.",
          "Liberty can help prepare a clear support-letter request. It does not control Questura requirements, immigration decisions, appointments, or official outcomes.",
        ],
      },
      {
        heading: "Confirm the authority's current requirement",
        paragraphs: [
          OFFICIAL_VERIFICATION_NOTE,
          "A letter that was useful for one person may not be the right evidence for another case, so ask the relevant official authority what is currently required for your situation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can Liberty influence a Questura decision?",
        answer:
          "No. Liberty provides independent preparation support only. The Questura and other official authorities control their own decisions and requirements.",
      },
      {
        question: "What should I prepare first?",
        answer:
          "Prepare a clear description of your request, consistent identity details, and the records connected to the official question you need to address.",
      },
      {
        question: "Will one support letter work for every case?",
        answer:
          "No. Confirm the current requirements for your specific case with the relevant official authority before relying on any document.",
      },
    ],
  },
];

export const GUIDES_BY_SLUG = Object.fromEntries(
  GUIDES.map((guide) => [guide.slug, guide]),
) as Record<string, Guide>;

export function getGuideBySlug(slug: string): Guide | null {
  return GUIDES_BY_SLUG[slug] ?? null;
}

export function getPublishedGuides(): Guide[] {
  return GUIDES;
}
