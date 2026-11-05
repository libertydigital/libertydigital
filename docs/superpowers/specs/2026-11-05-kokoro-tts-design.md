# Liberty Digital: free local narration for blog videos
Date: 2026-11-05
Decision: User requested implementation using the best free option. No deployment of any kind authorized.

## Goal
Every approved blog video should contain a human-sounding voice reading the article-derived storyboard, with background music at a conservative volume. No paid text-to-speech account, API key, or per-character billing.

## Decision and alternatives
1. ElevenLabs (existing code): good voice quality, but paid API and unacceptable ongoing cost. Removed.
2. Piper: free, small/fast CPU models, but voice naturalness is weaker for social-first narration and voice licensing varies.
3. Chosen: Kokoro-82M through `kokoro-js@1.2.1` using the official public `onnx-community/Kokoro-82M-v1.0-ONNX` model, q8 CPU inference and default English `af_heart` voice. Model weights and library have Apache 2.0 licensing. Runtime downloads model and voice weights on first use; no hosted inference API is used.

## Architecture
- Keep existing Next.js blog editor, storyboard, API, signed Supabase upload, GitHub Actions schedule, Remotion layout, narration timing fit, and original generated background music.
- Only change the video worker: create local Kokoro WAV chunks, validate non-silent audio, concatenate to a single MP3, fit to existing storyboard duration, and mix with low-volume original music.
- Chunk text below 280 characters per inference to avoid Kokoro's phoneme limits while preserving all text. Select from known English voices with optional `KOKORO_VOICE` worker variable.
- Fail rendering with a clear `FAILED` job if model loading fails, voice output is empty/silent, timing cannot be fitted, or the final MP4 has no audible audio. Never quietly create READY without narration.
- Preserve the existing 15–60 second storyboard duration and offline editorial approval controls.

## Costs, limits and release guard
- No per-character or voice-provider fees. Model download and CPU computation run on GitHub's standard public-repository runner, which is currently free for public repositories; availability/pricing may change.
- First actual Kokoro model download requires network access. Local offline unit tests cannot validate subjective voice quality or model cold start. No account credentials or additional TTS server are needed.
- No remote code pushes, PRs, merges, GitHub Actions dispatch, Vercel previews or production deployments without later explicit user approval. Older READY videos do not change automatically.

## Verification
Unit tests and ffmpeg/ffprobe fixture tests; CI renderer audio smoke (test tone, not actual Kokoro speech); worker validates output audio. A real narrated Remotion end-to-end run must be verified in an authorized connected environment before release.
