import { ButtonLink } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-14 sm:py-20" data-animate-section>
      <div className="container-shell">
        <div
          className="premium-panel relative overflow-hidden rounded-[32px] px-5 py-9 text-[var(--color-navy)] sm:rounded-[40px] sm:px-10 sm:py-12 lg:px-14 lg:py-14"
          data-animate-visual
        >
          <div className="absolute left-[-4rem] top-[-4rem] h-40 w-40 rounded-full bg-[rgba(234,217,188,0.16)] blur-3xl" />
          <div className="absolute right-[-2rem] top-10 h-52 w-52 rounded-full bg-[rgba(109,132,153,0.16)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_34%,rgba(17,32,49,0.03)_64%,transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,32,49,0.025)_1px,transparent_1px),linear-gradient(180deg,rgba(17,32,49,0.016)_1px,transparent_1px)] bg-[size:140px_140px] opacity-20" />
          <div className="relative grid gap-7 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div data-animate-text>
              <p className="section-kicker">Next step</p>
              <h2 className="mt-3 max-w-3xl font-serif text-[2.45rem] font-semibold leading-[0.96] sm:mt-4 sm:text-5xl sm:leading-[0.98] lg:text-[3.65rem]">
                Need help with a Nigerian documentation request?
              </h2>
              <p className="mt-4 max-w-2xl text-[0.96rem] leading-7 text-[color:rgba(17,32,49,0.82)] sm:mt-6 sm:text-base sm:leading-8">
                Start with the service that matches your request and the team will review your details before following up with next steps.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4" data-animate-cta>
                <ButtonLink
                  className="bg-[linear-gradient(135deg,#f7efe4_0%,#e7d3ad_100%)] text-[var(--color-navy)] hover:brightness-105"
                  href="/services"
                >
                  Start Your Request
                </ButtonLink>
                <p className="text-sm leading-7 text-[color:rgba(17,32,49,0.76)]">
                  Service-specific request forms. Structured follow-up. Rome office contact details.
                </p>
              </div>
            </div>
            <div className="rounded-[26px] border border-[rgba(17,32,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(246,240,231,0.84))] p-5 backdrop-blur-sm sm:rounded-[30px] sm:p-6" data-animate-card>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                What happens next
              </p>
              <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                {[
                  "Choose the service that matches your request.",
                  "Submit your details through the service-specific form.",
                  "Liberty reviews your request and contacts you with next steps.",
                ].map((item, index) => (
                  <div
                    className="flex items-start gap-3 rounded-[20px] border border-[rgba(17,32,49,0.08)] bg-white/72 px-4 py-3 sm:gap-4 sm:rounded-[22px] sm:py-4"
                    key={item}
                  >
                    <div className="flex size-8 items-center justify-center rounded-full border border-[rgba(177,138,81,0.22)] bg-[rgba(234,217,188,0.18)] text-xs font-semibold text-[var(--color-gold)] sm:size-9">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-6 text-[color:rgba(17,32,49,0.82)] sm:leading-7">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
