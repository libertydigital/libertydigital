# Content Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Add protected publishing, reviewable video generation and platform-specific distribution tracking to Liberty Digital.

**Architecture:** Next.js editor, Prisma records, and external Remotion renderer communicating through a restricted worker API. Existing resource guides are preserved.

**Tech Stack:** Next.js 16, TypeScript, Prisma, Supabase Storage, Remotion 4, Node 22.

**Spec:** docs/superpowers/specs/2026-11-02-content-studio-design.md

## Global Constraints
- One feature branch, no deployment or merge without owner approval.
- Keep legacy resources and service conversion paths functional.
- Never claim direct API publication without platform authorization.
- Document progress and run tests after changes.

## Review Focus
- Unauthorized draft access or worker claim
- Accidental publication of unreviewed videos
- Missing metadata, sitemap or malformed slugs
- Corrupted long-running render jobs or empty storage
- Confusion between manual publication tracking and actual API posting

## Task 1: Schema and publication contracts
- [x] Add Prisma models and status gates.
- [x] Add pure editorial/script validations and failing tests, verify red.
- [x] Implement model helpers and test green.
- [x] Record progress and commit.

## Task 2: CMS and public SEO
- [x] Add protected editor actions and forms.
- [x] Add blog listing/detail, canonical metadata/sitemap integration.
- [x] Add navigation and guard validation tests.
- [x] Record progress and commit.

## Task 3: Video storyboard and preview
- [x] Generate editable storyboard from approved article copy; AI optional.
- [x] Add scene editing, variants, content review and preview controls.
- [x] Add tests for scene limits, transformations and approval gates.
- [x] Record progress and commit.

## Task 4: Render worker and media storage
- [x] Add video job claim / heartbeat / complete / fail API with bearer token.
- [x] Add Remotion vertical scene composition and CLI worker.
- [x] Add optional TTS and signed object upload; retry support.
- [x] Verify render command, tests, and safe failure behavior.
- [x] Record progress and commit.

## Task 5: Distribution / analytics / final review
- [x] Add explicit per-platform distribution state tracking and export controls.
- [x] Show totals for ready, rendered and published items, without invented numbers.
- [x] Add operational docs, env examples, CI and regression tests.
- [x] Run full available test suite, lint, typecheck/build and review.
- [x] Report any external configuration or verification blockers, keep unmerged and undeployed.
## Completion evidence

- Final implementation-code commit: `d23534b57e26319654309ada7b6c0b5c1a8997db`.
- Full CI: https://github.com/libertydigital/libertydigital/actions/runs/41507297664
- App and renderer jobs: **passed**.
- No production deployment, merge, Supabase migration or bucket setup was authorized. End-to-end tests requiring live secrets and real external platforms are release-blocked pending user approval and credentials.
