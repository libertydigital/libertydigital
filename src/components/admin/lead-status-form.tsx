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
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white shadow-[0_28px_60px_rgba(4,10,18,0.16)] backdrop-blur-sm">
      <p className="section-kicker !text-[var(--color-gold-soft)]">Status</p>
      <p className="mt-3 text-sm leading-7 text-white/60">
        Keep the lead pipeline accurate as requests move from intake to follow-up.
      </p>
      <form action={formAction} className="mt-5 space-y-4">
        <input name="leadId" type="hidden" value={leadId} />
        <select
          className="w-full appearance-none rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 text-sm text-white shadow-inner shadow-black/10 [color-scheme:dark]"
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
          <p className={`text-sm ${state.success ? "text-emerald-300" : "text-rose-300"}`}>
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
      <div className="mt-6 rounded-[24px] border border-white/8 bg-black/18 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/44">
          Quick actions
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
        <QuickStatusButton leadId={leadId} onComplete={setQuickMessage} status="CONTACTED" />
        <QuickStatusButton leadId={leadId} onComplete={setQuickMessage} status="COMPLETED" />
        </div>
      </div>
      {quickMessage ? <p className="mt-3 text-sm text-emerald-300">{quickMessage}</p> : null}
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
      className="border border-white/10 bg-white/6 text-white/80 no-underline hover:border-[rgba(234,217,188,0.26)] hover:bg-white/10 hover:text-white"
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
