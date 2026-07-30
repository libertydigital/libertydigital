"use client";

import { useActionState, useMemo, useState } from "react";
import type { PublicTrackingStatus, TrackingCategory } from "@prisma/client";

import { updatePublicTrackingAction } from "@/actions/admin-lead-actions";
import {
  getPublicTrackingStatusLabel,
  getPublicTrackingStatusesForCategory,
  getTrackingCategoryLabel,
  getTrackingTimeline,
  TRACKING_SERVICE_RULES,
} from "@/lib/tracking";
import { Button } from "@/components/ui/button";

export function LeadPublicTrackingForm({
  leadId,
  trackingReference,
  trackingCategory,
  trackingOption,
  publicTrackingStatus,
  publicTrackingNote,
}: {
  leadId: string;
  trackingReference: string;
  trackingCategory: TrackingCategory | null;
  trackingOption: string | null;
  publicTrackingStatus: PublicTrackingStatus | null;
  publicTrackingNote: string | null;
}) {
  const [state, formAction, isPending] = useActionState(updatePublicTrackingAction, undefined);
  const [selectedCategory, setSelectedCategory] = useState<TrackingCategory | null>(
    trackingCategory,
  );
  const [selectedStatus, setSelectedStatus] = useState<PublicTrackingStatus | "">(
    publicTrackingStatus ?? "",
  );
  const statusOptions = useMemo(
    () => getPublicTrackingStatusesForCategory(selectedCategory),
    [selectedCategory],
  );

  return (
    <section className="overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_20px_48px_rgba(17,32,49,0.08)]">
      <p className="section-kicker">Public tracking</p>
      <div className="mt-4 rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy-soft)]">
          Tracking reference
        </p>
        <p className="mt-2 text-sm font-semibold text-[var(--color-navy)]">{trackingReference}</p>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
        Manage what the customer can see on the tracking page without changing the internal admin workflow.
      </p>
      <form action={formAction} className="mt-5 space-y-4">
        <input name="leadId" type="hidden" value={leadId} />

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
            Tracking category
          </span>
          <select
            className="w-full appearance-none rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)]"
            name="trackingCategory"
            onChange={(event) => {
              const nextCategory = (event.target.value || null) as TrackingCategory | null;
              const nextOptions: readonly PublicTrackingStatus[] =
                getPublicTrackingStatusesForCategory(nextCategory);

              setSelectedCategory(nextCategory);
              setSelectedStatus((current) =>
                current && nextOptions.includes(current) ? current : "",
              );
            }}
            value={selectedCategory ?? ""}
          >
            <option value="">Not set</option>
            {TRACKING_SERVICE_RULES.map((rule) => (
              <option key={rule.key} value={rule.key}>
                {rule.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
            Request option
          </span>
          <input
            className="w-full rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)]"
            defaultValue={trackingOption ?? ""}
            name="trackingOption"
            placeholder="Example: 5 years, 10 years, or General request"
            type="text"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
            Public status
          </span>
          <select
            className="w-full appearance-none rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)]"
            name="publicTrackingStatus"
            onChange={(event) => {
              setSelectedStatus((event.target.value || "") as PublicTrackingStatus | "");
            }}
            value={selectedStatus}
          >
            <option value="">Not set</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {getPublicTrackingStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
            Public note
          </span>
          <textarea
            className="min-h-28 w-full rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)]"
            defaultValue={publicTrackingNote ?? ""}
            name="publicTrackingNote"
            placeholder="Example: Biometric completed. Request is currently in processing."
          />
        </label>

        {state?.message ? (
          <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>
            {state.message}
          </p>
        ) : null}

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Saving..." : "Update public tracking"}
        </Button>

        <div className="rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
          <p className="font-semibold text-[var(--color-navy)]">
            Active timeline: {getTrackingTimeline(selectedCategory)}
          </p>
          <p className="mt-2">
            Category label: {getTrackingCategoryLabel(selectedCategory)}
          </p>
        </div>
      </form>
    </section>
  );
}
