import { Quote } from "lucide-react";

import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { SectionShell } from "@/components/layout/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { revealScale } from "@/lib/animations";

const testimonials = [
  {
    label: "Homepage clarity",
    quote:
      "The experience is structured around choosing a service, submitting details, and receiving next-step guidance.",
  },
  {
    label: "Service trust",
    quote:
      "The pages avoid overclaiming and keep the offer focused on preparation support, document guidance, and follow-up.",
  },
  {
    label: "Conversion path",
    quote:
      "Every primary section points visitors toward the service catalogue or contact request instead of decorative dead ends.",
  },
];

export function TestimonialsSection() {
  return (
    <SectionShell className="bg-[var(--color-obsidian)]" id="testimonials">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="section-kicker text-[var(--color-gold-soft)]">
            Experience proof
          </p>
          <h2 className="mt-4 font-serif text-[2.55rem] font-semibold leading-[0.96] text-white sm:text-6xl">
            Trust signals without unsupported claims.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/66 sm:text-base sm:leading-8">
            These cards describe verifiable site behaviors from this codebase
            instead of inventing client reviews or fake performance numbers.
          </p>
        </Reveal>

        <StaggerReveal className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <Reveal key={item.label} variants={revealScale}>
              <Card className="group h-full overflow-hidden rounded-[30px] p-0 transition duration-300 hover:-translate-y-1 hover:border-[rgba(233,212,171,0.34)]">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote className="size-8 text-[var(--color-gold-soft)]" />
                  <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold-soft)]">
                    {item.label}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    {item.quote}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </StaggerReveal>
      </div>
    </SectionShell>
  );
}
