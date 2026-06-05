import type { Metadata } from "next";

import { CTASection } from "@/components/sections/cta-section";
import { EnrollmentTabs } from "@/components/services/enrollment-tabs";
import { SectionHeading } from "@/components/ui/section-heading";
import { SERVICES } from "@/lib/services";

type HowToEnrollPageProps = {
  searchParams: Promise<{ service?: string }>;
};

export const metadata: Metadata = {
  title: "How to Enroll | NIN Centre & BVN Centre in Rome",
  description:
    "Learn how to enroll with Liberty Digital's NIN Centre in Rome and BVN Centre in Rome. Step-by-step guidance for passport, NIN, BVN, eVisa, and document services.",
};

export default async function HowToEnrollPage({
  searchParams,
}: HowToEnrollPageProps) {
  const { service } = await searchParams;

  return (
    <>
      <section className="section-band py-18 sm:py-20" data-animate-section>
        <div className="container-shell">
          <SectionHeading
            description="Use the tabs to switch between services. Each panel shows what to prepare, how the enrollment flow works, and the same walkthrough video you can watch before filling the official form."
            kicker="How to enroll"
            title="One clean enrollment path for every Liberty service"
          />
          <div className="mt-10">
            <EnrollmentTabs initialSlug={service} services={SERVICES} />
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
