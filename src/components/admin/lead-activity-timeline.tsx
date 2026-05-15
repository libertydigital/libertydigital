import type { LeadActivity } from "@prisma/client";

import { formatDateTime } from "@/lib/utils";

export function LeadActivityTimeline({
  activities,
}: {
  activities: LeadActivity[];
}) {
  return (
    <section className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 text-[var(--color-navy)] shadow-[0_20px_48px_rgba(17,32,49,0.08)] sm:p-8">
      <p className="section-kicker">Activity timeline</p>
      <div className="mt-6 space-y-5">
        {activities.length === 0 ? (
          <p className="text-sm text-[var(--color-navy-soft)]">No activity logged yet.</p>
        ) : (
          activities.map((activity) => (
            <article className="relative rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-4 pl-10" key={activity.id}>
              <span className="absolute left-4 top-5 size-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_0_6px_rgba(177,138,81,0.12)]" />
              <p className="text-sm font-semibold text-[var(--color-navy)]">{activity.description}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                {formatDateTime(activity.createdAt)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
