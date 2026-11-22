# Single-release verification: humanised video upgrade

Date: 2026-11-22
Approval: user approved PR #9 merge and one production release.

## Pre-release evidence
- GitHub Actions CI run 45008701377 passed app and Remotion worker jobs at commit 9d67039d21f762a7b2c2e77efc1eee0baf4fa28b.
- Supabase project defxhmtrhuqufalnjhjw is ACTIVE_HEALTHY and contains ContentPost, ContentVideo and ContentDistribution with RLS enabled.
- The necessary new fields are absent before migration.
- The approved migration in `docs/releases/2026-11-22-video-insights-migration.sql` creates a restricted table-level snapshot and adds five non-destructive analytics fields.
- Old application code continues to work with the additive columns, and existing data is retained.
- Production deployment must target the existing Liberty Digital Vercel project, not another user's project. Vercel Git automatic deployment is disabled in `vercel.json`.

## Deployment identity gate
The currently connected Vercel accounts only expose Web Growth, NOUNCompass and Crown Prive. None includes an existing Vercel project linked to `libertydigital/libertydigital`. Do not create a new project or deploy to the wrong account. The correct project/account must be connected before the single production deployment. This is an external credential/access blocker, not a reason to disable the production deployment guard.

## Post-deployment checks
- Verify live site and blog routes, admin/content editor under authorized login, and public absence of admin/worker endpoints.
- Confirm a newly generated storyboard offers the six formats and media thumbnails.
- Approve one video after verifying media reuse rights, render via the private worker, play the final MP4 and inspect voiceover/captions.
- Confirm the metrics editor persists reporting values and dashboard aggregates without exposing them publicly.
- Record one production deployment ID and Git SHA; do not trigger additional deployments to investigate unrelated failures.
