"use client";

import { track } from "@vercel/analytics";

export const GROWTH_EVENT_NAMES = [
  "form_start",
  "form_submit",
  "form_success",
  "form_error",
  "whatsapp_click",
  "phone_click",
  "email_click",
  "service_cta_click",
] as const;

export type GrowthEventName = (typeof GROWTH_EVENT_NAMES)[number];

export type GrowthEventData = {
  serviceSlug?: string;
  page?: string;
  placement?: string;
};

export function trackGrowthEvent(
  name: GrowthEventName,
  data: GrowthEventData = {},
) {
  try {
    track(name, data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Growth analytics event could not be recorded", {
        name,
        error,
      });
    }
  }
}
