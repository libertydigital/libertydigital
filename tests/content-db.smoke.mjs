import assert from "node:assert/strict";
import {PrismaClient} from "@prisma/client";
import {createStoryboard} from "../src/lib/content/storyboard.ts";

const db=new PrismaClient();
const slug="ci-content-studio-"+process.pid+"-"+Date.now();
let id;
try {
  const article={title:"Nigerian Passport Preparation in Italy",excerpt:"Practical pointers before preparing your next appointment with the authority.",body:"Compare the names across all identity records before you start. Keep readable copies of your identity documents and reference numbers. Verify instructions using the relevant official authority before making an appointment or arranging travel."};
  const post=await db.contentPost.create({data:{
    slug,title:article.title,excerpt:article.excerpt,
    body:article.body,metaDescription:"Learn practical preparation steps for Nigerian identity documents and related processes in Italy.",
    status:"REVIEW",
  }});
  id=post.id;
  const story=createStoryboard(article,"TIPS");
  const video=await db.contentVideo.create({data:{
    postId:post.id,format:"TIPS",hook:story.hook,script:story.script,
    scenes:story.scenes,durationSeconds:story.durationSeconds,status:"APPROVED",approvedAt:new Date(),
  }});
  assert.equal(video.postId,post.id);
  const dist=await db.contentDistribution.create({data:{
    videoId:video.id,platform:"TIKTOK",caption:story.hook,status:"DRAFT",
  }});
  assert.equal(dist.status,"DRAFT");
  const linked=await db.contentPost.findUniqueOrThrow({where:{id},include:{videos:{include:{distributions:true}}}});
  assert.equal(linked.videos[0].distributions[0].platform,"TIKTOK");
  await db.contentPost.delete({where:{id}});
  id=undefined;
  assert.equal(await db.contentVideo.count({where:{id:video.id}}),0);
  console.log("Database smoke OK: article, video, distribution, relation and cascade.");
} finally {
  if(id)await db.contentPost.delete({where:{id}}).catch(()=>{});
  await db.$disconnect();
}
