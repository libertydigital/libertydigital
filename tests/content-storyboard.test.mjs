import test from "node:test";
import assert from "node:assert/strict";
import {slugify,createStoryboard,validateScenes,mayQueue,mayPublishDistribution,mayPublishArticle} from "../src/lib/content/storyboard.ts";
import {getApprovedMediaAsset,publicMediaUrl} from "../src/lib/content/media-library.ts";
const article={title:"Nigerian Passport Preparation in Italy",excerpt:"Learn what you should prepare before an appointment.",body:"Check your passport identity details before requesting support. Compare spellings on your records so discrepancies are visible. Keep readable copies and confirm the current requirements with the relevant authority."};
test("slugs are normalized and bounded",()=>{
  assert.equal(slugify("  NIN & BVN in Ròme! "),"nin-bvn-in-rome");
  assert.equal(slugify("!"),"");
});
test("all six story formats use approved media, a conversational narration track and official caution",()=>{
  for(const format of ["EXPLAINER","TIPS","UPDATE","SCENARIO","SERVICE","BEHIND_SCENES"]) {
    const story=createStoryboard(article,format);
    assert.ok(story.durationSeconds>=30&&story.durationSeconds<=32);
    assert.equal(story.scenes.length,5);
    assert.ok(story.scenes.every(scene=>!scene.mediaId||getApprovedMediaAsset(scene.mediaId)),format);
    assert.match(story.scenes.at(-1).narration,/official requirements/);
    assert.ok(story.script.includes(story.scenes[1].narration));
  }
});
test("catalog paths are site-local and media IDs never accept arbitrary external URLs",()=>{
  assert.equal(getApprovedMediaAsset("https://evil.example/video.mp4"),undefined);
  assert.equal(publicMediaUrl(getApprovedMediaAsset("office-intro")),"/liberty-office-hero.jpeg");
});
test("rejects malformed scenes, unsupported assets, motion, and overly long narration",()=>{
  assert.throws(()=>validateScenes([{caption:"Bad",visual:"file",seconds:8}]),/2–8 scenes/);
  assert.throws(()=>validateScenes([{caption:"A",visual:"hook",seconds:40},{caption:"B",visual:"cta",seconds:20}]),/Invalid scene/);
  assert.throws(()=>validateScenes([{caption:"A",visual:"hook",seconds:2},{caption:"B",visual:"cta",seconds:2}]),/15–60/);
  assert.throws(()=>validateScenes([{caption:"A",visual:"hook",seconds:8,mediaId:"../../etc/passwd"},{caption:"B",visual:"cta",seconds:8}]),/Unapproved media/);
  assert.throws(()=>validateScenes([{caption:"A",visual:"hook",seconds:8,motion:"spin"},{caption:"B",visual:"cta",seconds:8}]),/motion/);
  assert.throws(()=>validateScenes([{caption:"A",visual:"hook",seconds:8,narration:"word ".repeat(30)},{caption:"B",visual:"cta",seconds:8}]),/too long/);
});
test("approval and distribution stay gated",()=>{
  assert.equal(mayPublishArticle("DRAFT"),false);
  assert.equal(mayPublishArticle("REVIEW"),true);
  assert.equal(mayQueue("DRAFT"),false);
  assert.equal(mayQueue("APPROVED"),true);
  assert.equal(mayPublishDistribution("QUEUED"),false);
  assert.equal(mayPublishDistribution("READY"),true);
});
