import test from "node:test";
import assert from "node:assert/strict";
import {parseVideoInsights} from "../src/lib/content/metrics.ts";
const sample={views:"1200",linkClicks:"45",qualifiedInquiries:"7",averageWatchSeconds:"12.25"};
test("reported social insights preserve distinct measures",()=>{
  assert.deepEqual(parseVideoInsights(sample,30),{views:1200,averageWatchSeconds:12.25,linkClicks:45,qualifiedInquiries:7});
  assert.equal(parseVideoInsights({...sample,averageWatchSeconds:""},30).averageWatchSeconds,null);
});
test("invalid and invented social numbers are rejected",()=>{
  assert.throws(()=>parseVideoInsights({...sample,views:"-2"},30),/Views/);
  assert.throws(()=>parseVideoInsights({...sample,views:"unknown"},30),/Views/);
  assert.throws(()=>parseVideoInsights({...sample,averageWatchSeconds:"45"},30),/duration/);
  assert.throws(()=>parseVideoInsights({...sample,linkClicks:"99999999999"},30),/Link clicks/);
});
