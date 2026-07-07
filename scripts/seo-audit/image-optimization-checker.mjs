function parseImageUrl(source) {
  try {
    return new URL(source);
  } catch {
    return null;
  }
}

function getUnderlyingImagePath(source) {
  const parsed = parseImageUrl(source);

  if (!parsed) {
    return source;
  }

  if (parsed.pathname === "/_next/image") {
    const original = parsed.searchParams.get("url");

    if (!original) {
      return parsed.pathname;
    }

    try {
      return decodeURIComponent(original);
    } catch {
      return original;
    }
  }

  return parsed.pathname;
}

function isOptimizedImage(image) {
  const parsed = parseImageUrl(image.src);

  return parsed?.pathname === "/_next/image";
}

function isModernFormat(image) {
  const originalPath = getUnderlyingImagePath(image.src);

  if (isOptimizedImage(image)) {
    return true;
  }

  return /\.(avif|webp)(\?|$)/i.test(originalPath);
}

function isAllowedLegacyFormat(image) {
  const originalPath = getUnderlyingImagePath(image.src);

  return /\.(svg|ico)(\?|$)/i.test(originalPath);
}

function hasReservedDimensions(image) {
  if (image.width && image.height) {
    return true;
  }

  return image.nextImageMode === "fill" && Boolean(image.sizes);
}

export function runImageChecks(crawl) {
  const issues = [];

  for (const page of crawl.pages) {
    for (const image of page.images) {
      if (!image.alt) {
        issues.push({
          severity: "medium",
          category: "images",
          url: page.finalUrl,
          issue: `Image missing alt text: ${image.src}`,
          fix: "Add descriptive alt text for meaningful images and empty alt text for decorative ones.",
        });
      }

      if (!isModernFormat(image) && !isAllowedLegacyFormat(image)) {
        issues.push({
          severity: "low",
          category: "images",
          url: page.finalUrl,
          issue: `Image is not using a modern format: ${image.src}`,
          fix: "Prefer WebP or AVIF for content imagery where quality allows.",
        });
      }

      if (!hasReservedDimensions(image)) {
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
