import { CheckCircle2, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { ContactRequestForm } from "@/components/forms/contact-request-form";
import { BUSINESS_DETAILS } from "@/lib/services";

const proofPoints = [
  {
    title: "Rome office contact details",
    body: BUSINESS_DETAILS.address,
    icon: MapPin,
  },
  {
    title: "Structured request follow-up",
    body: "Every enquiry is routed through a dedicated contact or service form instead of a generic inbox-only process.",
    icon: CheckCircle2,
  },
  {
    title: "Clear support boundaries",
    body: "Liberty is presented as a document preparation service, not an issuing authority, embassy, or government agency.",
    icon: ShieldCheck,
  },
  {
    title: "Fast WhatsApp path",
    body: "Visitors can move from the homepage into WhatsApp support or a service-specific request without extra friction.",
    icon: MessageCircle,
  },
];

export function HomeRequestSection() {
  return (
    <section className="section-band py-20 sm:py-28" data-animate-section>
      <div className="container-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="space-y-7" data-animate-text>
          <p className="section-kicker">Request support</p>
          <h2 className="section-title text-balance">
            Start with a real support form, not just a brochure page.
          </h2>
          <p className="section-description">
            Use the form to tell Liberty what document support you need, how you want to be contacted, and what should happen next. This gives visitors a direct conversion path from the homepage.
          </p>
          <div className="grid gap-4" data-animate-list>
            {proofPoints.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="rounded-[26px] border border-[rgba(17,32,49,0.08)] bg-white/76 p-5 shadow-[0_18px_40px_rgba(17,32,49,0.08)]"
                  data-animate-card
                  key={item.title}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0f3829] text-[#ead7a4]">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--color-navy)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-navy-soft)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div data-animate-visual>
          <ContactRequestForm />
        </div>
      </div>
    </section>
  );
}
