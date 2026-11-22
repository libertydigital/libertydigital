# Humanised video production: implementation progress

Date: 2026-11-22
Branch: feature/content-video-humanized-2026-11-22
Deployment: none. Vercel git.deploymentEnabled remains false.

## Implemented
- Six grounded video formats and validation of curated media IDs, caption, narration and pacing.
- Approved local media staging, muted source footage, photographic Remotion layout and old-video fallbacks.
- Free Kokoro scene-timed audio, silent-tail padding, audible-output gate and spoken phrase captions.
- Timed storyboard preview, visual editor for shots and voiceover, permission confirmation before approval.
- Authenticated manual platform views, average watch time, link clicks and qualified inquiries.
- Prisma additions for distribution performance, tests for scenes, assets, timed audio and metric input.
- Updated operating instructions preserving private MP4 playback and manual social publishing.

## Remaining verification
- Review PR CI: app unit tests, typecheck and production build; Remotion unit tests, typecheck and narrated video smoke.
- If CI fails, inspect the specific failure and fix on this branch.
- A real end-to-end authorized render and human review of the output remain a pre-release acceptance step.
- No merge, no preview deployment and no production deployment without owner approval.
- New database columns are not yet applied in production. Back up and review the schema update before a single approved release.

## Owner-approved release phase
- Owner approved merging PR #9 and a single production deployment.
- Before-action verification confirmed Vercel project is not available through either connected Vercel account.
- Identified the live Supabase project (defxhmtrhuqufalnjhjw) and verified protected content tables and missing insight columns.
- Prepared an additive, table-snapshot-backed migration; production migration and merge status must be updated from tool results before claiming completion.
- Do not deploy to the unrelated Vercel projects or create a new project as a workaround.
