export function runAccessibilityChecks(crawl, lighthouse) {
  const issues = [];

  for (const page of crawl.pages) {
    if (!page.lang) {
      issues.push({
        severity: "medium",
        category: "accessibility",
        url: page.finalUrl,
        issue: "Missing html lang attribute",
        fix: "Set the document language to improve screen reader interpretation.",
      });
    }
  }

  if (lighthouse?.data?.accessibility != null && lighthouse.data.accessibility < 0.9) {
    issues.push({
      severity: "medium",
      category: "accessibility",
      url: crawl.targetUrl,
      issue: `Lighthouse accessibility score is ${Math.round(lighthouse.data.accessibility * 100)}`,
      fix: "Review Lighthouse accessibility diagnostics and fix contrast, name/role/value, and form semantics issues.",
    });
  }

  return { issues };
}
