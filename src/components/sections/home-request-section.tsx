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
    body: "We keep a record of your request so the team can follow up with the relevant next step.",
    icon: CheckCircle2,
  },
  {
    title: "Clear support boundaries",
    body: "We help you prepare documents; only the relevant authorities can approve or issue them.",
    icon: ShieldCheck,
  },
  {
    title: "Fast WhatsApp path",
    body: "Message the team if you want help deciding which service fits your situation.",
    icon: MessageCircle,
  },
];

export function HomeRequestSection() {
  return (
    <section className="surface-base py-[var(--section-py)] lg:py-[var(--section-py-lg)]" data-animate-section>
      <div className="container-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <div className="space-y-7" data-animate-text>
          <p className="section-kicker">Request support</p>
          <h2 className="section-title text-balance">
            Tell us what you need. We will explain the next step.
          </h2>
          <p className="section-description">
            Share your name, a contact number and a short description of your request. We will review it and contact you about the right preparation route. No document uploads are needed at this stage.
          </p>
          <div className="grid gap-4" data-animate-list>
            {proofPoints.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="surface-raised rounded-[26px] p-5"
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
