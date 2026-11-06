"use server";

import { Prisma, ContentStatus, VideoStatus, DistributionPlatform } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { draftVideoStoryboard } from "@/lib/content/ai";
import { mayQueue, mayPublishDistribution, mayPublishArticle, validateScenes } from "@/lib/content/storyboard";
import { parseArticle, parseVideoFormat } from "@/lib/content/validation";
import { SERVICES } from "@/lib/services";
import { isPublishedPostUrl } from "@/lib/content/distribution";
import { ALL_CURATED_POSTS } from "@/lib/content/curated-index";
import { dispatchContentVideoWorker } from "@/lib/content/worker-dispatch";

function text(form: FormData, field: string): string { return String(form.get(field) ?? "").trim(); }
function refresh() { revalidatePath("/admin/content"); revalidatePath("/blog"); revalidatePath("/sitemap.xml"); }
function assertService(slug: string) {
  if (slug && !SERVICES.some(service => service.slug === slug)) throw new Error("Unknown service.");
}
export async function importCuratedContent() {
  await requireAdminUser();
  await getPrisma().contentPost.createMany({
    data:ALL_CURATED_POSTS.map(p=>({
      slug:p.slug,title:p.title,excerpt:p.excerpt,metaDescription:p.metaDescription,
      body:p.body,serviceSlug:p.serviceSlug,status:ContentStatus.PUBLISHED,
      publishedAt:p.publishedAt,
    })),
    skipDuplicates:true,
  });
  refresh();
}
export async function createContentPost(form: FormData) {
  await requireAdminUser();
  const title = text(form, "title");
  if (title.length < 8 || title.length > 150) throw new Error("Title must have 8–150 characters.");
  const { slugify } = await import("@/lib/content/storyboard");
  const slug = slugify(title);
  if (!slug) throw new Error("Invalid article title.");
  const post = await getPrisma().contentPost.create({
    data: {title, slug, excerpt: "", metaDescription: "", body: "", status: ContentStatus.DRAFT},
  });
  refresh(); redirect(`/admin/content/${post.id}`);
}
export async function saveContentPost(form: FormData) {
  await requireAdminUser();
  const id = text(form, "id");
  const parsed = parseArticle(form);
  assertService(parsed.serviceSlug ?? "");
  await getPrisma().$transaction(async (db) => {
    const current = await db.contentPost.findUniqueOrThrow({where:{id}});
    await db.contentPost.update({where: {id}, data: {...parsed, serviceSlug: parsed.serviceSlug || null,
      // Changes to a published article must be reviewed before they reappear publicly.
      status: current.status === ContentStatus.PUBLISHED ? ContentStatus.REVIEW : current.status,
      publishedAt: current.status === ContentStatus.PUBLISHED ? null : current.publishedAt,
    }});
    // Editing the underlying article invalidates every unrendered approval, including jobs in progress.
    await db.contentVideo.updateMany({
      where: {postId: id, status: {in: [VideoStatus.APPROVED, VideoStatus.QUEUED, VideoStatus.RENDERING]}},
      data: {status: VideoStatus.DRAFT, approvedAt: null},
    });
  });
  refresh(); revalidatePath(`/admin/content/${id}`);
}
export async function setContentStatus(form: FormData) {
  await requireAdminUser();
  const id = text(form, "id"), target = text(form, "status");
  if (!Object.values(ContentStatus).includes(target as ContentStatus)) throw new Error("Invalid status.");
  const post = await getPrisma().contentPost.findUniqueOrThrow({where: {id}});
  if (target === "PUBLISHED") {
    if (!mayPublishArticle(post.status)) throw new Error("Article must be submitted for review before publication.");
    const parsed = {title: post.title, slug: post.slug, excerpt: post.excerpt,
      body: post.body, metaDescription: post.metaDescription, serviceSlug: post.serviceSlug || ""};
    const { articleSchema } = await import("@/lib/content/validation");
    articleSchema.parse(parsed);
    assertService(parsed.serviceSlug);
  }
  await getPrisma().contentPost.update({
    where: {id},
    data: {status: target as ContentStatus, publishedAt: target === "PUBLISHED" ? (post.publishedAt ?? new Date()) : null},
  });
  refresh(); revalidatePath(`/admin/content/${id}`);
}
export async function createContentVideo(form: FormData) {
  await requireAdminUser();
  const postId = text(form, "postId"), format = parseVideoFormat(text(form, "format"));
  const post = await getPrisma().contentPost.findUniqueOrThrow({where:{id:postId}});
  if (post.body.length < 100) throw new Error("Save a complete article before generating a video.");
  const storyboard = await draftVideoStoryboard(post, format);
  await getPrisma().contentVideo.create({data: {
    postId, format, hook: storyboard.hook, script: storyboard.script,
    scenes: storyboard.scenes as unknown as Prisma.InputJsonValue,
    durationSeconds: storyboard.durationSeconds, status: VideoStatus.DRAFT,
  }});
  revalidatePath(`/admin/content/${postId}`);
}
export async function saveContentVideo(form: FormData) {
  await requireAdminUser();
  const id = text(form,"videoId");
  const current = await getPrisma().contentVideo.findUniqueOrThrow({where:{id}});
  if (current.status === VideoStatus.RENDERING || current.status === VideoStatus.READY) throw new Error("Create a new video variation rather than editing a rendering or completed video.");
  const scenes = validateScenes(JSON.parse(text(form,"scenes")));
  const hook = text(form,"hook");
  if (hook.length < 8 || hook.length > 200) throw new Error("Hook must contain 8–200 characters.");
  const durationSeconds = scenes.reduce((sum, scene) => sum + scene.seconds, 0);
  await getPrisma().contentVideo.update({where:{id},data:{
    scenes: scenes as unknown as Prisma.InputJsonValue,
    hook, script: scenes.map(scene=>scene.caption).join("\n\n"), durationSeconds,
    status: VideoStatus.DRAFT, approvedAt:null, storagePath:null, error:null,
  }});
  revalidatePath(`/admin/content/${current.postId}`);
}
export async function approveContentVideo(form: FormData) {
  await requireAdminUser();
  const id = text(form,"videoId");
  const video = await getPrisma().contentVideo.findUniqueOrThrow({where:{id},include:{post:true}});
  if (video.status !== VideoStatus.DRAFT && video.status !== VideoStatus.FAILED) throw new Error("Video is not editable for approval.");
  if (video.post.status === ContentStatus.DRAFT) throw new Error("Submit the article for review first.");
  validateScenes(video.scenes);
  await getPrisma().contentVideo.update({where:{id},data:{status:VideoStatus.APPROVED,approvedAt:new Date(),error:null}});
  revalidatePath(`/admin/content/${video.postId}`);
}
export async function queueContentVideo(form: FormData) {
  await requireAdminUser();
  const id = text(form,"videoId");
  const update = await getPrisma().contentVideo.updateMany({
    where:{id,status:VideoStatus.APPROVED,approvedAt:{not:null}},
    data:{status:VideoStatus.QUEUED,error:null},
  });
  if (update.count !== 1 || !mayQueue("APPROVED")) throw new Error("Video must be approved before rendering.");
  const video = await getPrisma().contentVideo.findUniqueOrThrow({where:{id}});
  // Leave the durable queue intact if GitHub dispatch is unconfigured or unavailable.
  const trigger = await dispatchContentVideoWorker();
  if (!trigger.dispatched) console.warn(`Video ${video.id} queued for scheduled processing: ${trigger.reason}`);
  revalidatePath(`/admin/content/${video.postId}`);
}
export async function prepareDistribution(form: FormData) {
  await requireAdminUser();
  const videoId=text(form,"videoId");
  const platform=text(form,"platform") as DistributionPlatform;
  if (!Object.values(DistributionPlatform).includes(platform)) throw new Error("Invalid destination.");
  const video = await getPrisma().contentVideo.findUniqueOrThrow({where:{id:videoId},include:{post:true}});
  if (!mayPublishDistribution(video.status) || video.post.status !== ContentStatus.PUBLISHED)
    throw new Error("Rendered video and published article required.");
  const caption = text(form,"caption") || `${video.hook}\nRead the guide: /blog/${video.post.slug}`;
  await getPrisma().contentDistribution.upsert({
    where: {videoId_platform:{videoId,platform}},
    create:{videoId,platform,caption,status:"DRAFT"},
    update:{caption},
  });
  revalidatePath(`/admin/content/${video.postId}`);
}
export async function markDistributionPublished(form: FormData) {
  await requireAdminUser();
  const id=text(form,"distributionId"), externalUrl=text(form,"externalUrl");
  const distribution=await getPrisma().contentDistribution.findUniqueOrThrow({where:{id},include:{video:{include:{post:true}}}});
  if (!isPublishedPostUrl(distribution.platform,externalUrl))
    throw new Error("URL must match the selected social platform.");
  if (distribution.video.status !== VideoStatus.READY || distribution.video.post.status !== ContentStatus.PUBLISHED)
    throw new Error("Article and video must be published and ready.");
  await getPrisma().contentDistribution.update({where:{id},data:{status:"PUBLISHED",externalUrl:new URL(externalUrl).toString(),publishedAt:new Date()}});
  revalidatePath(`/admin/content/${distribution.video.postId}`);
}
