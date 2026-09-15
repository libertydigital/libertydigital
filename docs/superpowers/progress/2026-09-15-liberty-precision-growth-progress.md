# Liberty Digital Precision Growth Sprint — Progress

Date: 2026-09-15
Production deployment: **Not performed**
Production branch changes: **None**
Working head: detached commit `234610bb56285f4a81c86c7bf9d5c2c00d11415d`
Base main: `862510accc41107aecfff28795a9d981bfbb0697`

## Completed implementation work

- Documented the approved design and implementation plan.
- Added a growth source-contract validator and `npm run validate:growth` script.
- Preserved the existing consent-gated Vercel Analytics and Speed Insights integration.
- Added consent-gated custom conversion events for form start/submit/success/error, WhatsApp clicks, phone clicks, email clicks and service CTA clicks.
- Added a reusable tracked-link/anchor component that passes only non-sensitive context to analytics.
- Replaced the public service-page document intake with a low-friction enquiry form that reuses the existing server-side `submitContactInquiryAction` and tracking-reference pipeline.
- Kept the old detailed `ServiceLeadForm` in the codebase for any later protected/qualified-client intake flow; it was not deleted.
- Added typed SEO/CRO content overrides for passport, BVN, NPC birth records and NIN.
- Updated the four priority services to distinguish Liberty's independent preparation role from official authorities.
- Added current official-resource links for NIS, NIBSS/CBN, NPC and NIMC.
- Added an NPC birth attestation/digital certificate resource guide.
- Rebuilt `/resources` into an actual article hub that surfaces the five existing guides plus the new NPC guide.
- Added all published resource guides to `sitemap.xml`.
- Expanded `/services` with direct internal links to passport, BVN, NPC and NIN priority pages and the resource library.
- Removed public Admin Login links from desktop and mobile navigation while leaving the staff login route intact.
- Replaced quote-style pseudo-testimonial presentation with explicit company capability cards. No customer reviews were invented.
- Added tracked phone/email links in the footer and a tracked sitewide WhatsApp button.
- Kept the existing legal/privacy wording that already discloses Vercel Analytics/Speed Insights and optional analytics consent.

## Important implementation corrections discovered during work

### Analytics was already mounted

Initial code inspection of the root layouts made Analytics/Speed Insights look unmounted. A later inspection found they were already mounted inside `CookieConsentManager`, and only after the visitor accepts optional analytics. The temporary root-layout mount was removed before any branch or deployment was published. Custom growth events now also check the same stored consent state before calling Vercel Analytics.

### Three planned guides already existed

Passport, BVN and NIN article pages were already present in `src/lib/guides.ts`, but `/resources` did not link to them and the sitemap omitted all guide URLs. Instead of creating duplicate pages and risking keyword cannibalisation, the sprint surfaces those existing assets and adds only the genuinely missing NPC birth-record guide.

### Lead pipeline is working

A fresh production aggregate query on 2026-09-15 showed:

- 23 total lead rows
- 5 active leads
- 18 soft-deleted leads
- 72 lead activity rows
- 0 lead notes

Active lead aggregates include NIN, BVN and Nigerian passport requests. This confirms the server-side Prisma submission pipeline is functioning. No public RLS policies were added and no production database schema change was made.

## Search Console configuration completed

Created topic clusters:

- Passport Italy
- BVN Italy
- NPC Birth Records
- NIN Italy

Created an Indexing Tracker and added the current homepage, services hub, resources hub, four priority services and the three existing passport/BVN/NIN guides.

Fresh URL inspections show:

- Indexed: homepage, resources hub, passport service, BVN service, NPC service
- Unknown to Google: services hub, NIN service, passport guide, BVN guide, NIN guide

This validates the internal-linking and sitemap work: those existing guide URLs were real pages but were not yet known to Google.

Created the property annotation `Precision Growth Sprint baseline` for 2026-09-15 with the pre-deployment 28-day metrics: 23 clicks, 525 impressions, 4.38% CTR and average position 13.94.

The new NPC guide has **not** been added to the tracker or submitted for indexing yet because it is not live. It should only be tracked/submitted after the approved production deployment.

## Supabase status

No DDL or production data mutations were made.

Current security advisor still reports:

- INFO: RLS enabled with no public policies on Lead, LeadActivity and LeadNote. This is compatible with the current server-side Prisma architecture and should not be “fixed” by opening anonymous access.
- WARN: Supabase Auth leaked-password protection is disabled. This remains an account-level security recommendation.

## Verification status

Repository diff review confirms the detached working head is three commits ahead of main and main has not moved during this sprint.

The following commands have **not yet been executed** because this environment cannot clone the private repository and no Git ref has been published. Publishing a branch may trigger an automatic Vercel preview deployment, which is intentionally blocked until explicit approval:

```bash
npm run validate:growth
npm run validate:guides
npm run lint
npm run build
```

Browser verification of the changed pages and live form flow is also pending the approved preview/deployment gate.

## External/account-level items

- Vercel connector currently returns no accessible team/project, so project logs, preview controls and deployment configuration cannot be inspected from this chat yet.
- GSC Wizard does not currently have GA4 scope/property access, so Google Analytics conversion reporting cannot be configured/verified there yet.
- Google Business Profile management is not exposed by the connected tools in this chat; no GBP listing changes have been made.

## Deployment rule

Do not merge to `main`, publish a production deployment, submit the new NPC URL for indexing, or delete branches until the user explicitly approves the deployment phase.
