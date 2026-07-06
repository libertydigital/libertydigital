import fs from "node:fs/promises";
import path from "node:path";

export const USER_AGENT =
  "LibertyDigitalSeoAudit/1.0 (+https://www.libertydigitalconsulting.com)";

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function readFileIfExists(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function loadEnvFile(filePath) {
  const content = await readFileIfExists(filePath);

  if (!content) {
    return {};
  }

  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value.replace(/\\n/g, "\n");
  }

  return env;
}

export function normalizeUrl(input, base) {
  try {
    const url = base ? new URL(input, base) : new URL(input);
    url.hash = "";

    if ((url.protocol === "http:" && url.port === "80") || (url.protocol === "https:" && url.port === "443")) {
      url.port = "";
    }

    return url.toString().replace(/\/$/, "") || url.origin;
  } catch {
    return null;
  }
}

export function toUrlWithSlash(input) {
  const normalized = normalizeUrl(input);

  if (!normalized) {
    return null;
  }

  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

export function isSameOrigin(left, right) {
  try {
    return new URL(left).origin === new URL(right).origin;
  } catch {
    return false;
  }
}

export async function fetchWithHeaders(url, init = {}) {
  const response = await fetch(url, {
    redirect: "follow",
    ...init,
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      ...(init.headers ?? {}),
    },
  });

  return response;
}

export async function fetchText(url, init = {}) {
  const response = await fetchWithHeaders(url, init);
  const text = await response.text();

  return { response, text };
}

export function toAbsoluteUrl(href, base) {
  if (!href) {
    return null;
  }

  if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return href;
  }

  return normalizeUrl(href, base);
}

export function dedupe(values) {
  return [...new Set(values.filter(Boolean))];
}

export function textOrNull(value) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized || null;
}

export function clip(value, maxLength = 160) {
  if (!value) {
    return "";
  }

  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`;
}

export function countWords(value) {
  if (!value) {
    return 0;
  }

  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function severityOrder(level) {
  switch (level) {
    case "critical":
      return 0;
    case "high":
      return 1;
    case "medium":
      return 2;
    case "low":
      return 3;
    default:
      return 4;
  }
}

export function sortIssues(issues) {
  return [...issues].sort((left, right) => severityOrder(left.severity) - severityOrder(right.severity));
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function writeTextFile(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

export async function writeJsonFile(filePath, value) {
  await writeTextFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
