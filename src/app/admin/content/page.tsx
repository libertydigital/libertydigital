import Link from "next/link";
import { createContentPost, importCuratedContent } from "@/actions/content-actions";
import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export default async function ContentStudioIndex() {
  await requireAdminUser();
  const [posts, totalVideos, completedVideos, distributionCount, readyVideos] = await Promise.all([
    getPrisma().contentPost.findMany({orderBy:{updatedAt:"desc"},take:100,include:{_count:{select:{videos:true}}}}),
    getPrisma().contentVideo.count(),
    getPrisma().contentVideo.count({where:{status:"READY"}}),
    getPrisma().contentDistribution.count({where:{status:"PUBLISHED"}}),
    getPrisma().contentVideo.findMany({
      where:{status:"READY",storagePath:{not:null}},
      orderBy:{updatedAt:"desc"},
      take:50,
      select:{id:true,postId:true,format:true,durationSeconds:true,post:{select:{title:true}}},
    }),
  ]);
  const renderedVideosHref=completedVideos===1 && readyVideos.length===1
    ? `/admin/content/${readyVideos[0].postId}#rendered-video-${readyVideos[0].id}`
    : "#rendered-videos";
  return <div className="space-y-8">
    <header><p className="section-kicker">Editorial workspace</p>
      <h1 className="mt-3 font-serif text-4xl text-[var(--color-navy)]">Content Studio</h1>
      <p className="mt-3 text-sm text-[var(--color-navy-soft)]">Draft articles, review vertical videos, and track publishing by channel.</p>
    </header>
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="surface-card rounded-2xl p-5"><p className="text-3xl font-semibold">{totalVideos}</p><p className="mt-2 text-sm">Video drafts and jobs</p></div>
      <Link href={renderedVideosHref} className="surface-card block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]" aria-label={`View ${completedVideos} rendered videos`}>
        <p className="text-3xl font-semibold">{completedVideos}</p>
        <p className="mt-2 text-sm">Rendered videos <span aria-hidden="true">↗</span></p>
        <p className="mt-1 text-xs text-[var(--color-navy-soft)]">View and play MP4s</p>
      </Link>
      <div className="surface-card rounded-2xl p-5"><p className="text-3xl font-semibold">{distributionCount}</p><p className="mt-2 text-sm">Confirmed external posts</p></div>
    </div>
    <section id="rendered-videos" aria-labelledby="rendered-videos-heading" className="scroll-mt-24 space-y-3">
      <h2 id="rendered-videos-heading" className="font-serif text-2xl">Rendered videos</h2>
      <p className="text-sm text-[var(--color-navy-soft)]">Choose a completed video to open its player and download the MP4. Videos are private to administrators.</p>
      {readyVideos.map(video=><Link key={video.id} href={`/admin/content/${video.postId}#rendered-video-${video.id}`}
        className="surface-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-navy)]"}>
        <div><h3 className="font-semibold text-[var(--color-navy)]">{video.post.title}</h3>
          <p className="mt-1 text-sm text-[var(--color-navy-soft)]">{video.format} · {video.durationSeconds}s · MP4 ready</p></div>
        <span className="rounded-xl border border-[var(--color-line)] px-4 py-2 text-sm font-semibold">Play video</span>
      </Link>)}
      {readyVideos.length===0&&<p className="text-sm">{completedVideos>0?"A rendered video has no file path. Check its storage status.":"No rendered videos yet."}</p>}
      {completedVideos>readyVideos.length&&readyVideos.length>0&&<p className="text-xs text-[var(--color-navy-soft)]">Showing the latest {readyVideos.length} available videos.</p>}
    </section>
    <form action={importCuratedContent} className="surface-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
      <div><p className="font-semibold">Five researched Italy guides</p>
        <p className="mt-1 text-xs text-[var(--color-navy-soft)]">Import the five published editorial articles for future edits and video storyboards. Existing slugs are preserved.</p>
      </div>
      <button className="rounded-xl border border-[var(--color-line)] px-4 py-3 font-semibold">Import curated articles</button>
    </form>
    <form action={createContentPost} className="surface-card flex flex-col gap-3 rounded-2xl p-5 sm:flex-row">
      <input name="title" required minLength={8} maxLength={150} placeholder="New article title" aria-label="New article title" className="min-w-0 flex-1 rounded-xl border p-3"/>
      <button className="rounded-xl bg-[var(--color-navy)] px-5 py-3 font-semibold text-white">Create article</button>
    </form>
    <div className="space-y-3">{posts.map(post=><Link key={post.id} href={`/admin/content/${post.id}`}
      className="surface-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5 transition hover:-translate-y-0.5">
      <div><h2 className="font-semibold text-[var(--color-navy)]">{post.title}</h2>
        <p className="mt-1 text-sm text-[var(--color-navy-soft)]">{post.slug} · {post._count.videos} videos</p></div>
      <span className="rounded-full border px-3 py-1 text-xs font-bold">{post.status}</span>
    </Link>)}
    {posts.length===0 && <p className="text-sm">No articles yet. Create the first draft above.</p>}</div>
  </div>;
}
