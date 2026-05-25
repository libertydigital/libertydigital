"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteLeadAction, restoreLeadAction } from "@/actions/admin-lead-actions";
import { Button } from "@/components/ui/button";

export function DeleteLeadCard({
  leadId,
  isArchived,
}: {
  leadId: string;
  isArchived: boolean;
}) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <section className="rounded-[32px] border border-[rgba(151,39,54,0.14)] bg-[linear-gradient(180deg,rgba(255,245,245,0.92),rgba(255,251,251,0.98))] p-6 text-[var(--color-navy)] shadow-[0_20px_48px_rgba(17,32,49,0.08)]">
      <p className="section-kicker text-[color:#972736]">
        {isArchived ? "Lead restore" : "Lead cleanup"}
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
        {isArchived
          ? "Restore this archived lead to the active pipeline so it appears in the normal admin views again."
          : "Archive test or invalid leads from the dashboard without losing the original record for future reference."}
      </p>

      {message ? (
        <p className="mt-4 text-sm text-rose-700">{message}</p>
      ) : null}

      {isArchived ? (
        <div className="mt-5">
          <Button
            className="border border-[var(--color-line)] bg-white text-[var(--color-navy)] shadow-none hover:border-[rgba(177,138,81,0.26)] hover:bg-[rgba(234,217,188,0.22)]"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                setMessage(null);
                const result = await restoreLeadAction(leadId);

                if (!result.success) {
                  setMessage(result.message);
                  return;
                }

                router.refresh();
              });
            }}
            type="button"
          >
            {isPending ? "Restoring..." : "Restore lead"}
          </Button>
        </div>
      ) : !isConfirming ? (
        <div className="mt-5">
          <Button
            className="bg-[linear-gradient(135deg,#7a1226_0%,#972736_100%)] text-white shadow-none hover:brightness-105"
            disabled={isPending}
            onClick={() => {
              setMessage(null);
              setIsConfirming(true);
            }}
            type="button"
          >
            Archive lead
          </Button>
        </div>
      ) : (
        <div className="mt-5 rounded-[24px] border border-[rgba(151,39,54,0.14)] bg-white px-4 py-4">
          <p className="text-sm font-semibold text-[color:#972736]">
            Archive this lead?
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-navy-soft)]">
            Use this for obvious test submissions only. The lead stays in the database and can be restored later from the archived leads view.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              className="bg-[linear-gradient(135deg,#7a1226_0%,#972736_100%)] text-white shadow-none hover:brightness-105"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  setMessage(null);
                  const result = await deleteLeadAction(leadId);

                  if (!result.success) {
                    setMessage(result.message);
                    return;
                  }

                  router.push("/admin/leads?archived=0");
                  router.refresh();
                });
              }}
              type="button"
            >
              {isPending ? "Archiving..." : "Yes, archive lead"}
            </Button>
            <Button
              className="border border-[var(--color-line)] bg-white text-[var(--color-navy)] shadow-none hover:border-[rgba(177,138,81,0.26)] hover:bg-[rgba(234,217,188,0.22)]"
              disabled={isPending}
              onClick={() => {
                setMessage(null);
                setIsConfirming(false);
              }}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
