# Liberty Digital: Five SEO Articles and Images
Date: 2026-11-03
Production main at start: `8a2541e9127b33352342c117fcba71ab120cd34e`.
Work branch: `feature/content-studio-blog-video-2026-11-02` (reused instead of proliferating feature branches).
Publication instruction: user requested five SEO-optimised illustrated blog posts and publication.
Release rule: no push/merge to main and no Vercel deployment before explicit deployment approval. Publishing public static articles from code requires a single deployment; user has requested publication but not separately authorised another code deployment under project's deployment rule.
Access constraint: no authenticated Liberty Digital Content Studio browser session or connected production Supabase project in available tools; cannot safely write production ContentPost records.

## Research and keyword positioning
Five long-tail, clear-intent primary keyword candidates selected after inspecting results and public authority guidance. 'Lower competition' is directional based on SERP specificity, not a verified volume/KD metric. No ranking or traffic guaranteed.

1. `Nigerian same-person affidavit Italy`: support for specific name-mismatch evidence; Italian Consulate in Lagos says a court affidavit may explain study document discrepancies, while NIS has separate record-correction procedures.
2. `Nigerian nulla osta marriage Italy`: Article 116, distinction between personal single-status declaration and competent authority's marriage no-impediment document; Rome prefecture signature-legalisation notes.
3. `Nigerian child passport parental consent Rome`: NIS fresh-passport minors requirements versus older Rome mission instructions; caution to confirm updated policy.
4. `NPC birth attestation Italy family reunion`: family-reunion checklist versus study/citizenship age cutoffs; avoid applying one December 1992 rule universally.
5. `Nigerian family income documents Italy scholarship`: official ER.GO requirements for household, foreign income, assets, issue year, translation and legalisation.

## Source authority
- https://conslagos.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/legalization-of-documents-for-study-and-declaration-of-value/
- https://immigration.gov.ng/passports/
- https://immigration.gov.ng/info-center/renewal-of-passport/
- https://www.esteri.it/it/servizi-opportunita/italiani-all-estero/stato-civile/matrimonio_0/
- https://www.comune.roma.it/web-resources/cms/documents/Carta_della_qualita_dei_servizi_DEMOGRAFICI_Mun_VI_2025.pdf
- https://static.tlscontact.com/media/ng/lgv/it/requisite_documents_for_family_reunion_visa.pdf
- https://ambabuja.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/traduzione-e-legalizzazione-dei-documenti/
- https://www.er-go.it/studenti-internazionali/documentazione-da-presentare
- https://www.er-go.it/studenti-internazionali/documentazione-da-presentare/procurati-i-documenti-richiesti
- https://www.er-go.it/studenti-internazionali/documentazione-da-presentare/studenti-con-redditi-e-o-patrimoni-sia-in-italia-sia-allestero

## Implementation checklist
- [x] Research five long-tail targets against official sources and niche SERP; fact-check high-risk procedural claims.
- [x] Write five original substantial guides with unique title, slug, metadata, FAQ, 3+ contextual links, related reads and official references.
- [x] Create five original lightweight SVG editorial illustrations at 1200x630 with descriptive alt text.
- [x] Add safe linked Markdown/image rendering, social metadata, site listing, structured data, sitemap and admin import action.
- [ ] Run CI editorial tests, app build, lint and TypeScript checks.
- [ ] Obtain deployment approval before altering main. Publication not complete until verified live after one deployment.

## Editorial publishing implementation
- Public blog and article routes now merge published Prisma records with five original static curated articles, avoiding duplicate URLs.
- An editorial record with the same slug in REVIEW/DRAFT overrides and suppresses static publication.
- Article hero SVG artwork, clickable internal/external links, bold text, lists, headings, canonical metadata and Article JSON-LD render safely.
- Every article has a dynamic 1200x630 PNG `opengraph-image` for social sharing; SVGs remain the lightweight on-page illustrations.
- Sitemap includes the five curated articles and published CMS records.
- Added an admin-only, idempotent import action to copy the five curated articles into `ContentPost` records for editing and generating videos.
- Added unit checks for article quality, SEO fields, link safety, image assets, and HTTP smoke checks for all five routes and social previews.
- This branch changes source code but has **not** been merged or deployed, pending explicit deployment approval.

## CI debugging, stable social preview
- First new branch CI: Prisma, all unit tests, database checks, lint, TS, Next production build and Remotion renderer passed; HTTP smoke reported 404 for `/blog/<slug>/opengraph-image`.
- Build route manifest revealed Next 16 adds a generated suffix to file-convention image routes. The hard-coded URL was incorrect.
- Fixed root cause by using a standalone stable route `/api/blog-og/[slug]`, returning PNG ImageResponse with 404 for unpublished articles, and changed Open Graph/Twitter/JSON-LD images to its stable URL. The source `opengraph-image.tsx` route is removed to avoid file-convention metadata collisions.
- Expanded HTTP assertions to check stable image metadata and PNG bytes. Awaiting updated CI run. No production deployment.

- Corrected over-escaped regex in the HTTP smoke test during review of the stable PNG API fix; awaiting GitHub CI rerun.
