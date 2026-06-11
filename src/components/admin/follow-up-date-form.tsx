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
    <section className="overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_20px_48px_rgba(17,32,49,0.08)]">
      <p className="section-kicker">Follow-up</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
        Add a date so the next contact point stays visible inside the workflow.
      </p>
      <form action={formAction} className="mt-5 space-y-4">
        <input name="leadId" type="hidden" value={leadId} />
        <input
          className="w-full rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)]"
          defaultValue={followUpDate}
          name="followUpDate"
          required
          type="date"
        />
        {state?.message ? (
          <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>
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
