import type { VideoScene } from "./storyboard";

// Source storyboard; rendering status is managed separately in Content Studio.
export const weeklyDocumentCampaignVideo: {
  articleSlug: string;
  hook: string;
  script: string;
  durationSeconds: number;
  scenes: VideoScene[];
} = {
  articleSlug: "get-your-nigerian-documents-on-track-this-week-italy",
  hook: "New week. Don't put off your Nigerian documents again.",
  script: "New week. Still putting off your passport renewal, N I N or B V N? Maybe an affidavit or certificate is on your list. If you're in Italy, Liberty Digital can help you prepare. Check your details. Gather what you have. Then send us a WhatsApp message. We'll help you understand the next official step. Don't carry that paperwork into another week. Get your documents on track with Liberty Digital.",
  durationSeconds: 30,
  scenes: [
  {
    "visual": "hook",
    "caption": "NEW WEEK. STOP PUTTING IT OFF.",
    "seconds": 4
  },
  {
    "visual": "document",
    "caption": "Passport applications and renewals",
    "seconds": 5
  },
  {
    "visual": "checklist",
    "caption": "NIN • BVN • Affidavits",
    "seconds": 5
  },
  {
    "visual": "document",
    "caption": "Legalisation • Certificates • Travel",
    "seconds": 5
  },
  {
    "visual": "checklist",
    "caption": "Check your details. Prepare this week.",
    "seconds": 5
  },
  {
    "visual": "cta",
    "caption": "LIBERTY DIGITAL • WhatsApp +39 353 390 3464",
    "seconds": 6
  }
],
};
