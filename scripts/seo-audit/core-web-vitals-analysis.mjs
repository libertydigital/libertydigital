function parseMetricValue(metric) {
  if (!metric) {
    return null;
  }

  if (typeof metric === "string") {
    const numeric = Number.parseFloat(metric.replace(/[^0-9.]/g, ""));
    return Number.isFinite(numeric) ? numeric : null;
  }

  if (typeof metric?.percentile === "number") {
    return metric.percentile;
  }

  return null;
}

export function runCoreWebVitalsAnalysis({ lighthouse, pageSpeed, targetUrl }) {
  const issues = [];
  const summary = {
    source: pageSpeed?.data ? "pagespeed" : lighthouse?.data ? "lighthouse" : "none",
    metrics: {},
  };

  if (pageSpeed?.data?.metrics) {
    const metrics = pageSpeed.data.metrics;

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
  } else if (lighthouse?.data?.metrics) {
    const lcp = parseMetricValue(lighthouse.data.metrics.largestContentfulPaint);
    const tbt = parseMetricValue(lighthouse.data.metrics.totalBlockingTime);
    const cls = parseMetricValue(lighthouse.data.metrics.cumulativeLayoutShift);

    summary.metrics = {
      LCP: lcp,
      TBT: tbt,
      CLS: cls,
    };

    if ((lcp ?? 0) > 2.5) {
      issues.push({
        severity: "medium",
        category: "core-web-vitals",
        url: targetUrl,
        issue: `Lighthouse LCP is ${lighthouse.data.metrics.largestContentfulPaint}`,
        fix: "Compress hero assets, preload critical imagery, and reduce layout complexity above the fold.",
      });
    }
  }

  return { summary, issues };
}
