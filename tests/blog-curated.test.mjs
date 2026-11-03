import test from "node:test";
import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {curatedPosts} from "../src/lib/content/curated-posts.ts";
import {additionalCuratedPosts} from "../src/lib/content/curated-posts-extra.ts";
import {extractArticleHero,safeArticleHref} from "../src/lib/content/markdown-utils.ts";
const posts=[...curatedPosts,...additionalCuratedPosts];
test("exactly five distinct, researched, publication-ready long-tail guides",()=>{
  assert.equal(posts.length,5);
  assert.equal(new Set(posts.map(p=>p.slug)).size,5);
  assert.equal(new Set(posts.map(p=>p.primaryKeyword)).size,5);
  posts.forEach(post=>{
    assert.match(post.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(post.title.length>=35 && post.title.length<=90,post.slug+": title length");
    assert.ok(post.metaDescription.length>=115 && post.metaDescription.length<=160,post.slug+": meta description");
    assert.ok(post.excerpt.length>=60 && post.excerpt.length<=350);
    assert.ok(post.body.split(/\s+/).length>=900,post.slug+": substantive article");
    assert.ok(post.body.includes("## Frequently asked questions"),post.slug+": questions");
    assert.ok(post.body.includes("## Related reads"),post.slug+": related content");
    assert.ok(post.body.includes("## Official references"),post.slug+": sources");
    assert.ok((post.body.match(/\]\(\/(?!images\/)/g)||[]).length>=4,post.slug+": four internal contextual links");
    assert.ok((post.body.match(/\]\(https:\/\//g)||[]).length>=2,post.slug+": two official links");
    assert.ok(post.sources.length>=2 && post.sources.every(url=>url.startsWith("https://")));
    assert.ok(post.publishedAt instanceof Date && !Number.isNaN(post.publishedAt.getTime()));
    assert.ok(post.updatedAt instanceof Date && !Number.isNaN(post.updatedAt.getTime()));
    const hero=extractArticleHero(post.body);
    assert.ok(hero,post.slug+": editorial artwork");
    assert.equal(hero.src,`/images/blog/${post.slug}.svg`);
    assert.ok(hero.alt.length>=25);
    const svg=readFileSync("public"+hero.src,"utf8");
    assert.match(svg,/<svg[^>]+viewBox="0 0 1200 630"/);
    assert.match(svg,/<title id="title">/);
    assert.doesNotMatch(svg,/<script\b/i);
    assert.ok(!post.body.includes("<script"));
  });
});
test("markdown URL security: internal and HTTPS only",()=>{
  assert.equal(safeArticleHref("/blog/example"),"/blog/example");
  assert.equal(safeArticleHref("https://www.esteri.it/it/servizi"),"https://www.esteri.it/it/servizi");
  for(const bad of ["javascript:alert(1)","http://example.com","//fake.example","/\\evil","mailto:a@example.com","https://user:password@example.com/"]){
    assert.equal(safeArticleHref(bad),null,bad);
  }
});
test("featured image parser only accepts local editorial assets and strips the hero line",()=>{
 const body="![A safe image](/images/blog/example.svg)\n\nAn introduction.";
 const out=extractArticleHero(body);
 assert.deepEqual(out,{src:"/images/blog/example.svg",alt:"A safe image",body:"An introduction."});
 assert.equal(extractArticleHero("![Tracking pixel](https://example.com/image.jpg)\n\nHi"),null);
 assert.equal(extractArticleHero("No cover"),null);
});
