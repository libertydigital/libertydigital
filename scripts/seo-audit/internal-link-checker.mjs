import { normalizeUrl } from "./utils.mjs";

export function runInternalLinkChecks(crawl) {
  const issues = [];
  const allUrls = new Set(crawl.pages.map((page) => normalizeUrl(page.finalUrl)).filter(Boolean));

  for (const page of crawl.pages) {
    if (page.internalLinks.length < 2 && page.finalUrl !== crawl.targetUrl) {
      issues.push({
        severity: "medium",
        category: "internal-linking",
        url: page.finalUrl,
        issue: "Page has very few internal links",
        fix: "Add contextual links to related services, trust pages, and contact pathways.",
      });
    }

    for (const link of page.internalLinks) {
      const normalizedLink = normalizeUrl(link.href);

      if (normalizedLink && !allUrls.has(normalizedLink)) {
        issues.push({
          severity: "low",
          category: "internal-linking",
          url: page.finalUrl,
          issue: `Internal link points to an uncrawled page: ${link.href}`,
          fix: "Confirm the target exists, is indexable, and is included in crawlable navigation.",
        });
      }
    }
  }

  return { issues };
}
