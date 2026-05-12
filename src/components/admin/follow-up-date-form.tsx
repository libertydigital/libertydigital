"use client";

import { useActionState } from "react";

import { setFollowUpDateAction } from "@/actions/admin-lead-actions";
import { Button } from "@/components/ui/button";

export function FollowUpDateForm({
  leadId,
  followUpDate,
}: {
  leadId: string;
  followUpDate: string;
}) {
  const [state, formAction, isPending] = useActionState(setFollowUpDateAction, undefined);

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white shadow-[0_28px_60px_rgba(4,10,18,0.16)] backdrop-blur-sm">
      <p className="section-kicker !text-[var(--color-gold-soft)]">Follow-up</p>
      <p className="mt-3 text-sm leading-7 text-white/60">
        Add a date so the next contact point stays visible inside the workflow.
      </p>
      <form action={formAction} className="mt-5 space-y-4">
        <input name="leadId" type="hidden" value={leadId} />
        <input
          className="w-full rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 text-sm text-white shadow-inner shadow-black/10 [color-scheme:dark]"
          defaultValue={followUpDate}
          name="followUpDate"
          type="date"
        />
        {state?.message ? (
          <p className={`text-sm ${state.success ? "text-emerald-300" : "text-rose-300"}`}>
            {state.message}
          </p>
        ) : null}
        <Button
          className="border-white/12 bg-white/8 text-white hover:border-[rgba(234,217,188,0.34)] hover:bg-white/12"
          disabled={isPending}
          type="submit"
          variant="secondary"
        >
          {isPending ? "Saving..." : "Set follow-up date"}
        </Button>
      </form>
    </section>
  );
}
