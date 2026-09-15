# Liberty Digital Precision Growth Sprint — Implementation Plan

Date: 2026-09-15
Design: `docs/superpowers/specs/2026-09-15-liberty-precision-growth-design.md`
Base commit: `862510accc41107aecfff28795a9d981bfbb0697`

## Task 1: Add source-contract tests first

Create `scripts/validate-growth-sprint.mjs` to assert the approved source contracts:

- root layout mounts Vercel Analytics and Speed Insights
- public header/mobile nav do not expose Admin Login
- sitemap includes published guide URLs
- resources hub imports and links published guides
- service detail page uses the lightweight lead-capture form and growth overrides
- analytics helper exposes only approved non-sensitive event names
- priority growth overrides exist for passport, BVN, NPC and NIN

Add `validate:growth` to package scripts. Against the base commit this test is expected to fail because the required implementation does not exist yet.

## Task 2: Measurement foundation

Files:
- `src/app/layout.tsx`
- new `src/lib/analytics.ts`
- new `src/components/analytics/tracked-link.tsx`
- `src/components/forms/contact-request-form.tsx`
- new lightweight service lead form component
- `src/components/layout/whatsapp-floating-button.tsx`

Changes:
- mount `<Analytics />` and `<SpeedInsights />`
- create a typed safe event wrapper using `@vercel/analytics`
- instrument form starts/submits/success/errors and contact/CTA clicks
- restrict analytics payloads to service slug, page and placement only

## Task 3: Replace public service document intake with qualification form

Files:
- new `src/components/forms/service-inquiry-form.tsx`
- `src/app/(site)/services/[slug]/page.tsx`

Changes:
- replace `ServiceLeadForm` on public service pages with a minimal qualification form
- reuse `submitContactInquiryAction`
- collect full name, optional email, phone/WhatsApp, preferred contact, message, consent
- display tracking reference on success
- explicitly tell visitors not to upload sensitive documents during initial enquiry
- preserve the existing detailed service information and document checklists as educational content

The existing `ServiceLeadForm` remains available in code for any later protected intake workflow; this sprint does not delete it.

## Task 4: Add typed SEO/CRO growth overrides

Files:
- new `src/lib/service-growth.ts`
- `src/app/(site)/services/[slug]/page.tsx`

Add override data for:

### Passport
Target title/H1: `Nigerian Passport Renewal & Registration Support in Rome, Italy`
Cover fresh applications, renewal/reissue, lost/damaged passports, data changes, biometric enrolment and official NIS portal guidance.

### BVN
Target: `BVN Support in Rome & Italy`
Explain Liberty's support role, official diaspora enrolment, NIBSS listed Rome location and NRBVN as an alternative official route where applicable.

### NPC
Target: `NPC Digital Birth Certificate & Birth Attestation Support`
Cover digital birth certificate, attestation, reissuance, birth registration and diaspora/foreign birth questions, with current-process caveats.

### NIN
Target: `NIN Registration Support in Rome & Italy`
Clarify preparation support vs official enrolment and align with `nin registration italy` search intent.

Each override includes metadata title/description, visible H1/intro, current-process guidance, FAQ additions and guide links.

## Task 5: Turn Resources into a real content hub

Files:
- `src/app/(site)/resources/page.tsx`
- `src/lib/guides.ts`

Changes:
- render `getPublishedGuides()` as primary resource cards
- retain a compact service-checklist section beneath the guide library
- add four new 2026 intent guides: passport renewal Italy, BVN/NRBVN Italy, NPC attestation/digital certificate, NIN registration Italy
- ensure related guides and commercial service links form clear topical silos

## Task 6: Fix sitemap and services discoverability

Files:
- `src/app/sitemap.ts`
- `src/app/(site)/services/page.tsx`

Changes:
- include all `getPublishedGuides()` URLs in sitemap
- use guide publication/update dates where available
- expand services hub intro with specific passport/NIN/BVN/NPC Rome/Italy intent and links to priority pages/resources
- maintain current canonical/schema behavior

## Task 7: Clean public trust/navigation

Files:
- `src/components/layout/header.tsx`
- `src/components/layout/mobile-nav.tsx`
- `src/components/sections/testimonials-section.tsx`

Changes:
- remove public Admin Login links and unused LogIn import
- convert quote-style company claims into capability cards without quotation iconography
- do not invent customer reviews

## Task 8: Documentation and GSC tracking setup

Files:
- update this plan with completion notes if implementation changes materially

GSC actions after code is ready but before production deployment:
- add key pages to Indexing Tracker if not already tracked
- create topic clusters for Passport Italy, BVN Italy, NPC Birth Records and NIN Italy
- baseline current metrics in an annotation or documentation

Do not submit changed production URLs for recrawl until the production deployment is approved and live.

## Task 9: Final verification gate

Run after the implementation ref is publishable:

```bash
npm run validate:growth
npm run validate:guides
npm run lint
npm run build
```

Then visually verify desktop/mobile and lead flow on preview. Re-run Supabase security/performance advisors if any DB change unexpectedly becomes necessary. Inspect Vercel preview/runtime errors once the Vercel project connection is available.

## Task 10: Stop before production deployment

When all work and tests are complete:
- summarize changes
- show test/build results
- show remaining external/account-level tasks, including GA4 consent and Vercel connector access if still unavailable
- ask for explicit production deployment approval

No production deployment or merge to `main` occurs without that approval.
