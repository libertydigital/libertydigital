# Reggio Emilia BVN, NIN and Nigerian Passport Event: Publication Progress

Date: 6 November 2026
Repository: `libertydigital/libertydigital`
Article slug: `bvn-nin-reggio-emilia-7-8-november-2026`

## Content delivered
- [x] Published article exists in Supabase Content Studio, with BVN, NIN and Nigerian passport services.
- [x] Saturday 7 November is the only BVN day, Sunday 8 November is NIN services; passport service day is unconfirmed.
- [x] No new adult NIN enrolment; child enrolment ages 0–17; adult and minor NIN modifications permitted.
- [x] Address Via Anselmo Govi 3 and WhatsApp +39 353 390 3464 retained.
- [x] SEO title, excerpt, 155-character-or-less meta description, related reads and relevant service links prepared.
- [x] Existing high-resolution, realistic photographic editorial images reused as dedicated event assets. They are not actual event photography.
- [x] Unsupported Markdown schedule table replaced with native-renderable bullets and headings.
- [x] Added time-sensitive curated fallback source. Published database content still takes priority.
- [x] Reggio-specific article tests added (dates, eligibility, image PNG signatures, source matching).

## Media mapping
- `public/images/blog/bvn-nin-reggio-emilia-7-8-november-2026.png` copies existing repository image `public/images/blog/nigerian-child-passport-parental-consent-rome.png` (same Git blob, 2451440 bytes).
- `public/images/blog/reggio-emilia-passport-support-2026.png` copies existing repository image `public/images/blog/nigerian-same-person-affidavit-italy.png` (same Git blob, 2898475 bytes).

## Release boundaries
- MP4 files and video-worker code are intentionally untouched; the user will use the existing Remotion feature.
- Do not trigger preview deployments. Vercel Git deployments remain blocked by `vercel.json` (`deploymentEnabled: false`).
- Publication in Content Studio and merging source to main are distinct from Vercel production deployment.
- A single production deployment requires access to the Vercel project under the owning team, followed by verification of the live article and image URLs.
- No feature branch created, so no branch cleanup required.

## Completed GitHub and live-publication verification (6 November 2026)
- Source and two dedicated high-resolution PNG paths were committed directly to `main` at `c60342368ebf7ed86f35c1a9650470ec2febdf0a`, with no short-lived branch.
- No build or end-to-end GitHub CI check was started by this direct commit; the added event test is staged for the next Content Studio CI run. Basic editorial constraints, asset presence and main ref were verified programmatically.
- The existing Supabase article record `3d5273e4-9bc0-42f1-b6ea-11c699193198` remains `PUBLISHED` and was synchronized with the final article copy.
- Because the production Vercel deployment hold is still active, the live database article references the two **original, already-deployed** editorial PNGs: `nigerian-child-passport-parental-consent-rome.png` and `nigerian-same-person-affidavit-italy.png`. Those contain identical photographic data to the new event-specific paths committed to main, avoiding broken images before a later controlled deployment.
- The earlier queued video `87cdc330-ba3a-4ba6-977e-00ab01b86206` was restored to `DRAFT` before a worker could claim it (`attemptCount=0`) to prevent an unwanted outdated narration.
- Independently fetched the canonical live article URL via TinyFish. The published title, SEO description, complete BVN/NIN/passport details and both Next Image image links were present. The non-www URL resolved to www.
- Neither of the connected Vercel accounts can find the Liberty Digital project; separate Vercel production deployment is **not performed**. `vercel.json` continues to disable automatic production and preview builds.
