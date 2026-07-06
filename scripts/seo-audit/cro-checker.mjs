export function runCroChecks(crawl) {
  const issues = [];
  const homepage = crawl.pages.find((page) => page.finalUrl === crawl.targetUrl) ?? crawl.pages[0];

  if (!homepage) {
    return { summary: null, issues };
  }

  if (homepage.conversionSignals.ctaLabels.length === 0) {
    issues.push({
      severity: "high",
      category: "cro",
      url: homepage.finalUrl,
      issue: "No clear CTA detected above the fold heuristically",
      fix: "Add a primary conversion CTA tied to booking, WhatsApp, or request submission in the hero.",
    });
  }

  if (!homepage.conversionSignals.hasLeadForm) {
    issues.push({
      severity: "medium",
      category: "cro",
      url: homepage.finalUrl,
      issue: "No form detected on the homepage",
      fix: "Add a low-friction lead capture or route users quickly to a service-specific form.",
    });
  }

  if (!homepage.trustSignals.hasTestimonials) {
    issues.push({
      severity: "medium",
      category: "cro",
      url: homepage.finalUrl,
      issue: "Testimonials or social proof were not detected",
      fix: "Add testimonials, review proof, or outcome-based trust signals near the main CTAs.",
    });
  }

  if (!homepage.conversionSignals.hasWhatsappCta) {
    issues.push({
      severity: "medium",
      category: "cro",
      url: homepage.finalUrl,
      issue: "WhatsApp conversion path was not detected",
      fix: "Expose WhatsApp support clearly for mobile-first diaspora users who prefer chat conversion.",
    });
  }

  return {
    summary: {
      homepageCtas: homepage.conversionSignals.ctaLabels,
      hasLeadForm: homepage.conversionSignals.hasLeadForm,
      hasWhatsappCta: homepage.conversionSignals.hasWhatsappCta,
      hasTestimonials: homepage.trustSignals.hasTestimonials,
    },
    issues,
  };
}
