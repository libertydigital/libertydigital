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
    <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md sm:p-8">
      <p className="section-kicker !text-[var(--color-gold-soft)]">Internal notes</p>
      <div className="mt-6 space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-white/62">No notes added yet.</p>
        ) : (
          notes.map((note) => (
            <article className="rounded-[24px] border border-white/8 bg-white/5 px-4 py-4" key={note.id}>
              <p className="text-sm leading-7 text-white/78">{note.note}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/46">
                {formatDateTime(note.createdAt)}
              </p>
            </article>
          ))
        )}
      </div>
      <form action={formAction} className="mt-6 space-y-4">
        <input name="leadId" type="hidden" value={leadId} />
        <textarea
          className="w-full rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 text-sm text-white shadow-inner shadow-black/10 placeholder:text-white/38"
          name="note"
          placeholder="Add an internal note"
          rows={4}
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
          {isPending ? "Saving note..." : "Add note"}
        </Button>
      </form>
    </section>
  );
}
