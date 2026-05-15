"use client";

import { useActionState, useState, useTransition } from "react";
import type { LeadStatus } from "@prisma/client";

import {
  quickUpdateLeadStatusAction,
  updateLeadStatusAction,
} from "@/actions/admin-lead-actions";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_OPTIONS } from "@/lib/services";

export function LeadStatusForm({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: LeadStatus;
}) {
  const [state, formAction, isPending] = useActionState(updateLeadStatusAction, undefined);
  const [quickMessage, setQuickMessage] = useState<string | null>(null);

  return (
    <section className="overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_20px_48px_rgba(17,32,49,0.08)]">
      <p className="section-kicker">Status</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
        Keep the lead pipeline accurate as requests move from intake to follow-up.
      </p>
      <form action={formAction} className="mt-5 space-y-4">
        <input name="leadId" type="hidden" value={leadId} />
        <select
          className="w-full appearance-none rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)]"
          defaultValue={currentStatus}
          name="status"
        >
          {LEAD_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        {state?.message ? (
          <p className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>
            {state.message}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button
            className="border-white/12 bg-white/8 text-white hover:border-[rgba(234,217,188,0.34)] hover:bg-white/12"
            disabled={isPending}
            type="submit"
            variant="secondary"
          >
            {isPending ? "Saving..." : "Update status"}
          </Button>
        </div>
      </form>
      <div className="mt-6 rounded-[24px] border border-[var(--color-line)] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy-soft)]">
          Quick actions
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
        <QuickStatusButton leadId={leadId} onComplete={setQuickMessage} status="CONTACTED" />
        <QuickStatusButton leadId={leadId} onComplete={setQuickMessage} status="COMPLETED" />
        </div>
      </div>
      {quickMessage ? <p className="mt-3 text-sm text-emerald-700">{quickMessage}</p> : null}
    </section>
  );
}

function QuickStatusButton({
  leadId,
  onComplete,
  status,
}: {
  leadId: string;
  onComplete: (message: string) => void;
  status: LeadStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="border border-[var(--color-line)] bg-[rgba(220,229,237,0.26)] text-[var(--color-navy)] no-underline hover:border-[rgba(177,138,81,0.26)] hover:bg-[rgba(234,217,188,0.34)] hover:text-[var(--color-navy)]"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await quickUpdateLeadStatusAction(leadId, status);
          onComplete(result.message);
        });
      }}
      type="button"
      variant="ghost"
    >
        Mark as {status === "CONTACTED" ? "contacted" : "completed"}
    </Button>
  );
}
