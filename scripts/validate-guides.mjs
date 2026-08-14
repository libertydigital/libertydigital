import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const outputDirectory = await mkdtemp(join(tmpdir(), "liberty-guide-validation-"));
const tscPath = resolve("node_modules/typescript/bin/tsc");

try {
  await execFileAsync(process.execPath, [
    tscPath,
    "--module",
    "commonjs",
    "--target",
    "es2020",
    "--moduleResolution",
    "node",
    "--esModuleInterop",
    "true",
    "--skipLibCheck",
    "true",
    "--rootDir",
    "src/lib",
    "--outDir",
    outputDirectory,
    "src/lib/guides.ts",
    "src/lib/services.ts",
  ]);

  const require = createRequire(import.meta.url);
  const { GUIDES, getPublishedGuides } = require(join(outputDirectory, "guides.js"));
  const { SERVICES_BY_SLUG } = require(join(outputDirectory, "services.js"));

  if (GUIDES.length !== 5 || getPublishedGuides().length !== 5) {
    throw new Error("Expected five published launch guides.");
  }

  for (const guide of GUIDES) {
    for (const serviceSlug of [guide.primaryServiceSlug, ...guide.relatedServiceSlugs]) {
      if (!(serviceSlug in SERVICES_BY_SLUG)) {
        throw new Error(`Guide ${guide.slug} references missing service: ${serviceSlug}`);
      }
    }
  }

  console.log(`Validated ${getPublishedGuides().length} published guides.`);
} finally {
  await rm(outputDirectory, { force: true, recursive: true });
}
