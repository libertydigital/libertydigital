# Liberty Digital Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish five original, indexable document-preparation guides from a reusable Resources guide system that routes qualified visitors to Liberty Digital services.

**Architecture:** A typed `src/lib/guides.ts` catalogue will own all guide content and relationship data. A single `/resources/[slug]` route will render metadata, structured data, article content, related services, and conversion CTAs from that data. The Resources hub and sitemap will import the same catalogue so navigation, rendering, and discovery cannot diverge.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide React, existing `@/lib/seo` schema helpers.

## Global Constraints

- Publish only original English-language preparation guidance for Nigerians and African residents in Italy.
- Do not claim Liberty controls official requirements, appointments, approvals, processing times, or issuance.
- Every guide must tell visitors to confirm changing requirements with the relevant official authority.
- Use existing site components, premium surface classes, service data, contact paths, and no new dependencies.
- Each guide needs one H1, semantic `article` content, canonical metadata, `Article`, FAQ, breadcrumb, and webpage schema.
- Keep service-request conversion primary: primary CTA near the top, reassurance CTA after preparation guidance, final request CTA at the end.
- Include only published catalogue entries in the Resources hub and sitemap.

---

### Task 1: Create and validate the typed guide catalogue

**Files:**
- Create: `src/lib/guides.ts`
- Create: `scripts/validate-guides.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `ServiceSlug`, `SERVICES_BY_SLUG` from `@/lib/services`.
- Produces: `Guide`, `GUIDES`, `GUIDES_BY_SLUG`, `getGuideBySlug(slug: string): Guide | null`, and `getPublishedGuides(): Guide[]`.
- Produces: `npm run validate:guides`, which exits non-zero when a guide references a missing primary or related service.

- [ ] **Step 1: Write the failing catalogue validation script**

Create `scripts/validate-guides.mjs` with the required catalogue API before creating it:

```js
import { GUIDES, getPublishedGuides } from "../src/lib/guides.ts";

if (GUIDES.length !== 5 || getPublishedGuides().length !== 5) {
  throw new Error("Expected five published launch guides.");
}
```

Add this package script:

```json
"validate:guides": "node scripts/validate-guides.mjs"
```

- [ ] **Step 2: Run the validation to verify it fails**

Run: `npm run validate:guides`

Expected: failure because `src/lib/guides.ts` does not exist.

- [ ] **Step 3: Implement the minimal typed catalogue and relationship validation**

Create `src/lib/guides.ts` with these types and exports:

```ts
export type GuideSection = { heading: string; paragraphs: string[] };
export type GuideFaq = { question: string; answer: string };
export type Guide = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  readingTime: string;
  primaryServiceSlug: ServiceSlug;
  relatedServiceSlugs: ServiceSlug[];
  relatedGuideSlugs: string[];
  checklist: string[];
  commonMistakes: string[];
  sections: GuideSection[];
  faqs: GuideFaq[];
};
```

Populate the five approved guide slugs with original content, a clear official-verification note in the section copy, and service relationships:

```ts
"nigerian-passport-support-rome" -> "nigeria-passport-online-registration"
"bvn-support-italy" -> "bank-verification-number"
"nin-document-support-rome" -> "national-identification-number"
"nigerian-embassy-document-legalization-rome" -> "document-legalization-at-nigerian-embassy"
"questura-support-letter-italy" -> "citizenship-letter-to-questura"
```

In `scripts/validate-guides.mjs`, import the built JavaScript-compatible catalogue through the project runtime or replace it with a TypeScript-free script that scans the compiled source only after `npm run build`; it must confirm every `primaryServiceSlug` and `relatedServiceSlugs` value is a key in `SERVICES_BY_SLUG`.

- [ ] **Step 4: Run the catalogue validation to verify it passes**

Run: `npm run validate:guides`

Expected: exit code 0 and output `Validated 5 published guides.`

- [ ] **Step 5: Commit the independently validated data layer**

```bash
git add package.json src/lib/guides.ts scripts/validate-guides.mjs
git commit -m "feat: add Liberty guide content catalogue"
```

### Task 2: Add reusable schema helpers and the guide route

**Files:**
- Modify: `src/lib/seo.ts`
- Create: `src/app/(site)/resources/[slug]/page.tsx`

**Interfaces:**
- Consumes: `Guide`, `getGuideBySlug`, `getPublishedGuides` from `@/lib/guides`; `getServiceBySlug` from `@/lib/services`; `buildPageMetadata`, `createBreadcrumbSchema`, `createFAQPageSchema`, and `createWebPageSchema` from `@/lib/seo`.
- Produces: `createArticleSchema(input)` and statically generated guide pages for every published guide.

- [ ] **Step 1: Write the failing static route contract**

Add the guide route with only this temporary static-params contract:

```ts
export function generateStaticParams() {
  return getPublishedGuides().map((guide) => ({ slug: guide.slug }));
}
```

Run: `npm run build`

Expected: failure because the route imports catalogue and schema helpers not yet implemented.

- [ ] **Step 2: Implement the reusable Article schema helper**

Add this input type and function in `src/lib/seo.ts`:

```ts
type ArticleSchemaInput = {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
};

export function createArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.publishedAt,
    mainEntityOfPage: absoluteUrl(input.path),
    author: { "@id": `${getSiteUrl()}#organization` },
    publisher: { "@id": `${getSiteUrl()}#organization` },
    image: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
  };
}
```

- [ ] **Step 3: Implement the full guide page**

In `src/app/(site)/resources/[slug]/page.tsx`:

- Resolve `params.slug` asynchronously, load with `getGuideBySlug`, and call `notFound()` when absent.
- Use `generateMetadata` and `buildPageMetadata({ title, description, path, type: "article" })`.
- Render the four schema payloads: `createArticleSchema`, `createFAQPageSchema`, `createBreadcrumbSchema`, and `createWebPageSchema` with type `"ItemPage"`.
- Render semantic `<article>`, one H1, the guide introduction, checklist, ordered content sections, common mistakes, authority-boundary note, FAQ section, and related service links.
- Use `getServiceBySlug` to render the primary request link and related-service links; do not duplicate service labels in the guide data.
- Reuse existing `Breadcrumbs`, `Link`, Lucide icons, `container-premium`, `surface-base`, `surface-card`, `section-kicker`, `section-title`, and `section-description` conventions.
- Use `href={`/services/${service.slug}`}` for every request CTA; do not add a new WhatsApp URL unless an existing shared constant is found and verified.

- [ ] **Step 4: Verify generated guide routes and route error handling**

Run: `npm run build`

Expected: production build succeeds and lists all five `/resources/<slug>` routes. Then run `npm run start -- --port 3007` and request one known guide and `/resources/not-a-guide`; expect 200 for the known guide and 404 for the unknown guide.

- [ ] **Step 5: Commit the route and SEO schema work**

```bash
git add src/lib/seo.ts src/app/(site)/resources/[slug]/page.tsx
git commit -m "feat: add SEO guide article pages"
```

### Task 3: Convert Resources into a guide library and extend the sitemap

**Files:**
- Modify: `src/app/(site)/resources/page.tsx`
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `getPublishedGuides()` from `@/lib/guides` and `SERVICES` from `@/lib/services`.
- Produces: a guide-first Resources hub and sitemap entries for every published guide.

- [ ] **Step 1: Write the failing sitemap expectation**

Add a temporary check in the existing SEO audit or a new `scripts/validate-guides.mjs` assertion:

```js
const guideUrls = sitemap().filter((entry) => entry.url.includes("/resources/"));
if (guideUrls.length !== 5) throw new Error("Expected five guide sitemap URLs.");
```

Run: `npm run validate:guides`

Expected: failure because the sitemap does not yet return guide routes.

- [ ] **Step 2: Implement guide-first Resources content**

Modify `src/app/(site)/resources/page.tsx` to:

- Import `getPublishedGuides`.
- Add a `Guides for your next step` section before the current service cards.
- Render one semantic `<article>` per guide, using its title, excerpt, reading time, and a descriptive `Read the guide` link to `/resources/${guide.slug}`.
- Retain the service preparation directory under a clearly named secondary section such as `Explore support services`.
- Keep the existing page metadata, CollectionPage schema, breadcrumb, and one-H1 structure.

- [ ] **Step 3: Add guide entries to the sitemap**

Import `getPublishedGuides` in `src/app/sitemap.ts` and map it to entries:

```ts
const guideRoutes: MetadataRoute.Sitemap = getPublishedGuides().map((guide) => ({
  url: `${siteUrl}/resources/${guide.slug}`,
  lastModified: new Date(guide.publishedAt),
  changeFrequency: "monthly",
  priority: 0.7,
}));
```

Return `guideRoutes` after static routes and before service routes.

- [ ] **Step 4: Verify hub and sitemap behavior**

Run: `npm run validate:guides && npm run lint && npm run build`

Expected: all commands exit 0; Resources contains five guide links; `sitemap.xml` includes the five canonical guide URLs exactly once.

- [ ] **Step 5: Commit the discovery-layer changes**

```bash
git add src/app/(site)/resources/page.tsx src/app/sitemap.ts scripts/validate-guides.mjs
git commit -m "feat: surface guides in resources and sitemap"
```

### Task 4: Run production-quality checks and prepare delivery

**Files:**
- Modify: no production files expected
- Verify: `src/lib/guides.ts`, `src/app/(site)/resources/[slug]/page.tsx`, `src/app/(site)/resources/page.tsx`, `src/app/sitemap.ts`, `src/lib/seo.ts`

**Interfaces:**
- Consumes: the completed guide catalogue, route, hub, schema helpers, and sitemap.
- Produces: verified local build evidence and a clean Git delivery state.

- [ ] **Step 1: Run static validation and quality checks**

Run:

```bash
npm run validate:guides
npm run lint
npm run build
git diff --check
```

Expected: each command exits 0.

- [ ] **Step 2: Inspect rendered guide SEO elements**

Start the built app on its isolated Liberty port:

```bash
npm run start -- --port 3007
```

For the Passport guide, verify the 200 response contains one `<h1>`, a canonical `/resources/nigerian-passport-support-rome`, an Article JSON-LD block, FAQ JSON-LD block, a link to the passport service, and the official-verification statement. Verify an unknown guide responds 404. Stop only the process started for this check; do not interfere with other projects' development servers.

- [ ] **Step 3: Review content safety and conversion paths**

For all five guide records, confirm the published copy does not say Liberty issues, approves, guarantees, or controls official outcomes. Confirm each page includes a primary service CTA, a mid-page CTA, a final CTA, and descriptive related-service links.

- [ ] **Step 4: Commit the final verified implementation**

```bash
git add src/lib/guides.ts src/lib/seo.ts src/app/(site)/resources/[slug]/page.tsx src/app/(site)/resources/page.tsx src/app/sitemap.ts scripts/validate-guides.mjs package.json
git commit -m "feat: launch Liberty document preparation guides"
```

- [ ] **Step 5: Report delivery boundaries**

Report the local validation results, commit SHA, changed files, and that production indexing, Core Web Vitals, and Search Console performance require a separate post-deployment verification.

## Plan self-review

- **Spec coverage:** Tasks 1–3 implement the catalogue, five guides, route, SEO, schema, Resources hub, sitemap, internal service links, and compliant editorial boundaries. Task 4 verifies build, semantic SEO output, errors, CTAs, and content safety.
- **Placeholder scan:** No deferred implementation labels or undefined handoffs are used. The one temporary failing-check step is explicitly replaced by the final check in the same task.
- **Type consistency:** `Guide`, `getGuideBySlug`, `getPublishedGuides`, `createArticleSchema`, and service-slug relationships have a single definition and are used consistently throughout the plan.
