import { normalizeUrl } from "./utils.mjs";

export function runCanonicalChecks(crawl) {
  const issues = [];

  for (const page of crawl.pages) {
    const normalizedFinal = normalizeUrl(page.finalUrl);
    const normalizedCanonical = normalizeUrl(page.canonical);

    if (!normalizedCanonical) {
      issues.push({
        severity: "high",
        category: "canonical",
        url: page.finalUrl,
        issue: "Missing canonical tag",
        fix: "Set a self-referencing canonical unless the page should intentionally canonicalize elsewhere.",
      });
      continue;
    }

    if (normalizedCanonical !== normalizedFinal) {
      issues.push({
        severity: "medium",
        category: "canonical",
        url: page.finalUrl,
        issue: `Canonical points to ${normalizedCanonical}`,
        fix: "Review canonical logic and confirm the live URL and canonical host align.",
      });
    }
  }

  return { issues };
}
