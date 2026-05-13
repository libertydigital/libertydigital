import { AnimatedList } from "@/components/animations/animated-list";
import { SectionHeading } from "@/components/ui/section-heading";

const processSteps = [
  {
    title: "Choose your service",
    description: "Select the documentation support request that matches your situation.",
  },
  {
    title: "Submit your request",
    description: "Complete the service-specific form with the details Liberty needs to review.",
  },
  {
    title: "Internal review",
    description: "Liberty Digital Consulting checks the request, documents, and preparation needs.",
  },
  {
    title: "Get next-step guidance",
    description: "The team contacts you with practical instructions and follow-up direction.",
  },
  {
    title: "Prepare and proceed",
    description: "You organise the required documents and continue with the relevant process.",
  },
];

export function ProcessSection() {
  return (
    <section className="section-band-deep relative overflow-hidden py-14 sm:py-20" data-animate-dark-section>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
      >
        <div className="absolute left-[8%] top-10 h-40 w-40 rounded-full bg-[rgba(234,217,188,0.06)] blur-3xl" />
        <div className="absolute right-[10%] top-16 h-48 w-48 rounded-full bg-[rgba(109,132,153,0.06)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(17,32,49,0.03))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,32,49,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(17,32,49,0.025)_1px,transparent_1px)] bg-[size:120px_120px] opacity-20" />
      </div>
      <div className="container-shell">
        <SectionHeading
          description="A straightforward request flow built for clear guidance, clean handover, and follow-up after submission."
          kicker="How it works"
          title="Simple request handling with clear next steps"
        />
        <div className="relative mt-8 sm:mt-14">
          <div
            aria-hidden="true"
            className="absolute left-6 right-6 top-8 hidden h-px bg-[linear-gradient(90deg,rgba(234,217,188,0.08),rgba(234,217,188,0.4),rgba(234,217,188,0.08))] lg:block"
          />
          <AnimatedList className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-5">
            {processSteps.map((step, index) => (
              <article
                className="process-card relative flex h-full flex-col rounded-[26px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(244,238,229,0.88))] p-5 shadow-[0_20px_45px_rgba(4,10,18,0.1)] backdrop-blur-sm will-change-transform sm:rounded-[30px] sm:p-6"
                data-animate-card
                key={step.title}
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-full border border-[rgba(177,138,81,0.22)] bg-[linear-gradient(135deg,rgba(234,217,188,0.38),rgba(255,255,255,0.6))] text-xs font-semibold tracking-[0.14em] text-[var(--color-gold)] shadow-[0_12px_30px_rgba(4,10,18,0.1)] sm:size-12 sm:text-sm">
                    0{index + 1}
                  </div>
                  <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(234,217,188,0.28),rgba(255,255,255,0))] lg:hidden" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)] sm:mt-6 sm:tracking-[0.28em]">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 max-w-[13rem] font-serif text-[1.55rem] font-semibold leading-[0.98] text-[var(--color-navy)] sm:mt-4 sm:text-[1.9rem]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:rgba(17,32,49,0.82)] sm:mt-4 sm:leading-7">
                  {step.description}
                </p>
              </article>
            ))}
          </AnimatedList>
        </div>
      </div>
    </section>
  );
}
