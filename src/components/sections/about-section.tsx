import Image from "next/image";
import { CheckCircle2, MapPin, ShieldCheck } from "lucide-react";

import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { SectionShell } from "@/components/layout/section-shell";
import { Card } from "@/components/ui/card";
import { revealScale, revealUp } from "@/lib/animations";
import { BUSINESS_DETAILS } from "@/lib/services";

const proofPoints = [
  "Service-specific intake instead of one generic enquiry form.",
  "Preparation-focused copy that avoids claiming official issuance.",
  "Visible office, phone, and email details for direct follow-up.",
];

export function AboutSection() {
  return (
    <SectionShell className="bg-[var(--color-obsidian)]" id="about">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal variants={revealScale}>
          <div className="relative min-h-[34rem] overflow-hidden rounded-[34px] border border-white/10 shadow-[0_34px_100px_rgba(2,6,12,0.42)]">
            <Image
              alt="Liberty Digital Consulting Services office in Rome"
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              src="/liberty-office-about-1.jpeg"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,16,0.06),rgba(7,11,16,0.78))]" />
            <Card className="absolute inset-x-5 bottom-5 rounded-[26px] p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(233,212,171,0.14)] text-[var(--color-gold-soft)]">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-gold-soft)]">
                    Rome office
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/76">
                    {BUSINESS_DETAILS.address}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="section-kicker text-[var(--color-gold-soft)]">
              About Liberty
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-[2.8rem] font-semibold leading-[0.95] text-white sm:text-6xl">
              A premium digital front desk for documentation support requests.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/68">
              The site now frames Liberty Digital Consulting Services around a
              clear, credible support workflow: choose the service, submit the
              correct details, and receive follow-up guidance from the team.
            </p>
          </Reveal>

          <StaggerReveal className="mt-8 grid gap-4">
            {proofPoints.map((point) => (
              <Reveal
                className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl"
                key={point}
                variants={revealUp}
              >
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-[var(--color-gold-soft)]" />
                <p className="text-sm leading-7 text-white/74">{point}</p>
              </Reveal>
            ))}
          </StaggerReveal>

          <Reveal className="mt-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white/72 backdrop-blur-xl">
              <ShieldCheck className="size-4 text-[var(--color-gold-soft)]" />
              Preparation support only. Official issuance remains with the
              relevant official process.
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
