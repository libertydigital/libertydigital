import path from "node:path";

import { reportsDir } from "./config.mjs";
import { sortIssues, writeJsonFile, writeTextFile } from "./utils.mjs";

function section(title, body) {
  return `## ${title}\n\n${body}\n`;
}

function renderIssueList(issues) {
  if (issues.length === 0) {
    return "- None detected in this pass.\n";
  }

  return issues
    .map(
      (issue) =>
        `- [${issue.severity.toUpperCase()}] ${issue.issue} (${issue.url})\n  Fix: ${issue.fix}`,
    )
    .join("\n");
}

function groupIssues(issues) {
  return {
    critical: issues.filter((issue) => issue.severity === "critical"),
    high: issues.filter((issue) => issue.severity === "high"),
    medium: issues.filter((issue) => issue.severity === "medium"),
    low: issues.filter((issue) => issue.severity === "low"),
  };
}

function pickTopFixes(issues, limit = 10) {
  return sortIssues(issues).slice(0, limit);
}

export async function writeReports(audit) {
  const sortedIssues = sortIssues(audit.issues);
  const grouped = groupIssues(sortedIssues);
  const topFixes = pickTopFixes(sortedIssues, 10);
  const topCro = pickTopFixes(sortedIssues.filter((issue) => issue.category === "cro"), 5);
  const topLocalSeo = [
    "Strengthen Rome and Italy location modifiers across service-page headings, intros, and FAQ copy.",
    "Expand entity schema with stronger local business and service-area signals for Rome, Italy, Nigerians in Italy, and Africans in Italy.",
    "Build internal links between embassy, Questura, legalization, and affidavit services around intent clusters.",
    "Create location-support content for Nigerian Embassy Rome, Questura support, and document legalization journeys.",
    "Reinforce contact-page trust with map/address context, opening cadence, and WhatsApp-first conversion cues.",
  ];
  const finalChecklist = [];

  if (audit.pageSpeed.skipped) {
    finalChecklist.push(
      "- Configure `PAGESPEED_API_KEY` in `.env.local`.",
      "- Re-run the audit after PageSpeed credentials are in place.",
    );
  } else {
    finalChecklist.push("- PageSpeed live checks completed for this audit run.");
  }

  if (audit.searchConsole.skipped) {
    finalChecklist.push(
      "- Configure `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GSC_SITE_URL` in `.env.local`.",
      "- Verify the live Search Console property matches the canonical production host.",
      "- Add the service account as a Search Console property user.",
      "- Re-run the audit after Search Console credentials and access are in place.",
    );
  } else {
    finalChecklist.push("- Search Console live checks completed for this audit run.");
  }

  const finalReport = [
    `# Liberty Digital SEO Audit`,
    ``,
    `Target: ${audit.targetUrl}`,
    `Audit date: ${audit.generatedAt}`,
    ``,
    section(
      "Executive Summary",
      [
        `- Crawled pages: ${audit.crawl.pageCount}`,
        `- Total issues: ${sortedIssues.length}`,
        `- Critical issues: ${grouped.critical.length}`,
        `- High priority issues: ${grouped.high.length}`,
        `- Medium priority issues: ${grouped.medium.length}`,
        `- Low priority issues: ${grouped.low.length}`,
        `- PageSpeed API status: ${audit.pageSpeed.skipped ? `Skipped (${audit.pageSpeed.reason})` : "Connected"}`,
        `- Search Console API status: ${audit.searchConsole.skipped ? `Skipped (${audit.searchConsole.reason})` : "Connected"}`,
      ].join("\n"),
    ),
    section(
      "Audit Summary",
      [
        `- Package manager: npm`,
        `- Framework: Next.js App Router`,
        `- Existing SEO implementation: metadata helpers, canonical support, sitemap, robots, JSON-LD schema`,
        `- Priority market: Nigerians and Africans living in Italy, with Rome-centered service intent`,
      ].join("\n"),
    ),
    section("Critical Issues", renderIssueList(grouped.critical)),
    section("High Priority Issues", renderIssueList(grouped.high)),
    section("Medium Priority Issues", renderIssueList(grouped.medium)),
    section("Low Priority Issues", renderIssueList(grouped.low)),
    section(
      "Technical SEO Issues",
      renderIssueList(sortedIssues.filter((issue) =>
        ["metadata", "canonical", "robots", "sitemap", "schema", "internal-linking", "broken-links", "images", "core-web-vitals"].includes(issue.category),
      )),
    ),
    section(
      "Google Search Console Feedback",
      audit.searchConsole.skipped
        ? `- Skipped: ${audit.searchConsole.reason}`
        : [
            `- Property: ${audit.searchConsole.summary.siteUrl}`,
            `- Permission level: ${audit.searchConsole.summary.permissionLevel ?? "Unknown"}`,
            `- Top pages by clicks:`,
            ...audit.searchConsole.summary.topPages.map(
              (entry) =>
                `  - ${entry.page} | clicks ${entry.clicks} | impressions ${entry.impressions} | CTR ${(entry.ctr * 100).toFixed(2)}% | position ${entry.position.toFixed(2)}`,
            ),
            `- Top queries by impressions:`,
            ...audit.searchConsole.summary.topQueries.map(
              (entry) =>
                `  - ${entry.query} | clicks ${entry.clicks} | impressions ${entry.impressions} | CTR ${(entry.ctr * 100).toFixed(2)}% | position ${entry.position.toFixed(2)}`,
            ),
          ].join("\n"),
    ),
    section(
      "Indexed and Non-Indexed Pages",
      [
        `- Crawled public pages: ${audit.crawl.pageCount}`,
        `- Non-indexable heuristics: ${audit.crawl.pages.filter((page) => page.robotsMeta?.includes("noindex")).length}`,
        `- Full index coverage requires Search Console access for confirmation.`,
      ].join("\n"),
    ),
    section("Metadata Issues", renderIssueList(sortedIssues.filter((issue) => issue.category === "metadata"))),
    section("Canonical Issues", renderIssueList(sortedIssues.filter((issue) => issue.category === "canonical"))),
    section("Sitemap Issues", renderIssueList(sortedIssues.filter((issue) => issue.category === "sitemap"))),
    section("robots.txt Issues", renderIssueList(sortedIssues.filter((issue) => issue.category === "robots"))),
    section("Schema Issues", renderIssueList(sortedIssues.filter((issue) => issue.category === "schema"))),
    section("Internal Linking Issues", renderIssueList(sortedIssues.filter((issue) => issue.category === "internal-linking"))),
    section("Broken Links", renderIssueList(sortedIssues.filter((issue) => issue.category === "broken-links"))),
    section("Image Optimization Issues", renderIssueList(sortedIssues.filter((issue) => issue.category === "images"))),
    section(
      "Core Web Vitals",
      [
        `- Data source: ${audit.coreWebVitals.summary.source}`,
        `- Metrics: ${JSON.stringify(audit.coreWebVitals.summary.metrics)}`,
        renderIssueList(sortedIssues.filter((issue) => issue.category === "core-web-vitals")),
      ].join("\n"),
    ),
    section(
      "Accessibility Findings",
      renderIssueList(sortedIssues.filter((issue) => issue.category === "accessibility")),
    ),
    section(
      "AdSense Readiness Checks",
      [
        `- About page found: ${audit.adsense.checks.hasAbout}`,
        `- Contact page found: ${audit.adsense.checks.hasContact}`,
        `- Privacy page found: ${audit.adsense.checks.hasPrivacy}`,
        `- Terms page found: ${audit.adsense.checks.hasTerms}`,
        `- Disclaimer page found: ${audit.adsense.checks.hasDisclaimer}`,
        "",
        renderIssueList(sortedIssues.filter((issue) => issue.category === "adsense-readiness")),
      ].join("\n"),
    ),
    section(
      "CRO Recommendations",
      [
        ...topCro.map((issue) => `- ${issue.issue} -> ${issue.fix}`),
        "- Strengthen service-page CTA continuity with one above-the-fold CTA, one mid-page reassurance CTA, and one final WhatsApp or form CTA.",
        "- Make the WhatsApp path explicit for mobile users who want faster triage than email.",
      ].join("\n"),
    ),
    section(
      "Local SEO Recommendations",
      topLocalSeo.map((item) => `- ${item}`).join("\n"),
    ),
    section(
      "Exact Next.js Implementation Steps",
      [
        "- Refine `src/lib/seo.ts` metadata titles and descriptions where the audit flags duplicate or weak metadata.",
        "- Expand service-page schema blocks in `src/app/(site)/services/[slug]/page.tsx` to include more service-specific FAQ and area-served detail.",
        "- Improve internal links in the service templates and home sections so passport, NIN, BVN, eVisa, legalization, affidavit, and Questura pages reinforce each other.",
        "- Audit large hero and service-cover media in `public/` and convert remaining heavy PNG/JPEG assets to WebP or AVIF where practical.",
        "- Re-run `npm run seo:audit:liberty` after any metadata, content, schema, or image changes.",
      ].join("\n"),
    ),
    section(
      "Final Implementation Checklist",
      finalChecklist.join("\n"),
    ),
  ].join("\n");

  const checklist = [
    `# Liberty Digital SEO Action Checklist`,
    ``,
    ...topFixes.map((issue, index) => `${index + 1}. ${issue.issue} (${issue.url})\n   Fix: ${issue.fix}`),
  ].join("\n");

  const clientSummary = [
    `# Client Summary`,
    ``,
    `Liberty Digital Consulting already has a strong technical base with Next.js metadata helpers, schema, robots, and sitemap support. The new audit system is installed and can now scan the live site repeatedly with one command.`,
    ``,
    audit.pageSpeed.skipped || audit.searchConsole.skipped
      ? `Some Google-connected checks are still incomplete in this run. Review the API status lines in the full audit and the remaining setup notes in SEO_AUDIT_SETUP.md.`
      : `Google PageSpeed and Search Console access are configured for this audit run, so the report includes live API-backed findings alongside the crawler results.`,
    ``,
    `The highest-impact next fixes are concentrated around metadata quality, internal linking between key immigration/document service pages, conversion-path clarity, and performance on media-heavy pages.`,
  ].join("\n");

  const debugJsonPath = path.join(reportsDir, "seo-audit-debug.json");

  await Promise.all([
    writeTextFile(path.join(reportsDir, "final-seo-audit.md"), finalReport),
    writeTextFile(path.join(reportsDir, "action-checklist.md"), checklist),
    writeTextFile(path.join(reportsDir, "client-summary.md"), clientSummary),
    writeJsonFile(debugJsonPath, audit),
  ]);

  return {
    reportPaths: {
      finalReport: path.join(reportsDir, "final-seo-audit.md"),
      actionChecklist: path.join(reportsDir, "action-checklist.md"),
      clientSummary: path.join(reportsDir, "client-summary.md"),
      debugJson: debugJsonPath,
    },
    topFixes,
    topCro,
    topLocalSeo,
  };
}
