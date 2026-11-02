# Content Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

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
- [ ] Add Prisma models and status gates.
- [ ] Add pure editorial/script validations and failing tests, verify red.
- [ ] Implement model helpers and test green.
- [ ] Record progress and commit.

## Task 2: CMS and public SEO
- [ ] Add protected editor actions and forms.
- [ ] Add blog listing/detail, canonical metadata/sitemap integration.
- [ ] Add navigation and guard validation tests.
- [ ] Record progress and commit.

## Task 3: Video storyboard and preview
- [ ] Generate editable storyboard from approved article copy; AI optional.
- [ ] Add scene editing, variants, content review and preview controls.
- [ ] Add tests for scene limits, transformations and approval gates.
- [ ] Record progress and commit.

## Task 4: Render worker and media storage
- [ ] Add video job claim / heartbeat / complete / fail API with bearer token.
- [ ] Add Remotion vertical scene composition and CLI worker.
- [ ] Add optional TTS and signed object upload; retry support.
- [ ] Verify render command, tests, and safe failure behavior.
- [ ] Record progress and commit.

## Task 5: Distribution / analytics / final review
- [ ] Add explicit per-platform distribution state tracking and export controls.
- [ ] Show totals for ready, rendered and published items, without invented numbers.
- [ ] Add operational docs, env examples, CI and regression tests.
- [ ] Run full available test suite, lint, typecheck/build and review.
- [ ] Report any external configuration or verification blockers, keep unmerged and undeployed.