import test from "node:test";
import assert from "node:assert/strict";
import {CAMPAIGN_VIDEO_ID,narrationEnvironment} from "../narration-preset.mjs";
test("campaign uses warm natural voice without affecting other videos",()=>{
 const base={KOKORO_VOICE:"bf_emma",KOKORO_SPEED:"1.05"};
 const x=narrationEnvironment(CAMPAIGN_VIDEO_ID,base);
 assert.equal(x.KOKORO_VOICE,"af_bella");
 assert.equal(x.KOKORO_SPEED,"0.98");
 assert.equal(narrationEnvironment("some-other-video",base),base);
});
