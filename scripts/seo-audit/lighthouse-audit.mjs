import fs from "node:fs/promises";
import path from "node:path";

import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

import { ensureDir } from "./utils.mjs";
import { tempDir } from "./config.mjs";

export async function runLighthouseAudit(targetUrl) {
  let chrome;
  const runProfileDir = path.join(
    tempDir,
    `lighthouse-profile-${process.pid}-${Date.now()}`,
  );

  try {
    await ensureDir(runProfileDir);

    chrome = await chromeLauncher.launch({
      userDataDir: runProfileDir,
      chromeFlags: [
        "--headless=new",
        "--no-sandbox",
      ],
    });

    const result = await lighthouse(targetUrl, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
    });

    const categories = result?.lhr?.categories ?? {};
    const audits = result?.lhr?.audits ?? {};

    return {
      skipped: false,
      reason: null,
      data: {
        performance: categories.performance?.score ?? null,
        accessibility: categories.accessibility?.score ?? null,
        bestPractices: categories["best-practices"]?.score ?? null,
        seo: categories.seo?.score ?? null,
        metrics: {
          firstContentfulPaint: audits["first-contentful-paint"]?.displayValue ?? null,
          largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue ?? null,
          speedIndex: audits["speed-index"]?.displayValue ?? null,
          totalBlockingTime: audits["total-blocking-time"]?.displayValue ?? null,
          cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue ?? null,
        },
      },
      issues: [],
    };
  } catch (error) {
    return {
      skipped: true,
      reason: error instanceof Error ? error.message : String(error),
      data: null,
      issues: [
        {
          severity: "medium",
          category: "lighthouse",
          url: targetUrl,
          issue: "Lighthouse audit could not run",
          fix: `Confirm that Chrome is installed and can run headlessly. Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch {
        // Chrome cleanup can fail on Windows temp paths; the audit should still complete.
      }
    }

    await fs.rm(runProfileDir, { recursive: true, force: true }).catch(() => {});
  }
}
