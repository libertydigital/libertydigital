export type ServiceSlug =
  | "nigeria-passport-online-registration"
  | "court-e-affidavit"
  | "national-identification-number"
  | "bank-verification-number"
  | "nigeria-e-visa"
  | "national-population-commission-digital-certificate"
  | "emergency-travel-certificate"
  | "nulla-osta-for-marriage"
  | "document-legalization-at-nigerian-embassy"
  | "certificate-of-nationality"
  | "citizenship-letter-to-questura"
  | "same-person-letter"
  | "family-income-document"
  | "letter-of-single"
  | "newspaper-publication"
  | "letter-to-prison"
  | "child-recognition-of-the-father-or-mother";

export type ServiceFieldOption = {
  label: string;
  value: string;
};

export type ServiceField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "file";
  placeholder?: string;
  description?: string;
  required?: boolean;
  options?: ServiceFieldOption[];
};

export type ServiceContent = {
  title: string;
  slug: ServiceSlug;
  shortLabel: string;
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
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const SERVICES: ServiceContent[] = [
  {
    title: "Nigeria Passport Online Registration",
    slug: "nigeria-passport-online-registration",
    shortLabel: "Passport",
    price: 0,
    shortDescription:
      "Professional NIS portal registration and biometric appointment preparation.",
    longDescription:
      "Navigating the Nigerian Immigration Service (NIS) portal requires technical precision. We provide professional data auditing and registration support for Nigerians in Italy, ensuring your application is processed without rejection or delay. From document verification to biometric appointment readiness at the Embassy, our consultancy streamlines the entire journey.",
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
          description:
            "Choose a Monday, Tuesday, or Wednesday only.",
        },
        {
          name: "passportNumber",
          label: "Passport number",
          type: "text",
          required: true,
          placeholder: "Enter your passport number",
        },
        {
          name: "passportPhotographs",
          label: "Upload passport photograph(s)",
          type: "file",
          required: true,
          description:
            "Required. Upload up to 2 passport photographs in JPG or PNG format.",
        },
        {
          name: "passportDataPage",
          label: "Upload passport data page",
          type: "file",
          required: true,
          description:
            "Required. Upload 1 passport data page in JPG, PNG, WEBP, or PDF format.",
        },
        {
          name: "birthCertificate",
          label: "Upload birth certificate",
          type: "file",
          required: true,
          description:
            "Required. Upload 1 birth certificate in JPG, PNG, WEBP, or PDF format.",
        },
        {
          name: "localStateOfOrigin",
          label: "Upload local state of origin document",
          type: "file",
          required: true,
          description:
            "Required. Upload 1 local state of origin document in JPG, PNG, WEBP, or PDF format.",
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
    seoTitle: "Nigeria Passport Support in Rome",
    seoDescription:
      "Get guided support with Nigerian passport online registration, renewal preparation, document guidance, and appointment readiness in Rome.",
    ctaLabel: "Request Passport Support",
    highlight: "Passport preparation support",
  },
  {
    title: "Court E-Affidavit",
    slug: "court-e-affidavit",
    shortLabel: "E-Affidavit",
    price: 30,
    shortDescription:
      "Structured preparation of e-affidavit declarations for official legal submission.",
    longDescription:
      "Legal documentation must be error-free. We assist in structuring your court e-affidavit request, organizing essential facts and supporting annexures for official swearing. Our service ensures that your declaration is prepared according to standard jurisdictional requirements, minimizing administrative pushback.",
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
    seoTitle: "Court E-Affidavit Support",
    seoDescription:
      "Request support with court e-affidavit preparation. Submit your details and Liberty Digital Consulting Services will contact you with next steps.",
    ctaLabel: "Request Affidavit Support",
    highlight: "Strategic Legal Preparation",
  },
  {
    title: "National Identification Number (NIN) Support in Rome",
    slug: "national-identification-number",
    shortLabel: "NIN",
    price: 100,
    shortDescription:
      "NIN preparation and identity-data support for Nigerian nationals living in Italy.",
    longDescription:
      "The National Identification Number (NIN) is an important Nigerian identity record. Our Rome-based consultancy provides preparation support, helping you review identity data and organise relevant documents before you continue with the appropriate official process.",
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
        name: "surname",
        label: "Surname",
        type: "text",
        required: true,
      },
      {
        name: "firstName",
        label: "First name",
        type: "text",
        required: true,
      },
      {
        name: "middleName",
        label: "Middle name",
        type: "text",
      },
      {
        name: "dateOfBirth",
        label: "Date of birth",
        type: "date",
        required: true,
      },
      {
        name: "placeOfBirth",
        label: "Place of birth",
        type: "text",
        required: true,
      },
      {
        name: "residentAddress",
        label: "Resident address",
        type: "textarea",
        required: true,
      },
      {
        name: "stateOfOrigin",
        label: "State of origin",
        type: "text",
        required: true,
      },
      {
        name: "lgaOfState",
        label: "LGA of state",
        type: "text",
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ],
      },
      {
        name: "height",
        label: "Height",
        type: "text",
        required: true,
      },
      {
        name: "maritalStatus",
        label: "Marital status",
        type: "text",
        required: true,
      },
      {
        name: "passportNumber",
        label: "Passport",
        type: "text",
        required: true,
        placeholder: "Passport number or passport details",
      },
      {
        name: "nextOfKin",
        label: "Next of kin",
        type: "text",
        required: true,
      },
      {
        name: "fatherFullName",
        label: "Father full name",
        type: "text",
        required: true,
      },
      {
        name: "motherFullName",
        label: "Mother full name",
        type: "text",
        required: true,
      },
      {
        name: "declarationDate",
        label: "Date",
        type: "date",
      },
      {
        name: "neverDoneNinBefore",
        label: "I have never done NIN before",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
    ],
    seoTitle: "NIN Support in Rome",
    seoDescription:
      "Get NIN document preparation and identity-data support in Rome before continuing with the appropriate official process.",
    ctaLabel: "Request NIN Support",
    highlight: "NIN document readiness",
  },
  {
    title: "Bank Verification Number (BVN) Support in Rome",
    slug: "bank-verification-number",
    shortLabel: "BVN",
    price: 100,
    shortDescription:
      "BVN preparation and banking identity support for Nigerian nationals living in Italy.",
    longDescription:
      "The Bank Verification Number (BVN) is used by Nigerian financial institutions for identity verification. Our Rome-based consultancy helps clients prepare relevant information, understand next steps, and organise records before working with the appropriate bank or authorised provider.",
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
      "Complete the BVN enrolment details below. The team will review your form and contact you with the next steps.",
    formFields: [
      {
        name: "surname",
        label: "Surname",
        type: "text",
        required: true,
      },
      {
        name: "firstName",
        label: "First name",
        type: "text",
        required: true,
      },
      {
        name: "middleName",
        label: "Middle name",
        type: "text",
      },
      {
        name: "customerId",
        label: "Customer ID",
        type: "text",
      },
      {
        name: "nationalIdentityNumber",
        label: "National identity number (NIN)",
        type: "text",
      },
      {
        name: "title",
        label: "Title",
        type: "select",
        required: true,
        options: [
          { label: "Mr", value: "Mr" },
          { label: "Mrs", value: "Mrs" },
          { label: "Miss", value: "Miss" },
          { label: "Other", value: "Other" },
        ],
      },
      {
        name: "maritalStatus",
        label: "Marital status",
        type: "select",
        required: true,
        options: [
          { label: "Single", value: "Single" },
          { label: "Married", value: "Married" },
          { label: "Widow", value: "Widow" },
          { label: "Widower", value: "Widower" },
          { label: "Divorced", value: "Divorced" },
          { label: "Separated", value: "Separated" },
        ],
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ],
      },
      {
        name: "dateOfBirth",
        label: "Date of birth",
        type: "date",
        required: true,
      },
      {
        name: "nationality",
        label: "Nationality",
        type: "text",
        required: true,
      },
      {
        name: "stateOfOrigin",
        label: "State of origin",
        type: "text",
        required: true,
      },
      {
        name: "lgaOfOrigin",
        label: "LGA of origin",
        type: "text",
        required: true,
      },
      {
        name: "residentialAddress",
        label: "Residential address",
        type: "textarea",
        required: true,
      },
      {
        name: "lgaOfResidence",
        label: "LGA of residence",
        type: "text",
        required: true,
      },
      {
        name: "stateOfResidence",
        label: "State of residence",
        type: "text",
        required: true,
      },
      {
        name: "landmarks",
        label: "Nearest bus stop / landmark",
        type: "text",
      },
      {
        name: "phoneNumber1",
        label: "Phone number 1",
        type: "text",
        required: true,
      },
      {
        name: "phoneNumber2",
        label: "Phone number 2",
        type: "text",
      },
      {
        name: "emailAddress",
        label: "Email address",
        type: "text",
      },
      {
        name: "locationOfCardCollection",
        label: "Location of card collection",
        type: "text",
        required: true,
      },
      {
        name: "signatureDate",
        label: "Date",
        type: "date",
        required: true,
      },
    ],
    seoTitle: "BVN Support in Rome",
    seoDescription:
      "Get BVN preparation and banking identity support in Rome before working with the appropriate bank or authorised provider.",
    ctaLabel: "Request BVN Support",
    highlight: "Banking identity preparation",
  },
  {
    title: "Nigeria E-Visa",
    slug: "nigeria-e-visa",
    shortLabel: "E-Visa",
    price: 330,
    shortDescription:
      "Support with Nigeria eVisa application preparation, travel document guidance, and visa-type selection.",
    longDescription:
      "Secure your travel to Nigeria with confidence. Navigating eVisa categories—from Business to Tourism—requires careful document preparation to meet NIS entry requirements. We provide a managed application flow, auditing your invitation letters, travel itineraries, and supporting documentation to ensure a high-quality submission and minimize the risk of visa denial.",
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
          name: "passportExpiryDate",
          label: "Passport expiry date",
          type: "date",
          required: true,
        },
        {
          name: "passportPhotographs",
          label: "Upload passport photograph(s)",
          type: "file",
        required: true,
        description:
          "Required. Upload passport photograph(s) in JPG or PNG format.",
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
      {
        name: "invitationLetterNigeria",
        label: "Invitation letter from family/friend in Nigeria",
        type: "file",
        required: true,
        description:
          "Upload invitation letter accepting immigration responsibility in PDF or JPG format.",
      },
      {
        name: "nigerianPassportHostResidencyPermit",
        label: "Nigerian Passport or Host Residency Permit",
        type: "file",
        required: true,
        description:
          "Copy of Nigerian Passport of the Host or Residency Permit (for Non-Nigerian hosts) in PDF or JPG format.",
      },
      {
        name: "validPassportCopy",
        label: "Copy of valid passport",
        type: "file",
        required: true,
        description:
          "Upload a copy of your valid passport (not less than 6 months validity) in PDF or JPG format.",
      },
      {
        name: "returnTicketEvidence",
        label: "Evidence of return ticket",
        type: "file",
        required: true,
        description:
          "Upload evidence of your return ticket in PDF or JPG format.",
      },
      {
        name: "hotelReservationHostAddress",
        label: "Hotel reservation or host address in Nigeria",
        type: "file",
        required: true,
        description:
          "Upload hotel reservation confirmation or host address documentation in PDF or JPG format.",
      },
      {
        name: "bankStatement180Days",
        label: "Bank statement (180 days)",
        type: "file",
        required: true,
        description:
          "Upload evidence of sufficient funds - 180 days bank statement in PDF or JPG format.",
      },
    ],
    seoTitle: "Nigeria E-Visa Support",
    seoDescription:
      "Request support with Nigeria eVisa application preparation, travel document guidance, and visa-type selection.",
    ctaLabel: "Request E-Visa Support",
    highlight: "Travel document guidance",
  },
  {
    title: "National Population Commission Digital Certificate",
    slug: "national-population-commission-digital-certificate",
    shortLabel: "NPC Certificate",
    price: 30,
    shortDescription:
      "Support with NPC digital certificate preparation for NIN-related documentation requirements.",
    longDescription:
      "Establishing your legal foundation is critical for NIMC registration. The National Population Commission (NPC) Digital Certificate is often a mandatory prerequisite for identity enrollment. We assist in the structured preparation of birth attestation and registration requests, ensuring your records are digitally captured according to official standards before you proceed with higher-level documentation.",
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
    seoTitle: "NPC Digital Certificate Support",
    seoDescription:
      "Get support with National Population Commission digital certificate preparation for NIN-related documentation requirements.",
    ctaLabel: "Request NPC Certificate Support",
    highlight: "NIN-related certificate preparation",
  },
  {
    title: "Emergency Travel Certificate (ETC)",
    slug: "emergency-travel-certificate",
    shortLabel: "ETC",
    price: 0,
    shortDescription:
      "Preparation support for emergency travel certificate requests when urgent return-travel documentation is needed.",
    longDescription:
      "When urgent travel is required and your passport is unavailable, time and accuracy are of the essence. We provide prioritized assistance for Emergency Travel Certificate (ETC) preparation, helping you organize the necessary police reports, identity proofs, and travel itineraries required for consular approval and your safe return to Nigeria.",
    oldWebsiteSourceSummary:
      "Service requested by the business owner. Official Nigerian consular pages list the Emergency Travel Certificate as a passport-related consular service.",
    whoThisIsFor: [
      "Travellers who urgently need return-travel documentation.",
      "Applicants whose passport situation may affect immediate travel plans.",
      "People who need help preparing their details before approaching the relevant consular process.",
    ],
    whatWeHelpWith: [
      "Reviewing the reason for the emergency travel request before submission.",
      "Preparing identity, travel, and passport details in a clear format.",
      "Helping you organise supporting records before the official ETC process.",
      "Providing next-step guidance on what to keep ready before follow-up.",
    ],
    requiredDocuments: [
      "Full personal details.",
      "Passport information if available.",
      "Reason for emergency travel.",
      "Expected travel date or urgency details.",
      "Supporting identification or travel records relevant to the request.",
    ],
    processSteps: [
      "Submit your emergency travel request with your identity and travel details.",
      "Liberty Digital Consulting Services reviews the request and supporting context.",
      "You receive guidance on what records and next steps should be prepared.",
      "Proceed with the relevant official ETC process using the prepared information.",
    ],
    importantNotes: [
      "Liberty Digital Consulting Services does not issue travel certificates directly.",
      "This service is for preparation support and guidance only.",
      "Final approval, issuance, and travel acceptance remain part of the relevant official process.",
      "Applicants should prepare accurate identity and travel details before submission.",
    ],
    faqs: [
      {
        question: "Do you issue the Emergency Travel Certificate directly?",
        answer:
          "No. Liberty Digital Consulting Services offers preparation support only. Issuance remains part of the official consular process.",
      },
      {
        question: "Can this help if my travel is urgent?",
        answer:
          "Yes. The service is intended to help you organise urgent travel-request information before the official ETC process.",
      },
      {
        question: "Do I need my old passport details?",
        answer:
          "If available, passport details can help the team review your request more clearly.",
      },
    ],
    formIntro:
      "Tell us why you need an Emergency Travel Certificate and what documents you already have. The team will review your request and contact you with the next steps.",
    formFields: [
      {
        name: "declarantTitle",
        label: "Title",
        type: "select",
        required: true,
        options: [
          { label: "Mr", value: "Mr" },
          { label: "Mrs", value: "Mrs" },
          { label: "Miss", value: "Miss" },
        ],
      },
      {
        name: "declarantFullName",
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        name: "birthPlace",
        label: "Born at",
        type: "text",
        required: true,
      },
      {
        name: "birthDate",
        label: "Date of birth",
        type: "date",
        required: true,
      },
      {
        name: "residentCityInItaly",
        label: "Resident in Italy (City)",
        type: "text",
        required: true,
      },
      {
        name: "residentStreetInItaly",
        label: "Via/Piazza/Corso",
        type: "text",
        required: true,
      },
      {
        name: "streetNumber",
        label: "Street number",
        type: "text",
      },
      {
        name: "lostPassportNumber",
        label: "Lost passport number",
        type: "text",
        required: true,
      },
      {
        name: "passportIssuePlace",
        label: "Passport issued at",
        type: "text",
      },
      {
        name: "passportIssueDate",
        label: "Passport issue date",
        type: "date",
      },
      {
        name: "passportLostLocation",
        label: "Where was the passport lost?",
        type: "text",
        required: true,
      },
      {
        name: "passportLostDate",
        label: "When was the passport lost?",
        type: "date",
      },
      {
        name: "policeReportDate",
        label: "Police report date",
        type: "date",
      },
      {
        name: "flightName",
        label: "Flight name",
        type: "text",
      },
      {
        name: "flightNumber",
        label: "Flight number",
        type: "text",
      },
      {
        name: "travelDate",
        label: "Travel date",
        type: "date",
      },
      {
        name: "declarationDate",
        label: "Date",
        type: "date",
      },
      {
        name: "hasTwoPhotographs",
        label: "Do you have two passport-size photographs?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        name: "passportPhotographs",
        label: "Upload passport photograph(s)",
        type: "file",
        required: true,
        description:
          "Required. Upload up to 2 passport-size photographs in JPG or PNG format.",
      },
    ],
    seoTitle: "Emergency Travel Certificate",
    seoDescription:
      "Request preparation support for Emergency Travel Certificate (ETC) applications and urgent travel-document readiness in Rome.",
    ctaLabel: "Request ETC Support",
    highlight: "Urgent travel-document support",
  },
  {
    title: "Nulla Osta for Marriage",
    slug: "nulla-osta-for-marriage",
    shortLabel: "Marriage",
    price: 0,
    shortDescription:
      "Preparation support for marriage no-impediment documentation and next-step readiness in Italy.",
    longDescription:
      "International marriage in Italy involves complex legal clearances. The Nulla Osta is a vital document confirming your legal capacity to marry. Our consultancy guides you through the rigorous preparation of personal declarations and parent information, ensuring your paperwork meets the high standards required by both the Nigerian Embassy and Italian civil registries.",
    oldWebsiteSourceSummary:
      "Service requested by the business owner. Official Italian guidance explains that foreign citizens marrying in Italy may need a nulla osta confirming there is no legal impediment to the marriage.",
    whoThisIsFor: [
      "Foreign citizens preparing to marry in Italy.",
      "Applicants who need help organising marriage-clearance request details.",
      "Couples who want clearer preparation before the official marriage-document process.",
    ],
    whatWeHelpWith: [
      "Reviewing the purpose of the marriage-clearance request.",
      "Preparing personal and relationship details before submission.",
      "Helping you identify supporting records that may be relevant to your case.",
      "Providing practical next-step guidance before the official process continues.",
    ],
    requiredDocuments: [
      "Full applicant details.",
      "Partner details where applicable.",
      "Intended marriage location or municipality.",
      "Expected marriage date if known.",
      "Supporting identity or civil-status records relevant to the request.",
    ],
    processSteps: [
      "Submit your marriage-clearance request details and supporting context.",
      "Liberty Digital Consulting Services reviews the information provided.",
      "You receive guidance on the details and records to prepare next.",
      "Proceed with the relevant official nulla osta or marriage-document process.",
    ],
    importantNotes: [
      "Liberty Digital Consulting Services does not issue marriage-clearance documents directly.",
      "This service is for preparation support and guidance only.",
      "Final acceptance and issuance remain part of the relevant official process.",
      "Applicants should prepare accurate civil-status and identity information before submission.",
    ],
    faqs: [
      {
        question: "Do you issue the Nulla Osta directly?",
        answer:
          "No. Liberty Digital Consulting Services provides preparation support only. Issuance remains part of the official process.",
      },
      {
        question: "Is this only for people marrying in Italy?",
        answer:
          "This page is positioned for applicants preparing marriage-clearance documentation in Italy.",
      },
      {
        question: "Can you help if I am unsure which records I need?",
        answer:
          "Yes. Submit your request details and the team can guide you on the next preparation steps.",
      },
    ],
    formIntro:
      "Tell us about your marriage-clearance request. The team will review your details and contact you with the next steps.",
    formFields: [
      {
        name: "neverPreviouslyMarried",
        label: "I was not previously married",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        name: "previouslyMarriedDivorcedOrWidow",
        label: "I was previously married but divorced/widow",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        name: "declarationNeededForRecordPurposes",
        label: "This declaration is needed for record purposes",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        name: "surname",
        label: "Surname",
        type: "text",
        required: true,
      },
      {
        name: "names",
        label: "Name(s)",
        type: "text",
        required: true,
      },
      {
        name: "dateOfBirth",
        label: "Date of birth",
        type: "date",
        required: true,
      },
      {
        name: "placeOfBirth",
        label: "Place of birth",
        type: "text",
        required: true,
      },
      {
        name: "sex",
        label: "Sex",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ],
      },
      {
        name: "nationality",
        label: "Nationality",
        type: "text",
        required: true,
      },
      {
        name: "fatherNames",
        label: "Father's surname/name(s)",
        type: "text",
        required: true,
      },
      {
        name: "motherNames",
        label: "Mother's surname/name(s)",
        type: "text",
        required: true,
      },
      {
        name: "passportOrCertificateOfNationality",
        label: "Passport No. / Certificate of Nationality",
        type: "text",
        required: true,
      },
      {
        name: "dateIssued",
        label: "Date issued",
        type: "date",
      },
      {
        name: "placeOfIssue",
        label: "Place of issue",
        type: "text",
      },
        {
          name: "expiryDate",
          label: "Expiry date",
          type: "date",
        },
        {
          name: "passportPhotographWhiteBackground",
          label: "Upload passport photograph with white background",
          type: "file",
          required: true,
          description:
            "Required. Upload 1 passport photograph with white background in JPG or PNG format.",
        },
        {
          name: "internationalPassportDataPage",
          label: "Upload international passport data page",
          type: "file",
          required: true,
          description:
            "Required. Upload the passport data page in JPG or PNG format.",
        },
        {
          name: "addressInNigeria",
          label: "Address in Nigeria",
          type: "textarea",
        required: true,
      },
      {
        name: "addressInItaly",
        label: "Address in Italy",
        type: "textarea",
        required: true,
      },
      {
        name: "profession",
        label: "Profession",
        type: "text",
      },
      {
        name: "civilStatus",
        label: "Civil status",
        type: "text",
      },
      {
        name: "partnerSurname",
        label: "Getting married to: surname",
        type: "text",
        required: true,
      },
      {
        name: "partnerNames",
        label: "Getting married to: name(s)",
        type: "text",
        required: true,
      },
      {
        name: "partnerPlaceOfBirth",
        label: "Getting married to: place of birth",
        type: "text",
        required: true,
      },
        {
          name: "partnerDateOfBirth",
          label: "Getting married to: date of birth",
          type: "date",
          required: true,
        },
        {
          name: "partnerValidIdCard",
          label: "Getting married to: upload valid ID card (front and back)",
          type: "file",
          required: true,
          description:
            "Required. Upload both the front and back of the valid ID card in JPG or PNG format.",
        },
      ],
    seoTitle: "Nulla Osta for Marriage",
    seoDescription:
      "Request preparation support for Nulla Osta for Marriage documentation and next-step readiness in Italy.",
    ctaLabel: "Request Marriage Support",
    highlight: "Marriage-clearance preparation",
  },
  {
    title: "Document Legalization at the Nigerian Embassy",
    slug: "document-legalization-at-nigerian-embassy",
    shortLabel: "Legalization",
    price: 0,
    shortDescription:
      "Preparation support for document legalization requests before submission to the Nigerian Embassy.",
    longDescription:
      "Ensure your Nigerian documents carry legal weight in Italy and beyond. Legalization at the Embassy is essential for the validity of affidavits, certificates, and legal letters. We audit your documentation for correctness and organization, preparing a professional submission package that meets current consular requirements for official authentication.",
    oldWebsiteSourceSummary:
      "Service requested by the business owner. Official Nigerian embassy pages list legalization of documents as a consular service with defined submission requirements.",
    whoThisIsFor: [
      "Applicants who need documents prepared for embassy legalization.",
      "Individuals or families handling official document-use requirements involving the Nigerian Embassy.",
      "People who want clearer preparation before submitting legalization requests.",
    ],
    whatWeHelpWith: [
      "Identifying the document type and purpose of legalization.",
      "Preparing document and applicant details before submission.",
      "Helping you organise supporting records before the official embassy process.",
      "Providing next-step guidance for a cleaner submission workflow.",
    ],
    requiredDocuments: [
      "Document to be legalized.",
      "Type of document.",
      "Purpose of legalization.",
      "Country or institution where the document will be used.",
      "Supporting identity or submission records where applicable.",
    ],
    processSteps: [
      "Submit your document-legalization request details.",
      "Liberty Digital Consulting Services reviews the document type and purpose.",
      "You receive guidance on the records and next steps to prepare.",
      "Proceed with the relevant official embassy legalization process.",
    ],
    importantNotes: [
      "Liberty Digital Consulting Services does not legalize documents directly.",
      "This service is for preparation support and guidance only.",
      "Final review, acceptance, fees, and legalization remain part of the official embassy process.",
      "Applicants should ensure documents and personal details are accurate before submission.",
    ],
    faqs: [
      {
        question: "Do you legalize documents directly?",
        answer:
          "No. Liberty Digital Consulting Services provides preparation support only. Legalization remains part of the official embassy process.",
      },
      {
        question: "Can this help with different document types?",
        answer:
          "Yes. Use the form to describe the document type and purpose so the team can review your request.",
      },
      {
        question: "Should I already know where the document will be used?",
        answer:
          "If you know the destination country or institution, include it. That helps the team understand the request more clearly.",
      },
    ],
    formIntro:
      "Tell us what document you need legalized and why. The team will review your request and contact you with the next steps.",
    formFields: [
      {
        name: "documentType",
        label: "Document type",
        type: "text",
        required: true,
        placeholder: "Example: birth record, affidavit, certificate, letter",
      },
      {
        name: "legalizationPurpose",
        label: "Purpose of legalization",
        type: "text",
        required: true,
      },
        {
          name: "destinationInstitutionOrCountry",
          label: "Destination institution or country",
          type: "text",
        },
        {
          name: "documentsToLegalize",
          label: "Upload document(s) for legalization",
          type: "file",
          description:
            "Optional. Upload up to 4 scanned documents in JPG or PNG format if you want the team to review them.",
        },
        {
          name: "documentCount",
          label: "Number of documents",
          type: "select",
        required: true,
        options: [
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "More than 3", value: "More than 3" },
        ],
      },
      {
        name: "hasOriginalDocumentsReady",
        label: "Do you have the original documents ready?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Partly", value: "Partly" },
        ],
      },
    ],
    seoTitle: "Document Legalization Support",
    seoDescription:
      "Request preparation support for document legalization submissions to the Nigerian Embassy.",
    ctaLabel: "Request Legalization Support",
    highlight: "Embassy document preparation",
  },
  {
    title: "Certificate of Nationality",
    slug: "certificate-of-nationality",
    shortLabel: "Nationality",
    price: 0,
    shortDescription:
      "Preparation support for certificate of nationality and statutory declaration of nationality requests.",
    longDescription:
      "Proving your citizenship is often the first step in complex administrative processes. We provide specialized support for the Statutory Declaration of Nationality, helping you accurately document your lineage, state of origin, and identity details. Our structured preparation ensures your declaration is consistent with official records for seamless embassy processing.",
    oldWebsiteSourceSummary:
      "Built directly from the provided Certificate of Nationality / Statutory Declaration of Nationality form.",
    whoThisIsFor: [
      "Applicants who need a certificate of nationality request prepared.",
      "People asked to provide nationality confirmation records.",
      "Applicants who want a cleaner, form-based preparation process before official submission.",
    ],
    whatWeHelpWith: [
      "Preparing the personal and family details required on the nationality form.",
      "Reviewing address, profession, and civil-status information before submission.",
      "Helping you organise declaration details in the same structure as the provided form.",
      "Providing next-step readiness before the official process continues.",
    ],
    requiredDocuments: [
      "Surname and name(s).",
      "Date and place of birth.",
      "Sex.",
      "Father's and mother's names.",
      "Address in Nigeria.",
      "Address in Italy and telephone number.",
      "Profession and civil status.",
      "Supporting photographs where required.",
    ],
    processSteps: [
      "Submit the details requested on the certificate of nationality form.",
      "Liberty Digital Consulting Services reviews the form data for completeness.",
      "You receive guidance on any missing details and next-step preparation.",
      "Proceed with the relevant official nationality-document process.",
    ],
    importantNotes: [
      "This service is for preparation support only.",
      "Final acceptance, signature, oath, and issuance remain part of the official process.",
      "The form indicates capital-letter completion and supporting photographs.",
    ],
    faqs: [
      {
        question: "Do you issue the certificate of nationality directly?",
        answer:
          "No. Liberty Digital Consulting Services prepares the request details, but issuance remains part of the official process.",
      },
      {
        question: "Do I need family information for this request?",
        answer:
          "Yes. The provided form includes both father's and mother's names.",
      },
      {
        question: "Is this based on the actual form?",
        answer:
          "Yes. The field structure on this page is based directly on the provided PDF form.",
      },
    ],
    formIntro:
      "Tell us the details required for the certificate of nationality form. The team will review your request and contact you with the next steps.",
    formFields: [
      { name: "surname", label: "Surname", type: "text", required: true },
      { name: "names", label: "Name(s)", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of birth", type: "date", required: true },
      { name: "placeOfBirth", label: "Place of birth", type: "text", required: true },
      {
        name: "sex",
        label: "Sex",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ],
      },
      { name: "fatherNames", label: "Father's surname/name(s)", type: "text", required: true },
      { name: "motherNames", label: "Mother's surname/name(s)", type: "text", required: true },
      { name: "addressInNigeria", label: "Address in Nigeria", type: "textarea", required: true },
      {
        name: "addressInItalyAndPhone",
        label: "Address in Italy & telephone number",
        type: "textarea",
        required: true,
      },
      { name: "profession", label: "Profession", type: "text" },
      { name: "civilStatus", label: "Civil status", type: "text" },
      {
        name: "hasTwoPassportPhotographs",
        label: "Do you have two passport-size photographs?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
      },
      {
        name: "passportPhotographs",
        label: "Upload passport photograph(s)",
        type: "file",
        required: true,
        description:
          "Required. Upload up to 2 passport-size photographs in JPG or PNG format.",
      },
    ],
    seoTitle: "Certificate of Nationality",
    seoDescription:
      "Request preparation support for certificate of nationality and declaration of nationality forms in Rome.",
    ctaLabel: "Request Nationality Support",
    highlight: "Nationality-form preparation",
  },
  {
    title: "Citizenship Letter to Questura",
    slug: "citizenship-letter-to-questura",
    shortLabel: "Citizenship",
    price: 0,
    shortDescription:
      "Preparation support for the citizenship declaration letter used for Italian citizenship-related administrative purposes.",
    longDescription:
      "Navigating Italian administrative requirements at the Questura often necessitates official confirmation of your Nigerian status. We assist in preparing specialized citizenship letters and declarations, ensuring your passport history and residence details are professionally organized to support your applications for Italian residency or citizenship.",
    oldWebsiteSourceSummary:
      "Built directly from the provided Citizenship / Cittadinanza declaration of oath form.",
    whoThisIsFor: [
      "Applicants preparing citizenship-related paperwork involving Italian authorities.",
      "People asked to provide a declaration linked to citizenship processing.",
      "Applicants who want a cleaner preparation workflow before official submission.",
    ],
    whatWeHelpWith: [
      "Preparing the declaration details shown on the citizenship form.",
      "Reviewing passport, residence, and city information before submission.",
      "Helping you structure the request clearly before the official process continues.",
      "Providing practical next-step readiness based on the form.",
    ],
    requiredDocuments: [
      "Surname and name(s).",
      "Birthplace in Nigeria and date of birth.",
      "Passport number, issue place, and issue date.",
      "Residence city and street address in Italy.",
      "Relevant citizenship-request context.",
    ],
    processSteps: [
      "Submit the identity and declaration details required on the citizenship form.",
      "Liberty Digital Consulting Services reviews the form for completeness and clarity.",
      "You receive guidance on any missing records and next steps.",
      "Proceed with the relevant official citizenship-related process.",
    ],
    importantNotes: [
      "This service is for preparation support only.",
      "Final oath, signature, acceptance, and administrative outcome remain part of the official process.",
      "The provided form references citizenship-office and police certificate context.",
    ],
    faqs: [
      {
        question: "Is this the actual citizenship approval process?",
        answer:
          "No. This service helps prepare the declaration form only. The official process remains with the relevant authorities.",
      },
      {
        question: "Does the form ask for passport details?",
        answer:
          "Yes. The provided form includes passport number, issue place, and issue date fields.",
      },
      {
        question: "Is this based on the PDF you provided?",
        answer:
          "Yes. The field structure on this page is based directly on the provided form.",
      },
    ],
    formIntro:
      "Tell us the details required for the citizenship declaration form. The team will review your request and contact you with the next steps.",
    formFields: [
      { name: "surname", label: "Surname", type: "text", required: true },
      { name: "names", label: "Name(s)", type: "text", required: true },
      { name: "birthPlaceInNigeria", label: "Born in (Nigeria)", type: "text", required: true },
      { name: "dateOfBirth", label: "Date of birth", type: "date", required: true },
      { name: "passportNumber", label: "Passport number", type: "text", required: true },
      { name: "passportIssuePlace", label: "Passport issued at", type: "text", required: true },
      { name: "passportIssueDate", label: "Passport issue date", type: "date", required: true },
      { name: "residentCityInItaly", label: "Resident in Italy (City)", type: "text", required: true },
      { name: "residentStreetInItaly", label: "Via", type: "text", required: true },
      { name: "streetNumber", label: "Street number", type: "text" },
    ],
    seoTitle: "Questura Citizenship Letter",
    seoDescription:
      "Request preparation support for the citizenship declaration letter used for Italian administrative purposes.",
    ctaLabel: "Request Citizenship Support",
    highlight: "Citizenship declaration support",
  },
  {
    title: "Same Person Letter",
    slug: "same-person-letter",
    shortLabel: "Same Person",
    price: 0,
    shortDescription:
      "Preparation support for same-person declaration letters when two identity records must be linked to one person.",
    longDescription:
      "Data inconsistencies between different identity records can cause significant administrative delays. A 'Same Person' declaration is a formal tool to link mismatched records to a single identity. We provide precise support in structuring these declarations, clearly identifying discrepancies and presenting the corrected data in a format optimized for consular and legal recognition.",
    oldWebsiteSourceSummary:
      "Built directly from the provided same person attestation form.",
    whoThisIsFor: [
      "Applicants whose names or identity records need to be confirmed as belonging to the same person.",
      "People handling document inconsistencies across records.",
      "Applicants who want a cleaner structured declaration before official submission.",
    ],
    whatWeHelpWith: [
      "Preparing the two identity records referenced in the same person form.",
      "Reviewing the corrected surname, name, birth, and passport details.",
      "Helping you structure the declaration clearly before the official process continues.",
      "Providing next-step readiness using the same layout as the form.",
    ],
    requiredDocuments: [
      "First person's name and birth details.",
      "Second person's name and birth details.",
      "Correct surname and name.",
      "Correct birthplace and date of birth.",
      "Passport number, issuing authority, issue date, and expiry date.",
    ],
    processSteps: [
      "Submit the two identity records and corrected details required by the form.",
      "Liberty Digital Consulting Services reviews the declaration fields for completeness.",
      "You receive guidance on missing records and next-step preparation.",
      "Proceed with the relevant official same-person declaration process.",
    ],
    importantNotes: [
      "This service is for preparation support only.",
      "Final attestation, signature, legalization, and official acceptance remain part of the relevant formal process.",
      "The provided form notes that the consul's signature may need legalization at the Prefettura.",
    ],
    faqs: [
      {
        question: "Is this for correcting identity mismatches?",
        answer:
          "Yes. The form is structured to confirm that two identity records refer to the same person and to state the correct details.",
      },
      {
        question: "Do I need passport details for this?",
        answer:
          "Yes. The provided form includes passport number, issuing authority, issue date, and expiry information.",
      },
      {
        question: "Is this page based on the PDF form?",
        answer:
          "Yes. The field structure here follows the provided same person form.",
      },
    ],
    formIntro:
      "Tell us the details required for the same person letter. The team will review your request and contact you with the next steps.",
    formFields: [
      { name: "firstPersonName", label: "First person's full name", type: "text", required: true },
      { name: "firstPersonBirthPlace", label: "First person born at", type: "text", required: true },
      { name: "firstPersonBirthDate", label: "First person date of birth", type: "date", required: true },
      { name: "secondPersonName", label: "Second person's full name", type: "text", required: true },
      { name: "secondPersonBirthPlace", label: "Second person born at", type: "text", required: true },
      { name: "secondPersonBirthDate", label: "Second person date of birth", type: "date", required: true },
      { name: "correctSurname", label: "Correct surname", type: "text", required: true },
      { name: "correctName", label: "Correct name", type: "text", required: true },
      { name: "correctBirthPlace", label: "Correct place of birth", type: "text", required: true },
      { name: "correctBirthDate", label: "Correct date of birth", type: "date", required: true },
      { name: "passportNumber", label: "Passport number", type: "text", required: true },
      { name: "passportIssuedBy", label: "Passport issued by", type: "text", required: true },
      { name: "passportIssueDate", label: "Passport issue date", type: "date", required: true },
      { name: "passportExpiryDate", label: "Passport expiry date", type: "date", required: true },
    ],
    seoTitle: "Same Person Letter Support",
    seoDescription:
      "Request preparation support for same person declaration letters and identity-record correction support in Rome.",
    ctaLabel: "Request Same Person Support",
    highlight: "Identity-match declaration",
  },
  {
    title: "Family Income Document",
    slug: "family-income-document",
    shortLabel: "Family Income",
    price: 0,
    shortDescription:
      "Preparation support for family income declaration documents used to confirm household dependency and no-income status.",
    longDescription:
      "Confirming financial dependency is often required for family reunions or visa renewals in Italy. We assist in the detailed preparation of Family Income declarations, helping you structure household dependency lists and no-income statements. Our consultancy ensures these declarations are organized professionally to reflect your family’s financial status for official use.",
    oldWebsiteSourceSummary:
      "Built directly from the provided family income document sample shared by the client.",
    whoThisIsFor: [
      "Applicants who need a family income declaration for embassy or administrative use.",
      "People who must list financially dependent family members on an official support document.",
      "Clients who need a cleaner structured form before formal submission.",
    ],
    whatWeHelpWith: [
      "Preparing the applicant identity and birth details shown on the document.",
      "Structuring the family-member list with relationship, birth date, and occupation.",
      "Capturing the no-income declaration year and financial-responsibility statement clearly.",
      "Providing a submission-ready structure that matches the sample document format.",
    ],
    requiredDocuments: [
      "Applicant full name.",
      "Applicant date of birth.",
      "Applicant place of birth.",
      "The declaration year for the no-income statement.",
      "Family-member details including surname and name, relationship, date of birth, and occupation.",
    ],
    processSteps: [
      "Enter the applicant details exactly as they should appear on the declaration.",
      "Add each family member included in the family income statement.",
      "Confirm the declaration year and the financial-responsibility statement.",
      "Submit the completed form so the team can review it before the official process continues.",
    ],
    importantNotes: [
      "This service is for preparation support only.",
      "Final certification, signature, and official issuance remain part of the relevant embassy or administrative process.",
      "Family-member names and dates of birth should match the supporting records exactly.",
      "Add every dependent family member who must appear on the declaration before submission.",
    ],
    faqs: [
      {
        question: "Can I include more family members than the sample document shows?",
        answer:
          "Yes. The form lets you add extra family-member rows so the declaration can cover everyone who should appear on the document.",
      },
      {
        question: "Does this service issue the document directly?",
        answer:
          "No. Liberty Digital Consulting Services prepares the form details only. Final issuance remains part of the official process.",
      },
      {
        question: "What family details do I need?",
        answer:
          "You should provide each family member's surname and name, relationship, date of birth, and occupation, matching the sample structure.",
      },
    ],
    formIntro:
      "Complete the family income declaration details below. The team will review the applicant information and family-member list before the next official step.",
    formFields: [
      {
        name: "applicantDateOfBirth",
        label: "Applicant date of birth",
        type: "date",
        required: true,
      },
      {
        name: "applicantPlaceOfBirth",
        label: "Applicant place of birth",
        type: "text",
        required: true,
      },
      {
        name: "declarationYear",
        label: "Declaration year",
        type: "text",
        required: true,
        placeholder: "Example: 2026",
      },
      {
        name: "familyMembers",
        label: "Family members",
        type: "textarea",
        required: true,
        description:
          "Add every dependent family member included in the declaration.",
      },
    ],
    seoTitle: "Family Income Document Support",
    seoDescription:
      "Request preparation support for family income declaration documents and household-dependency statements in Rome.",
    ctaLabel: "Request Family Income Support",
    highlight: "Household dependency declaration",
  },
  {
    title: "Letter of Single",
    slug: "letter-of-single",
    shortLabel: "Single Letter",
    price: 0,
    shortDescription:
      "Preparation support for single-status declaration letters used for embassy and administrative purposes.",
    longDescription:
      "Verified civil status is a common requirement for marriage and legal residency. The Letter of Single (Single Status Declaration) requires accurate recording of parental links and previous marital history. We provide a managed workflow to prepare these declarations, ensuring your status is documented clearly and professionally for embassy certification.",
    oldWebsiteSourceSummary:
      "Built directly from the provided letter of single sample shared by the client.",
    whoThisIsFor: [
      "Applicants who need an official single-status declaration for administrative use.",
      "People preparing civil-status documentation for embassy or legal purposes.",
      "Clients who want a structured form that matches the sample declaration layout before submission.",
    ],
    whatWeHelpWith: [
      "Preparing the identity details exactly as they should appear on the declaration.",
      "Reviewing birthplace, date of birth, nationality, and sex fields before submission.",
      "Capturing paternity, maternity, residence, and civil-status details in the correct structure.",
      "Providing a submission-ready format that reflects the sample embassy document.",
    ],
    requiredDocuments: [
      "Surname and names.",
      "Place and date of birth.",
      "Nationality.",
      "Sex.",
      "Father's full name.",
      "Mother's full name.",
      "Current residence.",
      "Civil status details.",
    ],
    processSteps: [
      "Enter the applicant identity details exactly as they should appear on the declaration.",
      "Complete the birth, nationality, sex, and parent-information sections.",
      "Add the current residence and civil-status information shown on the sample form.",
      "Submit the completed form so the team can review it before the official process continues.",
    ],
    importantNotes: [
      "This service is for preparation support only.",
      "Final certification, signature, and official issuance remain part of the embassy or relevant administrative process.",
      "All identity details should match the supporting records exactly.",
      "Civil-status information should be entered carefully because the declaration is issued for formal purposes permitted by law.",
    ],
    faqs: [
      {
        question: "Is this service based on the sample embassy declaration?",
        answer:
          "Yes. The field structure follows the details visible on the sample letter of single document you provided.",
      },
      {
        question: "Does Liberty issue the letter directly?",
        answer:
          "No. Liberty Digital Consulting Services prepares the form details only. Final issuance remains part of the official process.",
      },
      {
        question: "What civil-status detail should I enter?",
        answer:
          "Use the civil-status value that matches your supporting records, such as single, so the declaration can be reviewed correctly.",
      },
    ],
    formIntro:
      "Complete the single-status declaration details below. The team will review the applicant information before the next official step.",
    formFields: [
      {
        name: "surnameAndNames",
        label: "Surname / names",
        type: "text",
        required: true,
      },
      {
        name: "placeOfBirth",
        label: "Place of birth",
        type: "text",
        required: true,
      },
      {
        name: "dateOfBirth",
        label: "Date of birth",
        type: "date",
        required: true,
      },
      {
        name: "nationality",
        label: "Nationality",
        type: "text",
        required: true,
      },
      {
        name: "sex",
        label: "Sex",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ],
      },
      {
        name: "paternity",
        label: "Paternity",
        type: "text",
        required: true,
      },
      {
        name: "maternity",
        label: "Maternity",
        type: "text",
        required: true,
      },
      {
        name: "residence",
        label: "Residence",
        type: "textarea",
        required: true,
      },
      {
        name: "civilStatus",
        label: "Civil status",
        type: "select",
        required: true,
        options: [
          { label: "Single", value: "Single" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
    ],
    seoTitle: "Letter of Single Support",
    seoDescription:
      "Request preparation support for single-status declaration letters and embassy-ready identity documentation in Rome.",
    ctaLabel: "Request Letter of Single Support",
    highlight: "Single-status declaration",
  },
  {
    title: "Newspaper Publication",
    slug: "newspaper-publication",
    shortLabel: "Publication",
    price: 0,
    shortDescription:
      "Preparation support for newspaper-publication correction requests using old and new identity details.",
    longDescription:
      "Legally correcting identity details—such as name or date of birth—requires a formal public notice. We provide structured support for Newspaper Publication requests, helping you organize 'Old Details' versus 'New Details' declarations. Our service ensures your correction request is legally structured and ready for the final step of public notification.",
    oldWebsiteSourceSummary:
      "Built directly from the provided newspaper publication sample shared by the client.",
    whoThisIsFor: [
      "Applicants who need a newspaper publication for identity correction or update purposes.",
      "People changing or correcting name-related records across documents.",
      "Clients who want a clear old-data and new-data form before official publication processing.",
    ],
    whatWeHelpWith: [
      "Capturing the old identity details exactly as they appear on existing records.",
      "Structuring the new corrected details clearly before submission.",
      "Helping you review date-of-birth and place-of-birth corrections in one form.",
      "Providing a clean correction-request structure based on the sample layout.",
    ],
    requiredDocuments: [
      "Old surname.",
      "Old name.",
      "Old middle name if applicable.",
      "Old date of birth.",
      "Old place of birth.",
      "New surname.",
      "New name.",
      "New date of birth.",
      "New place of birth.",
    ],
    processSteps: [
      "Enter the old details exactly as they appear on the current record.",
      "Enter the corrected new details for publication.",
      "Review the date-of-birth and place-of-birth fields carefully before submission.",
      "Submit the completed correction form so the team can review it before the next official step.",
    ],
    importantNotes: [
      "This service is for preparation support only.",
      "Final publication, approval, and official acceptance remain part of the relevant formal process.",
      "Old and new details should match the supporting records exactly.",
      "Use this form carefully where identity corrections affect multiple documents.",
    ],
    faqs: [
      {
        question: "What does this form capture?",
        answer:
          "It captures the old identity details and the new corrected details shown on the sample newspaper publication form.",
      },
      {
        question: "Does Liberty publish the newspaper notice directly?",
        answer:
          "No. Liberty Digital Consulting Services prepares the form details only. Final publication remains part of the relevant official or media process.",
      },
      {
        question: "Can this be used for name corrections?",
        answer:
          "Yes. The sample structure clearly supports old-data to new-data corrections for identity-related details.",
      },
    ],
    formIntro:
      "Complete the old details and new details below. The team will review the correction structure before the next official step.",
    formFields: [
      {
        name: "oldSurname",
        label: "Old details: surname",
        type: "text",
        required: true,
      },
      {
        name: "oldName",
        label: "Old details: name",
        type: "text",
        required: true,
      },
      {
        name: "oldMiddleName",
        label: "Old details: middle name",
        type: "text",
      },
      {
        name: "oldDateOfBirth",
        label: "Old details: date of birth",
        type: "date",
        required: true,
      },
      {
        name: "oldPlaceOfBirth",
        label: "Old details: place of birth",
        type: "text",
        required: true,
      },
      {
        name: "newSurname",
        label: "New details: surname",
        type: "text",
        required: true,
      },
      {
        name: "newName",
        label: "New details: name",
        type: "text",
        required: true,
      },
      {
        name: "newDateOfBirth",
        label: "New details: date of birth",
        type: "date",
        required: true,
      },
      {
        name: "newPlaceOfBirth",
        label: "New details: place of birth",
        type: "text",
        required: true,
      },
    ],
    seoTitle: "Newspaper Publication Support",
    seoDescription:
      "Request preparation support for newspaper publication correction forms and old-data/new-data identity updates in Rome.",
    ctaLabel: "Request Newspaper Publication Support",
    highlight: "Old-data / new-data correction",
  },
  {
    title: "Letter to Prison",
    slug: "letter-to-prison",
    shortLabel: "Prison Letter",
    price: 0,
    shortDescription:
      "Preparation support for prison visitation, prison contact, or prison-permission letters based on the client's requested service.",
    longDescription:
      "Facilitating communication or visitation for detained family members requires professional and respectful documentation. We assist in preparing formal letters to prison authorities, organizing the necessary identity links, relationship proofs, and purpose-of-visitation details to support your request within the Italian and Nigerian administrative frameworks.",
    oldWebsiteSourceSummary:
      "This service is based on the client's handwritten service list and the best-supported interpretation that it refers to prison visitation, prison contact, or prison-permission documentation. A public official Nigerian Embassy Rome template could not be confirmed.",
    whoThisIsFor: [
      "Applicants requesting prison visitation or prison contact support documents.",
      "Family members or related persons preparing prison-permission letters.",
      "Clients who need a structured record of the relationship and purpose before official submission.",
    ],
    whatWeHelpWith: [
      "Preparing the applicant's identity and contact details clearly.",
      "Capturing the detained person's identifying details and prison information.",
      "Recording the relationship between the applicant and the detained person.",
      "Structuring the reason for the prison-related request before the next official step.",
    ],
    requiredDocuments: [
      "Applicant full name and contact details.",
      "Applicant valid identification details.",
      "Detained person's full name.",
      "Prison name and location if known.",
      "Relationship between the applicant and the detained person.",
      "Purpose of the letter or prison-related request.",
    ],
    processSteps: [
      "Enter the applicant and detained-person details as accurately as possible.",
      "Add the prison information and the relationship between both parties.",
      "Explain the purpose of the prison-related letter or permission request.",
      "Submit the completed form so the team can review it before the next official step.",
    ],
    importantNotes: [
      "This service is for preparation support only.",
      "A public official Nigerian Embassy Rome form for this exact service could not be confirmed.",
      "Final prison permission, visit approval, or official acceptance remain part of the relevant prison, legal, or administrative process.",
      "Applicants should match all identity details to the supporting records exactly.",
    ],
    faqs: [
      {
        question: "Is this based on an official embassy form?",
        answer:
          "No public official Nigerian Embassy Rome template for this exact service could be confirmed. This page is built from the client's requested service name and the most likely prison-visitation or prison-contact interpretation.",
      },
      {
        question: "What is this service for?",
        answer:
          "It is intended for prison visitation, prison contact, or prison-related administrative permission support, depending on the specific case.",
      },
      {
        question: "Does Liberty approve prison visits or prison requests?",
        answer:
          "No. Liberty Digital Consulting Services prepares the document details only. Final approval remains part of the relevant official process.",
      },
    ],
    formIntro:
      "Complete the prison-related request details below. The team will review the relationship, identity, and purpose information before the next official step.",
    formFields: [
      {
        name: "applicantNameOnId",
        label: "Applicant name",
        type: "text",
        required: true,
      },
      {
        name: "applicantValidIdCard",
        label: "Upload valid ID card",
        type: "file",
        required: true,
        description: "Required. Upload the applicant's valid ID card in JPG or PNG format.",
      },
      {
        name: "detainedPersonFullName",
        label: "Detained person's full name",
        type: "text",
        required: true,
      },
      {
        name: "prisonName",
        label: "Prison name",
        type: "text",
        required: true,
      },
      {
        name: "prisonLocation",
        label: "Prison location",
        type: "text",
      },
      {
        name: "relationshipToDetainedPerson",
        label: "Relationship to the detained person",
        type: "text",
        required: true,
      },
      {
        name: "requestPurpose",
        label: "Purpose of the prison-related letter",
        type: "textarea",
        required: true,
        placeholder: "Example: prison visitation, prison contact, or administrative permission request",
      },
    ],
    seoTitle: "Letter to Prison Support",
    seoDescription:
      "Request preparation support for prison visitation, prison contact, or prison-permission letters in Rome.",
    ctaLabel: "Request Prison Letter Support",
    highlight: "Prison contact documentation",
  },
  {
    title: "Child Recognition of the Father or Mother",
    slug: "child-recognition-of-the-father-or-mother",
    shortLabel: "Child Recognition",
    price: 0,
    shortDescription:
      "Preparation support for child-recognition declarations involving the father, mother, and supporting birth details.",
    longDescription:
      "Establishing a legal parental link is a sensitive and critical administrative process. Whether for the father or mother, a formal recognition declaration requires meticulous attention to birth details and identity records. We provide specialized intake support, ensuring all demographic data is synchronized before you proceed with official recognition at the Embassy.",
    oldWebsiteSourceSummary:
      "This service is based on the client's handwritten service list and a verified general recognition-of-child process. A public official Nigerian Embassy Rome form template could not be confirmed.",
    whoThisIsFor: [
      "Parents preparing a child-recognition declaration involving the father or mother.",
      "Applicants handling birth-record or parental-recognition administrative steps.",
      "Clients who need a structured intake before the official recognition process continues.",
    ],
    whatWeHelpWith: [
      "Preparing the child's identity and birth details clearly.",
      "Capturing the father and mother details in a structured form.",
      "Recording which parent is making or supporting the recognition request.",
      "Helping you organise recognition context and supporting documents before the next official step.",
    ],
    requiredDocuments: [
      "Child full name.",
      "Child date of birth.",
      "Child place of birth.",
      "Father's full name and details.",
      "Mother's full name and details.",
      "Information on which parent is making the recognition request.",
      "Supporting birth or identity records relevant to the case.",
    ],
    processSteps: [
      "Enter the child details exactly as they appear on the supporting records.",
      "Complete the father and mother information sections.",
      "Indicate who is making or supporting the recognition request and explain the case context.",
      "Submit the completed form so the team can review it before the next official step.",
    ],
    importantNotes: [
      "This service is for preparation support only.",
      "A public official Nigerian Embassy Rome form for this exact service could not be confirmed.",
      "Final recognition, registration, legalization, and official acceptance remain part of the relevant formal process.",
      "All child and parent details should match the supporting records exactly.",
    ],
    faqs: [
      {
        question: "Is this page based on an official embassy form?",
        answer:
          "No public official Nigerian Embassy Rome template for this exact service could be confirmed. This page is built as a structured provisional service based on the verified recognition-of-child process.",
      },
      {
        question: "What does this service help prepare?",
        answer:
          "It helps prepare the child details, parent details, and recognition context before the official process continues.",
      },
      {
        question: "Does Liberty complete the official recognition directly?",
        answer:
          "No. Liberty Digital Consulting Services prepares the intake details only. Final recognition remains part of the relevant official process.",
      },
    ],
    formIntro:
      "Complete the child and parent details below. The team will review the recognition context before the next official step.",
    formFields: [
      {
        name: "childFullName",
        label: "Child full name",
        type: "text",
        required: true,
      },
      {
        name: "childDateOfBirth",
        label: "Child date of birth",
        type: "date",
        required: true,
      },
      {
        name: "childPlaceOfBirth",
        label: "Child place of birth",
        type: "text",
        required: true,
      },
      {
        name: "fatherFullName",
        label: "Father's full name",
        type: "text",
        required: true,
      },
      {
        name: "motherFullName",
        label: "Mother's full name",
        type: "text",
        required: true,
      },
      {
        name: "recognizingParent",
        label: "Parent making or supporting the recognition",
        type: "select",
        required: true,
        options: [
          { label: "Father", value: "Father" },
          { label: "Mother", value: "Mother" },
          { label: "Both parents", value: "Both parents" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
      {
        name: "currentChildStatus",
        label: "Current child-record status",
        type: "text",
        required: true,
        placeholder: "Example: child not yet recognized by father, record needs update, or similar",
      },
      {
        name: "supportingDocumentsReady",
        label: "Do you have the supporting documents ready?",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
          { label: "Partly", value: "Partly" },
          { label: "Not sure", value: "Not sure" },
        ],
      },
    ],
    seoTitle: "Child Recognition Support",
    seoDescription:
      "Request preparation support for child-recognition declarations involving the father, mother, and supporting birth details in Rome.",
    ctaLabel: "Request Child Recognition Support",
    highlight: "Parent-recognition preparation",
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
