# Liberty Digital: free narrated video worker, local implementation record

Date: 2026-11-05
Base GitHub repository: `libertydigital/libertydigital`, `main` @ `1cde28988f63553036e36df2771105cc44687144` (read-only snapshot).
Release state: **INTEGRATING THROUGH GITHUB; AUTOMATIC VERCEL DEPLOYMENTS DISABLED; NOT DEPLOYED**.

## Objective and approach
- Replace the optional, paid ElevenLabs API in the existing Remotion blog-video worker with an Apache-2.0-licensed, local Kokoro-82M ONNX narrator using `kokoro-js@1.2.1` on Node.js CPU (`q8`).
- Maintain the original blog/editor, review and approved-job flow, 15–60-second storyboards, private storage, and the existing video composition.
- On each queued job, synthesize spoken WAV in bounded chunks, concatenate and encode to a playable MP3, fit narration within the clip length if mild speed-up (<=1.30x) suffices, and reject impossible timing rather than cut off speech.
- Mix narration at 1.0 with a synthesized, original background music bed at a default volume of 0.14. Support a locally provisioned, commercially cleared MP3/WAV alternative, with volume fade-in and fade-out.
- Verify both synthesized narration and the completed MP4 contain a non-silent audio stream before reporting READY. Exceptions report FAILED via the existing worker protocol.

## Configuration and prerequisites
- **No ElevenLabs account, key, or billing is required.** Remove `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` from the Actions workflow. Existing API/Supabase worker secrets remain required.
- Optional GitHub Actions variables: `KOKORO_VOICE` (defaults to `af_heart`, also supports selected English voices), `VIDEO_MUSIC_VOLUME` (0 to 1; default 0.14), `VIDEO_BACKGROUND_MUSIC_PATH` (absolute or runner-local MP3/WAV with commercial distribution rights).
- The job runner needs Node.js 22, network access on the first Kokoro model download, `ffmpeg`, `ffprobe`, and sufficient disk space/CPU time for ONNX inference and Remotion.
- The model runs locally after download. No paid speech provider or per-character API fees; compute, storage and GitHub Actions limits still apply. Model license is Apache-2.0.
- `npm install` is required in the `video-worker` directory after applying the patch to add `kokoro-js@1.2.1`.

## Validation scope
- Node tests cover bounded text chunks, allowed voices, local narration chunk combining (using synthetic WAV to isolate the provider), missing/failed model output, silent speech rejection, music and fades, narration timing fit, final MP4 with audible/missing/silent audio, and worker wiring.
- `node --check` verifies Node source syntax; TypeScript/TSX and full Remotion smoke require installed npm dependencies. CI runs the renderer's `npm test`, typecheck, compositions check, and an actual MP4 audio smoke rendered with test tone; this is not a live Kokoro inference test.
- Real Kokoro model quality and cold-start behavior have **not** been verified in this offline environment. The worker's first authorized live job must be observed for model download, voice quality, execution time, and upload success. Do not trigger that job before owner authorization.
- Existing READY MP4s are unchanged; the silent prior render needs an explicit requeue/re-render after authorized release if a narrated replacement is desired.

## Deployment safety
- User authorized GitHub integration and merge after green checks but still forbade Vercel preview and production deployments. A separate safety commit on `main` set `git.deploymentEnabled: false` for all branches. No Vercel preview or production deployment has been requested.
- The feature branch inherits the global no-deployment configuration. The production content-video worker schedule is temporarily disabled until an authorized release; manual dispatch must not run without approval.
- The artifact contains a Git-format patch plus source files to apply locally. Any eventual integration/deployment is a separate owner-approved step.

## Verified local results, 2026-11-05
- `node --check` passed for `audio.mjs`, `kokoro.mjs`, `worker.mjs`, and `scripts/audio-smoke.mjs`.
- `node --test tests/*.test.mjs`: **19 passed, 0 failed**; includes real ffmpeg-created WAV, MP3 and MP4 fixtures, but simulates Kokoro inference because the model and npm dependencies are not cached locally.
- Standalone patch was reverse-reconstructed against the earlier audio work and checked against the current `main` Git blob IDs for the original worker, Remotion component, package and workflows. The combined patch applied cleanly via `git apply --check` and `git apply` in a new copy of this baseline; resulting files matched the delivery source byte-for-byte.
- The actual model inference, full `npm install`, Remotion render smoke and full application CI cannot be exercised in this isolated offline runtime. These remain explicit pre-release verification requirements, not implied passes.

## GitHub verification plan
- CI renderer runs mocked TTS tests, Remotion synthetic audio smoke, and actual Kokoro download, speech synthesis, and short MP4 rendering.
- No scheduled or manual production worker runs are authorized before a separate release approval.
- Existing production videos are unchanged.

## CI correction 1: GitHub runner audio-tool dependency
- The first GitHub CI renderer job installed npm dependencies but failed on `command -v ffmpeg && command -v ffprobe`: this hosted runner did not expose FFmpeg binaries.
- Added explicit `sudo apt-get update -qq && sudo apt-get install -y ffmpeg` in both the CI renderer and manual worker workflows.
- Added a regression assertion for provisioning FFmpeg on each runner. Re-run GitHub CI and record the result before merge.

## GitHub merge and release hold (5 November 2026)
- Installed the repository-wide deployment safety guard on `main` in commit `1ad2bcafd7b990f131cbce825022c0688c705325`: `vercel.json` now uses `git.deploymentEnabled: false`, blocking automatic preview and production deployments.
- Implemented the Kokoro narration/music pipeline in PR #6: https://github.com/libertydigital/libertydigital/pull/6.
- Fixed the hosted renderer runner's missing FFmpeg prerequisite after reading the failed job logs; both GitHub CI jobs then passed in run https://github.com/libertydigital/libertydigital/actions/runs/42036439310 (`app` and `renderer`).
- Real Kokoro smoke downloaded the model, synthesized speech and rendered a Remotion MP4 containing an audible audio track. The renderer's 20 Node tests, TypeScript check and synthetic render passed. Application tests, lint, typecheck, optimized Next.js build and HTTP smoke passed. Earlier unrelated Google Fonts build flake did not reproduce on final run.
- Squash-merged PR #6 to `main` at `127afcbf6596956b5a5e6d7d255092bd4628f645` after checking the exact passing head SHA.
- Removed temporary feature branch `feature/kokoro-audio-2026-11-05` through a guarded one-time GitHub Actions run: https://github.com/libertydigital/libertydigital/actions/runs/42037090428. The ref returned HTTP 404 after cleanup; `main` was preserved. Removed the one-time workflow after it succeeded.
- No Vercel preview or production deployment was requested or executed by this work. The production content-video worker workflow is **manual-only** until explicit release permission; scheduled rendering is paused intentionally. Do not dispatch the worker or re-enable its schedule before the owner authorizes a release.
- Previously rendered MP4 files are not changed. The originally silent video will need an authorized re-render after release.

## Video generation incident and automatic worker restoration (5 November 2026)
- The site owner confirmed a manual production deployment (exact deployed commit unverified because the connected Vercel account cannot access the project).
- Read-only check of Liberty Digital's own Supabase `ContentVideo` records confirmed video `cmw3lk2wq0001l208vu257fks` for the Same-Person Affidavit article is `QUEUED` with `attemptCount=0`, created on 2026-11-05 13:44:12 UTC. The request was accepted but never claimed by a worker.
- Root cause: `.github/workflows/content-video-worker.yml` remained `workflow_dispatch`-only after release; the manual website deployment does not start GitHub Actions. The most recent worker run predates the merge and manual release.
- Restore schedule (`*/15 * * * *`) and add a tightly scoped `push` trigger on `main` when and only when the worker workflow file changes. This permits an immediate recovery run and recurring future queue processing. Preserve manual dispatch for controlled retries.
- The repository-wide `vercel.json` `git.deploymentEnabled=false` guard stays unchanged. No preview or production Vercel deployment is requested or authorized by this restoration.
- Verify that the new GitHub Actions worker runs and whether the queued video transitions from QUEUED to READY; if not, document job logs and actual cause rather than claiming success.

## Verified recovery after owner's manual release (5 November 2026)
- PR #7 (https://github.com/libertydigital/libertydigital/pull/7) squash-merged at `5a295c5f674a261d35f66eb3853031bd8d04891a` after successful app and renderer CI: https://github.com/libertydigital/libertydigital/actions/runs/42040030800.
- The workflow-scoped `main` push immediately launched one video worker: https://github.com/libertydigital/libertydigital/actions/runs/42040531321, **success**.
- Run logs confirm real Kokoro narration was prepared (31.5s for a 32s video) and the MP4 rendered/uploaded successfully (3,681,376 bytes). Final audio validation is enforced by the worker before reporting READY.
- Queried production database after the run. Video `cmw3lk2wq0001l208vu257fks` transitioned `QUEUED (attemptCount=0)` -> `RENDERING (attemptCount=1)` -> **`READY`** with empty error. Its file `cmw3lk2wq0001l208vu257fks/render-1793887193363.mp4` is present in Supabase Storage bucket `content-videos` with `video/mp4` MIME and byte size 3,681,376.
- The scheduled video worker is restored to 15-minute cron checks for future queued videos. GitHub Actions scheduler timing may vary; queued videos require a successful worker run.
- Temporary fix branch `fix/content-video-worker-resume-2026-11-05` deleted in successful one-time GitHub Actions run https://github.com/libertydigital/libertydigital/actions/runs/42040694357; its one-time cleanup workflow was deleted afterward. `main` preserved.
- No new Vercel preview or production deployment was requested. The owner independently reported a manual production deployment before this fix. The repository-wide `git.deploymentEnabled=false` guard remains active.
