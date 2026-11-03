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
  const curatedSlugs=[
    "nigerian-same-person-affidavit-italy",
    "nigerian-nulla-osta-marriage-italy-documents",
    "nigerian-child-passport-parental-consent-rome",
    "npc-birth-attestation-italy-family-reunion",
    "nigerian-family-income-documents-italy-scholarship",
  ];
  for(const guideSlug of curatedSlugs) {
    const url=origin+"/blog/"+guideSlug;
    const result=await fetch(url);
    assert.equal(result.status,200,guideSlug+" must be public");
    const content=await result.text();
    assert.ok(content.includes("/images/blog/"+guideSlug+".png"),guideSlug+" displays realistic hero image");
    const image=await fetch(origin+"/images/blog/"+guideSlug+".png");
    assert.equal(image.status,200);
    assert.match(image.headers.get("content-type")||"",/image\\/png/);
    assert.ok((await image.arrayBuffer()).byteLength>200000,"realistic image file");
    assert.match(content,/rel="canonical"/);
    assert.match(content,/application\/ld\+json/);
    const ogTag=content.match(/<meta\b[^>]*property="og:image"[^>]*>/)?.[0];
    const twitterTag=content.match(/<meta\b[^>]*name="twitter:image"[^>]*>/)?.[0];
    assert.ok(ogTag?.includes("/images/blog/"+guideSlug+".png"),"realistic photo is Open Graph preview");
    assert.ok(twitterTag?.includes("/images/blog/"+guideSlug+".png"),"realistic photo is Twitter preview");
    assert.ok(content.includes('"image":["'),"Article JSON-LD contains image metadata");
    assert.match(content,/Official references/);
    assert.match(content,/Related reads/);
  }
  const generatedImage=await fetch(origin+"/api/blog-og/nigerian-same-person-affidavit-italy");
  assert.equal(generatedImage.status,200);
  assert.match(generatedImage.headers.get("content-type")||"",/image\/png/);
  assert.ok((await generatedImage.arrayBuffer()).byteLength>1024,"PNG social preview must not be empty");
  assert.match(index,/Published content studio public integration article/);
  assert.doesNotMatch(index,/Private unfinished test content/);
  const article=await fetch(origin+"/blog/"+slug);
  assert.equal(article.status,200);
  const html=await article.text();
  assert.match(html,/This temporary article verifies/);
  assert.match(html,/rel="canonical"/);
  // A streamed Next.js notFound() can retain HTTP 200 after headers are flushed.
  // Privacy and noindex are the invariants, not a transport status alone.
  const draftResponse=await fetch(origin+"/blog/"+draftSlug);
  assert.ok([200,404].includes(draftResponse.status));
  const draftHtml=await draftResponse.text();
  assert.doesNotMatch(draftHtml,/Private unfinished test content/);
  assert.doesNotMatch(draftHtml,/This is a private draft and must never/);
  assert.match(draftHtml,/(404|not found)/i);
  assert.match(draftHtml,/noindex/i);
  const map=await (await fetch(origin+"/sitemap.xml")).text();
  assert.match(map,new RegExp(slug));
  for(const guideSlug of curatedSlugs)assert.ok(map.includes("/blog/"+guideSlug),"missing sitemap slug "+guideSlug);
  assert.ok(!map.includes(draftSlug));
  assert.equal((await fetch(origin+"/api/internal/content-video")).status,401);
  // Authorized workers must present their exact claim-attempt lease. An older
  // worker may not overwrite a newly retried attempt for the same video ID.
  const published=await db.contentPost.findUniqueOrThrow({where:{slug}});
  const video=await db.contentVideo.create({data:{
    postId:published.id,hook:"Document guidance sample hook",script:"Prepare and verify your documents.",
    scenes:[{caption:"Prepare and verify your records.",visual:"hook",seconds:10},{caption:"Confirm official instructions.",visual:"cta",seconds:10}],
    durationSeconds:20,attemptCount:2,status:"RENDERING",claimedAt:new Date(),
  }});
  const request=(attemptCount)=>fetch(origin+"/api/internal/content-video",{
    method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+process.env.VIDEO_WORKER_TOKEN},
    body:JSON.stringify({action:"fail",id:video.id,attemptCount,error:"CI test failure"}),
  });
  const stale=await request(1);
  assert.equal(stale.status,409);
  assert.equal((await db.contentVideo.findUniqueOrThrow({where:{id:video.id}})).status,"RENDERING");
  assert.equal((await request(2)).status,200);
  assert.equal((await db.contentVideo.findUniqueOrThrow({where:{id:video.id}})).status,"FAILED");
  console.log("HTTP smoke OK: public and private article routes, sitemap, guarded worker lease transitions.");
}finally{
  if(server){server.kill("SIGTERM");await new Promise(r=>setTimeout(r,400));}
  await db.contentPost.deleteMany({where:{slug:{in:[slug,draftSlug]}}});
  await db.$disconnect();
}
