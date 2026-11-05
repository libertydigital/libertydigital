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
