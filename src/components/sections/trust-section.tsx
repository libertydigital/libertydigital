import { LockKeyhole, MapPinned, MessageSquareMore, ScrollText, Shield } from "lucide-react";

import { AnimatedList } from "@/components/animations/animated-list";
import { SectionHeading } from "@/components/ui/section-heading";

const trustItems = [
  {
    icon: ScrollText,
    title: "Clear service-by-service guidance",
    description:
      "Each request is presented with practical preparation notes, document expectations, and clearer next-step direction before you proceed.",
  },
  {
    icon: MessageSquareMore,
    title: "Structured request capture",
    description:
      "Every core service has its own intake flow, helping Liberty review enquiries with the right context from the start.",
  },
  {
    icon: MapPinned,
    title: "Visible Rome contact details",
    description:
      "The Rome address, email, and phone details stay easy to verify so visitors know exactly who they are contacting.",
  },
  {
    icon: Shield,
    title: "Support positioning that stays credible",
    description:
      "Liberty is framed as a documentation support service with guidance and preparation help, not as a government issuing authority.",
  },
  {
    icon: LockKeyhole,
    title: "Protected request handling",
    description:
      "Submitted enquiries are validated server-side and routed into a protected admin workflow for practical follow-up.",
  },
];

const processSignals = [
  {
    title: "Clear ways to verify and make contact",
    description:
      "Clear contact details, a visible Rome location, and a direct way to ask for help before they gather every document.",
  },
  {
    title: "Careful guidance before you proceed",
    description:
      "Service-specific request paths, practical preparation guidance, and support language that stays careful about official boundaries.",
  },
  {
    title: "Fewer avoidable follow-up questions",
    description:
      "A WhatsApp-first route for urgent questions, plus structured forms that reduce back-and-forth once they are ready to proceed.",
  },
];

export function TrustSection() {
  return (
    <section className="section-band relative overflow-hidden py-14 sm:py-20" data-animate-section>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[6%] top-12 h-44 w-44 rounded-full bg-[rgba(234,217,188,0.05)] blur-3xl" />
        <div className="absolute right-[8%] top-8 h-52 w-52 rounded-full bg-[rgba(109,132,153,0.05)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,32,49,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(17,32,49,0.022)_1px,transparent_1px)] bg-[size:132px_132px] opacity-15" />
      </div>
      <div className="container-shell">
        <SectionHeading
          description="The experience is designed to feel verified, practical, and respectful of documentation-sensitive requests from the first click to the follow-up."
          kicker="Trust signals"
          title="Built to feel credible, careful, and properly handled"
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3" data-animate-list>
          {processSignals.map((item) => (
            <article
              className="rounded-[24px] border border-[rgba(17,32,49,0.08)] bg-[rgba(255,255,255,0.7)] p-5 shadow-[0_18px_38px_rgba(17,32,49,0.08)] backdrop-blur-sm"
              data-animate-card
              key={item.title}
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Process benefit
              </p>
              <h3 className="mt-3 font-serif text-[1.35rem] font-semibold leading-tight text-[var(--color-navy)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:rgba(17,32,49,0.82)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
        <AnimatedList className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                className="trust-card relative flex h-full flex-col rounded-[26px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(244,238,229,0.88))] p-5 shadow-[0_22px_50px_rgba(4,10,18,0.1)] backdrop-blur-sm will-change-transform sm:rounded-[30px] sm:p-7"
                data-animate-card
                key={item.title}
              >
                <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-[rgba(177,138,81,0.22)] bg-[linear-gradient(135deg,rgba(234,217,188,0.38),rgba(255,255,255,0.6))] text-[var(--color-gold)] shadow-[0_14px_32px_rgba(4,10,18,0.1)] sm:size-14">
                  <Icon className="size-4 sm:size-5" />
                </div>
                <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)] sm:mt-6 sm:tracking-[0.28em]">
                  Trust point
                </p>
                <h3 className="mt-3 max-w-[15rem] font-serif text-[1.55rem] font-semibold leading-[0.98] text-[var(--color-navy)] sm:mt-4 sm:text-[1.9rem]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:rgba(17,32,49,0.82)] sm:mt-4 sm:leading-7">
                  {item.description}
                </p>
              </article>
            );
          })}
        </AnimatedList>
      </div>
    </section>
  );
}
