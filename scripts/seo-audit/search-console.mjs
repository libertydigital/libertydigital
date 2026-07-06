import { google } from "googleapis";

import { auditEnv, defaultGscSiteUrl } from "./config.mjs";

function hasSearchConsoleEnv() {
  return (
    Boolean(auditEnv.GOOGLE_CLIENT_EMAIL) &&
    Boolean(auditEnv.GOOGLE_PRIVATE_KEY) &&
    Boolean(defaultGscSiteUrl)
  );
}

export async function runSearchConsoleAudit() {
  if (!hasSearchConsoleEnv()) {
    return {
      skipped: true,
      reason: "Search Console credentials are not fully configured in .env.local",
      summary: null,
      issues: [],
    };
  }

  try {
    const auth = new google.auth.JWT({
      email: auditEnv.GOOGLE_CLIENT_EMAIL,
      key: auditEnv.GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

    const searchConsole = google.searchconsole({ version: "v1", auth });
    const siteUrl = defaultGscSiteUrl;
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 28);

    const formatDate = (value) => value.toISOString().slice(0, 10);

    const [siteEntryResponse, queryResponse, pageResponse] = await Promise.all([
      searchConsole.sites.list(),
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["query"],
          rowLimit: 10,
        },
      }),
      searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ["page"],
          rowLimit: 10,
        },
      }),
    ]);

    const siteEntries = siteEntryResponse.data.siteEntry ?? [];
    const matchedProperty = siteEntries.find((entry) => entry.siteUrl === siteUrl) ?? null;
    const queryRows = queryResponse.data.rows ?? [];
    const pageRows = pageResponse.data.rows ?? [];

    return {
      skipped: false,
      reason: null,
      summary: {
        siteUrl,
        permissionLevel: matchedProperty?.permissionLevel ?? null,
        topQueries: queryRows.map((row) => ({
          query: row.keys?.[0] ?? "",
          clicks: row.clicks ?? 0,
          impressions: row.impressions ?? 0,
          ctr: row.ctr ?? 0,
          position: row.position ?? 0,
        })),
        topPages: pageRows.map((row) => ({
          page: row.keys?.[0] ?? "",
          clicks: row.clicks ?? 0,
          impressions: row.impressions ?? 0,
          ctr: row.ctr ?? 0,
          position: row.position ?? 0,
        })),
      },
      issues: [],
    };
  } catch (error) {
    return {
      skipped: true,
      reason: error instanceof Error ? error.message : String(error),
      summary: null,
      issues: [
        {
          severity: "high",
          category: "search-console",
          url: defaultGscSiteUrl,
          issue: "Search Console API request failed",
          fix:
            "Verify the property URL matches the verified Search Console property and add the service account as a property user with sufficient access.",
        },
      ],
    };
  }
}
