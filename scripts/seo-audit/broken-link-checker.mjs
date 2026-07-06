import { fetchWithHeaders } from "./utils.mjs";

export async function runBrokenLinkChecks(crawl) {
  const uniqueLinks = new Set();
  const issues = [];

  for (const page of crawl.pages) {
    for (const link of [...page.internalLinks, ...page.externalLinks]) {
      if (link.href.startsWith("mailto:") || link.href.startsWith("tel:")) {
        continue;
      }

      uniqueLinks.add(link.href);
    }
  }

  const checked = [];
  const urls = [...uniqueLinks].slice(0, 80);

  for (const url of urls) {
    try {
      let response = await fetchWithHeaders(url, { method: "HEAD" });

      if (response.status === 405 || response.status === 501) {
        response = await fetchWithHeaders(url, { method: "GET" });
      }

      checked.push({ url, status: response.status });

      if (response.status >= 400) {
        issues.push({
          severity: "medium",
          category: "broken-links",
          url,
          issue: `Link returned HTTP ${response.status}`,
          fix: "Update or remove the broken link target.",
        });
      }
    } catch (error) {
      issues.push({
        severity: "medium",
        category: "broken-links",
        url,
        issue: "Link request failed",
        fix: `Check the destination URL or network access. Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return { checked, issues };
}
