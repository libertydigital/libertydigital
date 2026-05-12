import type { Lead, LeadActivity, LeadNote, LeadStatus } from "@prisma/client";

import { FollowUpDateForm } from "@/components/admin/follow-up-date-form";
import { LeadActivityTimeline } from "@/components/admin/lead-activity-timeline";
import { LeadNotes } from "@/components/admin/lead-notes";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { LeadStatusForm } from "@/components/admin/lead-status-form";
import { getServiceBySlug } from "@/lib/services";
import {
  buildWhatsAppLink,
  formatDate,
  formatDateTime,
  objectEntries,
  toTitleCase,
} from "@/lib/utils";

type LeadDetailPanelProps = {
  lead: Lead & {
    notes: LeadNote[];
    activities: LeadActivity[];
  };
};

export function LeadDetailPanel({ lead }: LeadDetailPanelProps) {
  const service = getServiceBySlug(lead.serviceSlug);
  const fieldMap = new Map(
    service?.formFields.map((field) => [field.name, field]) ?? [],
  );
  const whatsappLink = buildWhatsAppLink(
    lead.whatsapp || lead.phone,
    `Hello ${lead.fullName}, thank you for contacting Liberty Digital Consulting Services about ${lead.serviceName}. We have received your request and would like to guide you on the next steps.`,
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-6">
        <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-kicker !text-[var(--color-gold-soft)]">Lead detail</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-white">
                {lead.fullName}
              </h2>
              <p className="mt-2 text-sm text-white/64">{lead.serviceName}</p>
            </div>
            <LeadStatusBadge status={lead.status as LeadStatus} />
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <DetailBlock label="Email" value={lead.email || "Not provided"} />
            <DetailBlock label="Phone" value={lead.phone || "Not provided"} />
            <DetailBlock label="WhatsApp" value={lead.whatsapp || "Not provided"} />
            <DetailBlock
              label="Preferred contact method"
              value={lead.preferredContactMethod || "Not specified"}
            />
            <DetailBlock label="Created" value={formatDateTime(lead.createdAt)} />
            <DetailBlock label="Follow-up date" value={formatDate(lead.followUpDate)} />
          </div>
          <div className="mt-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-soft)]">
              Message
            </p>
            <p className="rounded-[24px] border border-white/8 bg-white/5 px-4 py-4 text-sm leading-7 text-white/72">
              {lead.message || "No message provided."}
            </p>
          </div>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-soft)]">
              Submitted form answers
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {objectEntries(lead.formData as Record<string, unknown>).map(([key, value]) => (
                <div
                  className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-4 py-4"
                  key={String(key)}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/48">
                    {getReadableFieldLabel(String(key), fieldMap.get(String(key))?.label)}
                  </p>
                  <p className="mt-2 break-words text-sm leading-7 text-white">
                    {formatFieldValue(value, fieldMap.get(String(key))?.type)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <LeadNotes leadId={lead.id} notes={lead.notes} />
        <LeadActivityTimeline activities={lead.activities} />
      </section>
      <aside className="space-y-6">
        <LeadStatusForm currentStatus={lead.status as LeadStatus} leadId={lead.id} />
        <FollowUpDateForm
          followUpDate={lead.followUpDate ? lead.followUpDate.toISOString().slice(0, 10) : ""}
          leadId={lead.id}
        />
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white shadow-[0_28px_60px_rgba(4,10,18,0.16)] backdrop-blur-sm">
          <p className="section-kicker !text-[var(--color-gold-soft)]">Quick actions</p>
          <p className="mt-3 text-sm leading-7 text-white/60">
            Open a drafted response fast when you are ready to follow up.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {lead.email ? (
              <a
                className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 text-sm font-semibold text-white hover:border-[rgba(234,217,188,0.24)] hover:bg-white/10"
                href={`mailto:${lead.email}?subject=${encodeURIComponent(`Your ${lead.serviceName} Request`)}&body=${encodeURIComponent(`Hello ${lead.fullName},`)}`}
              >
                Open email draft
              </a>
            ) : null}
            {whatsappLink ? (
              <a
                className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 text-sm font-semibold text-white hover:border-[rgba(234,217,188,0.24)] hover:bg-white/10"
                href={whatsappLink}
                rel="noreferrer"
                target="_blank"
              >
                Open WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </aside>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-soft)]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm leading-7 text-white/72">{value}</p>
    </div>
  );
}

function getReadableFieldLabel(key: string, configuredLabel?: string) {
  if (configuredLabel) {
    return configuredLabel;
  }

  return toTitleCase(
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2"),
  );
}

function formatFieldValue(value: unknown, fieldType?: string) {
  if (value == null || value === "") {
    return "Not provided";
  }

  if (fieldType === "date" && typeof value === "string") {
    return formatDate(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}
