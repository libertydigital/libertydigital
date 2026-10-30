# Liberty Digital Conversion Sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or subagent-driven-development. Steps use checkbox syntax.

**Goal:** Increase relevant enquiry conversions and measure completed and paid outcomes without changing the brand or public privacy architecture.

**Architecture:** Reuse Next.js App Router marketing components, typed service catalogue, consent-gated tracking and protected Prisma lead administration. Develop all changes as detached Git objects, leaving branch publication and deployment behind explicit user approval.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, Prisma 6, TypeScript, Vercel Analytics.

**Spec:** docs/superpowers/specs/2026-10-30-liberty-conversion-design.md

## Global constraints
- Preserve independent-support disclaimers and existing server-side enquiry submission.
- No fabricated reviews, office hours, official affiliations or arbitrary fees.
- No deployment or main changes until user explicitly approves.
- No DB schema migration, no payment provider integration and no unnecessary extra branch.
- Document actual verification and limitations, not estimated test results.

## Review focus
1. Zero-priced catalogue item must request a quote rather than appear free.
2. Service mobile CTA must not overlap sitewide floating WhatsApp or obscure the end of content.
3. Only authenticated admins can change internal revenue, never site visitors.
4. Clearing, zero, invalid and fractional EUR amounts must not silently corrupt totals.
5. New guide slugs must be unique and all existing article routes must remain intact.

### Task 1: Homepage conversion hierarchy
- [x] Build static outcome hero and four service choices.
- [x] Simplify homepage services and user-facing enquiry copy.
- [x] Keep existing colors, typography and office address.
- [ ] Verify visual and responsive states in an approved browser preview.

### Task 2: Fee clarity and service action
- [x] Add service pricing helper and fee disclaimers.
- [x] Add service sticky mobile request/WhatsApp CTA.
- [x] Hide redundant floating WhatsApp on service pages.
- [x] Strengthen relevant cross-selling and urgent-help link.
- [ ] Verify actual service form submission via approved preview.

### Task 3: Intent-based content
- [x] Create three distinct service-problem resources.
- [x] Add contextual links and Related reads.
- [x] Update guide-count validation.
- [ ] Run guide validation and inspect routes/sitemap.

### Task 4: Confirmed revenue reporting
- [x] Implement EUR-cent parser/formatter.
- [x] Add authenticated admin paid-revenue action and editor.
- [x] Add dashboard totals and service-level breakdown.
- [ ] Verify admin save/clear/zero, access guard and persistence in preview.

### Task 5: Tests, documentation, release
- [x] Create design and progress documentation.
- [x] Add source-contract and helper-level tests.
- [ ] Run full tests, lint, build in an executable environment.
- [ ] Request explicit release approval, publish one branch/preview only when approved.
- [ ] Request explicit main/production approval after verification.
