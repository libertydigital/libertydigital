export type ServiceSlug =
  | "nigeria-passport-online-registration"
  | "court-e-affidavit"
  | "national-identification-number"
  | "bank-verification-number"
  | "nigeria-e-visa"
  | "national-population-commission-digital-certificate";

export type ServiceFieldOption = {
  label: string;
  value: string;
};

export type ServiceField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "select";
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: ServiceFieldOption[];
};

export type ServiceContent = {
  title: string;
  slug: ServiceSlug;
  price: number;
  shortDescription: string;
  longDescription: string;
  oldWebsiteSourceSummary: string;
  whoThisIsFor: string[];
  whatWeHelpWith: string[];
  requiredDocuments: string[];
  processSteps: string[];
  importantNotes: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  formIntro: string;
  formFields: ServiceField[];
  seoTitle: string;
  seoDescription: string;
  ctaLabel: string;
  highlight: string;
};

export const BUSINESS_DETAILS = {
  name: "Liberty Digital Consulting Services",
  address: "Via Orazio 19, 00193, Rome, Italy",
  email: "contact@libertydigitalconsulting.com",
  phone: "+393533903464",
};

export const SITE_NAV_ITEMS = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/services", label: "Book now" },
];

export const SERVICES: ServiceContent[] = [
  {
    title: "Nigeria Passport Online Registration",
    slug: "nigeria-passport-online-registration",
    price: 0,
    shortDescription:
      "Guided support for passport registration, renewals, document review, and appointment readiness.",
    longDescription:
      "Get guided support with Nigerian passport online registration, renewal preparation, document review, and appointment readiness in Rome. Liberty Digital Consulting Services helps you prepare your details, review the required information, and get ready for the official online registration and biometric appointment process.",
    oldWebsiteSourceSummary:
      "The old website explains the online passport registration flow, common applicant categories, adult and minor requirements, special case documents, and the standard portal-based process through the Nigerian Immigration Service.",
    whoThisIsFor: [
      "First-time passport applicants.",
      "Applicants preparing for passport renewal.",
      "Lost, stolen, or damaged passport replacement requests.",
      "Applicants who need passport data updates, including name-change support after marriage.",
      "Parents or guardians handling minor passport applications.",
    ],
    whatWeHelpWith: [
      "Understanding the online registration steps before you begin.",
      "Preparing application details and supporting document checklists.",
      "Reviewing renewal and replacement requirements before submission.",
      "Helping you organise printed summaries, receipts, and appointment documents.",
      "Getting ready for biometric capture appointments at official passport centres.",
    ],
    requiredDocuments: [
      "Valid national ID if available.",
      "Birth certificate or age declaration.",
      "Recent passport-sized photographs.",
      "Proof of address.",
      "Previous passport for renewals, if available.",
      "Payment method for official application fees.",
      "For minors: birth certificate, parent identification, and any required consent documents.",
      "For special cases: police report, statutory declaration, marriage certificate, or other supporting records where applicable.",
    ],
    processSteps: [
      "Choose the passport support request that matches your situation.",
      "Submit your form so the team can review your request and supporting information.",
      "Receive guidance on the official online registration process and the documents you should prepare.",
      "Complete the official application, payment, and printout steps on the relevant government portal.",
      "Attend the biometric appointment with your required documents and keep copies of your receipts and summaries.",
    ],
    importantNotes: [
      "Liberty Digital Consulting Services does not issue passports and does not replace the official application process.",
      "Official fees depend on passport type and processing option.",
      "Processing times may vary by location and demand.",
      "Lost or stolen passport cases may require a police report or statutory declaration.",
      "Minor applications may require parent or guardian identification and signed consent documents.",
      "Keep clear copies of receipts, summaries, and appointment records.",
    ],
    faqs: [
      {
        question: "Can you issue a Nigerian passport directly?",
        answer:
          "No. Liberty Digital Consulting Services provides guidance and preparation support only. Passport issuance remains part of the official government process.",
      },
      {
        question: "Is this service suitable for renewals and replacements?",
        answer:
          "Yes. The old website content covers renewals, lost or stolen passport replacements, damaged passport replacements, and data updates.",
      },
      {
        question: "Do minors need extra documents?",
        answer:
          "Yes. Minor applications may require a birth certificate, parent identification, and consent documents where required.",
      },
    ],
    formIntro:
      "Tell us what you need help with. Once your request is submitted, the team will review your details and contact you with the next steps.",
    formFields: [
      {
        name: "applicationType",
        label: "Application type",
        type: "select",
        required: true,
        options: [
          { label: "First-time application", value: "First-time application" },
          { label: "Renewal", value: "Renewal" },
          {
            label: "Lost/stolen passport replacement",
            value: "Lost/stolen passport replacement",
          },
          {
            label: "Damaged passport replacement",
            value: "Damaged passport replacement",
          },
          {
            label: "Data update / name change",
            value: "Data update / name change",
          },
          { label: "Minor application", value: "Minor application" },
        ],
      },
      {
        name: "passportPages",
        label: "Preferred passport booklet",
        type: "select",
        required: true,
        options: [
          { label: "32-page", value: "32-page" },
          { label: "64-page", value: "64-page" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "hasPreviousPassport",
        label: "Do you have a previous passport?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not applicable", value: "Not applicable" },
        ],
      },
      {
        name: "preferredAppointmentDate",
        label: "Preferred appointment date",
        type: "date",
      },
      {
        name: "hasSupportingDocuments",
        label: "Do you already have the supporting documents?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
    ],
    seoTitle: "Nigeria Passport Online Registration Support in Rome",
    seoDescription:
      "Get guided support with Nigerian passport online registration, renewal preparation, document guidance, and appointment readiness in Rome.",
    ctaLabel: "Request Passport Support",
    highlight: "Biometric appointment readiness",
  },
  {
    title: "Court E-Affidavit",
    slug: "court-e-affidavit",
    price: 30,
    shortDescription:
      "Document preparation support for court e-affidavit requests with clear guidance and legal-care disclaimers.",
    longDescription:
      "Request support with court e-affidavit document preparation. Liberty Digital Consulting Services helps you organise the facts, supporting details, and submission information needed for a court e-affidavit request before you proceed to authorised swearing or legal review where necessary.",
    oldWebsiteSourceSummary:
      "The old website includes a general Nigerian court affidavit template covering deponent details, claim facts, annexures, and sworn declarations before an authorised officer.",
    whoThisIsFor: [
      "Applicants who need help preparing court e-affidavit request information.",
      "Individuals who need guidance on structuring facts and supporting annexures.",
      "People who want a clearer preparation workflow before swearing an affidavit.",
    ],
    whatWeHelpWith: [
      "Organising affidavit purpose details and deponent information.",
      "Preparing case background facts in a clear, readable format.",
      "Identifying where supporting annexures may be needed.",
      "Helping you prepare for the next official or professional review step.",
    ],
    requiredDocuments: [
      "Deponent details.",
      "Purpose of the affidavit.",
      "Relevant facts and background information.",
      "Supporting annexures where applicable.",
      "Any jurisdiction or state information relevant to the request.",
    ],
    processSteps: [
      "Submit the purpose of the affidavit and the facts you want reviewed.",
      "Liberty Digital Consulting Services reviews the request details and supporting context.",
      "You receive guidance on preparing the affidavit information and referenced annexures.",
      "The final affidavit should be sworn before a Commissioner for Oaths, Notary Public, or authorised officer where required.",
    ],
    importantNotes: [
      "This service does not replace legal advice.",
      "For complex or significant legal matters, consult a qualified Nigerian lawyer.",
      "Bracketed or placeholder sections should be completed with specific facts before any formal use.",
      "Referenced annexures should be clearly labelled and attached where applicable.",
      "Where the deponent is illiterate, interpretation and attestation rules must be observed.",
    ],
    faqs: [
      {
        question: "Does this service replace legal advice?",
        answer:
          "No. This service is for preparation support only. For complex or significant legal matters, consult a qualified Nigerian lawyer.",
      },
      {
        question: "Can I use this for any affidavit type?",
        answer:
          "The old website template is presented as a general guide. Suitability depends on your specific facts and legal context.",
      },
      {
        question: "Do supporting documents matter?",
        answer:
          "Yes. Where annexures are referenced, they should be attached and clearly labelled.",
      },
    ],
    formIntro:
      "Tell us what you need help with. Once your request is submitted, the team will review your details and contact you with the next steps.",
    formFields: [
      {
        name: "affidavitPurpose",
        label: "Affidavit purpose",
        type: "text",
        required: true,
        placeholder: "Example: name correction, declaration, supporting statement",
      },
      {
        name: "jurisdictionOrState",
        label: "Jurisdiction or state",
        type: "text",
        required: true,
      },
      {
        name: "deponentName",
        label: "Name of deponent",
        type: "text",
        required: true,
      },
      {
        name: "needsLegalReview",
        label: "Do you think legal review may be needed?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "hasSupportingDocuments",
        label: "Do you have supporting documents?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        name: "preferredCompletionDate",
        label: "Preferred completion date",
        type: "date",
      },
    ],
    seoTitle: "Court E-Affidavit Support | Liberty Digital Consulting",
    seoDescription:
      "Request support with court e-affidavit preparation. Submit your details and Liberty Digital Consulting Services will contact you with next steps.",
    ctaLabel: "Request Affidavit Support",
    highlight: "Preparation support only",
  },
  {
    title: "National Identification Number (NIN)",
    slug: "national-identification-number",
    price: 100,
    shortDescription:
      "Support with preparing for NIN registration, updates, and NIN-related documentation requirements.",
    longDescription:
      "Get support with preparing for NIN registration or NIN-related documentation requirements in Rome. Liberty Digital Consulting Services helps you understand the required information, supporting documents, and next-step preparation for this identity-related process.",
    oldWebsiteSourceSummary:
      "The old website describes NIN as a unique identity number used for identity verification across public and private services, and highlights security, privacy, and correction considerations.",
    whoThisIsFor: [
      "Individuals preparing for new NIN registration support.",
      "Applicants who need NIN-related update guidance.",
      "People who need help understanding the supporting documents involved in NIN-related processes.",
    ],
    whatWeHelpWith: [
      "Preparing for NIN registration or update-related steps.",
      "Reviewing the supporting details you may need before attending official enrolment processes.",
      "Explaining NIN-related documentation requirements in practical terms.",
      "Helping you identify whether an NPC digital certificate may be relevant to your request.",
    ],
    requiredDocuments: [
      "Personal identification details.",
      "Any existing Nigerian ID information if available.",
      "Supporting documentation relevant to the request type.",
      "NPC digital certificate information where applicable.",
      "For applicants under 16, call the centre before booking.",
    ],
    processSteps: [
      "Choose the NIN-related support request that best matches your situation.",
      "Submit your request details so the team can review them.",
      "Receive guidance on what information and documents you should prepare.",
      "Follow the next-step instructions for the relevant official process or appointment.",
    ],
    importantNotes: [
      "Liberty Digital Consulting Services does not issue NIN directly.",
      "NIN is described on the old website as a unique government-issued identifier used for identity verification.",
      "Data accuracy and correction matter, so information should be prepared carefully.",
      "For children under 16, please call the centre before booking.",
    ],
    faqs: [
      {
        question: "Do you issue NIN directly?",
        answer:
          "No. Liberty Digital Consulting Services provides preparation support and guidance only.",
      },
      {
        question: "Why is the NPC digital certificate mentioned?",
        answer:
          "The old website states that the NPC digital certificate is compulsory for NIN registration, so it may be relevant to your preparation.",
      },
      {
        question: "Can you help if I am not sure what type of NIN request I need?",
        answer:
          "Yes. Use the service-specific form and choose the “Not sure” option where available so the team can review your situation.",
      },
    ],
    formIntro:
      "Tell us what you need help with. Once your request is submitted, the team will review your details and contact you with the next steps.",
    formFields: [
      {
        name: "requestType",
        label: "Request type",
        type: "select",
        required: true,
        options: [
          {
            label: "New NIN registration support",
            value: "New NIN registration support",
          },
          { label: "NIN update support", value: "NIN update support" },
          {
            label: "NIN-related document guidance",
            value: "NIN-related document guidance",
          },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "hasNigerianId",
        label: "Do you already have a Nigerian ID?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "hasNPCDigitalCertificate",
        label: "Do you have the NPC digital certificate?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "applicantAgeGroup",
        label: "Applicant age group",
        type: "select",
        required: true,
        options: [
          { label: "Adult", value: "Adult" },
          { label: "Child under 16", value: "Child under 16" },
        ],
      },
      {
        name: "preferredAppointmentDate",
        label: "Preferred appointment date",
        type: "date",
      },
    ],
    seoTitle: "NIN Registration Support in Rome | Liberty Digital Consulting",
    seoDescription:
      "Get support with NIN registration preparation, NIN-related guidance, and required document readiness in Rome.",
    ctaLabel: "Request NIN Support",
    highlight: "NIN-related document readiness",
  },
  {
    title: "Bank Verification Number (BVN)",
    slug: "bank-verification-number",
    price: 100,
    shortDescription:
      "Support with BVN registration guidance and banking identity verification preparation.",
    longDescription:
      "Get support with BVN registration guidance and banking identity verification preparation. Liberty Digital Consulting Services helps you organise the basic details and documents you may need before the relevant banking or identity-verification process.",
    oldWebsiteSourceSummary:
      "The old website explains BVN as a biometric-linked banking identity number used across financial institutions for customer verification, fraud prevention, compliance, and related banking checks.",
    whoThisIsFor: [
      "Individuals preparing for new BVN registration support.",
      "People dealing with an existing BVN-related issue.",
      "Applicants who need guidance on banking identity verification preparation.",
    ],
    whatWeHelpWith: [
      "Preparing your details before BVN-related registration or verification steps.",
      "Reviewing whether you have the right identification and banking information ready.",
      "Helping you organise request details before you proceed with the relevant bank-led process.",
    ],
    requiredDocuments: [
      "Basic personal information.",
      "Bank account details where applicable.",
      "Valid identification if available.",
      "Any existing BVN-related information if the request is about an existing issue.",
    ],
    processSteps: [
      "Choose the BVN-related support request that matches your situation.",
      "Submit your details through the service form.",
      "Liberty Digital Consulting Services reviews your request and contacts you with next-step guidance.",
      "Prepare your identification and bank-related documents before the relevant official or bank-led process.",
    ],
    importantNotes: [
      "Liberty Digital Consulting Services is not a bank and does not issue BVN directly.",
      "The old website describes BVN as a banking identity number linked to biometric verification.",
      "Availability, processes, and outcomes may depend on the relevant financial institution.",
      "Data accuracy and rectification processes matter for identity-linked records.",
    ],
    faqs: [
      {
        question: "Can Liberty issue my BVN directly?",
        answer:
          "No. Liberty Digital Consulting Services offers preparation support and guidance only.",
      },
      {
        question: "What if I already have a BVN problem?",
        answer:
          "Use the form to describe whether you need support for an existing BVN issue or general verification guidance.",
      },
      {
        question: "Is a bank account required?",
        answer:
          "The form asks about your current bank account status so the team can understand your situation more clearly.",
      },
    ],
    formIntro:
      "Tell us what you need help with. Once your request is submitted, the team will review your details and contact you with the next steps.",
    formFields: [
      {
        name: "requestType",
        label: "Request type",
        type: "select",
        required: true,
        options: [
          {
            label: "New BVN registration support",
            value: "New BVN registration support",
          },
          { label: "Existing BVN issue", value: "Existing BVN issue" },
          {
            label: "Banking identity verification guidance",
            value: "Banking identity verification guidance",
          },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "hasNigerianBankAccount",
        label: "Do you already have a Nigerian bank account?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "bankName",
        label: "Bank name",
        type: "text",
        placeholder: "If applicable",
      },
      {
        name: "hasValidIdentification",
        label: "Do you have valid identification?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "preferredAppointmentDate",
        label: "Preferred appointment date",
        type: "date",
      },
    ],
    seoTitle: "BVN Registration Support in Rome | Liberty Digital Consulting",
    seoDescription:
      "Get support with BVN registration guidance and banking identity verification preparation through Liberty Digital Consulting Services.",
    ctaLabel: "Request BVN Support",
    highlight: "Banking identity preparation",
  },
  {
    title: "Nigeria E-Visa",
    slug: "nigeria-e-visa",
    price: 330,
    shortDescription:
      "Support with Nigeria eVisa application preparation, travel document guidance, and visa-type selection.",
    longDescription:
      "Get support with Nigeria eVisa application preparation and document guidance. Liberty Digital Consulting Services helps you review the likely requirements, organise your travel documents, and prepare for the appropriate application route based on your situation.",
    oldWebsiteSourceSummary:
      "The old website explains Nigeria eVisa categories, broad eligibility considerations, common travel-document requirements, and notes that processing times and eligibility rules may vary.",
    whoThisIsFor: [
      "Travellers preparing for Nigeria tourism, business, transit, work, or other permitted travel support.",
      "Applicants who need help understanding likely eVisa documents before applying.",
      "People who are unsure which travel category best fits their request.",
    ],
    whatWeHelpWith: [
      "Reviewing visa-type information before submission.",
      "Preparing common travel and supporting document checklists.",
      "Helping you identify whether invitation, passport validity, or sponsorship documents may apply.",
      "Providing practical preparation support before you continue with the relevant application process.",
    ],
    requiredDocuments: [
      "Passport valid for at least 6 months.",
      "Recent passport-sized photograph.",
      "Invitation letter for business travel where applicable.",
      "Hotel reservation where applicable.",
      "Travel itinerary.",
      "Proof of funds where required.",
      "Return or onward travel ticket where applicable.",
      "Employment or sponsorship documents for work-related categories where applicable.",
    ],
    processSteps: [
      "Choose the visa type or select “Not sure” if you need guidance first.",
      "Submit your request with your nationality, travel purpose, and document readiness details.",
      "Liberty Digital Consulting Services reviews your request and contacts you with next-step guidance.",
      "Prepare the required travel documents before you proceed with the relevant application route.",
      "Present your passport, approval documents, and supporting records during travel or entry checks where required.",
    ],
    importantNotes: [
      "Visa eligibility and processing times may vary.",
      "Approval is not guaranteed.",
      "Some nationalities may be eligible for eVisa or visa-on-arrival pathways, while others may need embassy or consulate processing.",
      "Passport validity, document quality, and purpose-of-travel evidence should be reviewed carefully.",
      "The old website mentions 2 to 4 days, but processing times may vary and should not be treated as guaranteed.",
    ],
    faqs: [
      {
        question: "Can Liberty guarantee visa approval?",
        answer:
          "No. This service is for preparation support and guidance only. Approval is not guaranteed.",
      },
      {
        question: "Do all travellers qualify for the same route?",
        answer:
          "No. Eligibility may depend on nationality, visa category, and current rules.",
      },
      {
        question: "What if I do not know my visa type yet?",
        answer:
          "Choose the “Not sure” option in the form and provide your travel purpose so the team can review your request.",
      },
    ],
    formIntro:
      "Tell us what you need help with. Once your request is submitted, the team will review your details and contact you with the next steps.",
    formFields: [
      {
        name: "visaType",
        label: "Visa type",
        type: "select",
        required: true,
        options: [
          { label: "Tourist eVisa", value: "Tourist eVisa" },
          { label: "Business eVisa", value: "Business eVisa" },
          { label: "Transit eVisa", value: "Transit eVisa" },
          {
            label: "Work / Temporary Permit eVisa",
            value: "Work / Temporary Permit eVisa",
          },
          {
            label: "Diplomatic / Official eVisa",
            value: "Diplomatic / Official eVisa",
          },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "nationality",
        label: "Nationality",
        type: "text",
        required: true,
      },
      {
        name: "travelPurpose",
        label: "Purpose of travel",
        type: "text",
        required: true,
      },
      {
        name: "expectedTravelDate",
        label: "Expected travel date",
        type: "date",
      },
      {
        name: "hasInvitationLetter",
        label: "Do you have an invitation letter?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not applicable", value: "Not applicable" },
        ],
      },
      {
        name: "hasValidPassportSixMonths",
        label: "Is your passport valid for at least 6 months?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
    ],
    seoTitle: "Nigeria E-Visa Support | Liberty Digital Consulting",
    seoDescription:
      "Request support with Nigeria eVisa application preparation, travel document guidance, and visa-type selection.",
    ctaLabel: "Request E-Visa Support",
    highlight: "Travel document guidance",
  },
  {
    title: "National Population Commission Digital Certificate",
    slug: "national-population-commission-digital-certificate",
    price: 30,
    shortDescription:
      "Support with NPC digital certificate preparation for NIN-related documentation requirements.",
    longDescription:
      "Get support with NPC digital certificate preparation for NIN-related documentation requirements. Liberty Digital Consulting Services helps you prepare the relevant request details and supporting information before you continue with the appropriate official process.",
    oldWebsiteSourceSummary:
      "The old website states that the NPC Digital Certificate is compulsory for NIN registration and lists adult birth attestation, birth registration, and foreign birth notification as relevant categories.",
    whoThisIsFor: [
      "Adults who need NPC birth attestation support for NIN-related documentation.",
      "Applicants preparing for birth registration or foreign birth notification support.",
      "Parents or guardians who need guidance before booking for children under 16.",
    ],
    whatWeHelpWith: [
      "Explaining the listed NPC certificate categories on the old website.",
      "Preparing the request details before attending enrolment-related appointments.",
      "Helping you understand the documents you should have ready for the next step.",
      "Flagging child-under-16 booking considerations before you proceed.",
    ],
    requiredDocuments: [
      "The relevant NPC certificate request category details.",
      "Supporting personal or birth-related records relevant to the request.",
      "The digital NPC certificate and any other required documents before attending enrolment-related appointments.",
      "For children under 16, call the centre before booking.",
    ],
    processSteps: [
      "Choose the NPC digital certificate request type that best matches your situation.",
      "Submit your details for review.",
      "Liberty Digital Consulting Services reviews your request and contacts you with next-step guidance.",
      "Prepare the required documents before your enrolment-related or registration-related appointment.",
    ],
    importantNotes: [
      "The old website states that the NPC Digital Certificate is compulsory for NIN registration.",
      "For children under 16, please call the centre before booking.",
      "Have required documents ready before attending enrolment-related appointments.",
      "Wear a bright top for best NIN picture quality.",
      "The old website states that there are no refunds once details and biometrics are confirmed, taken, and submitted.",
      "Liberty Digital Consulting Services does not act as the National Population Commission.",
    ],
    faqs: [
      {
        question: "Is this relevant to NIN registration?",
        answer:
          "Yes. The old website states that the NPC Digital Certificate is compulsory for NIN registration.",
      },
      {
        question: "Should children under 16 follow the same process?",
        answer:
          "The old website specifically says children under 16 should call the centre before booking.",
      },
      {
        question: "Do I need to prepare documents in advance?",
        answer:
          "Yes. The old website advises applicants to have the digital NPC certificate and other required documents ready before appointments.",
      },
    ],
    formIntro:
      "Tell us what you need help with. Once your request is submitted, the team will review your details and contact you with the next steps.",
    formFields: [
      {
        name: "certificateType",
        label: "Certificate type",
        type: "select",
        required: true,
        options: [
          {
            label: "NPC Birth Attestation for adult",
            value: "NPC Birth Attestation for adult",
          },
          { label: "NPC Birth Registration", value: "NPC Birth Registration" },
          {
            label: "Foreign Birth Notification",
            value: "Foreign Birth Notification",
          },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "applicantAgeGroup",
        label: "Applicant age group",
        type: "select",
        required: true,
        options: [
          { label: "Adult", value: "Adult" },
          { label: "Child under 16", value: "Child under 16" },
        ],
      },
      {
        name: "isForNINRegistration",
        label: "Is this for NIN registration?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "preferredAppointmentDate",
        label: "Preferred appointment date",
        type: "date",
      },
    ],
    seoTitle: "NPC Digital Certificate Support for NIN Registration",
    seoDescription:
      "Get support with National Population Commission digital certificate preparation for NIN-related documentation requirements.",
    ctaLabel: "Request NPC Certificate Support",
    highlight: "NIN-related certificate preparation",
  },
];

export const SERVICES_BY_SLUG = Object.fromEntries(
  SERVICES.map((service) => [service.slug, service]),
) as Record<ServiceSlug, ServiceContent>;

export function getServiceBySlug(slug: string) {
  return SERVICES.find((service) => service.slug === slug) ?? null;
}

export const LEAD_STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "WAITING_FOR_DOCUMENTS",
  "APPOINTMENT_SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "LOST",
] as const;
