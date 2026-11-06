# Liberty Digital Content Studio: queued video incident
Date: 2026-11-06
Repository: libertydigital/libertydigital

## Diagnosis
- Publishing the article and manually deploying the website did not start the separately hosted GitHub Actions video worker.
- The 32-second Reggio Emilia explainer `cmw5d8xjb0003jw08i2mlvjuf` was in `QUEUED` with attemptCount=0 after being created at 19:27 UTC.
- An earlier unwanted 30-second explainer `87cdc330-ba3a-4ba6-977e-00ab01b86206` had also been requeued and was ahead of it in the FIFO queue.
- Last completed scheduled render workflow before the incident: https://github.com/libertydigital/libertydigital/actions/runs/42249277253, first attempt at 16:06 UTC, success but “No queued videos.”
- The schedule configured for every 15 minutes was actually firing hours apart, so relying on GitHub cron alone is unreliable.
- Prior successful Remotion/Kokoro worker run: https://github.com/libertydigital/libertydigital/actions/runs/42040531321.

## Recovery actions and code fixes
- [x] Removed the obsolete queued 30-second explainer by transitioning it back to DRAFT only when attemptCount=0, leaving the current job intact.
- [x] Restarted the previously successful GitHub worker job using the GitHub connector. GitHub accepted the rerun as attempt 2 of run 42249277253.
- [x] Added an immediate server-side `workflow_dispatch` request to `queueContentVideo`. When not configured, rejected or unavailable, the durable queue and cron fallback remain in place.
- [x] Added tests for dispatch success, missing configuration, rejected response and network errors, with four local isolated tests passing.
- [x] Changed the fallback cron schedule from `*/15 * * * *` to off-peak minutes `7,22,37,52`.
- [x] Skipped unnecessary FFmpeg installation when both ffmpeg and ffprobe already exist on the runner.
- [x] Documented configuration in `docs/content-studio-operations.md`.

## Release constraints and follow-up checks
- No preview or production Vercel deployment is authorised by this repair. `vercel.json` remains unchanged with automatic deployment disabled.
- To enable future immediate dispatch, the site owner must configure server-side `CONTENT_VIDEO_GITHUB_TOKEN` in the Vercel production project, scoped to this GitHub repository with Actions read/write, during a single separately approved deployment.
- The workflow's existing `workflow_dispatch` and `schedule` triggers remain supported.
- A successful render must show `ContentVideo.status='READY'`, attemptCount>0 and a non-null storagePath; a render failure must expose its message and preserve the queue or FAILED state.
- Do not mistake GitHub workflow recovery for a Vercel deployment.
