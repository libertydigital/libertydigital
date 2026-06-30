"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronUp, Languages } from "lucide-react";

type SupportedLanguage = "en" | "fr" | "it" | "de";

type LanguageOption = {
  code: SupportedLanguage;
  label: string;
};

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: unknown;
      };
    };
    libertyGoogleTranslateInit?: () => void;
  }
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "it", label: "Italian" },
  { code: "de", label: "German" },
];

const GOOGLE_TRANSLATE_COOKIE = "googtrans";
const LANGUAGE_STORAGE_KEY = "liberty-selected-language";

function readStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "en";
  }

  const cookieMatch = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  const cookieValue = cookieMatch?.[1];

  if (cookieValue) {
    const rawLanguage = decodeURIComponent(cookieValue).split("/").pop();
    if (rawLanguage && LANGUAGE_OPTIONS.some((option) => option.code === rawLanguage)) {
      return rawLanguage as SupportedLanguage;
    }
  }

  if (typeof window !== "undefined") {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && LANGUAGE_OPTIONS.some((option) => option.code === storedLanguage)) {
      return storedLanguage as SupportedLanguage;
    }
  }

  return "en";
}

function subscribeToLanguageChange(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === LANGUAGE_STORAGE_KEY || event.key === null) {
      callback();
    }
  };

  const handleLanguageChange = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener("liberty-language-change", handleLanguageChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("liberty-language-change", handleLanguageChange);
  };
}

function persistSelectedLanguage(language: SupportedLanguage) {
  const translateValue = `/auto/${language}`;
  const maxAge = 60 * 60 * 24 * 365;

  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${encodeURIComponent(translateValue)};path=/;max-age=${maxAge}`;

  const hostname = window.location.hostname;
  if (hostname.includes(".")) {
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=${encodeURIComponent(translateValue)};domain=${hostname};path=/;max-age=${maxAge}`;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  window.dispatchEvent(new Event("liberty-language-change"));
}

function syncGoogleCombo(language: SupportedLanguage) {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) {
    return false;
  }

  combo.value = language;
  combo.dispatchEvent(new Event("change"));
  return true;
}

export function FloatingLanguageTranslator() {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeLanguage = useSyncExternalStore(
    subscribeToLanguageChange,
    readStoredLanguage,
    () => "en",
  );

  const activeOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === activeLanguage) ?? LANGUAGE_OPTIONS[0],
    [activeLanguage],
  );

  const availableOptions = useMemo(
    () => LANGUAGE_OPTIONS.filter((option) => option.code !== activeLanguage),
    [activeLanguage],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    window.libertyGoogleTranslateInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      const host = document.getElementById("google_translate_element");
      if (host?.childElementCount) {
        return;
      }

      const TranslateElement = window.google.translate.TranslateElement as unknown as new (
        options: {
          autoDisplay?: boolean;
          includedLanguages?: string;
          layout?: unknown;
          pageLanguage?: string;
        },
        elementId: string,
      ) => unknown;

      const inlineLayout =
        (window.google.translate.TranslateElement as unknown as { InlineLayout?: { SIMPLE?: unknown } })
          .InlineLayout?.SIMPLE;

      new TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr,it,de",
          autoDisplay: false,
          layout: inlineLayout,
        },
        "google_translate_element",
      );

      const currentLanguage = readStoredLanguage();
      if (currentLanguage !== "en") {
        window.setTimeout(() => {
          syncGoogleCombo(currentLanguage);
        }, 400);
      }
    };

    return () => {
      delete window.libertyGoogleTranslateInit;
    };
  }, []);

  useEffect(() => {
    const scriptId = "liberty-google-translate-script";

    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://translate.google.com/translate_a/element.js?cb=libertyGoogleTranslateInit";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  function handleSelectLanguage(language: SupportedLanguage) {
    persistSelectedLanguage(language);
    setIsOpen(false);

    if (language === "en") {
      window.location.reload();
      return;
    }

    if (syncGoogleCombo(language)) {
      return;
    }

    window.location.reload();
  }

  return (
    <>
      <div
        className="notranslate fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6"
        ref={rootRef}
        translate="no"
      >
        {isOpen ? (
          <div className="mb-3 w-[min(18rem,calc(100vw-2rem))] rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(12,22,33,0.96),rgba(8,16,24,0.94))] p-3 text-[var(--color-paper)] shadow-[0_24px_64px_rgba(4,10,18,0.28)] backdrop-blur-2xl">
            <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
                Translate
              </p>
              <p className="mt-2 text-sm leading-6 text-white/68">
                Current language: {activeOption.label}
              </p>
            </div>
            <div className="mt-3 grid gap-2">
              {availableOptions.map((option) => (
                <button
                  className="flex items-center justify-between rounded-[20px] border border-white/10 bg-white/8 px-4 py-3 text-left text-sm font-semibold text-white/86 transition hover:border-[rgba(234,217,188,0.32)] hover:bg-white/12"
                  key={option.code}
                  onClick={() => handleSelectLanguage(option.code)}
                  type="button"
                >
                  <span>{option.label}</span>
                  <ChevronUp className="size-4 rotate-90 text-white/44" />
                </button>
              ))}
            </div>
            <p className="mt-3 px-1 text-xs leading-5 text-white/42">
              Machine translation powered by Google Translate.
            </p>
          </div>
        ) : null}

        <button
          aria-expanded={isOpen}
          aria-label="Change website language"
          className="inline-flex items-center gap-3 rounded-full border border-[rgba(177,138,81,0.24)] bg-[linear-gradient(135deg,#112031_0%,#1d3347_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(8,18,28,0.28)] transition hover:-translate-y-0.5 hover:brightness-105"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/12">
            <Languages className="size-5" />
          </span>
          <span className="flex items-center gap-2">
            {activeOption.label}
            <Check className="size-4 text-[var(--color-gold)]" />
          </span>
        </button>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-9999px] top-[-9999px] opacity-0"
        id="google_translate_element"
      />
    </>
  );
}
