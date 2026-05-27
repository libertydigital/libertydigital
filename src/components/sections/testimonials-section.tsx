import { Quote } from "lucide-react";

import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { SectionShell } from "@/components/layout/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { revealScale } from "@/lib/animations";

const testimonials = [
  {
    label: "Rome Consultancy",
    quote:
      "Strategically located to assist the Nigerian community across Italy with document preparation and advice.",
  },
  {
    label: "Portal Precision",
    quote:
      "We navigate the technical requirements of official Nigerian immigration and identity portals so you don't have to.",
  },
  {
    label: "Appointment Readiness",
    quote:
      "Get exactly what you need for your embassy appointments. We ensure your paperwork is complete and correct.",
  },
];

export function TestimonialsSection() {
  return (
    <SectionShell id="testimonials" tone="premium-light">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="section-kicker">
            Why Choose Liberty
          </p>
          <h2 className="mt-4 font-serif text-[2.55rem] font-semibold leading-[0.96] text-[var(--color-navy)] sm:text-6xl">
            Reliable support for your digital applications.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[rgba(17,32,49,0.68)] sm:text-base sm:leading-8">
            We simplify the complexities of Nigerian administrative portals, providing a 
            seamless bridge between you and your required documentation.
          </p>
        </Reveal>

        <StaggerReveal className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <Reveal key={item.label} variants={revealScale}>
              <Card className="group h-full overflow-hidden rounded-[30px] border-[rgba(17,32,49,0.08)] bg-white/76 p-0 text-[var(--color-navy)] shadow-[0_22px_54px_rgba(17,32,49,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(177,138,81,0.28)]">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote className="size-8 text-[var(--color-gold)]" />
                  <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                    {item.label}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[rgba(17,32,49,0.72)]">
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
