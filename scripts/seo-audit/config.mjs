import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadEnvFile, normalizeUrl, toUrlWithSlash } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const repoRoot = path.resolve(__dirname, "..", "..");
export const reportsDir = path.join(repoRoot, "reports");
export const tempDir = path.join(repoRoot, ".codex-temp");
export const lighthouseProfileDir = path.join(tempDir, "lighthouse-profile");

const envFromFile = await loadEnvFile(path.join(repoRoot, ".env.local"));

export const auditEnv = {
  ...envFromFile,
  ...process.env,
};

export const defaultTarget =
  normalizeUrl(process.argv[2]) ||
  normalizeUrl(auditEnv.GSC_SITE_URL) ||
  normalizeUrl(auditEnv.NEXT_PUBLIC_SITE_URL) ||
  "https://www.libertydigitalconsulting.com";

export const defaultGscSiteUrl =
  toUrlWithSlash(auditEnv.GSC_SITE_URL) ||
  toUrlWithSlash(defaultTarget);

export const libertyPriorityPaths = [
  "/",
  "/services",
  "/services/nigeria-passport-online-registration",
  "/services/national-identification-number",
  "/services/bank-verification-number",
  "/services/nigeria-e-visa",
  "/services/document-legalization-at-nigerian-embassy",
  "/services/court-e-affidavit",
  "/services/citizenship-letter-to-questura",
  "/services/certificate-of-nationality",
  "/contact",
  "/about",
  "/privacy-policy",
  "/terms-of-service",
  "/disclaimer",
  "/how-to-enroll",
  "/resources",
];

export const auditKeywords = [
  "Nigerian passport renewal",
  "NIN",
  "BVN",
  "eVisa",
  "document legalization",
  "affidavit",
  "embassy",
  "Questura",
  "Rome",
  "Italy",
  "WhatsApp",
];
