"use client";

import { useActionState } from "react";

import { updateLeadPaidRevenueAction } from "@/actions/admin-lead-actions";
import { Button } from "@/components/ui/button";
import { formatEurCents } from "@/lib/lead-revenue";

export function LeadRevenueForm({
  leadId,
  paidRevenueCents,
}: {
  leadId: string;
  paidRevenueCents: number | null;
}) {
  const [state, formAction, isPending] = useActionState(updateLeadPaidRevenueAction, undefined);
  return (
    <section className="rounded-[30px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
      <p className="section-kicker">Confirmed payment</p>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-[var(--color-navy)]">
        {paidRevenueCents === null ? "No payment recorded" : formatEurCents(paidRevenueCents)}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
        Enter only money actually received by Liberty in euros. Do not enter quotes, invoices awaiting payment, or official government charges.
      </p>
      <form action={formAction} className="mt-5 space-y-4">
        <input name="leadId" type="hidden" value={leadId} />
        <label className="block text-sm font-semibold text-[var(--color-navy)]" htmlFor="paid-amount">
          Paid amount (EUR)
        </label>
        <input
          className="w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-base text-[var(--color-navy)] focus-visible:outline-2 focus-visible:outline-[#b18a51]"
          defaultValue={paidRevenueCents === null ? "" : (paidRevenueCents / 100).toFixed(2)}
          id="paid-amount"
          inputMode="decimal"
          max="999999.99"
          min="0"
          name="paidAmount"
          placeholder="0.00"
          step="0.01"
          type="number"
        />
        <p className="text-xs leading-6 text-[var(--color-navy-soft)]">
          Leave blank and save to clear the recorded value. Zero is a valid recorded amount.
        </p>
        {state?.message ? <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-800" : "text-rose-800"}`}>{state.message}</p> : null}
        <Button disabled={isPending} type="submit" variant="dark">
          {isPending ? "Saving..." : "Save confirmed payment"}
        </Button>
      </form>
    </section>
  );
}
