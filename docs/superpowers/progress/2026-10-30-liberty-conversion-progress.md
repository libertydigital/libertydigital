# Liberty Digital Conversion Sprint Progress

Date: 2026-10-30
Base main commit: 323ba616755e4a7ac87deefe463f987d561324f9
Status: Prepared as detached commits. NOT published to a branch, merged, or deployed.

## Code changes
- Homepage now has a static user-focused headline and four service paths, preserved forest/champagne identity and contact/WhatsApp tracking.
- Homepage and services hub prioritise Passport, NIN, BVN and NPC, with other offerings retained.
- Indicative service prices are sourced from the existing catalogue and disclosed separately from official fees. Zero means quote required.
- Service pages have tracked sticky mobile calls to action, relevant related services and urgent passport-help route. Global WhatsApp is suppressed on those pages.
- Contact CTA deep-links to the form; Roma office directions use the maintained business address.
- Three topic-specific guides are added into existing guide architecture, article schema and sitemap. Their sections have contextual links and Related reads.
- Existing short public forms continue to use protected server-side enquiries. Legacy sensitive intake remains unused by public routes.
- Authenticated admin staff can record actual paid EUR in lead.formData without schema changes; admin dashboard totals leads, completions, and confirmed payments by service.
- Design context, implementation plan and source-contract/helper tests are included.

## Verification recorded
- GitHub repo and latest main base checked; all changes assembled as detached Git objects, with no Vercel deployment initiated.
- During preparation, lightweight string/source contracts were checked for hero, primary services, pricing guards, mobile CTA scoping, content linking and admin auth.
- Code search confirmed public service routes use ServiceInquiryForm, not legacy ServiceLeadForm.
- The connected tool cannot check out/run the repository in the local shell. Full npm/ESLint/TypeScript/build, server-action testing, browser UI and visual QA have not yet run. They remain required before production.
- Authentic Google reviews, verified GBP ownership/open hours and price confirmation require evidence from Liberty, so are not invented or published as claims.
