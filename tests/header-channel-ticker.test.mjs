import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const header = readFileSync("src/components/layout/header.tsx", "utf8");
const styles = readFileSync("src/app/globals.css", "utf8");

test("the existing WhatsApp channel CTA is included in the ticker", () => {
  assert.match(header, /className="channel-ticker-viewport/);
  assert.match(header, /className="channel-ticker-track"/);
  assert.match(header, /className="channel-ticker-item/);
  assert.match(header, /Follow the Liberty Digital Consulting Services channel on WhatsApp/);
  assert.match(header, /https:\/\/whatsapp\.com\/channel\/0029Vb8z5273gvWbQFIfCA1E/);
  assert.match(header, /Join channel/);
});

test("two matching ticker items loop seamlessly without doubling announcements for assistive tech", () => {
  assert.match(header, /\[false, true\]\.map\(\(duplicate\) =>/);
  assert.match(header, /aria-hidden=\{duplicate \|\| undefined\}/);
  assert.match(header, /tabIndex=\{duplicate \? -1 : undefined\}/);
  assert.match(styles, /\.channel-ticker-track\s*\{[^}]*animation: channel-ticker-scroll 24s linear infinite/s);
  assert.match(styles, /@keyframes channel-ticker-scroll\s*\{\s*to\s*\{\s*transform: translate3d\(-50%, 0, 0\)/s);
});

test("ticker pauses for interaction and provides a static reduced-motion fallback", () => {
  assert.match(styles, /\.channel-ticker-viewport:hover \.channel-ticker-track/);
  assert.match(styles, /\.channel-ticker-viewport:focus-within \.channel-ticker-track/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.channel-ticker-item\[aria-hidden="true"\]\s*\{\s*display: none;/);
});
