import Link from "next/link";
import type { ReactNode } from "react";

export function ArticleBody({body}:{body:string}) {
  const lines=body.split(/\r?\n/);
  const nodes:ReactNode[]=[];
  let bullets:string[]=[];
  function finishList() {if(bullets.length){nodes.push(<ul key={nodes.length} className="my-5 list-disc space-y-2 pl-6">{bullets.map((b,i)=><li key={i}>{b}</li>)}</ul>);bullets=[];}}
  lines.forEach((line,index)=>{
    const clean=line.trim();
    if(!clean) {finishList();return;}
    if(/^[-*] /.test(clean)) {bullets.push(clean.slice(2));return;}
    finishList();
    if(clean.startsWith("### ")) nodes.push(<h3 key={index} className="mt-7 text-xl font-bold">{clean.slice(4)}</h3>);
    else if(clean.startsWith("## ")) nodes.push(<h2 key={index} className="mt-10 font-serif text-3xl font-semibold">{clean.slice(3)}</h2>);
    else if(clean.startsWith("# ")) nodes.push(<h2 key={index} className="mt-10 font-serif text-3xl font-semibold">{clean.slice(2)}</h2>);
    else nodes.push(<p key={index} className="my-4 text-base leading-8">{clean}</p>);
  });
  finishList();
  return <div className="text-[var(--color-navy-soft)]">{nodes}</div>;
}
export function ServiceInlineLink({href,label}:{href:string,label:string}) {
  return <Link href={href} className="font-semibold underline underline-offset-4">{label}</Link>;
}
