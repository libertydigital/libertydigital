# Homepage visual restoration, user-directed correction

Date: 2026-10-30
Base production commit: `b06d7e716e19d7a82e57822311803a7be77c6027`
Original visual source: `323ba616755e4a7ac87deefe463f987d561324f9`

## Why
The October 30 conversion sprint changed the homepage hero and replaced the prior rotating nine-service image carousel with four plain dark cards. The user explicitly rejected this redesign and requested the earlier appearance. Preserve the established design, and do not treat approval for conversion improvements as approval for a visual overhaul.

## Exact source restoration
- `src/components/sections/premium-hero.tsx`: restore original rotating hero.
- `src/components/sections/home-experience.tsx`: restore previous headline, nine featured services and ServiceSlider image carousel, and original remaining homepage content.
- `src/components/services/service-card.tsx`: restore original photo-backed card design without newly appended price badge.
- `src/app/(site)/services/page.tsx`: restore original priority area and full service grid.
- Update DESIGN.md and conversion sprint design notes to make original visual identity authoritative.
- Update validate:conversion to assert restored carousel and hero rather than enforcing the rejected redesign.

## Deliberately retained
- Latest problem-intent SEO guides, guide sitemap, internal article links.
- Short initial enquiries and protected server-side lead workflow.
- Service detail indicative pricing and cost disclosures, urgent enquiry routing and service-page mobile CTA.
- Analytics consent gating, administrative paid-revenue reports and all existing database structures.

## Verification and release gate
- Compare the four restored visual component contents byte-for-byte with `323ba616755e4a7ac87deefe463f987d561324f9`.
- Verify source contract and conversion assertions are consistent with the original layout.
- Run `npm run validate:conversion`, `npm run validate:growth`, `npm run validate:guides`, `npm run lint` and `npm run build` in a checkout before live release if execution is available.
- No branch creation, main update or Vercel deployment without the user's separate deployment approval. Main must never be deleted; avoid creating unnecessary branches.
