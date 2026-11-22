# Humanised Content Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Humanise Liberty Digital short videos while retaining safe, low-cost editorial and rendering infrastructure.

**Architecture:** Extend validated JSON storyboards, stage only curated site imagery, render footage with timed voiceover/captions, and add protected editorial previews and manual social metrics. No paid service is required.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma, Remotion 4, Kokoro, FFmpeg, GitHub Actions.

**Spec:** docs/superpowers/specs/2026-11-22-humanised-video-design.md

## Global Constraints
- Single coordinated production release only after user approval; don't trigger preview or production deployment now.
- Keep current private bucket, worker token and authorisation checks.
- Do not assert ownership of footage or invent performance data. Verify rights before approving social reuse.
- Legacy drafts and videos must remain viewable and renderable.
- All content remains sourced from the approved article and independently verified.

## Review Focus
- Missing asset IDs or traversal payloads must fail validation before rendering.
- Old JSON scenes missing optional media fields must still render.
- Long narration cannot be silently clipped or declared READY if inaudible.
- Saved performance cannot turn arbitrary URLs into published distributions.
- Preview and media selectors must remain keyboard-accessible.

### Task 1: Storyboard and media contract
- [x] Extend format parsing and validated scene metadata.
- [x] Create local media registry and test paths/validation.
- [x] Draft scenario, service and office-process storyboards with grounded copy.
- [ ] Verify tests in CI.

### Task 2: Rendering and narration
- [x] Stage approved assets only, support photo/video backgrounds and restrained motion.
- [x] Generate scene-timed Kokoro speech with short synchronized caption phrases.
- [x] Add narration/media regression tests; CI verification pending.

### Task 3: Admin workflow and conversion
- [x] Implement timed visual preview and media selection guidance.
- [x] Require rights confirmation and retain existing approval gates.
- [x] Add protected manual channel insights and review dashboard.
- [x] Update operations docs; Next.js build/tests pending CI.

### Task 4: Review and release gate
- [ ] Run CI, inspect failures and fix.
- [ ] Create review PR for owner. Do not merge or deploy.
