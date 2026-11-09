import type { VideoScene } from "./storyboard";

// The corresponding Content Studio video is a DRAFT for review, not queued to render.
export const weeklyDocumentCampaignVideo: {
  articleSlug: string;
  hook: string;
  script: string;
  durationSeconds: number;
  scenes: VideoScene[];
} = {
  articleSlug: "get-your-nigerian-documents-on-track-this-week-italy",
  hook: "New week. Don't put off your Nigerian documents again.",
  script: "New week. Same documents you've been putting off? Let's change that. If you're in Italy and need Nigerian passport support, NIN or BVN help, an affidavit, certificate, legalisation or travel paperwork, Liberty Digital can help you prepare. Check your details, gather your records, and take the first step this week. No false promises, just guidance for the right official process. Don't leave it until another Monday. Message Liberty Digital on WhatsApp today.",
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
