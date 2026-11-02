"use client";

import {useState} from "react";

type Scene={caption:string;visual:string;seconds:number};
export function VideoStoryboardPreview({scenes,title}:{scenes:Scene[];title:string}) {
  const [index,setIndex]=useState(0);
  const scene=scenes[index];
  if(!scene)return null;
  const accent=scene.visual==="warning"?"#e5b474":"#d2b885";
  return <section aria-label={`Storyboard preview for ${title}`} className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
    <div className="relative mx-auto flex aspect-[9/16] w-full max-w-[320px] flex-col justify-between overflow-hidden rounded-[28px] bg-[#132f3a] p-6 text-white shadow-xl">
      <div className="pointer-events-none absolute -right-20 top-20 h-60 w-60 rounded-full bg-teal-500/30 blur-3xl"/>
      <div className="relative text-xs font-black tracking-[0.3em] text-[#d2b885]">LIBERTY DIGITAL</div>
      <div className="relative space-y-6">
        <div className="flex size-24 items-center justify-center rounded-3xl border border-white/25 bg-white/10 text-5xl text-[#d2b885]">{scene.visual==="warning"?"!":scene.visual==="checklist"?"✓":scene.visual==="cta"?"→":"ID"}</div>
        <p className="text-2xl font-bold leading-tight" style={{borderLeft:`5px solid ${accent}`,paddingLeft:14}}>{scene.caption}</p>
      </div>
      <div className="relative text-xs text-white/70">Independent document support in Italy</div>
    </div>
    <div className="space-y-4">
      <h4 className="text-lg font-semibold">Scene {index+1} of {scenes.length}</h4>
      <p className="text-sm text-[var(--color-navy-soft)]">Visual: {scene.visual} · {scene.seconds} seconds</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))} className="rounded-xl border px-4 py-2 disabled:opacity-40">Previous</button>
        <button type="button" disabled={index===scenes.length-1} onClick={()=>setIndex(i=>Math.min(scenes.length-1,i+1))} className="rounded-xl border px-4 py-2 disabled:opacity-40">Next scene</button>
      </div>
      <p className="text-xs text-[var(--color-navy-soft)]">Storyboard-only visual review. Play the exported MP4 for full motion, audio and captions.</p>
      <ol className="space-y-2">{scenes.map((part,i)=><li key={i}>
        <button type="button" onClick={()=>setIndex(i)} aria-current={i===index?"step":undefined}
          className={`w-full rounded-xl border p-3 text-left text-xs ${i===index?"border-[#0e7479] bg-[rgba(14,116,121,0.06)]":""}`}>
          <strong>{i+1}. {part.visual}</strong> · {part.seconds}s <span className="block truncate">{part.caption}</span>
        </button>
      </li>)}</ol>
    </div>
  </section>;
}
