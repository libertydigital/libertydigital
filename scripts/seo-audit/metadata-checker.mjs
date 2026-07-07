export function runMetadataChecks(crawl) {
  const issues = [];
  const seenTitles = new Map();
  const seenDescriptions = new Map();

  for (const page of crawl.pages) {
    const pageLabel = page.finalUrl;

    if (!page.title) {
      issues.push({
        severity: "high",
        category: "metadata",
        url: pageLabel,
        issue: "Missing title tag",
        fix: "Add a unique keyword-led title tag for this page.",
      });
    } else {
      if (page.title.length < 30 || page.title.length > 65) {
        issues.push({
          severity: "medium",
          category: "metadata",
          url: pageLabel,
          issue: `Title length is ${page.title.length} characters`,
          fix: "Keep titles roughly between 30 and 65 characters while preserving keyword intent.",
        });
      }

      const currentCount = seenTitles.get(page.title) ?? 0;
      seenTitles.set(page.title, currentCount + 1);
    }

    if (!page.metaDescription) {
      issues.push({
        severity: "high",
        category: "metadata",
        url: pageLabel,
        issue: "Missing meta description",
        fix: "Add a benefit-driven meta description around 120 to 155 characters.",
      });
    } else {
      if (page.metaDescription.length < 70 || page.metaDescription.length > 160) {
        issues.push({
          severity: "medium",
          category: "metadata",
          url: pageLabel,
          issue: `Meta description length is ${page.metaDescription.length} characters`,
          fix: "Keep meta descriptions concise and persuasive, ideally between 120 and 155 characters.",
        });
      }

      const currentCount = seenDescriptions.get(page.metaDescription) ?? 0;
      seenDescriptions.set(page.metaDescription, currentCount + 1);
    }

    if (page.h1s.length === 0) {
      issues.push({
        severity: "high",
        category: "metadata",
        url: pageLabel,
        issue: "Missing H1",
        fix: "Add one clear H1 that matches the page intent.",
      });
    }

    if (page.h1s.length > 1) {
      issues.push({
        severity: "medium",
        category: "metadata",
        url: pageLabel,
        issue: `Found ${page.h1s.length} H1 tags`,
        fix: "Use a single H1 and move supporting headings to H2 or H3.",
      });
    }
  }

  for (const [title, count] of seenTitles.entries()) {
    if (count > 1) {
      issues.push({
        severity: "medium",
        category: "metadata",
        url: "sitewide",
        issue: `Duplicate title used ${count} times: ${title}`,
        fix: "Make repeated titles unique so service and legal pages do not compete with each other.",
      });
    }
  }

  for (const [, count] of seenDescriptions.entries()) {
    if (count > 1) {
      issues.push({
        severity: "low",
        category: "metadata",
        url: "sitewide",
        issue: `Duplicate meta description used ${count} times`,
        fix: "Differentiate repeated meta descriptions to better align with page-specific intent.",
      });
    }
  }

  return {
    issues,
  };
}
