# Liberty Digital Guides: Design Specification

**Status:** Approved for implementation  
**Date:** 2026-08-14  
**Objective:** Add a focused, search-led guide library that helps Nigerians and Africans in Italy prepare for high-intent document journeys and routes qualified visitors to Liberty Digital's existing support services.

## Scope

The first release adds a reusable guide system, enhances the existing Resources hub, and publishes five original English-language preparation guides:

1. Nigerian Passport Support in Rome
2. BVN Support in Italy
3. NIN Document Support in Rome
4. Nigerian Embassy Document Legalization in Rome
5. Questura Support Letter in Italy

The release does not add a CMS, paid advertising, user comments, auto-generated content, or claims that Liberty Digital controls official requirements, appointments, approvals, or document issuance.

## Audience and conversion goal

The primary audience is Nigerians and other African residents in Italy, especially Rome, who are researching a document requirement before contacting a support provider. The primary conversion is a qualified service request. A WhatsApp route may be shown as a secondary, faster-triage option where the existing site already supports it.

Each guide must help a visitor understand what to prepare, identify the relevant Liberty service, and take a next step without implying official affiliation.

## Information architecture

- `/resources` remains the library hub and becomes a collection of published guides, with the existing service-preparation directory retained as a secondary route.
- `/resources/[slug]` is the single dynamic guide route.
- A typed guide catalogue is the source of truth for publication data, metadata, FAQs, related services, and article copy.
- Only published guide slugs are statically generated and included in the sitemap.

## Guide page design

Every guide uses the site's existing premium surface, typography, breadcrumb, CTA, and responsive layout conventions. It includes:

1. Breadcrumbs: Home > Resources > Guide
2. One H1 matching the search intent
3. A short introduction that names the intended location/audience without overstating official requirements
4. A preparation checklist
5. A practical, original "common mistakes" or "before you submit" section
6. A clear boundary statement: official authorities control current requirements, appointments, approvals, and issuance
7. An above-the-fold primary CTA to the matching service request
8. A mid-page reassurance CTA after the checklist or process explanation
9. A final CTA with the existing form route and, where available, the site's WhatsApp route
10. Related Liberty services with descriptive internal-link text
11. Guide FAQs and a related-guides block when more than one guide is available

The design must remain content-first, fast, semantic, accessible, and free of display-ad placements on high-intent conversion pages.

## Data model and rendering

Create a `Guide` type and a typed catalogue in `src/lib/guides.ts`. A guide record contains:

- slug, title, description, excerpt, published date, and reading-time label
- primary service slug and related service slugs
- optional related guide slugs
- ordered article sections with headings and paragraphs
- checklist items, common mistakes, FAQs, and official-verification note

The dynamic page reads only from this catalogue. Unknown slugs return `notFound()`. Metadata comes from `buildPageMetadata` with `type: "article"`; article pages add `Article`, `FAQPage`, `BreadcrumbList`, and `WebPage` schema using the canonical site URL.

The sitemap derives its guide entries from the same published catalogue, preventing sitemap/page drift.

## Editorial and compliance rules

- Guides are original preparation content, not copied authority instructions or keyword-spun pages.
- Use words such as "prepare", "check", "support", and "confirm"; avoid promises such as "guarantee", "approval", "official processing", or "we issue".
- Cite or link to a relevant official authority only where an accurate, stable official URL is available; do not create unverifiable requirements.
- State that current requirements can change and must be confirmed with the relevant official authority before submission.
- Do not publish sensitive personal-document examples or any real client data.

## Internal linking and SEO rules

Each guide links prominently to its primary service page and naturally to related services. The library hub links to every published guide. Guides link back to Resources and avoid generic anchor text where a descriptive service name is available.

All pages require one H1, logical H2/H3 hierarchy, concise metadata, canonical URLs, optimized existing Open Graph imagery, semantic `article` content, and mobile-first CTA placement.

## Error handling and verification

- Missing guide slug: Next.js 404 through `notFound()`.
- Invalid service relationship: development-time TypeScript constraints where practical, plus a focused test or validation routine that ensures referenced service slugs exist.
- Validate the route, sitemap entries, metadata, canonical tags, heading count, schema payloads, and internal links.
- Run lint and production build after implementation. Re-run the live SEO audit separately after deployment; do not represent local build results as live performance or indexing data.

## Success criteria

The release is complete when five indexable guide pages are rendered from one reusable system, appear in the Resources hub and sitemap, link to relevant service pages, contain original and compliant preparation guidance, and pass lint/build verification.
