import type { ServiceContent, ServiceSlug } from "@/lib/services";

export type OfficialResource = {
  label: string;
  href: string;
};

export type ServiceGrowth = {
  title: string;
  seoTitle: string;
  seoDescription: string;
  shortDescription: string;
  longDescription: string;
  highlight: string;
  whoThisIsFor: string[];
  whatWeHelpWith: string[];
  requiredDocuments: string[];
  processSteps: string[];
  importantNotes: string[];
  faqs: ServiceContent["faqs"];
  currentProcessHeading: string;
  currentProcessIntro: string;
  currentProcessPoints: string[];
  guideHref: string;
  guideLabel: string;
  officialResources: OfficialResource[];
  verifiedAt: string;
};

const SERVICE_GROWTH: Partial<Record<ServiceSlug, ServiceGrowth>> = {
  "nigeria-passport-online-registration": {
    title: "Nigerian Passport Renewal & Registration Support in Rome, Italy",
    seoTitle: "Nigerian Passport Renewal Rome & Italy",
    seoDescription:
      "Prepare a Nigerian passport renewal, reissue, first application, data change or biometric appointment in Rome and Italy with independent support.",
    shortDescription:
      "Independent preparation support for Nigerian passport renewal, reissue, fresh applications, data changes and biometric appointment readiness in Italy.",
    longDescription:
      "Preparing a Nigerian passport application from Italy can involve NIN verification, an online application, supporting records, payment and biometric enrolment. Liberty helps you organise the information and documents for renewal, reissue, first applications, lost or damaged passport cases and data changes before you continue with the official Nigeria Immigration Service process.",
    highlight: "Passport renewal and biometric preparation",
    whoThisIsFor: [
      "Nigerians in Rome or elsewhere in Italy preparing a passport renewal or reissue.",
      "First-time applicants who need help understanding the official online application sequence.",
      "Applicants replacing a lost, stolen or damaged passport.",
      "People preparing a correction or change-of-data request.",
      "Parents or guardians preparing a minor's application.",
    ],
    whatWeHelpWith: [
      "Choosing the correct preparation path for renewal, reissue, fresh application or data change.",
      "Checking that the information you plan to use is consistent before submission.",
      "Organising the supporting-document checklist for your application type.",
      "Understanding the payment, appointment and biometric-enrolment stages.",
      "Preparing questions before you contact or attend the relevant Nigerian mission or official channel.",
    ],
    requiredDocuments: [
      "NIN details used for the official passport process.",
      "Current passport or passport data page for renewal/reissue where applicable.",
      "NPC birth certificate or accepted declaration of age, depending on the official requirement for your case.",
      "State-of-origin or other identity supporting records where required.",
      "Application-specific records for loss, damage, name changes or corrections.",
      "Payment and appointment confirmation after you complete the official application.",
    ],
    processSteps: [
      "Tell Liberty whether you need a fresh passport, renewal/reissue, replacement or data change.",
      "Review identity details and the supporting-document checklist before entering sensitive information on an official portal.",
      "Complete the official NIS application, payment and processing-centre selection through the current official channel.",
      "Book or follow the applicable biometric-enrolment route and keep the official acknowledgement and payment records.",
      "Attend the relevant biometric step when required and follow NIS or the Nigerian mission for status and issuance.",
    ],
    importantNotes: [
      "Liberty does not issue passports, control appointments or guarantee approval or processing time.",
      "Nigeria Immigration Service says renewal/reissue applicants verify NIN, provide current passport details, upload application-specific records, pay and book biometric enrolment.",
      "NIS instructions can change, including diaspora/contactless options, so confirm the current official route before paying or travelling.",
      "Do not send passport numbers, scans or other sensitive identity documents in the initial Liberty enquiry form.",
    ],
    faqs: [
      {
        question: "Can Liberty renew or issue my Nigerian passport?",
        answer:
          "No. Liberty provides independent preparation support. Nigeria Immigration Service and the relevant Nigerian mission or official processing channel control the application, biometric process, approval and issuance.",
      },
      {
        question: "What does the official renewal process involve?",
        answer:
          "NIS currently describes NIN verification, current-passport details, processing-centre and booklet selection, an ICAO-compliant photo, supporting documents, payment and biometric enrolment as key renewal/reissue stages.",
      },
      {
        question: "Can you help if my passport is lost or my details need changing?",
        answer:
          "Yes, Liberty can help you organise the preparation checklist and understand which official route applies. Lost-passport and change-of-data cases can require additional supporting records.",
      },
    ],
    currentProcessHeading: "Current Nigerian passport process for applicants in Italy",
    currentProcessIntro:
      "Nigeria Immigration Service currently requires the official application to be completed through its passport process, with identity verification, supporting records and biometric steps depending on the application type.",
    currentProcessPoints: [
      "Fresh and renewal applications start through the official passport application route and use NIN-linked identity details.",
      "Renewal/reissue requires current passport information and application-specific supporting documents.",
      "Applicants should follow the current NIS instruction for biometric enrolment, including any diaspora/contactless option for which they are eligible.",
    ],
    guideHref: "/resources/nigerian-passport-support-rome",
    guideLabel: "Read the Nigerian passport preparation guide",
    officialResources: [
      {
        label: "Nigeria Immigration Service passport guidance",
        href: "https://immigration.gov.ng/passports/",
      },
      {
        label: "NIS renewal/reissue steps",
        href: "https://immigration.gov.ng/info-center/renewal-of-passport/",
      },
    ],
    verifiedAt: "15 September 2026",
  },
  "bank-verification-number": {
    title: "BVN Support in Rome & Italy",
    seoTitle: "BVN Support in Rome & Italy",
    seoDescription:
      "Prepare for BVN enrolment in Rome or use the official NRBVN route from Italy with independent document and identity-data support.",
    shortDescription:
      "Independent BVN preparation support for Nigerians in Italy, including guidance around the official Rome diaspora enrolment location and NRBVN option.",
    longDescription:
      "Nigerians living in Italy can use official diaspora BVN channels without travelling to Nigeria. Liberty helps you prepare consistent identity information, understand the available official routes and avoid sharing unnecessary banking credentials while you organise the next step.",
    highlight: "BVN diaspora preparation support",
    whoThisIsFor: [
      "Nigerians in Rome or elsewhere in Italy who need a first BVN.",
      "Diaspora customers comparing physical BVN enrolment with the NRBVN remote route.",
      "Applicants who need to organise identity records before visiting an authorised enrolment point.",
      "People with a name, phone or identity mismatch who need to understand what to ask their bank or official BVN channel.",
    ],
    whatWeHelpWith: [
      "Explaining the difference between Liberty's preparation support and official BVN enrolment.",
      "Checking that identity details are organised before the official process.",
      "Pointing you to current official NIBSS/CBN information for diaspora enrolment.",
      "Preparing a clear list of questions for your bank or authorised enrolment provider when data differs.",
    ],
    requiredDocuments: [
      "A valid identity document accepted by the official BVN enrolment provider.",
      "Consistent personal details used for your Nigerian banking relationship.",
      "Any additional records the authorised provider or your bank specifically requests for your case.",
      "Do not provide passwords, PINs, OTPs or online-banking credentials to Liberty.",
    ],
    processSteps: [
      "Choose whether you are checking the physical Rome enrolment route or the remote NRBVN option.",
      "Organise your identity details and note any discrepancy that could affect enrolment or bank linkage.",
      "Confirm current requirements, fee and availability directly with the official/authorised channel.",
      "Complete biometric or digital verification only through the authorised process.",
      "Follow your bank for BVN linkage or account-specific action after enrolment where necessary.",
    ],
    importantNotes: [
      "Liberty is not NIBSS, CBN, a bank or a BVN issuing/enrolment authority.",
      "NIBSS currently lists Online Integrated Solutions S.R.L., Via Sicilia 30, 00187 Rome as its Italy diaspora BVN enrolment location.",
      "CBN and NIBSS launched NRBVN as a voluntary remote option for non-resident Nigerians in May 2025.",
      "Verify current opening hours, fees and requirements with the official provider before travelling.",
    ],
    faqs: [
      {
        question: "Where is the official diaspora BVN enrolment point in Rome?",
        answer:
          "NIBSS currently lists Online Integrated Solutions S.R.L. at Via Sicilia 30, 00187 Rome. Always recheck NIBSS before travelling because provider details can change.",
      },
      {
        question: "Can I obtain a BVN remotely from Italy?",
        answer:
          "CBN says the NRBVN platform was launched with NIBSS to let Nigerians in the diaspora obtain a BVN remotely through digital verification. Confirm eligibility and current processing requirements on official channels.",
      },
      {
        question: "Does Liberty issue BVNs?",
        answer:
          "No. Liberty provides independent preparation support only and does not issue BVNs, access bank accounts or control official enrolment.",
      },
    ],
    currentProcessHeading: "Official BVN options for Nigerians in Italy",
    currentProcessIntro:
      "There are now two relevant official paths to check: NIBSS-listed diaspora enrolment in Rome and the CBN/NIBSS NRBVN remote platform for non-resident Nigerians.",
    currentProcessPoints: [
      "NIBSS lists a physical diaspora BVN enrolment location at Via Sicilia 30 in Rome.",
      "NRBVN is an official remote option for Nigerians abroad and uses digital identity/verification processes.",
      "Bank-specific account linkage, KYC updates and acceptance remain matters for the relevant financial institution.",
    ],
    guideHref: "/resources/bvn-support-italy",
    guideLabel: "Read the BVN preparation guide for Italy",
    officialResources: [
      {
        label: "NIBSS diaspora BVN enrolment locations",
        href: "https://nibss-plc.com.ng/bank-verification-numberbvn/diaspora-enrolment/",
      },
      {
        label: "CBN information on NRBVN",
        href: "https://www.cbn.gov.ng/AboutCBN/Reforms.html",
      },
    ],
    verifiedAt: "15 September 2026",
  },
  "national-population-commission-digital-certificate": {
    title: "NPC Digital Birth Certificate & Birth Attestation Support",
    seoTitle: "NPC Birth Attestation & Digital Certificate",
    seoDescription:
      "Get independent help preparing for NPC birth attestation, birth registration, certificate reissuance and digital birth certificate requests from Italy.",
    shortDescription:
      "Preparation support for NPC birth attestation, child birth registration, certificate reissuance and digital birth records for Nigerians in Italy.",
    longDescription:
      "Nigeria's National Population Commission now provides self-service digital routes for birth attestation, birth registration and certificate reissuance. Liberty helps applicants in Italy understand which route fits their age and record history, organise the information they need and avoid relying on older instructions.",
    highlight: "NPC digital birth-record preparation",
    whoThisIsFor: [
      "Adults aged 18 or over preparing an NPC birth attestation request.",
      "Parents or guardians checking birth registration for a child aged 0 to 17.",
      "People with an older NPC birth certificate who need the current digital certificate reissuance route.",
      "Diaspora applicants who need an NPC record as part of a passport, NIN or other identity process.",
    ],
    whatWeHelpWith: [
      "Identifying whether birth attestation, birth registration or certificate reissuance is the relevant current route.",
      "Preparing the identity information needed before using the NPC self-service system.",
      "Explaining current NIN-related requirements in plain language.",
      "Organising follow-up questions when an old record, temporary attestation number or identity mismatch is involved.",
    ],
    requiredDocuments: [
      "For adult Birth Attestation, NPC currently lists a NIN and court-sworn affidavit as requirements.",
      "For child Birth Registration, NPC currently describes a child NIN and parent attestation number, with separate guidance for a child who does not yet have a NIN.",
      "For old-certificate digital reissuance, an NPC account linked to NIN is part of the current self-service route.",
      "Only submit sensitive records through the appropriate official channel after confirming the route for your case.",
    ],
    processSteps: [
      "Identify the NPC service that matches your age and record situation.",
      "Check the current official requirements and make sure the names used match your NIN-linked identity where required.",
      "Create or access the official NPC self-service account and follow the selected service flow.",
      "Complete any required verification, payment and record steps on the official system.",
      "Download or reprint the approved certificate through the official dashboard when the option becomes available.",
    ],
    importantNotes: [
      "Liberty does not issue NPC certificates and cannot approve, modify or validate official NPC records.",
      "NPC currently says Birth Attestation is for people aged 18 and above, while Birth Registration covers ages 0 to 17.",
      "NPC says an old birth certificate can be moved to the digital system through Certificate Reissuance after account/NIN setup.",
      "Current NPC processes can change, so use the official FAQ/self-service instructions as the final authority.",
    ],
    faqs: [
      {
        question: "What is the difference between NPC Birth Attestation and Birth Registration?",
        answer:
          "NPC currently states that Birth Attestation is for people aged 18 and above, while Birth Registration is for children aged 0 to 17.",
      },
      {
        question: "How do I get a digital version of an old NPC birth certificate?",
        answer:
          "NPC currently directs holders of older certificates to the Certificate Reissuance service, with account creation and NIN linking as part of the process.",
      },
      {
        question: "Can Liberty issue or approve my NPC certificate?",
        answer:
          "No. Liberty can help you understand and prepare for the current process, but NPC controls its records, approvals, reissuance and certificates.",
      },
    ],
    currentProcessHeading: "Current NPC digital birth-record routes",
    currentProcessIntro:
      "NPC's current self-service guidance distinguishes adult birth attestation, child birth registration and certificate reissuance for older records.",
    currentProcessPoints: [
      "Adults aged 18+ use the Birth Attestation route; NPC currently lists NIN and a court-sworn affidavit among the requirements.",
      "Birth Registration covers ages 0-17, with parent/guardian identity requirements and specific guidance where the child has no NIN yet.",
      "Older birth certificates can be handled through the current Certificate Reissuance service to request a digital version.",
    ],
    guideHref: "/resources/npc-birth-attestation-digital-certificate-italy",
    guideLabel: "Read the NPC birth-record guide",
    officialResources: [
      {
        label: "National Population Commission self-service FAQs",
        href: "https://www.nationalpopulation.gov.ng/FAQs",
      },
      {
        label: "NPC vital registration FAQs",
        href: "https://www.nationalpopulation.gov.ng/faq-vitalreg",
      },
    ],
    verifiedAt: "15 September 2026",
  },
  "national-identification-number": {
    title: "NIN Registration Support in Rome & Italy",
    seoTitle: "NIN Registration Support Rome & Italy",
    seoDescription:
      "Prepare for NIN diaspora enrolment in Rome or elsewhere in Italy with independent identity-data and document guidance before the official NIMC process.",
    shortDescription:
      "Independent NIN registration preparation for Nigerians in Italy before using a licensed NIMC diaspora enrolment route.",
    longDescription:
      "NIMC runs a diaspora enrolment programme through licensed partners and active enrolment locations outside Nigeria. Liberty helps Nigerians in Italy organise consistent identity information, understand the preparation steps and verify the current official enrolment route before they travel or submit data.",
    highlight: "NIN diaspora registration preparation",
    whoThisIsFor: [
      "Nigerians in Italy preparing for first-time NIN enrolment.",
      "Applicants who need NIN before a Nigerian passport renewal or fresh passport process.",
      "Parents or guardians checking the appropriate diaspora route for a child.",
      "People with identity-data differences who need to prepare before official enrolment or modification.",
    ],
    whatWeHelpWith: [
      "Organising names, date and place of birth and other identity details before official enrolment.",
      "Explaining how NIMC's licensed diaspora-partner model differs from Liberty's independent support.",
      "Checking the current official enrolment-location directory before you make travel plans.",
      "Preparing questions where your NIN requirement connects to passport, BVN or NPC records.",
    ],
    requiredDocuments: [
      "Valid identity and supporting records required by the current licensed diaspora enrolment provider.",
      "Consistent personal details across the records you expect to use.",
      "Additional parent/guardian or child records where the official route requires them.",
      "Confirm the current document list with NIMC or the licensed provider before attending.",
    ],
    processSteps: [
      "Check NIMC's current diaspora information and active enrolment-location directory.",
      "Prepare consistent identity details and note any mismatch you need to explain.",
      "Confirm the appointment, fee and required-document rules with the licensed provider serving your location.",
      "Complete official biometric enrolment through the licensed NIMC route.",
      "Use official NIMC channels for issuance, updates, verification or record-specific questions.",
    ],
    importantNotes: [
      "Liberty is not NIMC and is not presented as an authorised NIN enrolment centre.",
      "NIMC says diaspora enrolment is delivered through licensed partners operating across Africa, Asia, Europe and America.",
      "NIMC maintains an active diaspora enrolment-location list; verify the current Italy location/provider before travelling.",
      "NIMC notes that Nigerians abroad can also enrol without a diaspora service fee when they are in Nigeria and otherwise meet the official requirements.",
    ],
    faqs: [
      {
        question: "Can Liberty issue or enrol me for a NIN?",
        answer:
          "No. Liberty provides independent preparation support. Official NIN enrolment is controlled by NIMC and its licensed enrolment channels.",
      },
      {
        question: "Does NIMC support NIN enrolment outside Nigeria?",
        answer:
          "Yes. NIMC states that its diaspora programme uses licensed partners and maintains a list of active enrolment locations outside Nigeria.",
      },
      {
        question: "Why should I verify the enrolment provider before travelling?",
        answer:
          "NIMC's active locations and licensed partners can change. Checking the official directory helps you avoid relying on an outdated or unauthorised provider.",
      },
    ],
    currentProcessHeading: "Current NIMC diaspora enrolment model",
    currentProcessIntro:
      "NIMC says Nigerians abroad are enrolled through licensed diaspora partners and publishes active locations for people to verify before attending.",
    currentProcessPoints: [
      "Use NIMC's official diaspora page and location directory to confirm the current provider for Italy.",
      "Treat any non-NIMC business as preparation support unless NIMC itself lists it as a licensed enrolment channel.",
      "If your NIN is needed for a passport or banking process, prepare the connected identity records before official enrolment.",
    ],
    guideHref: "/resources/nin-document-support-rome",
    guideLabel: "Read the NIN preparation guide",
    officialResources: [
      {
        label: "NIMC diaspora enrolment information",
        href: "https://nimc.gov.ng/diaspora/",
      },
    ],
    verifiedAt: "15 September 2026",
  },
};

export function getServiceGrowth(slug: ServiceSlug): ServiceGrowth | null {
  return SERVICE_GROWTH[slug] ?? null;
}

export function applyServiceGrowth(
  service: ServiceContent,
): ServiceContent {
  const growth = getServiceGrowth(service.slug);

  if (!growth) {
    return service;
  }

  return {
    ...service,
    title: growth.title,
    seoTitle: growth.seoTitle,
    seoDescription: growth.seoDescription,
    shortDescription: growth.shortDescription,
    longDescription: growth.longDescription,
    highlight: growth.highlight,
    whoThisIsFor: growth.whoThisIsFor,
    whatWeHelpWith: growth.whatWeHelpWith,
    requiredDocuments: growth.requiredDocuments,
    processSteps: growth.processSteps,
    importantNotes: growth.importantNotes,
    faqs: growth.faqs,
  };
}
