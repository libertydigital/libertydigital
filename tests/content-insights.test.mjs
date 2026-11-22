import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
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

test("performance columns belong to published video distributions, not the article model",()=>{
  const schema=readFileSync("prisma/schema.prisma","utf8");
  const distribution=schema.split("model ContentDistribution {")[1];
  const post=schema.split("model ContentPost {")[1].split("model ContentVideo {")[0];
  assert.ok(distribution,"ContentDistribution model must exist");
  for(const field of ["views","averageWatchSeconds","linkClicks","qualifiedInquiries","insightsRecordedAt"]){
    assert.match(distribution,new RegExp("\\b"+field+"\\b"));
    assert.doesNotMatch(post,new RegExp("\\b"+field+"\\b"));
  }
});
