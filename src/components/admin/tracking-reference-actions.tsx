"use client";

import { useState } from "react";

type TrackingReferenceActionsProps = {
  trackingReference: string;
  trackingUrl: string | null;
};

export function TrackingReferenceActions({
  trackingReference,
  trackingUrl,
}: TrackingReferenceActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(trackingReference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        className="rounded-full border border-[var(--color-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-navy)] transition hover:border-[rgba(177,138,81,0.28)] hover:bg-[rgba(234,217,188,0.26)]"
        onClick={copyReference}
        type="button"
      >
        {copied ? "Copied" : "Copy reference"}
      </button>
      {trackingUrl ? (
        <a
          className="rounded-full border border-[var(--color-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-navy)] transition hover:border-[rgba(177,138,81,0.28)] hover:bg-[rgba(234,217,188,0.26)]"
          href={trackingUrl}
          rel="noreferrer"
          target="_blank"
        >
          Open tracking page
        </a>
      ) : null}
    </div>
  );
}
