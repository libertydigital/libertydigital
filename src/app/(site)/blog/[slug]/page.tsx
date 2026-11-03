import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import {findPublishedBlogPost,getPublishedBlogPosts} from "@/lib/content/public-posts";
import {extractArticleHero} from "@/lib/content/markdown-utils";
import {findCuratedPost} from "@/lib/content/curated-index";
import {ArticleBody,ServiceInlineLink} from "@/lib/content/article";
import {SERVICES} from "@/lib/services";
import {absoluteUrl,buildPageMetadata,createArticleSchema,createBreadcrumbSchema} from "@/lib/seo";

export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params;
  const post=await findPublishedBlogPost(slug);
  if(!post)return {title:"Article not found",robots:{index:false,follow:false}};
  const curated=findCuratedPost(slug),hero=extractArticleHero(post.body);
  const base=buildPageMetadata({title:post.title,description:post.metaDescription,
    path:`/blog/${post.slug}`,type:"article",
    keywords:curated?[curated.primaryKeyword,...curated.secondaryKeywords]:undefined,
  });
  const previewUrl=absoluteUrl(`/blog/${post.slug}/opengraph-image`);
  return {...base,
    openGraph:{...base.openGraph,images:[{url:previewUrl,width:1200,height:630,alt:hero?.alt||post.title}]},
    twitter:{...base.twitter,images:[previewUrl]},
  };
}
export default async function BlogPost({params}:Props){
  const {slug}=await params,post=await findPublishedBlogPost(slug);
  if(!post)notFound();
  const all=await getPublishedBlogPosts();
  const related=all.filter(p=>p.slug!==post.slug).slice(0,3);
  const service=SERVICES.find(s=>s.slug===post.serviceSlug);
  const href=service?`/services/${service.slug}`:"/services";
  const title=service?.shortLabel||"document-preparation";
  const articlePath=`/blog/${post.slug}`;
  const hero=extractArticleHero(post.body);
  const schema=createArticleSchema({
    title:post.title,description:post.metaDescription,path:articlePath,
    publishedAt:(post.publishedAt||post.updatedAt).toISOString(),
  });
  schema.image=[absoluteUrl(`/blog/${post.slug}/opengraph-image`)];
  schema.dateModified=post.updatedAt.toISOString();
  const ld=JSON.stringify([
    schema,
    createBreadcrumbSchema([{name:"Home",path:"/"},{name:"Blog",path:"/blog"},{name:post.title,path:articlePath}]),
  ]).replace(/</g,"\\u003c");
  return <article className="surface-base py-[var(--section-py)]"><div className="container-premium max-w-4xl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:ld}}/>
    <nav className="text-sm"><Link href="/" className="underline">Home</Link> / <Link href="/blog" className="underline">Blog</Link></nav>
    <header className="mt-8"><p className="section-kicker">Practical article · {post.publishedAt?.toLocaleDateString("en-GB",{timeZone:"UTC"})}</p>
      <h1 className="section-title mt-4">{post.title}</h1><p className="section-description mt-5">{post.excerpt}</p>
      <p className="mt-5 text-sm">Looking for help? <ServiceInlineLink href={href} label={`Explore ${title} support`}/>.</p>
    </header>
    {hero&&<figure className="mt-10 overflow-hidden rounded-3xl border border-[var(--color-line)]">
      <Image src={hero.src} alt={hero.alt} width={1200} height={630} unoptimized priority
        className="aspect-[16/9] w-full object-cover"/>
      <figcaption className="px-5 py-3 text-xs text-[var(--color-navy-soft)]">{hero.alt}</figcaption>
    </figure>}
    <section className="mt-10"><ArticleBody body={hero?hero.body:post.body}/></section>
    <aside className="surface-card mt-8 rounded-2xl p-5 text-sm leading-7">Requirements and processing decisions belong to the relevant official authorities. Confirm the latest instructions before making commitments.</aside>
    <p className="mt-8 text-sm">Read our <ServiceInlineLink href="/resources" label="practical preparation guides"/> or <ServiceInlineLink href={href} label={`request ${title} assistance`}/>.</p>
    <section className="mt-12 rounded-3xl bg-[var(--color-navy)] p-7 text-white">
      <h2 className="font-serif text-3xl">Ready for the next step?</h2>
      <p className="mt-3 text-sm">Liberty provides independent document-preparation support in Italy.</p>
      <Link className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-[var(--color-navy)]" href={href}>Review available support</Link>
    </section>
    {related.length>0&&<aside className="mt-12"><h2 className="font-serif text-3xl">Related reads</h2>
      <ul className="mt-4 space-y-3">{related.map(p=><li key={p.slug}><Link className="font-semibold underline" href={`/blog/${p.slug}`}>{p.title}</Link></li>)}</ul>
    </aside>}
  </div></article>;
}
