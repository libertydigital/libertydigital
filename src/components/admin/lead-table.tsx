import Link from "next/link";
import type { Lead } from "@prisma/client";

import { ButtonLink } from "@/components/ui/button";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { formatDateTime } from "@/lib/utils";

export function LeadTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] p-8 text-sm leading-7 text-[var(--color-navy-soft)] shadow-[0_18px_40px_rgba(17,32,49,0.06)]">
        No leads match the current filters.
      </div>
    );
  }

  return (
    <>
      <div className="hidden rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] shadow-[0_18px_40px_rgba(17,32,49,0.06)] 2xl:block">
        <div className="overflow-x-auto">
          <table className="min-w-[940px] w-full divide-y divide-[var(--color-line)]">
            <thead className="bg-[rgba(220,229,237,0.24)]">
              <tr className="text-left text-xs uppercase tracking-[0.24em] text-[var(--color-navy-soft)]">
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Created</th>
                <th className="px-6 py-4 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="min-w-0 px-6 py-5">
                    <p className="break-words font-semibold text-[var(--color-navy)]">{lead.fullName}</p>
                    <p className="break-words text-sm text-[var(--color-navy-soft)]">
                      {lead.email || lead.phone || lead.whatsapp || "No contact details"}
                    </p>
                  </td>
                  <td className="min-w-0 px-6 py-5 text-sm text-[var(--color-navy-soft)]">
                    {lead.serviceName}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-[var(--color-navy-soft)]">
                    {formatDateTime(lead.createdAt)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <ButtonLink
                      className="border-white/12 bg-white/8 text-white hover:border-[rgba(234,217,188,0.34)] hover:bg-white/12"
                      href={`/admin/leads/${lead.id}`}
                      variant="secondary"
                    >
                      View lead
                    </ButtonLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid gap-4 2xl:hidden">
        {leads.map((lead) => (
          <article
            className="rounded-[28px] border border-[var(--color-line)] bg-[var(--color-paper)] p-5 shadow-[0_18px_40px_rgba(17,32,49,0.06)]"
            key={lead.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[var(--color-navy)]">{lead.fullName}</p>
                <p className="mt-1 text-sm text-[var(--color-navy-soft)]">
                  {lead.serviceName}
                </p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </div>
            <div className="mt-4 space-y-2 text-sm text-[var(--color-navy-soft)]">
              <p>{lead.email || lead.phone || lead.whatsapp || "No contact details"}</p>
              <p>{formatDateTime(lead.createdAt)}</p>
            </div>
            <Link
              className="mt-5 inline-flex text-sm font-semibold text-[var(--color-navy)] hover:text-[var(--color-gold)]"
              href={`/admin/leads/${lead.id}`}
            >
              View lead
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
