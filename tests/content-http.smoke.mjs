import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {PrismaClient} from "@prisma/client";

const db=new PrismaClient();
const slug="ci-http-"+process.pid+"-"+Date.now();
const draftSlug=slug+"-private";
const origin="http://127.0.0.1:3210";
let server;
try{
  await db.contentPost.createMany({data:[
    {slug,title:"Published content studio public integration article",excerpt:"This is a sample article used by the isolated CI database to confirm public rendering.",metaDescription:"CI integration article for testing Liberty Digital content routes without publishing on production.",body:"This temporary article verifies that an approved and published editorial document is rendered by the blog route. Its content exists solely inside the disposable continuous-integration database. The test verifies the public response and sitemap inclusion.",status:"PUBLISHED",publishedAt:new Date()},
    {slug:draftSlug,title:"Private unfinished test content",excerpt:"A private editorial draft that should never appear in a public response or public sitemap.",metaDescription:"Private editorial integration draft, not intended for publication.",body:"This is a private draft and must never be shown on the public blog or included in the public sitemap. The temporary CI server runs with an isolated database only.",status:"DRAFT"}
  ]});
  server=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p","3210","-H","127.0.0.1"],{
    env:process.env,stdio:["ignore","pipe","pipe"],
  });
  let output="";
  server.stdout.on("data",chunk=>{output+=chunk.toString();});
  server.stderr.on("data",chunk=>{output+=chunk.toString();});
  let ready=false;
  for(let i=0;i<40;i++){
    if(server.exitCode!==null)break;
    await new Promise(r=>setTimeout(r,500));
    try{const check=await fetch(origin+"/blog",{signal:AbortSignal.timeout(2000)});if(check.ok){ready=true;break;}}catch{}
  }
  if(!ready)throw new Error("Could not start CI Next server: "+output.slice(-1000));
  const index=await (await fetch(origin+"/blog")).text();
  assert.match(index,/Published content studio public integration article/);
  assert.doesNotMatch(index,/Private unfinished test content/);
  const article=await fetch(origin+"/blog/"+slug);
  assert.equal(article.status,200);
  const html=await article.text();
  assert.match(html,/This temporary article verifies/);
  assert.match(html,/rel="canonical"/);
  assert.equal((await fetch(origin+"/blog/"+draftSlug)).status,404);
  const map=await (await fetch(origin+"/sitemap.xml")).text();
  assert.match(map,new RegExp(slug));
  assert.ok(!map.includes(draftSlug));
  assert.equal((await fetch(origin+"/api/internal/content-video")).status,401);
  console.log("HTTP smoke OK: blog, article, private draft, sitemap, locked worker route.");
}finally{
  if(server){server.kill("SIGTERM");await new Promise(r=>setTimeout(r,400));}
  await db.contentPost.deleteMany({where:{slug:{in:[slug,draftSlug]}}});
  await db.$disconnect();
}
