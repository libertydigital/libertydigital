# Liberty Digital: rendered video playback navigation
Date: 2026-11-03
Branch: `fix/content-studio-rendered-video-links-2026-11-03`
Production deployment: **NOT REQUESTED OR PERFORMED** for this fix. The `vercel.json` Git production deployment hold remains enabled.

## Reported behavior and verified production state
- The Content Studio dashboard showed one rendered video, but its "Rendered videos" count was a static `<div>` with no navigation.
- Production `ContentVideo` record `cmw0qg9hf0001jt08zsbm5yw8` is `READY` and has `attemptCount=1`, a storage path, no error, and 32-second duration.
- Supabase Storage `content-videos` contains `cmw0qg9hf0001jt08zsbm5yw8/render-1793714739253.mp4` (MIME `video/mp4`; 2,387,297 bytes). The data and media are intact; no requeue is necessary.
- The article is `Nigerian Same-Person Affidavit in Italy: Fixing Name Mismatches`, post ID `cmw0qftjg0000lb08ex8l5646`. Existing editing route `/admin/content/<postId>` embeds playback through an admin-generated 15-minute signed URL, but the rendered-video counter did not link there.

## Changes implemented
1. Content Studio dashboard: turn the rendered video summary tile into an accessible link. For exactly one rendered video, the link opens its player anchor directly. For multiple videos, it opens a dedicated list of the latest 50 playable videos with article title, format, duration and direct "Play video" links.
2. Article editor: put a permanent `rendered-video-<videoId>` anchor at the HTML5 MP4 player, add a clear "Rendered MP4" heading, inline playback and visible download action. Advise refreshing for renewed 15-minute signed URLs.
3. If storage signing fails, show a visible administrator error instead of silently hiding the player while continuing to show `READY`.
4. Add targeted source-level regression assertions in `tests/content-video-navigation.test.mjs`. Full CI must typecheck, lint and build both application and renderer.

## Release / validation checkpoint
- GitHub Actions CI passed for the final PR head: run https://github.com/libertydigital/libertydigital/actions/runs/41653198442 (app, tests, lint, TypeScript, Next.js build, HTTP smoke, and Remotion renderer).
- No Supabase writes, worker rerenders, production deployments, or Vercel setting changes were executed by this fix.
- Before deployment, verify clickthrough from the dashboard counter to the signed MP4 player in an authenticated admin session, plus fallback behavior if signed URL cannot be created.

## CI correction log
- First pull-request run: Remotion renderer passed; application checks passed through database smoke and unit tests. ESLint/TSX parsing caught an extra JSX attribute delimiter on the new rendered-video Link (line 41 of the Content Studio index). Corrected the delimiter at commit `b6f2d36fb6758fd3cbefc7ebf6fdf76556cbccf7`.
- Re-run CI on latest PR head and confirm both app and renderer before merge. Deployment hold unchanged.

## Merge and cleanup (3 November 2026)
- Squash-merged PR #4 into `main` at `2170ac94e2ee82b96f8c08d6f69224d35befe603` after both CI jobs passed.
- Removed temporary branch `fix/content-studio-rendered-video-links-2026-11-03` using guarded one-time branch-only workflow https://github.com/libertydigital/libertydigital/actions/runs/41653827115. The delete job completed successfully, and the branch ref returned 404; `main` remains intact.
- Checked `vercel.json` on `main`: `git.deploymentEnabled.main=false` remains active. This change has **not been released to production**. The next release requires explicit owner permission for a **single** deployment, followed by admin playback verification. The existing video can already be opened in the article editor on the current production site.

## Production release approval and Vercel access blocker
- The owner explicitly approved **one production deployment** of this merged fix in chat on 3 November 2026.
- Reviewed release code merge commit: `2170ac94e2ee82b96f8c08d6f69224d35befe603`. Current `main` before this progress update: `3849c35a279be5b6bf3894b0143e4e4846728976` (documentation-only commit after merge).
- Confirmed successful application and renderer GitHub Actions run: https://github.com/libertydigital/libertydigital/actions/runs/41653198442.
- Target Vercel project is `contact-2122s-projects/libertydigital` (team ID `team_3VeOACqAHAXWP0KKqhgmEech`). Both presently connected Vercel accounts can access only their unrelated projects and receive HTTP 403 `not authorized` for the target scope.
- Explicit `authorize_team_access` calls using both the slug and exact target team ID returned HTTP 404 `Team not found` for the connected credentials, so no authorization link could be obtained via the connector. Owner must connect an account holding access to the target Vercel project, or have a project administrator grant access.
- No deployment initiated. No production settings, environment secrets, storage files, or database records altered by the release attempt. `git.deploymentEnabled.main=false` remains active. The approved single deployment is still pending; do not bypass the gate by toggling automatic Git deployments.
- Once correct access is available, inspect the owning project, perform **one** explicit production deployment of the verified `main` commit, inspect deployment logs, and verify an authenticated administrator can open the READY MP4 from the summary tile. Record deployed SHA, deployment ID, and verification.
