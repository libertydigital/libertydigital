import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);

  if (!fs.existsSync(absolutePath)) {
    failures.push(`${relativePath}: file is missing`);
    return "";
  }

  return fs.readFileSync(absolutePath, "utf8");
}

function expectContains(relativePath, needle, description) {
  const source = read(relativePath);
  if (!source.includes(needle)) {
    failures.push(`${relativePath}: ${description}`);
  }
}

function expectNotContains(relativePath, needle, description) {
  const source = read(relativePath);
  if (source.includes(needle)) {
    failures.push(`${relativePath}: ${description}`);
  }
}

expectContains(
  "src/components/layout/cookie-consent-manager.tsx",
  "@vercel/analytics/next",
  "consent-gated Vercel Web Analytics mount is missing",
);
expectContains(
  "src/components/layout/cookie-consent-manager.tsx",
  "@vercel/speed-insights/next",
  "consent-gated Vercel Speed Insights mount is missing",
);
expectNotContains(
  "src/app/layout.tsx",
  "@vercel/analytics/next",
  "root layout must not bypass the cookie-consent analytics gate",
);
expectNotContains(
  "src/app/layout.tsx",
  "@vercel/speed-insights/next",
  "root layout must not bypass the cookie-consent performance gate",
);
expectNotContains(
  "src/components/layout/header.tsx",
  "Admin Login",
  "public desktop navigation still exposes Admin Login",
);
expectNotContains(
  "src/components/layout/mobile-nav.tsx",
  "Admin Login",
  "public mobile navigation still exposes Admin Login",
);
expectContains(
  "src/app/sitemap.ts",
  "getPublishedGuides",
  "published guide URLs are missing from the sitemap",
);
expectContains(
  "src/app/(site)/resources/page.tsx",
  "getPublishedGuides",
  "resources hub is not rendering published guides",
);
expectContains(
  "src/app/(site)/services/[slug]/page.tsx",
  "ServiceInquiryForm",
  "public service pages are still using the full document-intake form",
);
expectContains(
  "src/app/(site)/services/[slug]/page.tsx",
  "getServiceGrowth",
  "priority service SEO/CRO overrides are not wired into service pages",
);

const analytics = read("src/lib/analytics.ts");
for (const eventName of [
  "form_start",
  "form_submit",
  "form_success",
  "form_error",
  "whatsapp_click",
  "phone_click",
  "email_click",
  "service_cta_click",
]) {
  if (!analytics.includes(`\"${eventName}\"`)) {
    failures.push(`src/lib/analytics.ts: missing approved event ${eventName}`);
  }
}
for (const sensitiveKey of [
  "fullName",
  "emailAddress",
  "passportNumber",
  "nationalIdentityNumber",
  "customerId",
]) {
  if (analytics.includes(sensitiveKey)) {
    failures.push(`src/lib/analytics.ts: analytics helper references sensitive field ${sensitiveKey}`);
  }
}
if (!analytics.includes("liberty-cookie-consent")) {
  failures.push("src/lib/analytics.ts: custom events are not gated by stored analytics consent");
}

const growth = read("src/lib/service-growth.ts");
for (const slug of [
  "nigeria-passport-online-registration",
  "bank-verification-number",
  "national-population-commission-digital-certificate",
  "national-identification-number",
]) {
  if (!growth.includes(`\"${slug}\"`)) {
    failures.push(`src/lib/service-growth.ts: missing priority override for ${slug}`);
  }
}

expectContains(
  "src/components/forms/service-inquiry-form.tsx",
  "submitContactInquiryAction",
  "lightweight enquiry form is not using the existing server-side lead pipeline",
);
expectNotContains(
  "src/components/forms/service-inquiry-form.tsx",
  'type="file"',
  "initial public enquiry must not request document uploads",
);
expectContains(
  "src/app/(site)/resources/npc-birth-attestation-digital-certificate-italy/page.tsx",
  "GrowthGuidePage",
  "NPC search-intent guide route is missing",
);

if (failures.length > 0) {
  console.error("Growth sprint source-contract validation failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Growth sprint source-contract validation passed.");
