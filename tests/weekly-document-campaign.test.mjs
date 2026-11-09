import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {weeklyCampaignPosts} from "../src/lib/content/curated-posts-weekly.ts";
import {weeklyDocumentCampaignVideo} from "../src/lib/content/weekly-document-video.ts";
import {extractArticleHero} from "../src/lib/content/markdown-utils.ts";

test("new-week article has SEO metadata, documented services and genuine repository assets",()=>{
 const post=weeklyCampaignPosts[0];
 assert.equal(weeklyCampaignPosts.length,1);
 assert.equal(post.slug,"get-your-nigerian-documents-on-track-this-week-italy");
 assert.ok(post.title.length>=35&&post.title.length<=90);
 assert.ok(post.metaDescription.length>=115&&post.metaDescription.length<=160);
 assert.ok(post.body.split(/\s+/).length>=900);
 assert.match(post.body,/9–15 November 2026/);
 assert.match(post.body,/## Frequently asked questions/);
 assert.match(post.body,/## Related reads/);
 assert.match(post.body,/## Official references/);
 assert.match(post.body,/does not control official approval or issuance/);
 const hero=extractArticleHero(post.body);
 assert.equal(hero?.src,"/images/blog/nigerian-family-income-documents-italy-scholarship.png");
 for(const image of ["/images/blog/nigerian-family-income-documents-italy-scholarship.png","/images/blog/nigerian-child-passport-parental-consent-rome.png","/images/blog/nigerian-nulla-osta-marriage-italy-documents.png"]){
   assert.ok(post.body.includes(image));
   const bytes=readFileSync("public"+image);
   assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
   assert.ok(bytes.length>200000);
 }
});
test("video matches new-week campaign, uses 30-second validated scenes and an actionable CTA",()=>{
 const video=weeklyDocumentCampaignVideo;
 assert.equal(video.articleSlug,weeklyCampaignPosts[0].slug);
 assert.equal(video.durationSeconds,30);
 assert.equal(video.scenes.length,6);
 assert.equal(video.scenes.reduce((n,s)=>n+s.seconds,0),30);
 assert.match(video.hook,/New week/);
 assert.match(video.script,/Liberty Digital/);
 assert.match(video.script,/this week/);
 assert.ok(video.scenes.some(x=>x.caption.includes("+39 353 390 3464")));
 assert.ok(video.scenes.every(x=>x.seconds>=2&&x.seconds<=20&&x.caption.length<=200));
});
