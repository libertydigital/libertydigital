import { ButtonLink } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="surface-brand relative overflow-hidden py-[var(--section-py)] text-white lg:py-[var(--section-py-lg)]" data-animate-section>
      <div className="passport-security-pattern absolute inset-0 opacity-24" />
      <div className="container-shell relative">
        <div className="relative" data-animate-visual>
          <div className="grid gap-7 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div data-animate-text>
              <p className="section-kicker text-[#d9bd7c]">Next step</p>
              <h2 className="mt-3 max-w-3xl font-serif text-[2.45rem] font-semibold leading-[0.96] text-[#fff9ed] sm:mt-4 sm:text-5xl sm:leading-[0.98] lg:text-[3.65rem]">
                Need help with a Nigerian documentation request?
              </h2>
              <p className="mt-4 max-w-2xl text-[0.96rem] leading-7 text-white/68 sm:mt-6 sm:text-base sm:leading-8">
                Start with the service that matches your request and the team will review your details before following up with next steps.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4" data-animate-cta>
                <ButtonLink
                  className="bg-[linear-gradient(135deg,#f7efe4_0%,#e7d3ad_100%)] text-[var(--color-navy)] hover:brightness-105"
                  href="/services"
                >
                  Start Your Request
                </ButtonLink>
                <p className="text-sm leading-7 text-white/62">
                  Service-specific request forms. Structured follow-up. Rome office contact details.
                </p>
              </div>
            </div>
            <div className="rounded-[26px] border border-white/12 bg-white/[0.05] p-5 sm:rounded-[30px] sm:p-6" data-animate-card>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#d9bd7c]">
                What happens next
              </p>
              <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
                {[
                  "Choose the service that matches your request.",
                  "Submit your details through the service-specific form.",
                  "Liberty reviews your request and contacts you with next steps.",
                ].map((item, index) => (
                  <div
                    className="flex items-start gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0 sm:gap-4 sm:pb-4"
                    key={item}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#d9bd7c]/30 bg-[#d9bd7c]/12 text-xs font-semibold text-[#ead7a4] sm:size-9">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-6 text-white/68 sm:leading-7">{item}</p>
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
