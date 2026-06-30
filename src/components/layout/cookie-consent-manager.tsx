"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

type CookieConsentState = "accepted" | "rejected" | "unknown";
type StoredCookieConsent = {
  expiresAt: number;
  value: Exclude<CookieConsentState, "unknown">;
};

const COOKIE_CONSENT_STORAGE_KEY = "liberty-cookie-consent";
const COOKIE_CONSENT_COOKIE = "liberty_cookie_consent";
const COOKIE_CONSENT_EVENT = "liberty-cookie-consent-change";
const COOKIE_MAX_AGE = 60 * 60 * 24;

function clearExpiredConsentState() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  document.cookie = `${COOKIE_CONSENT_COOKIE}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax`;

  const hostnameParts = window.location.hostname.split(".");
  if (hostnameParts.length >= 2) {
    const rootDomain = `.${hostnameParts.slice(-2).join(".")}`;
    document.cookie = `${COOKIE_CONSENT_COOKIE}=;domain=${rootDomain};path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Lax`;
  }
}

function readConsentState(): CookieConsentState {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "unknown";
  }

  const storageValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (storageValue) {
    try {
      const parsedValue = JSON.parse(storageValue) as StoredCookieConsent;
      if (
        (parsedValue.value === "accepted" || parsedValue.value === "rejected") &&
        parsedValue.expiresAt > Date.now()
      ) {
        return parsedValue.value;
      }
    } catch {}

    clearExpiredConsentState();
  }

  const cookieMatch = document.cookie.match(
    /(?:^|;\s*)liberty_cookie_consent=([^;]+)/,
  );
  const cookieValue = cookieMatch?.[1];

  if (cookieValue === "accepted" || cookieValue === "rejected") {
    return cookieValue;
  }

  return "unknown";
}

function subscribeToConsentChanges(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === COOKIE_CONSENT_STORAGE_KEY || event.key === null) {
      callback();
    }
  };

  const handleCustomEvent = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COOKIE_CONSENT_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COOKIE_CONSENT_EVENT, handleCustomEvent);
  };
}

function persistConsentState(value: Exclude<CookieConsentState, "unknown">) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const expiresAt = Date.now() + COOKIE_MAX_AGE * 1000;
  const storedValue: StoredCookieConsent = { expiresAt, value };

  window.localStorage.setItem(
    COOKIE_CONSENT_STORAGE_KEY,
    JSON.stringify(storedValue),
  );
  document.cookie = `${COOKIE_CONSENT_COOKIE}=${value};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;

  const hostnameParts = window.location.hostname.split(".");
  if (hostnameParts.length >= 2) {
    const rootDomain = `.${hostnameParts.slice(-2).join(".")}`;
    document.cookie = `${COOKIE_CONSENT_COOKIE}=${value};domain=${rootDomain};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
  }

  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

export function CookieConsentManager() {
  const consentState = useSyncExternalStore(
    subscribeToConsentChanges,
    readConsentState,
    () => "unknown",
  );

  const shouldLoadOptionalAnalytics = consentState === "accepted";

  function handleAccept() {
    persistConsentState("accepted");
    window.location.reload();
  }

  function handleReject() {
    persistConsentState("rejected");
    window.location.reload();
  }

  return (
    <>
      {consentState === "unknown" ? (
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-6">
          <div className="mx-auto max-w-5xl rounded-[28px] border border-[rgba(177,138,81,0.2)] bg-[linear-gradient(180deg,rgba(12,22,33,0.98),rgba(8,16,24,0.96))] p-5 text-white shadow-[0_28px_70px_rgba(4,10,18,0.3)] backdrop-blur-2xl sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                  Cookie Preferences
                </p>
                <h2 className="mt-3 font-serif text-2xl font-semibold text-[#fff9ed] sm:text-3xl">
                  Choose how this website uses optional cookies.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/68 sm:text-[0.96rem]">
                  We use essential cookies to keep the website working. With your
                  permission, we also use analytics and performance cookies to understand
                  visits and improve the site experience. Read the{" "}
                  <Link
                    className="font-semibold text-[var(--color-gold-soft)] underline"
                    href="/cookie-policy"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/8 px-6 text-sm font-semibold text-white transition hover:bg-white/12"
                  onClick={handleReject}
                  type="button"
                >
                  Reject
                </button>
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fff8ec_0%,#e9d4ab_48%,#c89f63_100%)] px-6 text-sm font-semibold text-[var(--color-navy)] shadow-[0_18px_34px_rgba(4,10,18,0.24)] transition hover:-translate-y-0.5 hover:brightness-105"
                  onClick={handleAccept}
                  type="button"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {shouldLoadOptionalAnalytics ? (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      ) : null}
    </>
  );
}
