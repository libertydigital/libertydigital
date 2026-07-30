import type { Metadata } from "next";
import { Clock3, FileSearch, ShieldCheck } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";
import { BUSINESS_DETAILS } from "@/lib/services";
import {
  getPublicTrackingStatusLabel,
  getTrackingCategoryNote,
  getTrackingCategoryLabel,
  getTrackingTimeline,
  TRACKING_EXAMPLE_RESULT,
  TRACKING_LOOKUP_FIELDS,
  TRACKING_RESULT_FIELDS,
  TRACKING_SERVICE_RULES,
} from "@/lib/tracking";
import { buildWhatsAppLink, formatDateTime, sanitizePhoneNumber } from "@/lib/utils";
import {
  buildPageMetadata,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/lib/seo";

const whatsappLink =
  buildWhatsAppLink(
    BUSINESS_DETAILS.phone,
    "Hello Liberty Digital Consulting, I want to check the status of my document request.",
  ) ?? `https://wa.me/${BUSINESS_DETAILS.phone.replace(/[^\d]/g, "")}`;

export const metadata: Metadata = buildPageMetadata({
  title: "Track Your Document Request Online",
  description:
    "Track your Liberty Digital Consulting document request online with your reference number and phone number.",
  path: "/track-request",
});

const trackingSteps = [
  {
    title: "Use your request reference",
    description:
      "Enter the tracking reference sent after your service request was submitted. It usually starts with LDC.",
    icon: FileSearch,
  },
  {
    title: "Add the submitted phone number",
    description:
      "Use the same phone or WhatsApp number you gave Liberty Digital Consulting when you made the request.",
    icon: Clock3,
  },
  {
    title: "Read the latest public update",
    description:
      "If a match is found, you will see the service, request type, current status, timeline, last update, and a short note.",
    icon: ShieldCheck,
  },
] as const;

type TrackRequestPageProps = {
  searchParams?: Promise<{
    referenceNumber?: string;
    phoneNumber?: string;
  }>;
};

export default async function TrackRequestPage({ searchParams }: TrackRequestPageProps) {
  const params = (await searchParams) ?? {};
  const referenceNumber = params.referenceNumber?.trim() ?? "";
  const phoneNumber = params.phoneNumber?.trim() ?? "";
  const lookupAttempted = referenceNumber.length > 0 || phoneNumber.length > 0;
  const trackingResult = await getTrackingLookupResult(referenceNumber, phoneNumber);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createWebPageSchema({
              title: "Track Your Document Request Online",
              description:
                "Track your Liberty Digital Consulting document request online with your reference number and phone number.",
              path: "/track-request",
            }),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createBreadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Track Request", path: "/track-request" },
            ]),
          ),
        }}
        type="application/ld+json"
      />

      <section className="section-band py-18" data-animate-section>
        <div className="container-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6" data-animate-text>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Track Request" },
              ]}
            />
            <p className="section-kicker">Track Request</p>
            <h1 className="font-serif text-[2.45rem] font-semibold leading-[0.98] text-[var(--color-navy)] sm:text-5xl sm:leading-tight">
              Track your Liberty Digital Consulting document request.
            </h1>
            <p className="text-base leading-8 text-[var(--color-navy-soft)]">
              Use this page to check the latest public update for a document support
              request handled by Liberty Digital Consulting Services in Rome. You
              only need your request reference number and the phone number used on
              the original form.
            </p>

            <div className="surface-card rounded-[32px] p-6" data-animate-card>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                How to use this page
              </p>
              <div className="mt-5 grid gap-4">
                {trackingSteps.map(({ title, description, icon: Icon }) => (
                  <div
                    className="rounded-[24px] border border-[var(--color-line)] bg-white/80 p-4"
                    key={title}
                  >
                    <div className="flex items-start gap-4">
                      <span className="inline-flex size-11 items-center justify-center rounded-full border border-[rgba(177,138,81,0.2)] bg-[rgba(234,217,188,0.24)] text-[var(--color-navy)]">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <h2 className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                          {title}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-navy-soft)]">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-[32px] p-6" data-animate-card>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                What the tracker shows
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                For privacy, the tracker only shows the update you need to follow
                your request. It does not display private documents, internal notes,
                payment details, or full application records.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {TRACKING_RESULT_FIELDS.map((field) => (
                  <div
                    className="rounded-[20px] border border-[var(--color-line)] bg-white/80 px-4 py-4"
                    key={field}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                      {field}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6" data-animate-visual>
            <div className="surface-card rounded-[32px] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Tracking portal
              </p>
              <h2 className="mt-4 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                Enter your request details
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                Type your reference number exactly as it appears in your Liberty
                Digital confirmation, then enter the phone number attached to that
                request. Both details are required so your update is not shown to
                the wrong person.
              </p>
              <form className="mt-6 space-y-5">
                {TRACKING_LOOKUP_FIELDS.map((field) => (
                  <label className="block space-y-2" key={field.name}>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                      {field.label}
                    </span>
                    <input
                      className="w-full rounded-[20px] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-sm text-[var(--color-navy)] shadow-sm outline-none"
                      defaultValue={field.name === "referenceNumber" ? referenceNumber : phoneNumber}
                      name={field.name}
                      placeholder={field.placeholder}
                      type="text"
                    />
                  </label>
                ))}
                <button className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#fff8ec_0%,#e9d4ab_48%,#c89f63_100%)] px-5 py-3 text-sm font-semibold tracking-wide text-[var(--color-navy)] shadow-[0_20px_42px_rgba(4,10,18,0.18)]" type="submit">
                  Check request status
                </button>
              </form>
              {lookupAttempted ? (
                <div className="mt-5 rounded-[24px] border border-[var(--color-line)] bg-white/78 px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                  {trackingResult.databaseUnavailable ? (
                    <p className="text-amber-800">
                      Tracking is temporarily unavailable because the request database could not be reached. Please try again shortly or contact the team directly.
                    </p>
                  ) : trackingResult.found ? (
                    <p className="text-emerald-800">
                      Request found. Your latest public tracking details are shown below.
                    </p>
                  ) : (
                    <p className="text-rose-700">
                      No request matched that reference number and phone number combination.
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="surface-card rounded-[32px] p-6" data-animate-card>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Understanding your timeline
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                Different document requests move at different speeds. Passport
                support, appointment preparation, and general document requests can
                have different timelines depending on the service type and how
                complete the submitted information is.
              </p>
              <div className="mt-5 space-y-4">
                {TRACKING_SERVICE_RULES.map((rule) => (
                  <div
                    className="rounded-[24px] border border-[var(--color-line)] bg-white/80 p-4"
                    key={rule.key}
                  >
                    <div className="flex items-start gap-4">
                      <span className="inline-flex size-11 items-center justify-center rounded-full border border-[rgba(177,138,81,0.2)] bg-[rgba(234,217,188,0.24)] text-[var(--color-navy)]">
                        <Clock3 className="size-5" />
                      </span>
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                          {rule.label}
                        </h3>
                        <p className="text-sm leading-7 text-[var(--color-navy-soft)]">
                          <span className="font-semibold text-[var(--color-navy)]">Options:</span>{" "}
                          {rule.options.join(", ")}
                        </p>
                        <p className="text-sm leading-7 text-[var(--color-navy-soft)]">
                          <span className="font-semibold text-[var(--color-navy)]">Timeline:</span>{" "}
                          {rule.timeline}
                        </p>
                        <p className="text-sm leading-7 text-[var(--color-navy-soft)]">
                          <span className="font-semibold text-[var(--color-navy)]">Note:</span>{" "}
                          {rule.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-[32px] p-6" data-animate-card>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Your tracking result
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                After a successful search, the result card below shows the current
                public update for your request. If you have not searched yet, it
                shows an example of the type of information you can expect.
              </p>
              <div className="mt-5 rounded-[24px] border border-[var(--color-line)] bg-white/82 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <ResultItem
                    label="Request ID"
                    value={
                      trackingResult.found
                        ? trackingResult.requestId
                        : TRACKING_EXAMPLE_RESULT.requestId
                    }
                  />
                  <ResultItem
                    label="Service"
                    value={
                      trackingResult.found
                        ? trackingResult.service
                        : TRACKING_EXAMPLE_RESULT.service
                    }
                  />
                  <ResultItem
                    label="Option"
                    value={
                      trackingResult.found
                        ? trackingResult.option
                        : TRACKING_EXAMPLE_RESULT.option
                    }
                  />
                  <ResultItem
                    label="Status"
                    value={
                      trackingResult.found
                        ? trackingResult.status
                        : TRACKING_EXAMPLE_RESULT.status
                    }
                  />
                  <ResultItem
                    label="Estimated timeline"
                    value={
                      trackingResult.found
                        ? trackingResult.estimatedTimeline
                        : TRACKING_EXAMPLE_RESULT.estimatedTimeline
                    }
                  />
                  <ResultItem
                    label="Last updated"
                    value={
                      trackingResult.found
                        ? trackingResult.lastUpdated
                        : TRACKING_EXAMPLE_RESULT.lastUpdated
                    }
                  />
                </div>
                <div className="mt-4 rounded-[20px] border border-[var(--color-line)] bg-[rgba(246,248,251,0.9)] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                    Note
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-navy)]">
                    {trackingResult.found ? trackingResult.note : TRACKING_EXAMPLE_RESULT.note}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card rounded-[32px] p-6" data-animate-card>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                Need help with your request?
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-navy-soft)]">
                <p>
                  If the tracker cannot find your request, check that the reference
                  number and phone number are typed correctly. Use the exact phone
                  number you submitted, including the country code when possible.
                </p>
                <p>
                  If your details are correct and you still cannot see an update,
                  contact the Liberty Digital team with your reference number so
                  they can review the request manually.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={whatsappLink}>
                  Ask on WhatsApp
                </ButtonLink>
                <ButtonLink
                  className="border-[rgba(17,32,49,0.1)] bg-white/80 text-[var(--color-navy)] hover:bg-white"
                  href="/contact"
                  variant="secondary"
                >
                  Contact the team
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

async function getTrackingLookupResult(referenceNumber: string, phoneNumber: string) {
  if (!referenceNumber || !phoneNumber) {
    return { found: false as const, databaseUnavailable: false as const };
  }

  const normalizedPhone = sanitizePhoneNumber(phoneNumber);

  if (!normalizedPhone) {
    return { found: false as const, databaseUnavailable: false as const };
  }

  try {
    const prisma = getPrisma();
    const lead = await prisma.lead.findFirst({
      where: {
        trackingReference: referenceNumber.toUpperCase(),
        deletedAt: null,
      },
      select: {
        trackingReference: true,
        phone: true,
        whatsapp: true,
        serviceName: true,
        trackingCategory: true,
        trackingOption: true,
        publicTrackingStatus: true,
        publicTrackingNote: true,
        trackingLastUpdatedAt: true,
        updatedAt: true,
      },
    });

    if (!lead) {
      return { found: false as const, databaseUnavailable: false as const };
    }

    const matchesPhone = [lead.phone, lead.whatsapp]
      .filter(Boolean)
      .some((value) => sanitizePhoneNumber(value) === normalizedPhone);

    if (!matchesPhone) {
      return { found: false as const, databaseUnavailable: false as const };
    }

    return {
      found: true as const,
      databaseUnavailable: false as const,
      requestId: lead.trackingReference,
      service:
        getTrackingCategoryLabel(lead.trackingCategory) === "Not set"
          ? lead.serviceName
          : getTrackingCategoryLabel(lead.trackingCategory),
      option: lead.trackingOption || "General request",
      status: getPublicTrackingStatusLabel(lead.publicTrackingStatus),
      estimatedTimeline: getTrackingTimeline(lead.trackingCategory),
      lastUpdated: formatDateTime(lead.trackingLastUpdatedAt ?? lead.updatedAt),
      note: lead.publicTrackingNote || getTrackingCategoryNote(lead.trackingCategory),
    };
  } catch {
    return { found: false as const, databaseUnavailable: true as const };
  }
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-[var(--color-line)] bg-[rgba(246,248,251,0.9)] px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-7 text-[var(--color-navy)]">{value}</p>
    </div>
  );
}
