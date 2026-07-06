export function runImageChecks(crawl) {
  const issues = [];

  for (const page of crawl.pages) {
    for (const image of page.images) {
      const isModernFormat = /\.(avif|webp)(\?|$)/i.test(image.src);
      const isSvg = /\.svg(\?|$)/i.test(image.src);

      if (!image.alt) {
        issues.push({
          severity: "medium",
          category: "images",
          url: page.finalUrl,
          issue: `Image missing alt text: ${image.src}`,
          fix: "Add descriptive alt text for meaningful images and empty alt text for decorative ones.",
        });
      }

      if (!isModernFormat && !isSvg) {
        issues.push({
          severity: "low",
          category: "images",
          url: page.finalUrl,
          issue: `Image is not using a modern format: ${image.src}`,
          fix: "Prefer WebP or AVIF for content imagery where quality allows.",
        });
      }

      if (!image.width || !image.height) {
        issues.push({
          severity: "low",
          category: "images",
          url: page.finalUrl,
          issue: `Image is missing explicit dimensions: ${image.src}`,
          fix: "Set width and height or use a component that reserves space to reduce layout shift.",
        });
      }
    }
  }

  return { issues };
}
