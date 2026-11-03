import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const studio=readFileSync("src/app/admin/content/page.tsx","utf8");
const editor=readFileSync("src/app/admin/content/[id]/page.tsx","utf8");

test("the rendered video counter is a navigable link, not an inert statistic",()=>{
  assert.match(studio,/href=\{renderedVideosHref\}/);
  assert.match(studio,/aria-label=\{\`View \$\{completedVideos\} rendered videos\`\}/);
  assert.match(studio,/id="rendered-videos"/);
  assert.match(studio,/readyVideos\.map\(video=>\s*<Link/);
});

test("each completed MP4 has a direct, stable editor anchor",()=>{
  assert.match(studio,/rendered-video-\$\{video\.id\}/);
  assert.match(editor,/id=\{\`rendered-video-\$\{video\.id\}\`\}/);
  assert.match(editor,/<video[^>]*controls playsInline preload="metadata"/);
  assert.match(editor,/<source src=\{signedUrls\[video\.id\]\} type="video\/mp4"\/>/);
});

test("missing private playback links are visible rather than silent",()=>{
  assert.match(editor,/role="alert"/);
  assert.match(editor,/private playback link could not be created/);
  assert.match(editor,/Refresh this page for a new link/);
});
