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
- Awaiting PR CI validation for the Next.js app and Remotion worker.
- Merge to `main` after successful CI; delete feature branch after merging. Never delete `main`.
- No Vercel deployment or change to the existing `git.deploymentEnabled.main=false` production hold.
- Manual visual smoke after owner-approved single deployment: confirm smooth motion at desktop/mobile widths, clickability, new-tab behavior, hover/focus pause, and reduced-motion fallback.
