# Liberty Digital — Realistic Blog Image Replacement
Date: 2026-11-03
Branch: `feature/content-studio-blog-video-2026-11-02` reused after previous merge; `main` remains `861e74ed252a6bbf55c62935ca9076d47626bafc`.
Deployment: **NOT AUTHORISED** for this change. No merge or production deployment without owner approval.

## Objective
Replace all five original vector banner illustrations with the user's generated realistic photographic images across blog cards, article heroes and social metadata. Preserve SEO structure, canonical routes and editorial approvals.

## Source files and mapping
1. `rome_identity_document_review.png` → `nigerian-same-person-affidavit-italy.png` (realistic document name comparison)
2. `italian_marriage_registry_desk.png` → `nigerian-nulla-osta-marriage-italy-documents.png`
3. `rome_travel_documents_and_family_journey.png` → `nigerian-child-passport-parental-consent-rome.png`
4. `italian_family_reunion_paperwork.png` → `npc-birth-attestation-italy-family-reunion.png`
5. `italian_student_grant_desk_abroad.png` → `nigerian-family-income-documents-italy-scholarship.png`

## Implementation checklist
- [x] Confirm source images exist and are full-resolution 1731×909 PNGs.
- [x] Stage all five images as Git blobs without altering main.
- [x] Write regression tests for image signatures, SEO preview path and legacy imported-article fallback.
- [x] Observe red CI as proof that tests catch the current SVG behavior.
- [x] Commit five photographic PNGs, update curated articles and Markdown image parser, use Next Image optimization.
- [x] Ensure social Open Graph/Twitter previews use the appropriate photograph.
- [ ] Run full GitHub CI: article tests, DB smoke, lint, TypeScript, production build, HTTP smoke, video worker.
- [ ] Review changes and record verification.
- [ ] Ask for explicit approval before a single main-branch deployment.

## Notes
- These are **AI-generated editorial photographs** showing illustrative records, not real issued documents; maintain a subtle illustrative disclaimer in article view.
- Avoid third-party image hotlinks, extra providers or new credentials; store source assets in repository.
- Existing `/images/blog/*.svg` files can remain for backward compatibility with any manually authored legacy post; the five curated slugs must resolve to the realistic images.
- Image optimization will be provided by Next.js `next/image` (AVIF/WebP negotiation, responsive variants) rather than embedding images as base64 in markup.

## Final integration and release gate
- Existing feature-branch CI failed on 3 November because the hero parser accepted only SVG and did not map legacy covers. The failures are addressed by the safe local PNG/WebP/SVG parser with a five-slug SVG-to-PNG fallback.
- Blog listing cards, article hero images and inline editorial images use responsive Next Image optimization for PNG/WebP. Older non-curated SVG content remains readable.
- Open Graph, Twitter and Article JSON-LD now point directly to each article's realistic photograph; posts without local hero images retain the existing dynamic branded PNG fallback.
- Photographic assets include a visible note identifying them as AI-generated editorial images, not official government documents.
- Regression tests cover all five PNG signatures, old SVG CMS records, safe-image validation, article metadata and image HTTP responses.
- GitHub CI must pass before merge. Deployment remains a separate owner-approved action; do not run a production release as part of this change.

## CI repair log
- First integrated CI run (GitHub Actions `41643790470`): article/unit and disposable database checks passed. Lint failed because the existing HTTP image MIME-type check contained an over-escaped regex, and lint also found an unused test import.
- Fixed the regex syntax and removed the unused import; full build/HTTP checks remain gated on a subsequent green CI run.

## Controlled production deployment
- The repository is linked to Vercel, so a normal push to `main` can automatically start a production deployment. The owner explicitly requires separate deployment approval.
- Added `vercel.json` with `git.deploymentEnabled.main=false` to prevent automatic production Git deployments, leaving preview branch builds enabled. This safety hold must stay active until the owner separately approves release.
- When approved, a person with access to Liberty Digital's Vercel project should create a single controlled production deployment from the verified `main` commit, or intentionally re-enable Git-based production deployment. Confirm the exact release commit before deployment.
- Vercel's owning project is not exposed through the currently connected Vercel accounts; GitHub integration evidence alone does not prove the live production site has been updated.
