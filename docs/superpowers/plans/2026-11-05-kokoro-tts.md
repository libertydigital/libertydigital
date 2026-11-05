# Free Kokoro TTS Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ElevenLabs with no-cost local Kokoro narration, keeping music and never publishing silent READY videos.
**Architecture:** Node Kokoro ONNX model loaded in worker only on queued jobs; generated WAV chunks are encoded into an MP3 fed into existing Remotion composition. ffprobe/ffmpeg gates enforce audible narration and final audio.
**Tech Stack:** Node 22, kokoro-js 1.2.1, ffmpeg/ffprobe, Remotion, GitHub Actions, Supabase.
**Spec:** docs/superpowers/specs/2026-11-05-kokoro-tts-design.md

## Global Constraints
- **GitHub feature branch and merge authorized after verification. No Vercel preview or production deployment is authorized.** The repository-wide `vercel.json` guard remains `git.deploymentEnabled: false`.
- Preserve existing Supabase schema, blog and admin UI, approved-job gating, and storage API.
- No ElevenLabs or other fee-based speech provider configuration.

## Tasks
### 1. Free narration engine
- [x] Add failing tests for Kokoro text chunking, selectable voices, local multi-chunk synthesis and failures.
- [x] Implement Kokoro model loader and PCM WAV -> MP3 conversion with temporary-file cleanup.
- [x] Run `node --test tests/kokoro.test.mjs` and verify all pass.

### 2. Worker, audio correctness and regression
- [x] Add failing worker wiring and rendered audio tests, including missing and silent audio.
- [x] Replace ElevenLabs dependency in worker and package, remove secrets, protect READY with MP4 audio validation.
- [x] Preserve original music, volume controls, storyboard length fitting; run all Node tests.

### 3. CI, docs and local delivery
- [x] Update workflow variables and audio-smoke commentary.
- [x] Record design decision, test evidence, cost and runtime requirements.
- [ ] Run connected real Kokoro model and Remotion smoke when network/dependencies are available; do not trigger remote jobs without approval.
- [ ] Apply local patch on a fully checked-out `main` and confirm full CI before any future deployment.

## Review Focus
Cold model download failures; CPU runtime over 25-minute worker limit; legal voice usage; long proper-noun scripts exceeding 1.30x fitting; deployment accidentally triggered through Vercel branch previews.
