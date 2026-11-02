# Liberty Content Studio Design
Date: 2026-11-02
Status: User approved implementation of phases A–E.

## Intent
Create original, reviewable website articles and repurpose each into social-first, vertical videos for Nigerian document-preparation audiences in Italy, without misleading official-process claims.

## Architecture
- Retain the existing typed `/resources` guide library unchanged.
- Add database-backed `/blog` articles and protected `/admin/content` editorial tools in the existing Next.js application.
- Persist posts, storyboard versions, video jobs and platform-specific publication records with Prisma.
- Produce an editable article-derived storyboard, with an optional external AI model and reliable deterministic fallback.
- Render branded 1080x1920 Remotion videos in a separate worker. Optional configured TTS narration and synchronized scene captions; store MP4 privately in Supabase Storage and issue expiring preview links.
- Only approved videos can queue rendering; publishing records require deliberate editorial approval and are tracked separately by platform.
- Start with manual MP4 export plus platform checklist/tracking; add direct platform adapters only with OAuth permissions and audited APIs, no simulated auto-posting.

## Editorial/SEO
One source of truth, human approval, canonical article URLs, sitemap only for published posts, descriptive internal service links. Render markdown safely as escaped paragraphs and headings, not untrusted HTML. Preserve original legacy resources. Explicit note that authorities, not Liberty, control appointments or issuance.

## Operational rules
- One feature branch, no merge or deployment without explicit approval.
- Document each phase in `docs/superpowers/progress`.
- Server-side admin authorization, action validation, private worker token, no credentials exposed to clients, no public drafts, no PII in generated video jobs.
- External dependencies and secrets are optional for local editorial flow; explain missing configuration rather than falsely reporting a render or publication.
- Tests: editorial state validation, storyboard fallback, route and authorization checks, TypeScript/build, render smoke job when worker credentials and runtime exist.

## Approaches considered
1. External CMS and social scheduling SaaS: faster launch but duplicate authoring and new recurring expense.
2. Entire pipeline in Next.js functions: simplest code, unreliable for long Chromium renders and large uploads.
3. Chosen: Next.js editorial app plus separate Remotion worker and authenticated private storage. Better control, no long-running web requests, explicit approval gates.

## Phases
A. CMS + public blog + SEO
B. Script/storyboard + editing
C. Remotion worker + storage + captions/TTS
D. Review/preview/export + retry
E. Distribution records + approval controls + analytics

## Limitations
Direct posting cannot honestly be enabled without platform OAuth/app approval. Production rendering requires worker credentials, storage bucket and deployment; branch-only verification cannot establish production functionality.