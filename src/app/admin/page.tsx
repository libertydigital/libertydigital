import Link from "next/link";
import { LeadStatus } from "@prisma/client";

import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { ButtonLink } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";
import { SERVICES } from "@/lib/services";
import { formatDateTime } from "@/lib/utils";

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
    { label: "Total leads", value: totalLeads, note: "All tracked enquiries" },
    { label: "New leads", value: newLeads, note: "Fresh requests needing review" },
    { label: "Waiting for documents", value: waitingLeads, note: "Pending applicant action" },
    { label: "Follow-up scheduled", value: followUps, note: "Leads with next-step dates" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-6 text-white shadow-[0_18px_45px_rgba(4,10,18,0.12)] backdrop-blur-sm"
            key={card.label}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold-soft)]">
              {card.label}
            </p>
            <p className="mt-4 font-serif text-5xl font-semibold text-white">
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/62">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker !text-[var(--color-gold-soft)]">Recent leads</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-white">
                Latest requests
              </h2>
            </div>
            <ButtonLink href="/admin/leads" variant="secondary">
              View all leads
            </ButtonLink>
          </div>
          <div className="mt-6 space-y-4">
            {recentLeads.map((lead) => (
              <Link
                className="block rounded-[24px] border border-white/8 bg-white/5 px-4 py-4 transition hover:border-[rgba(234,217,188,0.24)] hover:bg-white/8"
                href={`/admin/leads/${lead.id}`}
                key={lead.id}
              >
                <article>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{lead.fullName}</p>
                      <p className="mt-1 text-sm text-white/68">
                        {lead.serviceName}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/46">
                        {formatDateTime(lead.createdAt)}
                      </p>
                    </div>
                    <LeadStatusBadge status={lead.status} />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md">
          <p className="section-kicker !text-[var(--color-gold-soft)]">Leads by service</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white">
            Demand snapshot
          </h2>
          <div className="mt-6 space-y-4">
            {SERVICES.map((service) => {
              const match = leadsByService.find((entry) => entry.serviceSlug === service.slug);
              return (
                <div
                  className="rounded-[24px] border border-white/8 bg-white/5 px-4 py-4"
                  key={service.slug}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">
                      {service.title}
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm text-white/74">
                      {match?._count._all ?? 0}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker !text-[var(--color-gold-soft)]">Access control</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-white">
              Add new admin logins from inside the dashboard
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
              Use the admin accounts area to create new backend users without leaving the lead-management workspace.
            </p>
          </div>
          <ButtonLink href="/admin/accounts" variant="secondary">
            Manage admin accounts
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
