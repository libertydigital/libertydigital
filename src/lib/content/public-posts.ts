import "server-only";
import {getPrisma} from "@/lib/prisma";
import {ALL_CURATED_POSTS,findCuratedPost} from "./curated-index";

export type PublicBlogPost = {
  id:string; slug:string; title:string; excerpt:string; metaDescription:string;
  body:string; serviceSlug:string|null; publishedAt:Date|null; updatedAt:Date;
};
const curatedAsPublic=(post:(typeof ALL_CURATED_POSTS)[number]):PublicBlogPost=>({
  id:"curated:"+post.slug,slug:post.slug,title:post.title,excerpt:post.excerpt,
  metaDescription:post.metaDescription,body:post.body,serviceSlug:post.serviceSlug,
  publishedAt:post.publishedAt,updatedAt:post.updatedAt,
});
export async function getPublishedBlogPosts():Promise<PublicBlogPost[]> {
  const curatedSlugs=ALL_CURATED_POSTS.map(p=>p.slug);
  const rows=await getPrisma().contentPost.findMany({
    where:{OR:[{status:"PUBLISHED"},{slug:{in:curatedSlugs}}]},
    orderBy:{publishedAt:"desc"},take:250,
  });
  const reserved=new Set(rows.map(p=>p.slug));
  const curated=ALL_CURATED_POSTS.filter(p=>!reserved.has(p.slug)).map(curatedAsPublic);
  return [...rows.filter(p=>p.status==="PUBLISHED"),...curated]
    .sort((a,b)=>(b.publishedAt?.getTime()??0)-(a.publishedAt?.getTime()??0));
}
export async function findPublishedBlogPost(slug:string):Promise<PublicBlogPost|null> {
  const record=await getPrisma().contentPost.findUnique({where:{slug}});
  if(record) return record.status==="PUBLISHED"?record:null;
  const curated=findCuratedPost(slug);
  return curated?curatedAsPublic(curated):null;
}
