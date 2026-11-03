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
- Awaiting GitHub Actions pull-request CI.
- No Supabase writes, worker rerenders, production deployments, or Vercel setting changes were executed by this fix.
- Before deployment, verify clickthrough from the dashboard counter to the signed MP4 player in an authenticated admin session, plus fallback behavior if signed URL cannot be created.
