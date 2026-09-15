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

const COOKIE_CONSENT_STORAGE_KEY = "liberty-cookie-consent";
const COOKIE_CONSENT_COOKIE = "liberty_cookie_consent";

type StoredConsent = {
  expiresAt?: number;
  value?: string;
};

function hasAnalyticsConsent() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  const storedValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (storedValue) {
    try {
      const parsed = JSON.parse(storedValue) as StoredConsent;
      if (
        parsed.value === "accepted" &&
        typeof parsed.expiresAt === "number" &&
        parsed.expiresAt > Date.now()
      ) {
        return true;
      }
    } catch {
      // Fall through to the first-party consent cookie.
    }
  }

  return document.cookie
    .split(";")
    .some((part) => part.trim() === `${COOKIE_CONSENT_COOKIE}=accepted`);
}

export function trackGrowthEvent(
  name: GrowthEventName,
  data: GrowthEventData = {},
) {
  if (!hasAnalyticsConsent()) {
    return;
  }

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
