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

- Queue is concurrency-safe via conditional `updateMany` claim transitions. Render jobs timed out after 45 minutes move to FAILED and can be reviewed/reapproved/queued.
- Failed upload, TTS or Remotion job writes an error to the video record. Worker secrets are never embedded in the media.
- Source changes after approval revoke approval of queued, unrendered variants. Completed videos are immutable; create a fresh variation for revised content.
- The current implementation does not fetch licensed stock clips or perform native TikTok/Meta/YouTube API posting. Those need licensed sources and reviewed connected-account permissions.
- No paid AI rendering/voice provider requests are made during CI.
