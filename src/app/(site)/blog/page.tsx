import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {getPublishedBlogPosts} from "@/lib/content/public-posts";
import {extractArticleHero} from "@/lib/content/markdown-utils";
import {buildPageMetadata,createWebPageSchema} from "@/lib/seo";

export const dynamic="force-dynamic";
export const metadata:Metadata=buildPageMetadata({
  title:"Blog | Nigerian Document Support in Italy",
  description:"Practical Nigerian passport, NIN, BVN and document-preparation articles for people in Italy.",
  path:"/blog",
});
export default async function BlogIndex() {
  const posts=await getPublishedBlogPosts();
  const ld=JSON.stringify(createWebPageSchema({
    title:"Liberty Digital Blog",description:"Document-preparation articles for Nigerians in Italy.",
    path:"/blog",type:"CollectionPage",
  })).replace(/</g,"\\u003c");
  return <section className="surface-base py-[var(--section-py)]"><div className="container-premium">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:ld}}/>
    <header className="max-w-3xl"><p className="section-kicker">Expert guidance</p>
      <h1 className="section-title mt-4">Document preparation and life in Italy</h1>
      <p className="section-description mt-4">Original, practical information to help you prepare before approaching the relevant authorities.</p>
    </header>
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{posts.map(post=>{
      const cover=extractArticleHero(post.body);
      return <article key={post.id} className="surface-card overflow-hidden rounded-3xl">
        {cover&&<Link href={`/blog/${post.slug}`} aria-label={post.title}>
          <Image src={cover.src} alt={cover.alt} width={1200} height={630} sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" unoptimized={cover.src.endsWith(".svg")}
            className="aspect-[16/9] w-full object-cover" loading="lazy"/>
        </Link>}
        <div className="p-7">
          <p className="section-kicker">{post.publishedAt?.toLocaleDateString("en-GB",{timeZone:"UTC"})}</p>
          <h2 className="mt-3 font-serif text-2xl"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
          <p className="mt-4 text-sm leading-7">{post.excerpt}</p>
          <Link href={`/blog/${post.slug}`} className="mt-5 inline-block font-semibold underline underline-offset-4">Read article</Link>
        </div>
      </article>;
    })}</div>
    {posts.length===0&&<p className="mt-10 text-sm">Articles are in preparation. Explore our <Link href="/resources" className="underline">existing resource guides</Link>.</p>}
  </div></section>;
}
