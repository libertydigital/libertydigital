import type { LeadStatus } from "@prisma/client";

import { cn, toTitleCase } from "@/lib/utils";

const badgeVariants: Record<LeadStatus, string> = {
  NEW: "border border-sky-300/20 bg-[linear-gradient(180deg,rgba(56,189,248,0.16),rgba(56,189,248,0.08))] text-sky-100",
  CONTACTED: "border border-indigo-300/20 bg-[linear-gradient(180deg,rgba(129,140,248,0.16),rgba(129,140,248,0.08))] text-indigo-100",
  WAITING_FOR_DOCUMENTS: "border border-amber-200/20 bg-[linear-gradient(180deg,rgba(251,191,36,0.16),rgba(251,191,36,0.08))] text-amber-100",
  APPOINTMENT_SCHEDULED: "border border-violet-300/20 bg-[linear-gradient(180deg,rgba(167,139,250,0.16),rgba(167,139,250,0.08))] text-violet-100",
  IN_PROGRESS: "border border-blue-300/20 bg-[linear-gradient(180deg,rgba(96,165,250,0.16),rgba(96,165,250,0.08))] text-blue-100",
  COMPLETED: "border border-emerald-300/20 bg-[linear-gradient(180deg,rgba(52,211,153,0.16),rgba(52,211,153,0.08))] text-emerald-100",
  LOST: "border border-rose-300/20 bg-[linear-gradient(180deg,rgba(251,113,133,0.16),rgba(251,113,133,0.08))] text-rose-100",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm",
        badgeVariants[status],
      )}
    >
      {toTitleCase(status)}
    </span>
  );
}
