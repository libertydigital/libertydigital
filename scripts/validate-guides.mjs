import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const guidesPath = resolve("src/lib/guides.ts");
const servicesPath = resolve("src/lib/services.ts");

const [guidesSource, servicesSource] = await Promise.all([
  readFile(guidesPath, "utf8"),
  readFile(servicesPath, "utf8"),
]);

const serviceSlugs = new Set(
  [...servicesSource.matchAll(/^\s{4}slug:\s*"([^"]+)",$/gm)].map((match) => match[1]),
);
const guideBlocks = guidesSource.match(/export const GUIDES: Guide\[\] = \[(?<guides>[\s\S]*?)\n\];/)?.groups
  ?.guides.match(/\n  \{[\s\S]*?\n  \},?/g) ?? [];

const publishedGuideSlugs = [];

for (const guideBlock of guideBlocks) {
  const slug = guideBlock.match(/\n    slug:\s*"([^"]+)",/)?.[1];
  const primaryServiceSlug = guideBlock.match(/\n    primaryServiceSlug:\s*"([^"]+)",/)?.[1];
  const relatedServices = guideBlock.match(/\n    relatedServiceSlugs:\s*\[(?<slugs>[\s\S]*?)\],/)?.groups?.slugs ?? "";
  const relatedServiceSlugs = [...relatedServices.matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  if (!slug || !primaryServiceSlug) {
    throw new Error("Each guide must declare a slug and primary service.");
  }

  publishedGuideSlugs.push(slug);

  for (const serviceSlug of [primaryServiceSlug, ...relatedServiceSlugs]) {
    if (!serviceSlugs.has(serviceSlug)) {
      throw new Error(`Guide ${slug} references missing service: ${serviceSlug}`);
    }
  }
}

if (publishedGuideSlugs.length !== 5) {
  throw new Error("Expected five published launch guides.");
}

console.log(`Validated ${publishedGuideSlugs.length} published guides.`);
