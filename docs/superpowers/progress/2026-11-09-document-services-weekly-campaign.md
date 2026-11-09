# Nigerian Document Services: Weekly Campaign Progress

**Date:** 9 November 2026 (Africa/Lagos)
**Repository:** `libertydigital/libertydigital`
**Status:** Published article and 30-second Remotion job queued. Website deployment deliberately not triggered.

## Content delivered

- [x] Created and published an SEO article titled **Nigerian Passport, NIN & BVN Services in Italy: Your Document Checklist**.
- [x] Canonical blog URL: `https://www.libertydigitalconsulting.com/blog/nigerian-passport-nin-bvn-document-services-italy`.
- [x] Public Content Studio post ID: `cmed13eded5e5430f4943fff`.
- [x] Covers passport applications and renewals, NIN, BVN, affidavits, corrections, legalisation, civil status and family documentation, visa and emergency travel preparation.
- [x] Natural SEO keywords, 151-character meta description, internal service links, official NIS/NIMC references, related articles, FAQ and direct WhatsApp CTA.
- [x] Includes a 9–15 November 2026 planning checklist, **not** a same-week government processing guarantee.
- [x] Three existing 2 MB+ photographic-style editorial PNGs integrated in the article:
  - `/images/blog/nigerian-same-person-affidavit-italy.png` as cover.
  - `/images/blog/nigerian-child-passport-parental-consent-rome.png` after passport-support section.
  - `/images/blog/npc-birth-attestation-italy-family-reunion.png` after the affidavit/legalisation section.
- [x] Corrected alt text to clarify they are photorealistic editorial illustrations, **not genuine client or official appointment photos**.
- [x] Verified live article title, meta description, week dates and all three image links through an independent fetch of both www and non-www URLs.

## Video production

- [x] Created a **30-second, six-scene explainer** in the existing Content Studio database, with the hook: "Make this the week you get your Nigerian documents on track."
- [x] Video ID: `cme8f3b9f5c0e1494725ed32`.
- [x] Script: conversational, 73 words, encouraging viewers in Italy to start reviewing passports, NIN, BVN, affidavits, legalisation and supporting documents this week.
- [x] WhatsApp CTA: `+39 353 390 3464`.
- [x] Queued on 9 November for the existing GitHub Remotion + Kokoro worker. No paid voice generation service added.
- [x] Restarted the most recently successful workflow job `128874879388` in run `42527703004` to process the queue.
- [x] Verified `READY` status, narration and private MP4 storage object after worker completion.

## Operational boundaries

- No application code change, no temporary Git branch, and **no Vercel production or preview deployment**.
- GitHub worker invocation is independent of website deployment.
- Article publication through the live database is not a Vercel deployment.
- Verify in admin Content Studio: `/admin/content/cmed13eded5e5430f4943fff`.

## Final rendering verification (9 November 2026, 00:19 UTC)

- [x] GitHub workflow run `42527703004` (attempt 2) completed with conclusion **success**: https://github.com/libertydigital/libertydigital/actions/runs/42527703004
- [x] Remotion rendered/encoded **900 of 900 frames** for the 30-second explainer.
- [x] Kokoro narration prepared successfully, with **28.7 seconds of narration** for the 30-second output.
- [x] Video worker ran its audio verification without error and reported **3,311,074 bytes** uploaded.
- [x] Supabase ContentVideo `cme8f3b9f5c0e1494725ed32`: **READY**, attemptCount=1, storagePath `cme8f3b9f5c0e1494725ed32/render-1794183432961.mp4`, error=NULL.
- [x] Queried the `content-videos` bucket and independently confirmed the `video/mp4` object exists at that path with the expected 3,311,074-byte size.
- [x] Private playback location: `https://www.libertydigitalconsulting.com/admin/content/cmed13eded5e5430f4943fff#rendered-video-cme8f3b9f5c0e1494725ed32`.
- [x] **No Vercel production or preview deployment**, branch creation or Remotion code change.

The article is public and the video is private until distributed from the administration interface.
