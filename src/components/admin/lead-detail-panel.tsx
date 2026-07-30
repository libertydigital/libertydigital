import Image from "next/image";
import type {
  Lead,
  LeadActivity,
  LeadNote,
  LeadStatus,
  PublicTrackingStatus,
  TrackingCategory,
} from "@prisma/client";
import type { ReactNode } from "react";

import { DeleteLeadCard } from "@/components/admin/delete-lead-card";
import { FollowUpDateForm } from "@/components/admin/follow-up-date-form";
import { LeadActivityTimeline } from "@/components/admin/lead-activity-timeline";
import { LeadNotes } from "@/components/admin/lead-notes";
import { LeadPublicTrackingForm } from "@/components/admin/lead-public-tracking-form";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { LeadStatusForm } from "@/components/admin/lead-status-form";
import { TrackingReferenceActions } from "@/components/admin/tracking-reference-actions";
import { getServiceBySlug } from "@/lib/services";
import {
  buildTrackingLookupPath,
  getPublicTrackingStatusLabel,
  getTrackingCategoryLabel,
  getTrackingTimeline,
} from "@/lib/tracking";
import {
  buildWhatsAppLink,
  formatDate,
  formatDateTime,
  formatFamilyMemberSummary,
  isFamilyMemberEntryArray,
  isStoredUploadFileArray,
  objectEntries,
  type StoredUploadFile,
  summarizeStoredUploadFiles,
  toTitleCase,
} from "@/lib/utils";

type LeadDetailPanelProps = {
  lead: Lead & {
    deletedAt: Date | null;
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
  const trackingPhone = lead.phone || lead.whatsapp;
  const trackingUrl = trackingPhone
    ? buildTrackingLookupPath(lead.trackingReference, trackingPhone)
    : null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="space-y-6">
        <div className="rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 text-[var(--color-navy)] shadow-[0_22px_52px_rgba(17,32,49,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-kicker">Lead detail</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">
                {lead.fullName}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-navy-soft)]">{lead.serviceName}</p>
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
            <DetailBlock
              label="Archive status"
              value={lead.deletedAt ? `Archived on ${formatDateTime(lead.deletedAt)}` : "Active"}
            />
            <DetailBlock label="Created" value={formatDateTime(lead.createdAt)} />
            <DetailBlock label="Follow-up date" value={formatDate(lead.followUpDate)} />
            <div className="min-w-0">
              <DetailBlock label="Tracking reference" value={lead.trackingReference} />
              <TrackingReferenceActions
                trackingReference={lead.trackingReference}
                trackingUrl={trackingUrl}
              />
            </div>
            <DetailBlock label="Tracking category" value={getTrackingCategoryLabel(lead.trackingCategory as TrackingCategory | null)} />
            <DetailBlock label="Public status" value={getPublicTrackingStatusLabel(lead.publicTrackingStatus as PublicTrackingStatus | null)} />
            <DetailBlock label="Timeline" value={getTrackingTimeline(lead.trackingCategory as TrackingCategory | null)} />
          </div>
          <div className="mt-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Public tracking note
            </p>
            <p className="rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
              {lead.publicTrackingNote || "No public tracking note set yet."}
            </p>
          </div>
          <div className="mt-8 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Message
            </p>
            <p className="rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
              {lead.message || "No message provided."}
            </p>
          </div>
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
              Submitted form answers
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {objectEntries(lead.formData as Record<string, unknown>).map(([key, value]) => (
                <div
                  className="rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-4"
                  key={String(key)}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-navy-soft)]">
                    {getReadableFieldLabel(String(key), fieldMap.get(String(key))?.label)}
                  </p>
                  <div className="mt-2">
                    {renderFieldValue(value, fieldMap.get(String(key))?.type)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <LeadNotes leadId={lead.id} notes={lead.notes} />
        <LeadActivityTimeline activities={lead.activities} />
      </section>
      <aside className="space-y-6">
        <LeadPublicTrackingForm
          leadId={lead.id}
          publicTrackingNote={lead.publicTrackingNote}
          publicTrackingStatus={lead.publicTrackingStatus as PublicTrackingStatus | null}
          trackingCategory={lead.trackingCategory as TrackingCategory | null}
          trackingOption={lead.trackingOption}
          trackingReference={lead.trackingReference}
        />
        <LeadStatusForm currentStatus={lead.status as LeadStatus} leadId={lead.id} />
        <FollowUpDateForm
          followUpDate={lead.followUpDate ? lead.followUpDate.toISOString().slice(0, 10) : ""}
          leadId={lead.id}
        />
        <DeleteLeadCard isArchived={Boolean(lead.deletedAt)} leadId={lead.id} />
        <div className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 text-[var(--color-navy)] shadow-[0_20px_48px_rgba(17,32,49,0.08)]">
          <p className="section-kicker">Quick actions</p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
            Open a drafted response fast when you are ready to follow up.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <QuickActionLink href={`/admin/leads/${lead.id}/download`} label="Download completed form" />
            {lead.email ? (
              <QuickActionLink
                href={`mailto:${lead.email}?subject=${encodeURIComponent(`Your ${lead.serviceName} Request`)}&body=${encodeURIComponent(`Hello ${lead.fullName},`)}`}
                label="Open email draft"
              />
            ) : null}
            {whatsappLink ? (
              <QuickActionLink
                href={whatsappLink}
                label="Open WhatsApp"
                rel="noreferrer"
                target="_blank"
              />
            ) : null}
            {trackingUrl ? (
              <QuickActionLink
                href={trackingUrl}
                label="Open public tracking page"
                rel="noreferrer"
                target="_blank"
              />
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
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm leading-7 text-[var(--color-navy-soft)]">{value}</p>
    </div>
  );
}

function QuickActionLink({
  href,
  label,
  rel,
  target,
}: {
  href: string;
  label: string;
  rel?: string;
  target?: string;
}) {
  return (
    <a
      className="rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-navy)] hover:border-[rgba(177,138,81,0.24)] hover:bg-[rgba(234,217,188,0.24)]"
      href={href}
      rel={rel}
      target={target}
    >
      {label}
    </a>
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

function renderFieldValue(value: unknown, fieldType?: string): ReactNode {
  if (value == null || value === "") {
    return "Not provided";
  }

  if (fieldType === "file" && isStoredUploadFileArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm leading-7 text-[var(--color-navy)]">No files uploaded.</p>;
    }

    return (
      <div className="grid gap-3">
        {value.map((file, index) => (
          <UploadedFileCard file={file} index={index} key={`${file.name}-${index}`} />
        ))}
      </div>
    );
  }

  if (fieldType === "date" && typeof value === "string") {
    return <p className="break-words text-sm leading-7 text-[var(--color-navy)]">{formatDate(value)}</p>;
  }

  if (isFamilyMemberEntryArray(value)) {
    return (
      <div className="grid gap-3">
        {value.map((member, index) => (
          <div
            className="rounded-[18px] border border-[var(--color-line)] bg-[rgba(220,229,237,0.16)] px-3 py-3"
            key={`${member.memberFullName}-${index}`}
          >
            <p className="text-sm font-semibold text-[var(--color-navy)]">{member.memberFullName}</p>
            <p className="mt-1 text-xs leading-6 text-[var(--color-navy-soft)]">
              {member.relationship} • {formatDate(member.dateOfBirth)} • {member.occupation}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <p className="break-words text-sm leading-7 text-[var(--color-navy)]">{value ? "Yes" : "No"}</p>;
  }

  if (Array.isArray(value)) {
    return (
      <p className="break-words text-sm leading-7 text-[var(--color-navy)]">
        {formatFamilyMemberSummary(value) !== "No family members added"
          ? formatFamilyMemberSummary(value)
          : summarizeStoredUploadFiles(value)}
      </p>
    );
  }

  return <p className="break-words text-sm leading-7 text-[var(--color-navy)]">{String(value)}</p>;
}

function UploadedFileCard({ file, index }: { file: StoredUploadFile; index: number }) {
  const isImage = file.type.startsWith("image/");

  return (
    <div className="rounded-[20px] border border-[var(--color-line)] bg-white p-3">
        {isImage ? (
          <a className="block" href={file.dataUrl} rel="noreferrer" target="_blank">
            <div className="relative aspect-[20/9] w-full overflow-hidden rounded-[16px]">
              <Image
                alt={file.name}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                src={file.dataUrl}
                unoptimized
              />
            </div>
          </a>
        ) : null}
      <div className={isImage ? "mt-3 space-y-3" : "space-y-3"}>
        <div>
          <p className="text-sm font-semibold text-[var(--color-navy)]">{file.name}</p>
          <p className="mt-1 text-xs text-[var(--color-navy-soft)]">
            File {index + 1} • {Math.max(1, Math.round(file.size / 1024))} KB
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            className="rounded-full border border-[var(--color-line)] bg-[rgba(220,229,237,0.26)] px-3 py-1.5 text-xs font-semibold text-[var(--color-navy)] hover:border-[rgba(177,138,81,0.24)] hover:bg-[rgba(234,217,188,0.24)]"
            href={file.dataUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open
          </a>
          <a
            className="rounded-full border border-[var(--color-line)] bg-[rgba(220,229,237,0.26)] px-3 py-1.5 text-xs font-semibold text-[var(--color-navy)] hover:border-[rgba(177,138,81,0.24)] hover:bg-[rgba(234,217,188,0.24)]"
            download={file.name}
            href={file.dataUrl}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
