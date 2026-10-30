# Liberty Digital Conversion Sprint Design

Date: 2026-10-30

## Intent
Improve qualified lead conversion and relevant Rome/Italy search visibility without changing Liberty's identity or weakening privacy and authority disclaimers.

## Implemented approach
1. Replace rotating hero content with a readable outcome headline and static Passport/NIN/BVN/NPC chooser; other offerings remain in /services.
2. Source pricing from SERVICES.price exclusively. Positive values are indicative independent support fees, not official charges. Zero means enquiry-based quote.
3. Add a mobile service-specific request and WhatsApp bar with accessible tap targets and safe-area padding. Suppress competing global floating WhatsApp on service paths.
4. Keep two-stage enquiry capture with no identity-document upload in public initial form.
5. Use existing address for office directions and keep genuine trust statements. Do not add unverified testimonials, hours, GBP status or case counts.
6. Add three distinct problem-intent resources: lost Nigerian passport in Italy, BVN correction while in Italy, and Nigerian documents for Questura/Italian citizenship. Use existing guide sitemap, article schema and contextual linking.
7. Store manually confirmed Liberty revenue as integer EUR cents in existing protected lead.formData JSON, with authenticated update form and service-level admin dashboard breakdown. Do not introduce payment collection or a database migration.
8. Preserve consent-gated analytics, customer tracking references, lead management and independent advisory role.

## Alternatives considered
- Full brand rebuild: rejected as disruptive to an existing recognizable identity with established technical SEO.
- New payments/revenue subsystem: rejected because provider selection, migration, accounting requirements and compliance are separate projects.
- Targeted conversion sprint: selected based on the user's request to implement the previously proposed improvements while preserving existing systems.

## Constraints and validation
Run npm run validate:conversion, validate:growth, validate:guides, lint and build. Verify responsive hero, service forms and CTA, price language, guide linking, auth on admin payment actions and real browser states. No branch publication, main merge or deployment without explicit user approval. Pricing must be treated as indicative pending business confirmation.
