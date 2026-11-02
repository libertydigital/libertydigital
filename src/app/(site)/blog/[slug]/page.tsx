import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getPrisma} from "@/lib/prisma";
import {ArticleBody,ServiceInlineLink} from "@/lib/content/article";
import {SERVICES} from "@/lib/services";
import {buildPageMetadata,createArticleSchema,createBreadcrumbSchema} from "@/lib/seo";

export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
async function load(slug:string){return getPrisma().contentPost.findFirst({where:{slug,status:"PUBLISHED"}});}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params, post=await load(slug);
  return post?buildPageMetadata({title:post.title,description:post.metaDescription,path:`/blog/${post.slug}`,type:"article"}):{title:"Article not found",robots:{index:false}};
}
export default async function BlogPost({params}:Props){
  const {slug}=await params, post=await load(slug);
  if(!post)notFound();
  const related=await getPrisma().contentPost.findMany({where:{status:"PUBLISHED",id:{not:post.id}},take:3,orderBy:{publishedAt:"desc"}});
  const service=SERVICES.find(s=>s.slug===post.serviceSlug);
  const href=service?`/services/${service.slug}`:"/services";
  const title=service?.shortLabel||"document-preparation";
  const articlePath=`/blog/${post.slug}`;
  const ld=JSON.stringify([
    createArticleSchema({title:post.title,description:post.metaDescription,path:articlePath,publishedAt:(post.publishedAt||post.createdAt).toISOString()}),
    createBreadcrumbSchema([{name:"Home",path:"/"},{name:"Blog",path:"/blog"},{name:post.title,path:articlePath}]),
  ]).replace(/</g,"\\u003c");
  return <article className="surface-base py-[var(--section-py)]"><div className="container-premium max-w-4xl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:ld}}/>
    <nav className="text-sm"><Link href="/" className="underline">Home</Link> / <Link href="/blog" className="underline">Blog</Link></nav>
    <header className="mt-8"><p className="section-kicker">Practical article · {post.publishedAt?.toLocaleDateString("en-GB")}</p>
      <h1 className="section-title mt-4">{post.title}</h1><p className="section-description mt-5">{post.excerpt}</p>
      <p className="mt-5 text-sm">Looking for help? <ServiceInlineLink href={href} label={`Explore ${title} support`}/>.</p></header>
    <section className="mt-10"><ArticleBody body={post.body}/></section>
    <aside className="surface-card mt-8 rounded-2xl p-5 text-sm leading-7">Requirements and processing decisions belong to the relevant official authorities. Confirm the latest instructions before making commitments.</aside>
    <p className="mt-8 text-sm">Read our <ServiceInlineLink href="/resources" label="practical preparation guides"/> or <ServiceInlineLink href={href} label={`request ${title} assistance`}/>.</p>
    <section className="mt-12 rounded-3xl bg-[var(--color-navy)] p-7 text-white">
      <h2 className="font-serif text-3xl">Ready for the next step?</h2>
      <p className="mt-3 text-sm">Liberty provides independent document-preparation support in Italy.</p>
      <Link className="mt-5 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-[var(--color-navy)]" href={href}>Review available support</Link>
    </section>
    {related.length>0&&<aside className="mt-12"><h2 className="font-serif text-3xl">Related reads</h2>
      <ul className="mt-4 space-y-3">{related.map(p=><li key={p.id}><Link className="font-semibold underline" href={`/blog/${p.slug}`}>{p.title}</Link></li>)}</ul>
    </aside>}
  </div></article>;
}
