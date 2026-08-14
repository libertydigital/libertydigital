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
    <section className="surface-raised-band relative overflow-hidden py-[var(--section-py)] lg:py-[var(--section-py-lg)]" data-animate-dark-section>
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
                className="surface-card relative flex h-full flex-col rounded-[26px] p-5 sm:rounded-[30px] sm:p-6"
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
