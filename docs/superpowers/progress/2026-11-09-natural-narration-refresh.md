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
- [ ] Confirm GitHub Actions tests and render succeed.
- [ ] Confirm Supabase video READY and valid storagePath with MP4, audio and no errors.
