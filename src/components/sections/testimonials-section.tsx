import { ClipboardCheck, MapPinCheck, ShieldCheck } from "lucide-react";

import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { SectionShell } from "@/components/layout/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { revealScale } from "@/lib/animations";

const capabilities = [
  {
    label: "Rome-based support",
    description:
      "A physical contact point in Rome for Nigerians and diaspora residents who want help organising document requests before the official step.",
    icon: MapPinCheck,
  },
  {
    label: "Preparation first",
    description:
      "Clear checklists and authority-aware guidance help you identify the right route before you share unnecessary documents or pay for the wrong process.",
    icon: ClipboardCheck,
  },
  {
    label: "Independent guidance",
    description:
      "Liberty separates its preparation role from the government, bank, embassy, NIMC, NIS, NPC or other authority that controls official outcomes.",
    icon: ShieldCheck,
  },
];

export function TestimonialsSection() {
  return (
    <SectionShell data-social-proof id="testimonials" tone="premium-light">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="section-kicker">Why Choose Liberty</p>
          <h2 className="mt-4 font-serif text-[2.55rem] font-semibold leading-[0.96] text-[var(--color-navy)] sm:text-6xl">
            Clear preparation before the official process.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[rgba(17,32,49,0.68)] sm:text-base sm:leading-8">
            Liberty helps you organise the information, questions and document
            checklist for your case while keeping official decisions where they
            belong: with the relevant authority.
          </p>
        </Reveal>

        <StaggerReveal className="grid gap-5 md:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.label} variants={revealScale}>
                <Card className="group h-full overflow-hidden rounded-[30px] border-[rgba(17,32,49,0.08)] bg-white/76 p-0 text-[var(--color-navy)] shadow-[0_22px_54px_rgba(17,32,49,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(177,138,81,0.28)]">
                  <CardContent className="flex h-full flex-col p-6">
                    <Icon className="size-8 text-[var(--color-gold)]" />
                    <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                      {item.label}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[rgba(17,32,49,0.72)]">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </StaggerReveal>
      </div>
    </SectionShell>
  );
}
