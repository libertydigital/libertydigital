import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,statSync} from "node:fs";
import {eventCuratedPosts} from "../src/lib/content/curated-posts-events.ts";
import {extractArticleHero} from "../src/lib/content/markdown-utils.ts";

test("Reggio Emilia event includes correct dates, restrictions, passport and real-image asset paths",()=>{
  assert.equal(eventCuratedPosts.length,1);
  const post=eventCuratedPosts[0];
  assert.equal(post.slug,"bvn-nin-reggio-emilia-7-8-november-2026");
  assert.ok(post.metaDescription.length<=160);
  assert.match(post.body,/Saturday, 7 November/);
  assert.match(post.body,/Sunday, 8 November/);
  assert.match(post.body,/only day for BVN/);
  assert.match(post.body,/No new adult NIN registration/);
  assert.match(post.body,/Nigerian passport services are included/);
  assert.match(post.body,/Via Anselmo Govi 3/);
  assert.match(post.body,/353 390 3464/);
  const hero=extractArticleHero(post.body);
  assert.equal(hero?.src,"/images/blog/bvn-nin-reggio-emilia-7-8-november-2026.png");
  for(const path of ["/images/blog/bvn-nin-reggio-emilia-7-8-november-2026.png","/images/blog/reggio-emilia-passport-support-2026.png"]){
    const data=readFileSync("public"+path);
    assert.deepEqual([...data.subarray(0,8)],[137,80,78,71,13,10,26,10]);
    assert.ok(statSync("public"+path).size>200000);
  }
  assert.ok(post.body.includes("not pictures taken at the Reggio Emilia event"));
});
