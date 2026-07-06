import { auditEnv } from "./config.mjs";

const categories = ["performance", "accessibility", "best-practices", "seo"];

export async function runPageSpeedAudit(targetUrl) {
  if (!auditEnv.PAGESPEED_API_KEY) {
    return {
      skipped: true,
      reason: "PAGESPEED_API_KEY is not configured in .env.local",
      data: null,
      issues: [],
    };
  }

  try {
    const url = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    url.searchParams.set("url", targetUrl);
    url.searchParams.set("strategy", "mobile");
    url.searchParams.set("key", auditEnv.PAGESPEED_API_KEY);

    for (const category of categories) {
      url.searchParams.append("category", category);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`PageSpeed API returned ${response.status}`);
    }

    const data = await response.json();
    const categoriesResult = data?.lighthouseResult?.categories ?? {};

    return {
      skipped: false,
      reason: null,
      data: {
        performance: categoriesResult.performance?.score ?? null,
        accessibility: categoriesResult.accessibility?.score ?? null,
        bestPractices: categoriesResult["best-practices"]?.score ?? null,
        seo: categoriesResult.seo?.score ?? null,
        metrics: data?.loadingExperience?.metrics ?? {},
        originMetrics: data?.originLoadingExperience?.metrics ?? {},
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
          category: "pagespeed",
          url: targetUrl,
          issue: "PageSpeed API audit could not run",
          fix: `Verify the API key and project setup. Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
