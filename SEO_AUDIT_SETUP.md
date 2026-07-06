# Liberty Digital SEO Audit Setup

## What Was Added

- `scripts/seo-audit/` modular audit pipeline
- `npm run seo:audit -- https://example.com`
- `npm run seo:audit:liberty`
- `reports/final-seo-audit.md`
- `reports/action-checklist.md`
- `reports/client-summary.md`

## Required Environment Variables

Add real values only in `.env.local`:

```env
PAGESPEED_API_KEY=your_real_pagespeed_api_key
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GSC_SITE_URL=https://www.libertydigitalconsulting.com/
```

`.env.example` contains placeholders only.

## Controlled Browser Status

The requested browser-controlled Google setup could not be completed in this thread because the in-app browser runtime was available but no browser target was attached to the session.

Observed runtime state:

- Browser runtime loaded successfully
- Requested backend `iab` was unavailable
- `agent.browsers.list()` returned an empty array

That means a fresh browser-enabled session is required before manual Google login, 2FA, verification, or credential download steps can be driven live.

## Free Google Setup Steps To Complete In A Browser-Enabled Session

### Google Cloud

1. Open Google Cloud Console.
2. Log in manually.
3. Create or select a project named `Liberty Digital Consulting SEO Audit`.
4. Enable:
   - `PageSpeed Insights API`
   - `Google Search Console API`
5. Create a restricted API key for PageSpeed.
6. Create a service account for Search Console read access.
7. Download the JSON key only if needed.
8. Extract only:
   - `client_email` -> `GOOGLE_CLIENT_EMAIL`
   - `private_key` -> `GOOGLE_PRIVATE_KEY`

### Google Search Console

1. Open Google Search Console.
2. Confirm which URL-prefix property is actually verified:
   - `https://libertydigitalconsulting.com/`
   - `https://www.libertydigitalconsulting.com/`
3. Match `GSC_SITE_URL` to the verified property exactly.
4. Add the service account email as a property user.
5. Re-run `npm run seo:audit:liberty`.

## Important Hostname Note

The repo currently canonicalizes to:

`https://www.libertydigitalconsulting.com`

So Search Console access should usually target the verified URL-prefix property that matches the canonical host. If only the non-`www` property is verified, API data and canonical expectations may not line up cleanly.

## Commands

```bash
npm run seo:audit -- https://example.com
npm run seo:audit:liberty
```

## Audit Coverage

The current pipeline includes:

- local crawler
- metadata checks
- canonical checks
- robots.txt checks
- sitemap checks
- schema checks
- internal linking checks
- broken link checks
- image optimization checks
- Lighthouse audit
- PageSpeed API support
- Core Web Vitals analysis
- Search Console integration
- AdSense readiness checks
- CRO checks
- markdown report generation
