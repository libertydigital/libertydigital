# Liberty Digital SEO Audit

Target: https://www.libertydigitalconsulting.com
Audit date: 2026-07-07T23:27:21.332Z

## Executive Summary

- Crawled pages: 28
- Total issues: 0
- Critical issues: 0
- High priority issues: 0
- Medium priority issues: 0
- Low priority issues: 0
- PageSpeed API status: Connected
- Search Console API status: Connected

## Audit Summary

- Package manager: npm
- Framework: Next.js App Router
- Existing SEO implementation: metadata helpers, canonical support, sitemap, robots, JSON-LD schema
- Priority market: Nigerians and Africans living in Italy, with Rome-centered service intent

## Critical Issues

- None detected in this pass.


## High Priority Issues

- None detected in this pass.


## Medium Priority Issues

- None detected in this pass.


## Low Priority Issues

- None detected in this pass.


## Technical SEO Issues

- None detected in this pass.


## Google Search Console Feedback

- Property: https://www.libertydigitalconsulting.com/
- Permission level: siteFullUser
- Top pages by clicks:
  - https://www.libertydigitalconsulting.com/ | clicks 10 | impressions 61 | CTR 16.39% | position 4.05
  - https://www.libertydigitalconsulting.com/services/national-population-commission-digital-certificate | clicks 1 | impressions 7 | CTR 14.29% | position 10.57
  - https://www.libertydigitalconsulting.com/terms-of-service | clicks 1 | impressions 24 | CTR 4.17% | position 13.08
  - https://www.libertydigitalconsulting.com/disclaimer | clicks 0 | impressions 20 | CTR 0.00% | position 6.95
  - https://www.libertydigitalconsulting.com/how-to-enroll | clicks 0 | impressions 1 | CTR 0.00% | position 6.00
  - https://www.libertydigitalconsulting.com/services/bank-verification-number | clicks 0 | impressions 27 | CTR 0.00% | position 28.33
  - https://www.libertydigitalconsulting.com/services/citizenship-letter-to-questura | clicks 0 | impressions 8 | CTR 0.00% | position 7.00
  - https://www.libertydigitalconsulting.com/services/nigeria-passport-online-registration | clicks 0 | impressions 13 | CTR 0.00% | position 10.92
- Top queries by impressions:
  - bvn | clicks 0 | impressions 5 | CTR 0.00% | position 5.20
  - bvn assistance and support | clicks 0 | impressions 11 | CTR 0.00% | position 58.55
  - bvn support | clicks 0 | impressions 2 | CTR 0.00% | position 7.50
  - bvnsupport | clicks 0 | impressions 5 | CTR 0.00% | position 6.40
  - digital consulting | clicks 0 | impressions 1 | CTR 0.00% | position 31.00
  - digital consulting services | clicks 0 | impressions 2 | CTR 0.00% | position 21.00
  - global visa services | clicks 0 | impressions 1 | CTR 0.00% | position 20.00
  - liberty digital | clicks 0 | impressions 8 | CTR 0.00% | position 26.25
  - liberty offices | clicks 0 | impressions 1 | CTR 0.00% | position 5.00
  - liberty services | clicks 0 | impressions 3 | CTR 0.00% | position 5.00

## Indexed and Non-Indexed Pages

- Crawled public pages: 28
- Non-indexable heuristics: 1
- Full index coverage requires Search Console access for confirmation.

## Metadata Issues

- None detected in this pass.


## Canonical Issues

- None detected in this pass.


## Sitemap Issues

- None detected in this pass.


## robots.txt Issues

- None detected in this pass.


## Schema Issues

- None detected in this pass.


## Internal Linking Issues

- None detected in this pass.


## Broken Links

- None detected in this pass.


## Image Optimization Issues

- None detected in this pass.


## Core Web Vitals

- Data source: pagespeed
- Metrics: {"LCP":null,"INP":null,"CLS":null,"FCP":null,"TTFB":null}
- None detected in this pass.


## Accessibility Findings

- None detected in this pass.


## AdSense Readiness Checks

- About page found: true
- Contact page found: true
- Privacy page found: true
- Terms page found: true
- Disclaimer page found: true

- None detected in this pass.


## CRO Recommendations

- Strengthen service-page CTA continuity with one above-the-fold CTA, one mid-page reassurance CTA, and one final WhatsApp or form CTA.
- Make the WhatsApp path explicit for mobile users who want faster triage than email.

## Local SEO Recommendations

- Strengthen Rome and Italy location modifiers across service-page headings, intros, and FAQ copy.
- Expand entity schema with stronger local business and service-area signals for Rome, Italy, Nigerians in Italy, and Africans in Italy.
- Build internal links between embassy, Questura, legalization, and affidavit services around intent clusters.
- Create location-support content for Nigerian Embassy Rome, Questura support, and document legalization journeys.
- Reinforce contact-page trust with map/address context, opening cadence, and WhatsApp-first conversion cues.

## Exact Next.js Implementation Steps

- Refine `src/lib/seo.ts` metadata titles and descriptions where the audit flags duplicate or weak metadata.
- Expand service-page schema blocks in `src/app/(site)/services/[slug]/page.tsx` to include more service-specific FAQ and area-served detail.
- Improve internal links in the service templates and home sections so passport, NIN, BVN, eVisa, legalization, affidavit, and Questura pages reinforce each other.
- Audit large hero and service-cover media in `public/` and convert remaining heavy PNG/JPEG assets to WebP or AVIF where practical.
- Re-run `npm run seo:audit:liberty` after any metadata, content, schema, or image changes.

## Final Implementation Checklist

- Configure `PAGESPEED_API_KEY` in `.env.local`.
- Configure `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GSC_SITE_URL` in `.env.local`.
- Verify the live Search Console URL-prefix property that matches the canonical production host.
- Add the service account as a Search Console property user.
- Re-run the audit after credentials are in place to populate PageSpeed and Search Console sections.
