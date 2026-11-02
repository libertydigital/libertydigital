import test from "node:test";
import assert from "node:assert/strict";
import {slugify, createStoryboard, validateScenes, mayQueue, mayPublishDistribution} from "../src/lib/content/storyboard.ts";

const article = {title:"Nigerian Passport Preparation in Italy",excerpt:"Learn what you should prepare before an appointment.",body:"Check your passport identity details before requesting support. Compare spellings on your records so discrepancies are visible. Keep readable copies and confirm the current requirements with the relevant authority."};
test("slugs are normalized and bounded", () => {
  assert.equal(slugify("  NIN & BVN in Ròme! "), "nin-bvn-in-rome");
  assert.equal(slugify("!"), "");
});
test("storyboard is video-length, captioned and ends with official caution", () => {
  const story=createStoryboard(article, "TIPS");
  assert.equal(story.durationSeconds, 32);
  assert.equal(story.scenes.length, 5);
  assert.match(story.scenes.at(-1).caption,/official requirements/);
  assert.ok(story.script.includes(story.scenes[1].caption));
});
test("rejects hostile or malformed scenes", () => {
  assert.throws(()=>validateScenes([{caption:"Bad",visual:"file",seconds:8}]),/2–8 scenes/);
  assert.throws(()=>validateScenes([{caption:"A",visual:"hook",seconds:40},{caption:"B",visual:"cta",seconds:20}]),/Invalid scene/);
  assert.throws(()=>validateScenes([{caption:"A",visual:"hook",seconds:2},{caption:"B",visual:"cta",seconds:2}]),/15–60/);
});
test("approval cannot be bypassed by a draft", () => {
  assert.equal(mayQueue("DRAFT"),false);
  assert.equal(mayQueue("APPROVED"),true);
  assert.equal(mayPublishDistribution("QUEUED"),false);
  assert.equal(mayPublishDistribution("READY"),true);
});
