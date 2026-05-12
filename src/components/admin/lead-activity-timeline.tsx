import type { LeadActivity } from "@prisma/client";

import { formatDateTime } from "@/lib/utils";

export function LeadActivityTimeline({
  activities,
}: {
  activities: LeadActivity[];
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md sm:p-8">
      <p className="section-kicker !text-[var(--color-gold-soft)]">Activity timeline</p>
      <div className="mt-6 space-y-5">
        {activities.length === 0 ? (
          <p className="text-sm text-white/62">No activity logged yet.</p>
        ) : (
          activities.map((activity) => (
            <article className="relative rounded-[24px] border border-white/8 bg-white/5 px-4 py-4 pl-10" key={activity.id}>
              <span className="absolute left-4 top-5 size-2 rounded-full bg-[var(--color-gold-soft)] shadow-[0_0_0_6px_rgba(234,217,188,0.08)]" />
              <p className="text-sm font-semibold text-white">{activity.description}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/46">
                {formatDateTime(activity.createdAt)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
