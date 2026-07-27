function parseMetricValue(metric) {
  if (!metric) {
    return null;
  }

  if (typeof metric === "string") {
    const numeric = Number.parseFloat(metric.replaceAll(",", "").replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  if (typeof metric?.percentile === "number") {
    return metric.percentile;
  }

  return null;
}

export function runCoreWebVitalsAnalysis({ lighthouse, pageSpeed, targetUrl }) {
  const issues = [];
  const pageSpeedMetrics = pageSpeed?.data?.metrics;
  const hasPageSpeedMetrics =
    pageSpeedMetrics &&
    typeof pageSpeedMetrics === "object" &&
    Object.keys(pageSpeedMetrics).length > 0;
  const hasLighthouseMetrics =
    lighthouse?.data?.metrics &&
    typeof lighthouse.data.metrics === "object" &&
    Object.keys(lighthouse.data.metrics).length > 0;
  const summary = {
    source: hasPageSpeedMetrics ? "pagespeed" : hasLighthouseMetrics ? "lighthouse" : "none",
    metrics: {},
  };

  if (hasPageSpeedMetrics) {
    const metrics = pageSpeedMetrics;

    summary.metrics = {
      LCP: metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
      INP: metrics.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
      CLS: metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
      FCP: metrics.FIRST_CONTENTFUL_PAINT_MS?.percentile ?? null,
      TTFB: metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile ?? null,
    };

    if ((summary.metrics.LCP ?? 0) > 2500) {
      issues.push({
        severity: "high",
        category: "core-web-vitals",
        url: targetUrl,
        issue: `LCP is ${summary.metrics.LCP}ms`,
        fix: "Reduce above-the-fold asset weight and improve server response time for the hero experience.",
      });
    }

    if ((summary.metrics.INP ?? 0) > 200) {
      issues.push({
        severity: "high",
        category: "core-web-vitals",
        url: targetUrl,
        issue: `INP is ${summary.metrics.INP}ms`,
        fix: "Reduce main-thread blocking work and heavy client-side interactions.",
      });
    }
  } else if (hasLighthouseMetrics) {
    const lcp = parseMetricValue(lighthouse.data.metrics.largestContentfulPaint);
    const tbt = parseMetricValue(lighthouse.data.metrics.totalBlockingTime);
    const cls = parseMetricValue(lighthouse.data.metrics.cumulativeLayoutShift);
    const performanceScore =
      typeof lighthouse.data.performance === "number" ? lighthouse.data.performance : null;

    summary.metrics = {
      performanceScore,
      LCP: lcp,
      TBT: tbt,
      CLS: cls,
    };

    if ((lcp ?? 0) > 2.5) {
      issues.push({
        severity: lcp > 4 ? "high" : "medium",
        category: "core-web-vitals",
        url: targetUrl,
        issue: `Lighthouse LCP is ${lighthouse.data.metrics.largestContentfulPaint}`,
        fix: "Compress hero assets, preload critical imagery, and reduce layout complexity above the fold.",
      });
    }

    if ((tbt ?? 0) > 200) {
      issues.push({
        severity: tbt > 600 ? "high" : "medium",
        category: "core-web-vitals",
        url: targetUrl,
        issue: `Lighthouse Total Blocking Time is ${lighthouse.data.metrics.totalBlockingTime}`,
        fix: "Reduce client-side JavaScript, main-thread animation work, and third-party script execution.",
      });
    }

    if (performanceScore !== null && performanceScore < 0.9) {
      issues.push({
        severity: performanceScore < 0.5 ? "high" : "medium",
        category: "core-web-vitals",
        url: targetUrl,
        issue: `Lighthouse performance score is ${Math.round(performanceScore * 100)}/100`,
        fix: "Prioritize above-the-fold rendering and defer non-essential client-side work.",
      });
    }
  }

  return { summary, issues };
}
