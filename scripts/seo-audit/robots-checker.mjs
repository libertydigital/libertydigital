import { fetchText } from "./utils.mjs";

export async function runRobotsCheck(targetUrl) {
  const robotsUrl = new URL("/robots.txt", `${targetUrl}/`).toString();

  try {
    const { response, text } = await fetchText(robotsUrl);
    const hasSitemap = /sitemap:/i.test(text);
    const blocksSite = /disallow:\s*\/\s*$/im.test(text);

    const issues = [];

    if (!hasSitemap) {
      issues.push({
        severity: "high",
        category: "robots",
        url: robotsUrl,
        issue: "robots.txt does not declare a sitemap",
        fix: "Add an absolute sitemap URL to robots.txt.",
      });
    }

    if (blocksSite) {
      issues.push({
        severity: "critical",
        category: "robots",
        url: robotsUrl,
        issue: "robots.txt appears to block the whole site",
        fix: "Remove any sitewide disallow rule from production robots.txt.",
      });
    }

    return {
      url: robotsUrl,
      status: response.status,
      content: text,
      issues,
    };
  } catch (error) {
    return {
      url: robotsUrl,
      status: null,
      content: null,
      issues: [
        {
          severity: "critical",
          category: "robots",
          url: robotsUrl,
          issue: "robots.txt could not be fetched",
          fix: `Restore a reachable robots.txt file. Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
