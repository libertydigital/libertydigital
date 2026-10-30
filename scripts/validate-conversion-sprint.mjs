import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";

const file = (path) => readFileSync(path, "utf8");
const contains = (path, value) =>
  assert.ok(file(path).includes(value), path + " must contain " + value);

// Visual restoration is an explicit product constraint: do not regress
// to the unrequested four-card redesign.
contains("src/components/sections/premium-hero.tsx", "const heroSlides = [");
contains("src/components/sections/premium-hero.tsx", "data-premium-hero");
contains("src/components/sections/home-experience.tsx", "ServiceSlider services={featuredServices}");
contains("src/components/sections/home-experience.tsx", "Nine core support areas");
contains("src/components/services/service-card.tsx", "service-card group");
contains("src/app/(site)/services/page.tsx", "ServiceGrid services={SERVICES}");
assert.ok(
  !file("src/components/sections/home-experience.tsx").includes("Four common requests."),
  "The unwanted homepage four-card layout must remain removed",
);
contains("src/lib/service-pricing.ts", "service.price > 0");
contains("src/lib/service-pricing.ts", "Fee confirmed after enquiry");
contains("src/app/(site)/services/[slug]/page.tsx", "ServiceMobileActions");
contains("src/app/(site)/services/[slug]/page.tsx", "getServicePricing(service).label");
contains("src/components/layout/whatsapp-floating-button.tsx", 'pathname.startsWith("/services/")');
contains("src/app/(site)/contact/page.tsx", 'id="contact-form"');
const guides = file("src/lib/guides.ts");
for (const slug of [
  "lost-nigerian-passport-in-italy",
  "bvn-correction-from-italy",
  "nigerian-documents-italian-citizenship-questura",
]) {
  assert.ok(guides.includes('slug: "' + slug + '"'), "Missing " + slug);
}
contains("src/app/(site)/resources/[slug]/page.tsx", "Related reads");
contains("src/actions/admin-lead-actions.ts", "await requireAdminUser()");
contains("src/actions/admin-lead-actions.ts", "updateLeadPaidRevenueAction");
contains("src/app/admin/page.tsx", "serviceOutcomes");
contains("src/lib/analytics.ts", "liberty-cookie-consent");
assert.ok(
  !file("src/app/(site)/services/[slug]/page.tsx").includes("ServiceLeadForm"),
  "Public service page must not render legacy sensitive intake",
);
console.log("Conversion source contracts validated.");

// Transpile and execute the actual pure TypeScript helper, compatible with
// the Node 20 runtime supported by the project's Next.js version.
const require = createRequire(import.meta.url);
const typescript = require("typescript");
const source = file("src/lib/lead-revenue.ts");
const compiled = typescript.transpileModule(source, {
  compilerOptions: {
    module: typescript.ModuleKind.CommonJS,
    target: typescript.ScriptTarget.ES2020,
  },
}).outputText;
const helperExports = {};
runInNewContext(compiled, { exports: helperExports, Intl, Number, Math, String });
const { parseEurToCents, formatEurCents, getPaidRevenueCents } = helperExports;

assert.equal(parseEurToCents("100.50"), 10050);
assert.equal(parseEurToCents("0"), 0);
assert.equal(parseEurToCents("12.999"), null);
assert.equal(parseEurToCents("-10"), null);
assert.equal(parseEurToCents("abc"), null);
assert.equal(parseEurToCents(""), null);
assert.equal(getPaidRevenueCents({ _paidRevenueEurCents: 4999 }), 4999);
assert.equal(getPaidRevenueCents({ _paidRevenueEurCents: -1 }), null);
assert.equal(getPaidRevenueCents({ _paidRevenueEurCents: 5.5 }), null);
assert.equal(getPaidRevenueCents(null), null);
assert.ok(formatEurCents(10050).includes("100.50"));
console.log("Confirmed-revenue helpers validated.");
