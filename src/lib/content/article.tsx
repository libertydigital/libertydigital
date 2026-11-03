import Image from "next/image";
import Link from "next/link";
import type {ReactNode} from "react";
import {safeArticleHref} from "./markdown-utils";

const inlinePattern = /(\*\*[^*\r\n]+\*\*|\[[^\]\r\n]{1,180}\]\([^\s)]+\))/g;
function renderInline(text:string):ReactNode[] {
  const fragments:ReactNode[]=[];
  let start=0;
  for(const match of text.matchAll(inlinePattern)) {
    const index=match.index??0;
    if(index>start)fragments.push(text.slice(start,index));
    const raw=match[0];
    if(raw.startsWith("**")) {
      fragments.push(<strong key={index}>{raw.slice(2,-2)}</strong>);
    } else {
      const link=raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href=link?safeArticleHref(link[2]):null;
      if(!link||!href) fragments.push(raw);
      else if(href.startsWith("/"))fragments.push(<Link key={index} href={href} className="font-semibold text-[var(--color-navy)] underline underline-offset-4 decoration-[var(--color-gold)]">{link[1]}</Link>);
      else fragments.push(<a key={index} href={href} className="font-semibold text-[var(--color-navy)] underline underline-offset-4 decoration-[var(--color-gold)]" rel="noopener noreferrer" target="_blank">{link[1]}</a>);
    }
    start=index+raw.length;
  }
  if(start<text.length)fragments.push(text.slice(start));
  return fragments;
}
export function ArticleBody({body}:{body:string}) {
  const nodes:ReactNode[]=[];
  let listItems:string[]=[];
  let listType:"ul"|"ol"|null=null;
  function flush() {
    if(!listType||listItems.length===0)return;
    const items=listItems.map((part,i)=><li key={i} className="pl-1 leading-8">{renderInline(part)}</li>);
    nodes.push(listType==="ul"
      ?<ul key={nodes.length} className="my-6 list-disc space-y-2 pl-7">{items}</ul>
      :<ol key={nodes.length} className="my-6 list-decimal space-y-2 pl-7">{items}</ol>);
    listItems=[];listType=null;
  }
  for(const [index,line] of body.split(/\r?\n/).entries()) {
    const clean=line.trim();
    if(!clean){flush();continue;}
    const isBullet=/^[-*] /.test(clean);
    const isNumbered=/^\d{1,2}\. /.test(clean);
    if(isBullet||isNumbered) {
      const next=isBullet?"ul":"ol";
      if(listType&&listType!==next)flush();
      listType=next;
      listItems.push(clean.replace(/^([-*]|\d{1,2}\.)\s+/,""));
      continue;
    }
    flush();
    const picture=clean.match(/^!\[([^\]\r\n]{8,180})\]\((\/images\/blog\/[a-z0-9/-]+\.svg)\)$/);
    if(picture) {
      nodes.push(<figure key={index} className="my-8 overflow-hidden rounded-3xl border border-[var(--color-line)]">
        <Image alt={picture[1]} src={picture[2]} width={1200} height={630} unoptimized className="h-auto w-full"/>
        <figcaption className="px-5 py-3 text-xs text-[var(--color-navy-soft)]">{picture[1]}</figcaption>
      </figure>);
    } else if(clean.startsWith("### ")) {
      nodes.push(<h3 key={index} className="mt-8 text-xl font-bold text-[var(--color-navy)]">{renderInline(clean.slice(4))}</h3>);
    } else if(clean.startsWith("## ") || clean.startsWith("# ")) {
      const label=clean.replace(/^#{1,2} /,"");
      nodes.push(<h2 key={index} className="mt-12 font-serif text-3xl font-semibold text-[var(--color-navy)]">{renderInline(label)}</h2>);
    } else {
      nodes.push(<p key={index} className="my-5 text-base leading-8">{renderInline(clean)}</p>);
    }
  }
  flush();
  return <div className="text-[var(--color-navy-soft)]">{nodes}</div>;
}
export function ServiceInlineLink({href,label}:{href:string,label:string}) {
  return <Link href={href} className="font-semibold underline underline-offset-4">{label}</Link>;
}
