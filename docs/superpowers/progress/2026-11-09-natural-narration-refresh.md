# November new-week video: more natural AI narration
Date: 9 November 2026
Video ID: `cmcf12bd49fdf635e1207b5e`

The owner clarified that AI narration is acceptable, provided it sounds less mechanical.

## Implementation
- [x] Remove the mandatory human-recording override for the new-week campaign.
- [x] Use locally generated Kokoro speech with the warm `af_bella` voice at `0.98` pacing.
- [x] Isolate the voice configuration to this video, without changing unrelated videos.
- [x] Add validated Kokoro speaking-speed support and tests.
- [x] Update GitHub Actions to run all worker tests before rendering.
- [x] Fix the outdated GitHub cron-schedule test.
- [x] Preserve Remotion music, FFmpeg speech checks and private upload.
- [x] No Vercel deployment; direct merge to main, no temporary branch.

## Result verification
- [x] Confirm GitHub Actions tests and render succeed.
- [x] Confirm Supabase video READY and valid storagePath with MP4, audio and no errors.

## Verified completion (9 November 2026, 18:02 UTC)
- [x] Initial new voice worker run failed one outdated cron test; corrected it and reran before queueing the video.
- [x] GitHub Actions workflow run `42669836594`, attempt 2, **success**: https://github.com/libertydigital/libertydigital/actions/runs/42669836594
- [x] All **25 worker tests passed**. FFmpeg and media-audio validation succeeded.
- [x] Rewrote the campaign narration into **70 conversational words**, with distinct pauses and letter-spaced NIN/BVN pronunciations. Updated `src/lib/content/weekly-document-video.ts` and the existing Content Studio video.
- [x] Supabase `ContentVideo` `cmcf12bd49fdf635e1207b5e` reached `READY` after **1 attempt**, with `voice=af_bella`, `durationSeconds=30` and `error=NULL`.
- [x] GitHub worker logged `Narration generated through Kokoro.`, `Narration prepared (27.3s for 30s video)`, and `Encoded 900/900`.
- [x] Verified the exact private Supabase `content-videos` object `cmcf12bd49fdf635e1207b5e/render-1794247280165.mp4`, MIME `video/mp4`, **3,266,861 bytes**.
- [x] Private playback: `https://www.libertydigitalconsulting.com/admin/content/cm08af664a1d44ab2b891184#rendered-video-cmcf12bd49fdf635e1207b5e`.
- [x] No Vercel preview or production deployment performed. Changes were committed directly to `main`; no temporary branches created.

Audio is technically verified as present and non-silent. Subjective naturalness is not guaranteed by an automated test; review the MP4 before public sharing.
