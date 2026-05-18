import type { LeadStatus } from "@prisma/client";

import { cn, toTitleCase } from "@/lib/utils";

const badgeVariants: Record<LeadStatus, string> = {
  NEW: "border border-sky-300/45 bg-[linear-gradient(180deg,rgba(56,189,248,0.18),rgba(56,189,248,0.1))] text-sky-800",
  CONTACTED: "border border-indigo-300/45 bg-[linear-gradient(180deg,rgba(129,140,248,0.18),rgba(129,140,248,0.1))] text-indigo-800",
  WAITING_FOR_DOCUMENTS: "border border-amber-300/55 bg-[linear-gradient(180deg,rgba(251,191,36,0.2),rgba(251,191,36,0.1))] text-amber-900",
  APPOINTMENT_SCHEDULED: "border border-violet-300/45 bg-[linear-gradient(180deg,rgba(167,139,250,0.18),rgba(167,139,250,0.1))] text-violet-800",
  IN_PROGRESS: "border border-blue-300/45 bg-[linear-gradient(180deg,rgba(96,165,250,0.18),rgba(96,165,250,0.1))] text-blue-800",
  COMPLETED: "border border-emerald-300/45 bg-[linear-gradient(180deg,rgba(52,211,153,0.18),rgba(52,211,153,0.1))] text-emerald-800",
  LOST: "border border-rose-300/45 bg-[linear-gradient(180deg,rgba(251,113,133,0.18),rgba(251,113,133,0.1))] text-rose-800",
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
