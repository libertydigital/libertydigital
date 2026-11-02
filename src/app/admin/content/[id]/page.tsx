import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { SERVICES } from "@/lib/services";
import { createContentVideo, saveContentPost, setContentStatus, saveContentVideo,
  approveContentVideo, queueContentVideo, prepareDistribution, markDistributionPublished } from "@/actions/content-actions";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic="force-dynamic";
export default async function ContentEditor({params}:{params:Promise<{id:string}>}) {
  await requireAdminUser();
  const {id}=await params;
  const post=await getPrisma().contentPost.findUnique({where:{id},include:{
    videos:{orderBy:{createdAt:"desc"},include:{distributions:true}},
  }});
  if(!post) notFound();
  const signedUrls:Record<string,string>={};
  for (const video of post.videos) {
    if (!video.storagePath) continue;
    const {data}=await getSupabaseAdminClient().storage.from("content-videos").createSignedUrl(video.storagePath,900);
    if(data?.signedUrl) signedUrls[video.id]=data.signedUrl;
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
          <button disabled={post.status===status} className="rounded-xl border px-4 py-2 disabled:opacity-50">{status==="PUBLISHED"?"Publish article":status==="REVIEW"?"Submit for review":"Return to draft"}</button>
        </form>)}</div>
      {post.status==="PUBLISHED" && <Link className="mt-3 inline-block underline" href={`/blog/${post.slug}`}>View public article</Link>}
    </div>
    <section className="space-y-5">
      <h2 className="font-serif text-3xl">Video Studio</h2>
      <form action={createContentVideo} className="surface-card flex flex-wrap gap-3 rounded-3xl p-6">
        <input type="hidden" name="postId" value={post.id}/>
        <select className={input+" max-w-sm"} name="format"><option value="EXPLAINER">Explainer</option><option value="TIPS">Tips / mistakes</option><option value="UPDATE">News update</option></select>
        <button className={button}>Generate new storyboard</button>
      </form>
      {post.videos.map(video=><article key={video.id} className="surface-card space-y-4 rounded-3xl p-6">
        <header className="flex flex-wrap justify-between gap-3"><h3 className="text-xl font-semibold">{video.format} · {video.durationSeconds}s</h3>
          <span className="rounded-full border px-3 py-1 text-xs">{video.status}{video.error?" · failed":""}</span></header>
        {video.error&&<p role="alert" className="text-sm text-red-700">{video.error}</p>}
        <form action={saveContentVideo} className="space-y-3">
          <input type="hidden" name="videoId" value={video.id}/>
          <label className="block">Hook<input className={input} name="hook" defaultValue={video.hook} required/></label>
          <label className="block">Storyboard scenes (JSON: caption, visual, seconds)
            <textarea className={input+" mt-2 font-mono text-xs"} name="scenes" rows={13} defaultValue={JSON.stringify(video.scenes,null,2)} required/>
          </label>
          <button className="rounded-xl border px-5 py-2">Save changes and reset approval</button>
        </form>
        <div className="flex flex-wrap gap-3">
          {(["DRAFT","FAILED"].includes(video.status))&&<form action={approveContentVideo}><input name="videoId" type="hidden" value={video.id}/><button className={button}>Approve video</button></form>}
          {video.status==="APPROVED"&&<form action={queueContentVideo}><input name="videoId" type="hidden" value={video.id}/><button className={button}>Queue MP4 render</button></form>}
          {video.status==="QUEUED"&&<p className="text-sm">Queued for private render worker.</p>}
          {video.status==="RENDERING"&&<p className="text-sm">Rendering in progress.</p>}
        </div>
        {video.status==="READY"&&signedUrls[video.id]&&<div className="space-y-3">
          <video className="max-h-[500px] w-full rounded-2xl bg-black" src={signedUrls[video.id]} controls preload="metadata"/>
          <a className="inline-block rounded-xl border px-4 py-2" href={signedUrls[video.id]} download={post.slug+".mp4"}>Download MP4</a>
          <p className="text-xs">Download links are private and expire after 15 minutes.</p>
        </div>}
        {video.status==="READY"&&<section className="space-y-4 border-t pt-4">
          <h4 className="font-semibold">Distribution checklist (manual publication)</h4>
          <p className="text-xs">Create a destination draft, upload the downloaded MP4 yourself, and record its real platform link. This does not auto-post.</p>
          <form action={prepareDistribution} className="flex flex-wrap gap-2">
            <input type="hidden" name="videoId" value={video.id}/>
            <select name="platform" className={input+" max-w-xs"}>{["TIKTOK","INSTAGRAM","FACEBOOK","YOUTUBE"].map(p=><option key={p} value={p}>{p}</option>)}</select>
            <button className="rounded-xl border px-4 py-2">Prepare destination</button>
          </form>
          {video.distributions.map(dist=><form action={markDistributionPublished} key={dist.id} className="rounded-xl border p-3">
            <input type="hidden" name="distributionId" value={dist.id}/>
            <p className="text-sm font-bold">{dist.platform} · {dist.status}</p>
            <p className="whitespace-pre-line text-xs">{dist.caption}</p>
            {dist.status==="PUBLISHED"?<a className="text-sm underline" href={dist.externalUrl||"#"} rel="noopener noreferrer" target="_blank">View external post</a>:
              <div className="mt-2 flex flex-wrap gap-2"><input className={input+" flex-1"} name="externalUrl" type="url" placeholder="https://... actual published post URL" required/><button className="rounded-xl border px-4 py-2">Mark posted</button></div>}
          </form>)}
        </section>}
      </article>)}
    </section>
  </div>;
}
