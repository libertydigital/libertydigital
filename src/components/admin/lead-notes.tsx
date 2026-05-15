"use client";

import { useActionState } from "react";
import type { LeadNote } from "@prisma/client";

import { addLeadNoteAction } from "@/actions/admin-lead-actions";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export function LeadNotes({
  leadId,
  notes,
}: {
  leadId: string;
  notes: LeadNote[];
}) {
  const [state, formAction, isPending] = useActionState(addLeadNoteAction, undefined);

  return (
    <section className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 text-[var(--color-navy)] shadow-[0_20px_48px_rgba(17,32,49,0.08)] sm:p-8">
      <p className="section-kicker">Internal notes</p>
      <div className="mt-6 space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-[var(--color-navy-soft)]">No notes added yet.</p>
        ) : (
          notes.map((note) => (
            <article className="rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-4" key={note.id}>
              <p className="text-sm leading-7 text-[var(--color-navy-soft)]">{note.note}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                {formatDateTime(note.createdAt)}
              </p>
            </article>
          ))
        )}
      </div>
      <form action={formAction} className="mt-6 space-y-4">
        <input name="leadId" type="hidden" value={leadId} />
        <textarea
          className="w-full rounded-[22px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)] placeholder:text-[var(--color-navy-soft)]"
          name="note"
          placeholder="Add an internal note"
          rows={4}
        />
        {state?.message ? (
          <p className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>
            {state.message}
          </p>
        ) : null}
        <Button
          className="border-white/12 bg-white/8 text-white hover:border-[rgba(234,217,188,0.34)] hover:bg-white/12"
          disabled={isPending}
          type="submit"
          variant="secondary"
        >
          {isPending ? "Saving note..." : "Add note"}
        </Button>
      </form>
    </section>
  );
}
