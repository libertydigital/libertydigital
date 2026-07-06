import * as cheerio from "cheerio";

import { fetchText, normalizeUrl } from "./utils.mjs";

export async function runSitemapCheck(targetUrl, crawl) {
  const sitemapUrl = new URL("/sitemap.xml", `${targetUrl}/`).toString();

  try {
    const { response, text } = await fetchText(sitemapUrl, {
      headers: { accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" },
    });
    const $ = cheerio.load(text, { xmlMode: true });
    const locs = $("url > loc")
      .toArray()
      .map((element) => $(element).text().trim())
      .filter(Boolean);

    const crawledUrls = new Set(crawl.pages.map((page) => normalizeUrl(page.finalUrl)));
    const issues = [];

    if (locs.length === 0) {
      issues.push({
        severity: "high",
        category: "sitemap",
        url: sitemapUrl,
        issue: "Sitemap has no URL entries",
        fix: "Ensure the production sitemap emits all public pages.",
      });
    }

    for (const url of locs) {
      if (!crawledUrls.has(normalizeUrl(url))) {
        issues.push({
          severity: "low",
          category: "sitemap",
          url,
          issue: "URL is in sitemap but was not reached during crawl",
          fix: "Confirm the page is internally linked and returns indexable HTML.",
        });
      }
    }

    return {
      url: sitemapUrl,
      status: response.status,
      urls: locs,
      issues,
    };
  } catch (error) {
    return {
      url: sitemapUrl,
      status: null,
      urls: [],
      issues: [
        {
          severity: "high",
          category: "sitemap",
          url: sitemapUrl,
          issue: "Sitemap could not be fetched",
          fix: `Restore a reachable sitemap.xml endpoint. Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
