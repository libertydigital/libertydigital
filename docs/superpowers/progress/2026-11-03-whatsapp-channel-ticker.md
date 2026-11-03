# Liberty Digital: WhatsApp Channel Announcement Ticker

Date: 2026-11-03
Branch: `feature/whatsapp-channel-news-ticker-2026-11-03`
Deployment: **Not authorized for this change.** One controlled production deployment requires separate owner approval.

## Request
Move the existing "Join channel" announcement across the top of the website from side to side like a continuously scrolling news headline.

## Implementation
- Identified top-of-header announcement in `src/components/layout/header.tsx`.
- Replaced the fixed announcement with a right-to-left marquee-style ticker, moving the **entire message, icon, and WhatsApp join link**.
- Duplicated the identical announcement for a gap-free, continuous `translate3d(-50%, 0, 0)` loop lasting 24 seconds.
- Preserved the production WhatsApp channel URL, external-link attributes, styling and text.
- Pause ticker motion on hover or when the link is keyboard-focused, to make clicking the moving link practical.
- Mark the repeated copy `aria-hidden` with `tabIndex=-1` to avoid redundant screen-reader announcements or keyboard tab stops.
- For `prefers-reduced-motion: reduce`, stop animation, hide repeated content, and allow the single message to wrap on mobile.
- Pure CSS animation: no new package, JavaScript timer, database or API calls.

## Verification and rollout
- Added `tests/header-channel-ticker.test.mjs` to cover expected markup, looping keyframes, user-interaction pause, and reduced-motion behavior.
- GitHub Content Studio CI passed for the full app and Remotion renderer in run https://github.com/libertydigital/libertydigital/actions/runs/41656934281, including unit tests, lint, TypeScript check, production Next.js build, and HTTP smoke.
- Merge to `main` after successful CI; delete feature branch after merging. Never delete `main`.
- No Vercel deployment or change to the existing `git.deploymentEnabled.main=false` production hold.
- Manual visual smoke after owner-approved single deployment: confirm smooth motion at desktop/mobile widths, clickability, new-tab behavior, hover/focus pause, and reduced-motion fallback.

## Merge and branch cleanup (3 November 2026)
- Squash-merged PR https://github.com/libertydigital/libertydigital/pull/5 into `main`, merge commit `c668836b5dd5a45165f41f5343e5f85569c7696d`, after both CI jobs succeeded.
- Deleted `feature/whatsapp-channel-news-ticker-2026-11-03` using one-time branch-only workflow https://github.com/libertydigital/libertydigital/actions/runs/41657417174. The branch ref now returns HTTP 404; `main` remains intact.
- Verified `vercel.json` on `main` still contains `git.deploymentEnabled.main=false`. **No production deployment occurred** as part of this task.
- Release requires separate owner approval for a single production deployment. Browser-level visual QA should occur after deployment, including mobile width, reduced motion, keyboard focus, hover pause and clickable WhatsApp CTA.
