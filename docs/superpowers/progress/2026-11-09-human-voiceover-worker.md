# Human narration required for the new-week Liberty Digital video
Date: 9 November 2026
Video ID: `cmcf12bd49fdf635e1207b5e`
Article: `get-your-nigerian-documents-on-track-this-week-italy`

## Verified starting state
- The published article is available on Liberty Digital's site, already deployed by the owner.
- The target video's status is **DRAFT**, duration 30 seconds, no render attempts, no MP4 storage path.
- Repository is publicly readable, and there are **no MP3, WAV, M4A, OGG, or FLAC recordings** in its file tree.
- Supabase private Storage contains no existing audio file matching common recording extensions.
- The old worker always called Kokoro; that could not meet the user's genuine-human-narration requirement.

## Work
- [x] Created `video-worker/human-narration.mjs` to validate and transcode human-recorded audio from a private signed Supabase URL.
- [x] Added an explicit no-AI branch for the exact video ID, with no Kokoro fallback.
- [x] Added `HUMAN_VOICEOVER_URL` as a protected GitHub Actions secret input and pinned the human-voiceover-required video ID in the worker workflow.
- [x] Added tests for per-video gating, missing recording, insecure URLs and valid signed-audio conversion.
- [x] Documented operational steps in `docs/content-studio-operations.md`.
- [x] Preserved the existing automated workflow for other articles.
- [x] No Vercel deployment, preview deployment or new feature branch.

## Pending required human input
- [ ] Upload a real human-narrated recording of the video's script (approximately 25–29 seconds).
- [ ] Upload the recording to private Supabase Storage and configure a short-lived signed URL under GitHub Actions secret `HUMAN_VOICEOVER_URL`.
- [ ] Approve and queue the video, then run GitHub Actions and verify `READY` + a valid MP4/audio stream.

Do not describe a synthetic speech track as a human performance. Rendering is blocked pending the genuine human voice input.
