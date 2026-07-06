import { defaultTarget, defaultGscSiteUrl, libertyPriorityPaths } from "./config.mjs";
import { crawlSite } from "./crawler.mjs";
import { runMetadataChecks } from "./metadata-checker.mjs";
import { runCanonicalChecks } from "./canonical-checker.mjs";
import { runRobotsCheck } from "./robots-checker.mjs";
import { runSitemapCheck } from "./sitemap-checker.mjs";
import { runSchemaChecks } from "./schema-checker.mjs";
import { runInternalLinkChecks } from "./internal-link-checker.mjs";
import { runBrokenLinkChecks } from "./broken-link-checker.mjs";
import { runImageChecks } from "./image-optimization-checker.mjs";
import { runPageSpeedAudit } from "./pagespeed-audit.mjs";
import { runLighthouseAudit } from "./lighthouse-audit.mjs";
import { runCoreWebVitalsAnalysis } from "./core-web-vitals-analysis.mjs";
import { runSearchConsoleAudit } from "./search-console.mjs";
import { runAdSenseChecks } from "./adsense-readiness-checker.mjs";
import { runCroChecks } from "./cro-checker.mjs";
import { runAccessibilityChecks } from "./accessibility-checker.mjs";
import { writeReports } from "./report-generator.mjs";

async function main() {
  const targetUrl = defaultTarget;
  const crawl = await crawlSite(targetUrl, {
    maxPages: 40,
    priorityPaths: libertyPriorityPaths,
  });
  const metadata = runMetadataChecks(crawl);
  const canonical = runCanonicalChecks(crawl);
  const robots = await runRobotsCheck(targetUrl);
  const sitemap = await runSitemapCheck(targetUrl, crawl);
  const schema = runSchemaChecks(crawl);
  const internalLinks = runInternalLinkChecks(crawl);
  const brokenLinks = await runBrokenLinkChecks(crawl);
  const images = runImageChecks(crawl);
  const lighthouse = await runLighthouseAudit(targetUrl);
  const pageSpeed = await runPageSpeedAudit(targetUrl);
  const coreWebVitals = runCoreWebVitalsAnalysis({ lighthouse, pageSpeed, targetUrl });
  const searchConsole = await runSearchConsoleAudit();
  const adsense = runAdSenseChecks(crawl);
  const cro = runCroChecks(crawl);
  const accessibility = runAccessibilityChecks(crawl, lighthouse);

  const issues = [
    ...metadata.issues,
    ...canonical.issues,
    ...robots.issues,
    ...sitemap.issues,
    ...schema.issues,
    ...internalLinks.issues,
    ...brokenLinks.issues,
    ...images.issues,
    ...lighthouse.issues,
    ...pageSpeed.issues,
    ...coreWebVitals.issues,
    ...searchConsole.issues,
    ...adsense.issues,
    ...cro.issues,
    ...accessibility.issues,
  ];

  const audit = {
    generatedAt: new Date().toISOString(),
    targetUrl,
    gscSiteUrl: defaultGscSiteUrl,
    browserSetupStatus:
      "Blocked in this session: browser runtime loaded but no in-app browser target was attached.",
    crawl,
    metadata,
    canonical,
    robots,
    sitemap,
    schema,
    internalLinks,
    brokenLinks,
    images,
    lighthouse,
    pageSpeed,
    coreWebVitals,
    searchConsole,
    adsense,
    cro,
    accessibility,
    issues,
  };

  const output = await writeReports(audit);

  console.log(
    JSON.stringify(
      {
        targetUrl,
        gscSiteUrl: defaultGscSiteUrl,
        issueCount: issues.length,
        reports: output.reportPaths,
      },
      null,
      2,
    ),
  );
}

await main();
