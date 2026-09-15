# Liberty Digital Precision Growth Sprint — Design

Date: 2026-09-15
Status: Approved
Base commit: `862510accc41107aecfff28795a9d981bfbb0697`

## Goal

Increase qualified organic visibility and lead conversion for Liberty Digital Consulting without a visual redesign, without weakening privacy/security controls, and without deploying until the full sprint is complete and approved.

## Evidence driving the work

Google Search Console for the last 28 settled days shows 23 clicks, 525 impressions, 4.38% CTR and average position 13.94. The homepage and BVN page already rank on page one, while Nigerian passport and NPC pages sit around position 12 with meaningful impressions. Search intent is concentrated around passport renewal in Italy/Rome, BVN support, NPC attestation/digital certificates and NIN registration in Italy.

The production lead tables are empty, but code inspection confirms public submissions use server-side Prisma server actions. RLS being enabled with no public policies is therefore intentional defense, not the cause of missing leads. No public database policy will be added.

## Design decisions

### 1. Two-stage conversion funnel

Public service pages become qualification forms rather than document intake forms. Stage one collects only full name, phone or WhatsApp, optional email, preferred contact method, a short description and consent. It must explicitly state that no document upload is required at this stage. Existing server-side `submitContactInquiryAction` will be reused so tracking references, email notifications and admin lead workflow continue working.

Sensitive documents remain a later, qualified-client workflow. This reduces friction and supports GDPR data-minimisation principles.

### 2. Money-page SEO overlay

Do not rewrite the 100KB service catalogue. Add a small typed growth-override layer for the four priority services:

- Nigerian passport renewal/registration support in Rome and Italy
- BVN support in Italy, including the official Rome enrolment location and NRBVN route
- NPC digital birth certificate / birth attestation support
- NIN registration support in Italy

The dynamic service route will merge these overrides into the existing service model. Every priority page gets a clearer search-intent title/H1, updated description, practical official-process guidance, FAQs, internal links and visible authority disclaimer.

Official-process statements must be based on current NIS, NIBSS, NPC and NIMC sources and must distinguish Liberty's independent support from official enrolment/issuance.

### 3. Resource content silo

Turn `/resources` into a real content hub. Existing guide articles must be linked from the hub and included in the sitemap. Add four 2026 intent guides:

- Nigerian passport renewal in Italy
- BVN enrolment in Italy and NRBVN
- NPC birth attestation / digital certificate
- NIN registration in Italy

Each guide links to its primary commercial service and related guides. Article and FAQ schema remain on guide detail pages.

### 4. Measurement

Mount the already-installed Vercel Web Analytics and Speed Insights components. Add typed client-side custom events for:

- `form_start`
- `form_submit`
- `form_success`
- `form_error`
- `whatsapp_click`
- `phone_click`
- `email_click`
- `service_cta_click`

Event payloads must contain only non-sensitive context such as service slug, page/location and CTA placement. Never send names, phone numbers, email addresses, NIN/BVN/passport numbers or form messages into analytics.

GA4 remains an account-level follow-up because the current GSC Wizard account has not granted Analytics scope.

### 5. Trust and navigation

Remove public Admin Login links from desktop and mobile navigation. Keep `/login` available for staff who know the URL. Rework the “Why Choose Liberty” cards so they present company capabilities, not quotation-style pseudo-testimonials. Keep the footer disclaimer that Liberty is not a government agency, embassy, consulate, NIMC, NIS, bank or issuing authority.

### 6. Technical SEO

Include every published guide in `sitemap.xml`, give guide URLs meaningful priority/change frequency, improve `/services` copy and internal linking, and preserve self-canonicals/schema. Do not add fake hreflang or unnecessary schema.

### 7. Backend/security

No production Supabase schema change is required for this sprint. RLS remains enabled and closed to anonymous Data API access. Leaked-password protection is an account security recommendation, not a reason to alter lead submission architecture.

## Verification strategy

A Node source-contract script is added before implementation to encode the approved behavior. It is expected to fail against the base commit because the new growth files, analytics mounts and navigation cleanup do not yet exist. Final verification requires:

1. growth source-contract script
2. `npm run validate:guides`
3. `npm run lint`
4. `npm run build`
5. browser verification of homepage, services hub, four priority service pages, resources hub, four new guides, contact and lead submission
6. verify no sensitive values are sent to analytics
7. verify no production deployment until explicit approval

Because this session cannot execute repository code without publishing a Git ref, steps 1-4 will be the pre-deployment ref/preview gate rather than being falsely reported as run.
