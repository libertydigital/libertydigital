import Link from "next/link";
import { LeadStatus } from "@prisma/client";
import { Bell, CalendarDays, CircleCheckBig, Clock3, WalletCards } from "lucide-react";

import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { ButtonLink } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

const statIcons = [CalendarDays, Clock3, WalletCards, CircleCheckBig];

export default async function AdminDashboardPage() {
  const prisma = getPrisma();
  const [totalLeads, newLeads, waitingLeads, followUps, recentLeads, leadsByService] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: LeadStatus.NEW } }),
      prisma.lead.count({ where: { status: LeadStatus.WAITING_FOR_DOCUMENTS } }),
      prisma.lead.count({ where: { followUpDate: { not: null } } }),
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.lead.groupBy({
        by: ["serviceSlug", "serviceName"],
        _count: { _all: true },
      }),
    ]);

  const cards = [
    { label: "Today's intake", value: newLeads, note: "Fresh requests to review" },
    { label: "Pending docs", value: waitingLeads, note: "Applicants to chase" },
    { label: "All leads", value: totalLeads, note: "Tracked across services" },
    { label: "Follow-ups", value: followUps, note: "Scheduled next steps" },
  ];

  const topDemand = [...leadsByService]
    .sort((a, b) => b._count._all - a._count._all)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <section className="rounded-[34px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(135deg,#1f8f93,#24a0a1)] p-6 text-white shadow-[0_24px_60px_rgba(23,110,113,0.22)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
            Admin overview
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-white">
            Good morning, keep every request moving
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
            Track incoming service forms, spot stalled document requests, and move directly into the lead record that needs attention next.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {cards.map((card, index) => {
              const Icon = statIcons[index];

              return (
                <div
                  className="rounded-[24px] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm"
                  key={card.label}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-[16px] bg-white/10 text-white/82">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-xs uppercase tracking-[0.16em] text-white/60">
                      {card.label}
                    </span>
                  </div>
                  <p className="mt-4 font-serif text-4xl font-semibold">{card.value}</p>
                  <p className="mt-2 text-xs leading-6 text-white/72">{card.note}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink
              className="border-white/10 bg-white text-[var(--color-navy)] hover:bg-[var(--color-paper)]"
              href="/admin/leads"
              variant="secondary"
            >
              View leads
            </ButtonLink>
            <ButtonLink
              className="border-white/14 bg-white/10 text-white hover:bg-white/14"
              href="/admin/accounts"
              variant="ghost"
            >
              Manage admins
            </ButtonLink>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[30px] border border-[var(--color-line)] bg-[var(--color-paper)] p-5 shadow-[0_18px_40px_rgba(17,32,49,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Current time
            </p>
            <p className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">
              {new Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZone: "Africa/Lagos",
              }).format(new Date())}
            </p>
            <p className="mt-2 text-sm text-[var(--color-navy-soft)]">Rome-ready admin workflow</p>
          </section>

          <section className="rounded-[30px] border border-[var(--color-line)] bg-[linear-gradient(135deg,rgba(17,32,49,0.95),rgba(49,71,93,0.94))] p-5 text-white shadow-[0_18px_40px_rgba(17,32,49,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-soft)]">
              Daily focus
            </p>
            <p className="mt-4 text-lg font-semibold leading-8">
              Move new forms out of intake fast so follow-up does not pile up.
            </p>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Prioritise recent submissions, then clear document gaps and date every next action.
            </p>
          </section>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_22px_52px_rgba(17,32,49,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Today&apos;s appointments</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                Latest requests
              </h2>
            </div>
            <ButtonLink href="/admin/leads" variant="secondary">
              View all leads
            </ButtonLink>
          </div>
          <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--color-line)] bg-white">
            <table className="w-full">
              <thead className="border-b border-[var(--color-line)] bg-[rgba(220,229,237,0.28)]">
                <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {recentLeads.map((lead) => (
                  <tr className="align-top" key={lead.id}>
                    <td className="px-5 py-4 text-sm text-[var(--color-navy-soft)]">
                      {formatDateTime(lead.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[var(--color-navy)]">{lead.fullName}</p>
                      <p className="mt-1 text-sm text-[var(--color-navy-soft)]">
                        {lead.email || lead.phone || lead.whatsapp || "No contact details"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--color-navy-soft)]">
                      {lead.serviceName}
                    </td>
                    <td className="px-5 py-4">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        className="text-sm font-semibold text-[var(--color-navy)] hover:text-[var(--color-gold)]"
                        href={`/admin/leads/${lead.id}`}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_22px_52px_rgba(17,32,49,0.08)]">
            <p className="section-kicker">Upcoming focus</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">
              Most requested services
            </h2>
            <div className="mt-6 space-y-3">
              {(topDemand.length ? topDemand : leadsByService).map((service) => (
                <div
                  className="flex items-center justify-between rounded-[22px] border border-[var(--color-line)] bg-white px-4 py-4"
                  key={service.serviceSlug}
                >
                  <div>
                    <p className="font-semibold text-[var(--color-navy)]">{service.serviceName}</p>
                    <p className="mt-1 text-sm text-[var(--color-navy-soft)]">Service demand</p>
                  </div>
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-[rgba(36,160,161,0.14)] text-sm font-semibold text-[var(--color-navy)]">
                    {service._count._all}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_22px_52px_rgba(17,32,49,0.08)]">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-[16px] bg-[rgba(36,160,161,0.12)] text-[var(--color-navy)]">
                <Bell className="size-4" />
              </span>
              <div>
                <p className="section-kicker">Access control</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-[var(--color-navy)]">
                  Admin accounts
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
              Add new backend logins without leaving the dashboard so handover stays fast.
            </p>
            <ButtonLink className="mt-5" href="/admin/accounts" variant="secondary">
              Manage accounts
            </ButtonLink>
          </section>
        </div>
      </div>
    </div>
  );
}
