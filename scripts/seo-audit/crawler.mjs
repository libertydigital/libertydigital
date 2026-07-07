import * as cheerio from "cheerio";

import {
  clip,
  countWords,
  dedupe,
  fetchText,
  isSameOrigin,
  normalizeUrl,
  textOrNull,
  toAbsoluteUrl,
} from "./utils.mjs";

function collectJsonLdTypes($) {
  const types = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).html();

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const values = Array.isArray(parsed) ? parsed : [parsed];

      for (const value of values) {
        if (Array.isArray(value?.["@graph"])) {
          for (const graphEntry of value["@graph"]) {
            if (graphEntry?.["@type"]) {
              types.push(graphEntry["@type"]);
            }
          }
        }

        if (value?.["@type"]) {
          types.push(value["@type"]);
        }
      }
    } catch {
      types.push("Invalid JSON-LD");
    }
  });

  return dedupe(types.flatMap((value) => (Array.isArray(value) ? value : [value])));
}

function collectImages($, pageUrl) {
  const images = [];

  $("img").each((_, element) => {
    const src =
      $(element).attr("src") ||
      $(element).attr("data-src") ||
      $(element).attr("srcset")?.split(",")[0]?.trim()?.split(" ")[0] ||
      null;

    images.push({
      src: toAbsoluteUrl(src, pageUrl),
      alt: textOrNull($(element).attr("alt")),
      loading: $(element).attr("loading") ?? null,
      width: $(element).attr("width") ?? null,
      height: $(element).attr("height") ?? null,
      sizes: $(element).attr("sizes") ?? null,
      nextImageMode: $(element).attr("data-nimg") ?? null,
    });
  });

  return images.filter((image) => image.src);
}

function collectLinks($, pageUrl) {
  const internalLinks = [];
  const externalLinks = [];
  const specialLinks = [];

  $("a[href]").each((_, element) => {
    const href = $(element).attr("href");
    const absolute = toAbsoluteUrl(href, pageUrl);
    const text = textOrNull($(element).text());

    if (!absolute) {
      return;
    }

    if (absolute.startsWith("mailto:") || absolute.startsWith("tel:")) {
      specialLinks.push({ href: absolute, text });
      return;
    }

    if (/wa\.me|whatsapp/i.test(absolute)) {
      specialLinks.push({ href: absolute, text: text ?? "WhatsApp" });
    }

    if (isSameOrigin(absolute, pageUrl)) {
      internalLinks.push({ href: absolute, text });
    } else {
      externalLinks.push({ href: absolute, text });
    }
  });

  return {
    internalLinks: dedupe(internalLinks.map((link) => JSON.stringify(link))).map((value) => JSON.parse(value)),
    externalLinks: dedupe(externalLinks.map((link) => JSON.stringify(link))).map((value) => JSON.parse(value)),
    specialLinks: dedupe(specialLinks.map((link) => JSON.stringify(link))).map((value) => JSON.parse(value)),
  };
}

function detectTrustSignals($) {
  const pageText = $("body").text().toLowerCase();

  return {
    hasTestimonials:
      pageText.includes("testimonial") || pageText.includes("what clients say"),
    hasMetrics:
      /\b\d+\+/.test(pageText) || pageText.includes("years of experience"),
    hasOfficeAddress:
      pageText.includes("via orazio") || pageText.includes("rome"),
    hasWhatsappMention: pageText.includes("whatsapp"),
    hasEmbassyMention: pageText.includes("embassy"),
  };
}

function detectConversionSignals($) {
  const text = $("body").text().toLowerCase();
  const buttons = $("button, a").toArray().map((element) => $(element).text().trim()).filter(Boolean);

  return {
    ctaLabels: dedupe(
      buttons.filter((label) =>
        /request|book|contact|whatsapp|get started|enroll|support/i.test(label),
      ),
    ).slice(0, 12),
    hasLeadForm: $("form").length > 0,
    hasWhatsappCta: text.includes("whatsapp"),
    hasBookingLanguage: /book|appointment|schedule|consultation/i.test(text),
  };
}

export async function crawlSite(targetUrl, { maxPages = 40, priorityPaths = [] } = {}) {
  const normalizedTargetUrl = normalizeUrl(targetUrl);
  const visited = new Set();
  const queue = [];

  for (const path of priorityPaths) {
    const absolutePath = normalizeUrl(new URL(path, `${normalizedTargetUrl}/`).toString());

    if (absolutePath) {
      queue.push(absolutePath);
    }
  }

  if (normalizedTargetUrl) {
    queue.push(normalizedTargetUrl);
  }

  const pages = [];
  const fetchErrors = [];

  while (queue.length > 0 && pages.length < maxPages) {
    const current = normalizeUrl(queue.shift());

    if (!current || visited.has(current)) {
      continue;
    }

    visited.add(current);

    try {
      const { response, text } = await fetchText(current);
      const responseUrl = response.url;
      const finalUrl = normalizeUrl(responseUrl) ?? current;
      const contentType = response.headers.get("content-type") ?? "";

      if (!contentType.includes("text/html")) {
        continue;
      }

      const $ = cheerio.load(text);
      const { internalLinks, externalLinks, specialLinks } = collectLinks($, responseUrl);
      const page = {
        requestedUrl: current,
        finalUrl,
        status: response.status,
        title: textOrNull($("title").first().text()),
        metaDescription: textOrNull($('meta[name="description"]').attr("content")),
        canonical: toAbsoluteUrl($('link[rel="canonical"]').attr("href"), finalUrl),
        h1s: $("h1").toArray().map((element) => textOrNull($(element).text())).filter(Boolean),
        h2s: $("h2").toArray().map((element) => textOrNull($(element).text())).filter(Boolean),
        robotsMeta: textOrNull($('meta[name="robots"]').attr("content")),
        lang: $("html").attr("lang") ?? null,
        bodyWordCount: countWords($("main").text() || $("body").text()),
        textPreview: clip(textOrNull($("main").text() || $("body").text()) ?? "", 200),
        jsonLdTypes: collectJsonLdTypes($),
        images: collectImages($, finalUrl),
        internalLinks,
        externalLinks,
        specialLinks,
        trustSignals: detectTrustSignals($),
        conversionSignals: detectConversionSignals($),
      };

      pages.push(page);

      for (const link of internalLinks.map((entry) => entry.href)) {
        const normalizedLink = normalizeUrl(link);

        if (!normalizedLink || visited.has(normalizedLink) || queue.includes(normalizedLink)) {
          continue;
        }

        queue.push(normalizedLink);
      }
    } catch (error) {
      fetchErrors.push({
        url: current,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    targetUrl: normalizedTargetUrl ?? targetUrl,
    pageCount: pages.length,
    pages,
    fetchErrors,
  };
}
