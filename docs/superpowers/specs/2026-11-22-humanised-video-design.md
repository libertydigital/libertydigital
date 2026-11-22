# Real-footage Content Studio design
Date: 2026-11-22

## Goal and audience
Make Liberty Digital's short vertical videos feel like authentic, useful guidance for Nigerian people dealing with documents in Italy, rather than repeating a five-card animated slideshow. Primary business goal is an informed, qualified WhatsApp enquiry, not a vanity view count.

## Architecture and alternatives
- Selected: retain the existing Next.js content editor, Prisma approval and distribution records, GitHub Actions worker, Remotion 4 renderer and free Kokoro synthesis. Extend the scene JSON contract with optional approved media ID, motion and narration; preserve old records with no media.
- Rejected: generative video SaaS and paid TTS (recurring costs and uncertain quality).
- Rejected: replace the existing editor and worker with another video platform (unnecessary migration risk).

## Visual and content behavior
- 1080x1920, natural photographic/video backgrounds and restrained gold/paper/navy type derived from DESIGN.md; subtle slow movement and short captions, not floating fake government documents.
- Formats: explainer, tips, update, personal scenario, service, office process. Storyboard content remains anchored in the source article, always ends with independent-support CTA and requirement caveat.
- Media catalog: only existing repository assets, with a note that owners must confirm reuse permissions before approval. No arbitrary remote URLs or user-provided file paths.
- For new scripts, narration is tracked by scene so speech can be fitted to scene duration. Short subtitle phrases progress within the spoken portion, not across an unrelated arbitrary full-video timer.
- Admin can preview scene timing and selected photo, revise scene JSON, verify rights, approve then queue. Completed MP4s stay private.
- Distribution performance is entered from actual platform insights by the administrator; it is never fabricated or represented as live platform integration.

## Safety and release
- No repository push to main, no Vercel preview or production deployment until explicit owner approval.
- Rendering tests, app tests, type checks and ideally GitHub PR CI must pass before merging.
- No government affiliation, guaranteed issuance/processing dates, exposed personal documents or invented testimonials.
