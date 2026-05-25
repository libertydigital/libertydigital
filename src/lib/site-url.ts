const CANONICAL_SITE_URL = "https://www.libertydigitalconsulting.com";

function normalizeSiteUrl(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const hostname = url.hostname.toLowerCase();

    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return null;
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? CANONICAL_SITE_URL;
}

export { CANONICAL_SITE_URL };
