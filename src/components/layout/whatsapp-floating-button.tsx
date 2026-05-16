import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { BUSINESS_DETAILS } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/utils";

const WHATSAPP_MESSAGE =
  "Hello, I need help with a Nigerian documentation request in Rome.";

export function WhatsAppFloatingButton() {
  const whatsappLink = buildWhatsAppLink(BUSINESS_DETAILS.phone, WHATSAPP_MESSAGE);

  if (!whatsappLink) {
    return null;
  }

  return (
    <Link
      aria-label="Contact Liberty Digital on WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-3 rounded-full border border-[rgba(177,138,81,0.24)] bg-[linear-gradient(135deg,#153528_0%,#1f6a49_100%)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(8,22,16,0.26)] transition hover:-translate-y-0.5 hover:brightness-105 sm:bottom-6 sm:right-6"
      href={whatsappLink}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/12">
        <MessageCircle className="size-5" />
      </span>
      <span className="pr-1">Contact us</span>
    </Link>
  );
}
