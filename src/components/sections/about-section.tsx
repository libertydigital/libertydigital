import Image from "next/image";
import { CheckCircle2, MapPin, ShieldCheck } from "lucide-react";

import { Reveal, StaggerReveal } from "@/components/animations/reveal";
import { SectionShell } from "@/components/layout/section-shell";
import { Card } from "@/components/ui/card";
import { revealScale, revealUp } from "@/lib/animations";
import { BUSINESS_DETAILS } from "@/lib/services";

const proofPoints = [
  "NIN Centre in Rome and BVN Centre in Rome with certified guidance for official portals.",
  "Direct physical support in our Rome office for document auditing, NIN, and BVN verification.",
  "Rigorous data auditing to eliminate clerical errors and prevent application rejections.",
];

export function AboutSection() {
  return (
    <SectionShell id="about" tone="premium-light">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal variants={revealScale}>
          <div className="relative min-h-[34rem] overflow-hidden rounded-[34px] border border-[rgba(17,32,49,0.08)] shadow-[0_34px_90px_rgba(17,32,49,0.18)]">
            <Image
              alt="Liberty Digital Consulting Services office in Rome"
              className="h-full w-full object-cover"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              src="/liberty-office-about-1.jpeg"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,16,0.06),rgba(7,11,16,0.78))]" />
            <Card className="absolute inset-x-5 bottom-5 rounded-[26px] border-white/16 bg-[linear-gradient(180deg,rgba(9,15,22,0.76),rgba(9,15,22,0.58))] p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(233,212,171,0.14)] text-[var(--color-gold-soft)]">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-gold-soft)]">
                    Rome office
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/80">
                    {BUSINESS_DETAILS.address}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="section-kicker">
              Your Documentation Partner
            </p>
            <h2 className="mt-4 max-w-3xl font-serif text-[2.8rem] font-semibold leading-[0.95] text-[var(--color-navy)] sm:text-6xl">
              Rome&apos;s trusted NIN Centre & BVN Centre for Nigerian nationals.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[rgba(17,32,49,0.72)]">
              Processing Nigerian Passports, National Identification Numbers (NIN), or Bank Verification Numbers (BVN) from abroad can be complex. 
              Our NIN Centre in Rome and BVN Centre in Rome provide professional services, ensuring your applications are handled with 
              precision and expert care directly from our consultancy office location.
            </p>
          </Reveal>

          <StaggerReveal className="mt-8 grid gap-4">
            {proofPoints.map((point) => (
              <Reveal
                className="flex items-start gap-4 rounded-[24px] border border-[rgba(17,32,49,0.08)] bg-white/70 p-5 shadow-[0_18px_42px_rgba(17,32,49,0.08)] backdrop-blur-xl"
                key={point}
                variants={revealUp}
              >
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-[var(--color-gold)]" />
                <p className="text-sm leading-7 text-[rgba(17,32,49,0.74)]">{point}</p>
              </Reveal>
            ))}
          </StaggerReveal>

          <Reveal className="mt-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(17,32,49,0.08)] bg-white/76 px-4 py-3 text-sm text-[rgba(17,32,49,0.72)] shadow-[0_16px_34px_rgba(17,32,49,0.08)] backdrop-blur-xl">
              <ShieldCheck className="size-4 text-[var(--color-gold)]" />
              Preparation support only. Official issuance remains with the
              relevant official process.
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
