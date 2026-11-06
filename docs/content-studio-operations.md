# Liberty Digital Content Studio — operator manual

Status: implementation branch only. **Do not merge or deploy until the owner authorizes a single coordinated release.**

## Features

- `/admin/content`: article drafts and SEO fields, editorial review, publication.
- `/blog` and `/blog/[slug]`: published articles only, schema and sitemap.
- One article can create several `EXPLAINER`, `TIPS`, `UPDATE` storyboard variations.
- Storyboard captions and durations are editable; every revision resets approval.
- Admin approval is necessary to queue a render. Rendering uses a separate GitHub Actions worker. Videos are private Supabase Storage objects accessed via 15-minute signed links.
- Platform publication is **manual**. The app prepares platform-specific records and validates the real external post URL. It does not upload videos to TikTok, Meta, or YouTube automatically.

## Required configuration for the single production release

1. Back up production Postgres. Run `npm run db:push` and then `npm run content:secure` against the production project in the approved release window. The security script enables row-level security and revokes public `anon`/`authenticated` grants for all three new content tables. No automatic schema push at application startup. Review Prisma's planned database changes first.
2. Create a **private** Supabase Storage bucket named `content-videos`. Do not make it public. Supabase storage service-role server API signs uploads and read-only playback URLs.
3. Set `VIDEO_WORKER_TOKEN` to the same random >=32-character secret on the Next.js server and as a GitHub Actions secret. Never set it as `NEXT_PUBLIC_`.
4. Add GitHub Actions secrets `CONTENT_VIDEO_API_BASE_URL` (the production HTTPS base origin), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `VIDEO_WORKER_TOKEN`.
5. Ensure Next.js already has its production `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_SERVICE_ROLE_KEY`, Supabase public variables, and `NEXT_PUBLIC_SITE_URL` set.
6. Optional: `OPENAI_API_KEY` and `CONTENT_AI_MODEL` on the Next.js server for AI-assisted storyboard generation. Without them, a deterministic grounded storyboard is produced.
7. Optional: `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` in GitHub Actions secrets for narration. Without them, videos render silently with animated scene captions.
8. **Security requirement:** configure a strict `ADMIN_ALLOWED_EMAILS` allowlist for existing admins before release. The pre-existing app supports user_metadata-based admin fallback, which should be migrated to app_metadata in a separately reviewed authentication change. Do not leave the fallback unrestricted in production.
9. Merge to `main` and deploy **once** only with the owner's approval. Scheduled GitHub Actions worker runs on the default branch, not on the unmerged feature branch.

## Publishing walkthrough

1. Admin creates a blog draft, edits title, slug, excerpt, SEO description, Markdown text and relevant service. Updates to an already published article move it back to REVIEW; approval of in-progress/unrendered video variants is revoked.
2. Admin saves it, submits to REVIEW, and only then publishes after fact-checking.
3. Admin creates a video storyboard (optionally AI-assisted), edits hooks and scene JSON, previews scenes, then approves it.
4. Click Queue MP4 Render. A scheduled/manual GitHub Actions worker claims one queued item through a bearer-protected endpoint, renders a vertical 1080x1920 H.264 MP4, uploads via a signed one-time Supabase Storage token, and reports READY/FAILED.
5. Admin opens the video on the article edit page, previews/downloads it, uploads it to the chosen social site and records the **actual** HTTPS post URL.
6. Admin sees destination status and the count of externally published videos. No analytics beyond recorded publishing outcomes are invented.

## Verification

- GitHub Action `Content Studio CI`: `npm ci`, `prisma validate`, `prisma generate`, unit tests, disposable Postgres database smoke, lint, TypeScript check, Next build, Remotion CLI composition/render smoke.
- Workflow `Render approved content videos`: schedule (15-minute interval, main only) and manual dispatch. Does not publish social media posts.
- After deployment, test with a non-sensitive sample article in a private admin session, render one complete MP4, validate that the private link expires, and record one test distribution only with a real platform URL. Verify no draft appears publicly or in the sitemap.

## Recovery / boundaries

- Queue is concurrency-safe via conditional `updateMany` claim transitions. Each claim increments an attempt counter. Worker callbacks must include the exact attempt to prevent a stale worker from reporting success for a later retry. Render jobs timed out after 45 minutes move to FAILED and can be reviewed/reapproved/queued.
- Failed upload, TTS or Remotion job writes an error to the video record. Worker secrets are never embedded in the media.
- Source changes after approval revoke approval of queued, unrendered variants. Completed videos are immutable; create a fresh variation for revised content.
- The current implementation does not fetch licensed stock clips or perform native TikTok/Meta/YouTube API posting. Those need licensed sources and reviewed connected-account permissions.
- No paid AI rendering/voice provider requests are made during CI.

## Curated illustrated content

The five fact-checked articles in `src/lib/content/curated-posts.ts` and `curated-posts-extra.ts` are **published static fallback articles**. They have unique 1200x630 SVG illustrations and dynamic PNG social previews. They are visible on `/blog` after the ONE approved deployment, even before the database import. This does not mutate Postgres on public GET.

For full editor/Remotion support, open `/admin/content` and click **Import curated articles** exactly once. The action uses `createMany(skipDuplicates:true)`; it never overwrites an article already imported and modified in Content Studio. If an imported article is moved to DRAFT/REVIEW, the static fallback is suppressed so the editorial decision is respected.

Curated content includes source citations, contextual links, FAQs, correct Article JSON-LD and sitemap URLs. Source requirements change; recheck official instructions before making administrative commitments. The five editorial illustrations are custom vector art, not photographs of official documents. No extra production SQL migration is needed for this content extension.

## Rendering reliability: immediate dispatch and scheduled fallback (6 November 2026)

- Manually deploying the Next.js website does **not** run the separately hosted GitHub Actions renderer. Videos stay `QUEUED` until a GitHub workflow run claims them.
- GitHub Actions `schedule` events may be delayed or dropped. Observed successful worker runs on 6 November were at 08:24 UTC and 16:06 UTC despite the 15-minute schedule; the 16:06 run reported "No queued videos." New videos were queued later, at 18:25 and 19:27 UTC.
- The cron fallback is now at minute **7, 22, 37, 52** of each hour to avoid the busiest times. This is not a guaranteed completion deadline.
- The authenticated `queueContentVideo` server action now makes a best-effort GitHub `workflow_dispatch` request. To enable instant kick after the **next single owner-approved website deployment**, add the server-only `CONTENT_VIDEO_GITHUB_TOKEN` to Vercel production. Use a fine-grained GitHub access token scoped only to `libertydigital/libertydigital` with repository **Actions: read/write** permission. Never use a `NEXT_PUBLIC_` variable for this token or expose it in logs/client code.
- If the token is not configured, GitHub returns an error, or the dispatch times out, the database job remains queued and the cron fallback still runs. The UI must never claim that a queued job has already rendered.
- GitHub Action logs and job statuses: https://github.com/libertydigital/libertydigital/actions/workflows/content-video-worker.yml. Investigate `ContentVideo.status`, `attemptCount`, `claimedAt`, `error`, and `storagePath`.
- GitHub Actions secrets `CONTENT_VIDEO_API_BASE_URL` and `VIDEO_WORKER_TOKEN` are independent of the optional Vercel `CONTENT_VIDEO_GITHUB_TOKEN`. No paid TTS service is needed; Kokoro remains the renderer voice.
- A GitHub Actions worker invocation is not a Vercel deployment; keep `vercel.json` deployment hold on until the owner approves exactly one coordinated release.
