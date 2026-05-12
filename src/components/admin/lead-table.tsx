import Link from "next/link";
import type { Lead } from "@prisma/client";

import { ButtonLink } from "@/components/ui/button";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { formatDateTime } from "@/lib/utils";

export function LeadTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-8 text-sm leading-7 text-white/68 backdrop-blur-sm">
        No leads match the current filters.
      </div>
    );
  }

  return (
    <>
      <div className="hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] backdrop-blur-md 2xl:block">
        <div className="overflow-x-auto">
          <table className="min-w-[940px] w-full divide-y divide-white/8">
            <thead className="bg-white/5">
              <tr className="text-left text-xs uppercase tracking-[0.24em] text-white/46">
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Created</th>
                <th className="px-6 py-4 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="min-w-0 px-6 py-5">
                    <p className="break-words font-semibold text-white">{lead.fullName}</p>
                    <p className="break-words text-sm text-white/62">
                      {lead.email || lead.phone || lead.whatsapp || "No contact details"}
                    </p>
                  </td>
                  <td className="min-w-0 px-6 py-5 text-sm text-white/62">
                    {lead.serviceName}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-white/52">
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
            className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 text-white backdrop-blur-sm"
            key={lead.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{lead.fullName}</p>
                <p className="mt-1 text-sm text-white/62">
                  {lead.serviceName}
                </p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/62">
              <p>{lead.email || lead.phone || lead.whatsapp || "No contact details"}</p>
              <p>{formatDateTime(lead.createdAt)}</p>
            </div>
            <Link
              className="mt-5 inline-flex text-sm font-semibold text-white"
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
