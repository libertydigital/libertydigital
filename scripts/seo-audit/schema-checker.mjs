export function runSchemaChecks(crawl) {
  const issues = [];

  for (const page of crawl.pages) {
    const types = page.jsonLdTypes;

    if (types.length === 0) {
      issues.push({
        severity: "medium",
        category: "schema",
        url: page.finalUrl,
        issue: "No JSON-LD schema detected",
        fix: "Add page-relevant JSON-LD such as Organization, ProfessionalService, WebPage, or BreadcrumbList.",
      });
      continue;
    }

    if (types.includes("Invalid JSON-LD")) {
      issues.push({
        severity: "high",
        category: "schema",
        url: page.finalUrl,
        issue: "Invalid JSON-LD script detected",
        fix: "Validate the JSON-LD output and ensure it serializes to valid JSON.",
      });
    }
  }

  return { issues };
}
