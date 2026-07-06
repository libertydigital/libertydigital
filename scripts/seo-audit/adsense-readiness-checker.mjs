function hasPage(crawl, pathFragment) {
  return crawl.pages.some((page) => page.finalUrl.includes(pathFragment));
}

export function runAdSenseChecks(crawl) {
  const issues = [];
  const checks = {
    hasAbout: hasPage(crawl, "/about"),
    hasContact: hasPage(crawl, "/contact"),
    hasPrivacy: hasPage(crawl, "/privacy-policy"),
    hasTerms: hasPage(crawl, "/terms-of-service"),
    hasDisclaimer: hasPage(crawl, "/disclaimer"),
  };

  for (const [key, value] of Object.entries(checks)) {
    if (!value) {
      issues.push({
        severity: "high",
        category: "adsense-readiness",
        url: "sitewide",
        issue: `${key} page is missing or not crawlable`,
        fix: "Ensure the page exists publicly and is linked in the site navigation or footer.",
      });
    }
  }

  for (const page of crawl.pages) {
    if (page.bodyWordCount < 120 && !page.finalUrl.includes("/contact")) {
      issues.push({
        severity: "medium",
        category: "adsense-readiness",
        url: page.finalUrl,
        issue: "Thin content detected",
        fix: "Expand the page with original, people-first content before monetization review.",
      });
    }
  }

  return { checks, issues };
}
