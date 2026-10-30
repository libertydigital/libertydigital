import { MessageCircle } from "lucide-react";

import { TrackedAnchor, TrackedLink } from "@/components/analytics/tracked-link";
import type { ServiceContent } from "@/lib/services";
import { BUSINESS_DETAILS } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/utils";

export function ServiceMobileActions({ service }: { service: ServiceContent }) {
  const path = `/services/${service.slug}`;
  const whatsappLink = buildWhatsAppLink(
    BUSINESS_DETAILS.phone,
    `Hello Liberty Digital Consulting, I need help with ${service.shortLabel}. Please explain the next step and support fee.`,
  );

  return (
    <nav
      aria-label="Service enquiry actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e2d7c1] bg-[#fffaf3]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_38px_rgba(10,25,18,0.16)] backdrop-blur-lg lg:hidden"
      data-mobile-service-cta
    >
      <div className="mx-auto flex max-w-xl gap-3">
        <TrackedLink
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#103729] px-4 text-center text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b18a51]"
          eventData={{ page: path, placement: "mobile_sticky", serviceSlug: service.slug }}
          eventName="service_cta_click"
          href="#service-form"
        >
          Request support
        </TrackedLink>
        {whatsappLink ? (
          <TrackedAnchor
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#103729] bg-white px-4 text-center text-sm font-bold text-[#103729] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b18a51]"
            eventData={{ page: path, placement: "mobile_sticky", serviceSlug: service.slug }}
            eventName="whatsapp_click"
            href={whatsappLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle aria-hidden="true" className="size-4" /> WhatsApp
          </TrackedAnchor>
        ) : null}
      </div>
    </nav>
  );
}
