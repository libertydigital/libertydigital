import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { SERVICES } from "@/lib/services";
import { createContentVideo, saveContentPost, setContentStatus,
  approveContentVideo, queueContentVideo, prepareDistribution, markDistributionPublished, recordDistributionInsights } from "@/actions/content-actions";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { VideoWorkspace } from "@/components/admin/video-workspace";
import type { VideoScene } from "@/lib/content/storyboard";

export const dynamic="force-dynamic";
export default async function ContentEditor({params}:{params:Promise<{id:string}>}) {
  await requireAdminUser();
  const {id}=await params;
  const post=await getPrisma().contentPost.findUnique({where:{id},include:{
    videos:{orderBy:{createdAt:"desc"},include:{distributions:true}},
  }});
  if(!post) notFound();
  const signedUrls:Record<string,string>={};
  const downloadUrls:Record<string,string>={};
  for (const video of post.videos) {
    if (!video.storagePath) continue;
    const {data}=await getSupabaseAdminClient().storage.from("content-videos").createSignedUrl(video.storagePath,900);
    if(data?.signedUrl) signedUrls[video.id]=data.signedUrl;
    const {data:download}=await getSupabaseAdminClient().storage.from("content-videos")
      .createSignedUrl(video.storagePath,900,{download:post.slug+".mp4"});
    if(download?.signedUrl) downloadUrls[video.id]=download.signedUrl;
  }
  const input="w-full rounded-xl border border-[var(--color-line)] bg-white p-3 text-[var(--color-navy)]";
  const button="rounded-xl bg-[var(--color-navy)] px-5 py-3 font-semibold text-white";
  return <div className="space-y-8">
    <header><Link href="/admin/content" className="text-sm underline">← All articles</Link>
      <h1 className="mt-3 font-serif text-4xl">Edit article</h1>
      <p className="text-sm">Status: <strong>{post.status}</strong>. Published articles are visible to the public.</p></header>
    <form action={saveContentPost} className="surface-card grid gap-4 rounded-3xl p-6">
      <input type="hidden" name="id" value={post.id}/>
      <label>Title<input className={input} name="title" required defaultValue={post.title}/></label>
      <label>Slug<input className={input} name="slug" required defaultValue={post.slug}/></label>
      <label>Excerpt<textarea className={input} rows={2} name="excerpt" required defaultValue={post.excerpt}/></label>
      <label>SEO description<textarea className={input} rows={2} name="metaDescription" required defaultValue={post.metaDescription}/></label>
      <label>Related service<select className={input} name="serviceSlug" defaultValue={post.serviceSlug || ""}>
        <option value="">General service page</option>{SERVICES.map(s=><option key={s.slug} value={s.slug}>{s.shortLabel}</option>)}
      </select></label>
      <label>Article content (Markdown headings and lists supported)
        <textarea className={input+" min-h-[400px] font-mono text-sm"} rows={18} name="body" required defaultValue={post.body}/>
      </label>
      <button className={button}>Save article</button>
    </form>
    <div className="surface-card rounded-3xl p-6">
      <h2 className="text-xl font-semibold">Editorial approval</h2>
      <p className="my-3 text-sm">Save changes before changing status. Verify current official requirements before publishing.</p>
      <div className="flex flex-wrap gap-3">{(["DRAFT","REVIEW","PUBLISHED"] as const).map(status=>
        <form key={status} action={setContentStatus}><input type="hidden" name="id" value={post.id}/><input type="hidden" name="status" value={status}/>
          <button disabled={post.status===status || (status==="PUBLISHED" && post.status!=="REVIEW")} className="rounded-xl border px-4 py-2 disabled:opacity-50">{status==="PUBLISHED"?"Publish article":status==="REVIEW"?"Submit for review":"Return to draft"}</button>
        </form>)}</div>
      {post.status==="PUBLISHED" && <Link className="mt-3 inline-block underline" href={`/blog/${post.slug}`}>View public article</Link>}
    </div>
    <section className="space-y-5">
      <h2 className="font-serif text-3xl">Video Studio</h2>
      <form action={createContentVideo} className="surface-card flex flex-wrap gap-3 rounded-3xl p-6">
        <input type="hidden" name="postId" value={post.id}/>
        <select className={input+" max-w-sm"} name="format"><option value="EXPLAINER">Explainer</option><option value="TIPS">Tips / mistakes</option><option value="UPDATE">News update</option><option value="SCENARIO">Real-life scenario</option><option value="SERVICE">Service spotlight</option><option value="BEHIND_SCENES">Behind the scenes</option></select>
        <button className={button}>Generate new storyboard</button>
      </form>
      {post.videos.map(video=><article key={video.id} className="surface-card space-y-4 rounded-3xl p-6">
        <header className="flex flex-wrap justify-between gap-3"><h3 className="text-xl font-semibold">{video.format} · {video.durationSeconds}s</h3>
          <span className="rounded-full border px-3 py-1 text-xs">{video.status}{video.error?" · failed":""}</span></header>
        {video.error&&<p role="alert" className="text-sm text-red-700">{video.error}</p>}
        <VideoWorkspace videoId={video.id} initialHook={video.hook}
          initialScenes={video.scenes as unknown as VideoScene[]} title={post.title}
          editable={video.status!=="RENDERING"&&video.status!=="READY"}/>
        <div className="flex flex-wrap gap-3">
          {(["DRAFT","FAILED"].includes(video.status))&&<form action={approveContentVideo} className="space-y-3">
            <input name="videoId" type="hidden" value={video.id}/>
            {(video.scenes as unknown as VideoScene[]).some(scene=>scene.mediaId)&&<label className="flex max-w-xl items-start gap-3 text-xs leading-5">
              <input name="confirmMediaRights" type="checkbox" required className="mt-1 size-4"/>
              <span>I confirm that Liberty Digital may reuse the selected photos and video clips on social media.
                I have reviewed the content for privacy and factual accuracy.</span>
            </label>}
            <button className={button}>Approve video</button>
          </form>}
          {video.status==="APPROVED"&&<form action={queueContentVideo}><input name="videoId" type="hidden" value={video.id}/><button className={button}>Queue MP4 render</button></form>}
          {video.status==="QUEUED"&&<p className="text-sm">Queued for private render worker.</p>}
          {video.status==="RENDERING"&&<p className="text-sm">Rendering in progress.</p>}
        </div>
        {video.status==="READY"&&<section id={`rendered-video-${video.id}`} aria-label={`Rendered MP4 for ${post.title}`} className="scroll-mt-24 space-y-3 border-t pt-4">
          <h4 className="text-lg font-semibold">Rendered MP4 · ready to play</h4>
          {signedUrls[video.id]?<>
            <video className="mx-auto max-h-[500px] w-full rounded-2xl bg-black" controls playsInline preload="metadata" aria-label={`Play ${post.title}`}>
              <source src={signedUrls[video.id]} type="video/mp4"/>
              Your browser does not support MP4 playback.
            </video>
            <a className="inline-block rounded-xl border px-4 py-2 font-semibold underline-offset-2 hover:underline" href={downloadUrls[video.id] || signedUrls[video.id]} download={post.slug+".mp4"}>Download MP4</a>
            <p className="text-xs">Private playback and download links expire after 15 minutes. Refresh this page for a new link.</p>
          </>:<p role="alert" className="text-sm text-red-700">The video is marked ready, but its private playback link could not be created. Refresh the page; if the problem continues, check Supabase Storage configuration.</p>}
        </section>}
        {video.status==="READY"&&<section className="space-y-4 border-t pt-4">
          <h4 className="font-semibold">Distribution checklist (manual publication)</h4>
          <p className="text-xs">Create a destination draft, upload the downloaded MP4 yourself, and record its real platform link. This does not auto-post.</p>
          <form action={prepareDistribution} className="flex flex-wrap gap-2">
            <input type="hidden" name="videoId" value={video.id}/>
            <select name="platform" className={input+" max-w-xs"}>{["TIKTOK","INSTAGRAM","FACEBOOK","YOUTUBE"].map(p=><option key={p} value={p}>{p}</option>)}</select>
            <button className="rounded-xl border px-4 py-2">Prepare destination</button>
          </form>
          {video.distributions.map(dist=><div key={dist.id} className="space-y-3 rounded-xl border border-[var(--color-line)] p-4">
            <p className="text-sm font-bold">{dist.platform} · {dist.status}</p>
            <p className="whitespace-pre-line text-xs">{dist.caption}</p>
            {dist.status==="PUBLISHED"?<>
              <a className="text-sm underline" href={dist.externalUrl||"#"} rel="noopener noreferrer" target="_blank">View external post</a>
              <form action={recordDistributionInsights} className="space-y-3 border-t border-[var(--color-line)] pt-3">
                <input type="hidden" name="distributionId" value={dist.id}/>
                <p className="text-sm font-semibold">Performance from platform insights</p>
                <p className="text-xs text-[var(--color-navy-soft)]">Enter actual reported values only. No automatic TikTok, Instagram or Meta analytics connection is implied.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold">Views
                    <input className={input} name="views" type="number" min="0" max="1000000000" step="1" required defaultValue={dist.views}/>
                  </label>
                  <label className="block text-xs font-semibold">Average watch time (seconds)
                    <input className={input} name="averageWatchSeconds" type="number" min="0" max={video.durationSeconds} step=".01"
                      defaultValue={dist.averageWatchSeconds??""} placeholder="Not reported"/>
                  </label>
                  <label className="block text-xs font-semibold">Link clicks
                    <input className={input} name="linkClicks" type="number" min="0" max="1000000000" step="1" required defaultValue={dist.linkClicks}/>
                  </label>
                  <label className="block text-xs font-semibold">Qualified enquiries
                    <input className={input} name="qualifiedInquiries" type="number" min="0" max="1000000000" step="1" required defaultValue={dist.qualifiedInquiries}/>
                  </label>
                </div>
                <button className="min-h-11 rounded-xl border px-4 py-2 font-semibold">Save reported performance</button>
                {dist.insightsRecordedAt&&<p className="text-xs text-[var(--color-navy-soft)]">Updated {dist.insightsRecordedAt.toLocaleDateString("en-GB")}</p>}
              </form>
            </>:<form action={markDistributionPublished} className="flex flex-wrap gap-2">
              <input name="distributionId" type="hidden" value={dist.id}/>
              <input className={input+" min-w-0 flex-1"} name="externalUrl" type="url" placeholder="https://... actual published post URL" required/>
              <button className="min-h-11 rounded-xl border px-4 py-2">Mark posted</button>
            </form>}
          </div>)}
        </section>}
      </article>)}
    </section>
  </div>;
}
