"use client";

import {useEffect,useState} from "react";
import Image from "next/image";
import {getApprovedMediaAsset,publicMediaUrl} from "@/lib/content/media-library";
import type {VideoScene} from "@/lib/content/storyboard";

type Props={scenes:VideoScene[];title:string};
function asTime(value:number){return String(Math.floor(value/60)).padStart(2,"0")+":"+String(Math.floor(value%60)).padStart(2,"0");}
export function VideoStoryboardPreview({scenes,title}:Props) {
  const [elapsed,setElapsed]=useState(0);
  const [playing,setPlaying]=useState(false);
  const total=scenes.reduce((sum,scene)=>sum+scene.seconds,0);
  useEffect(()=>{
    if(!playing||total<=0)return;
    const interval=setInterval(()=>setElapsed(value=>{
      const next=Math.min(total,value+.25);
      if(next>=total)setPlaying(false);
      return next;
    }),250);
    return ()=>clearInterval(interval);
  },[playing,total]);
  if(!scenes.length)return <p role="status">No scenes to preview.</p>;
  let start=0,index=scenes.length-1;
  for(let i=0;i<scenes.length;i++) {
    if(elapsed<start+scenes[i].seconds){index=i;break;}
    start+=scenes[i].seconds;
  }
  const scene=scenes[index],asset=getApprovedMediaAsset(scene.mediaId);
  const words=(scene.narration||scene.caption).trim().split(/\s+/);
  const activeSecond=Math.max(0,elapsed-start);
  const phraseIndex=Math.min(Math.ceil(words.length/4)-1,Math.floor(activeSecond/Math.max(.25,scene.seconds-.5)*Math.ceil(words.length/4)));
  const phrase=words.slice(Math.max(0,phraseIndex)*4,(Math.max(0,phraseIndex)+1)*4).join(" ");
  return <section aria-label={"Timed storyboard preview for "+title}
      className="grid gap-5 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-2xl bg-[#112031] text-white">
      {asset?.kind==="photo"&&<Image src={publicMediaUrl(asset)} alt={asset.description} fill sizes="300px" className="object-cover"/>}
      {asset?.kind==="video"&&<video src={publicMediaUrl(asset)} muted loop playsInline controls preload="metadata"
        className="absolute inset-0 h-full w-full object-cover" aria-label={asset.title}/>}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95"/>
      <div className="absolute inset-x-5 top-5 flex justify-between gap-3 text-[10px] font-black tracking-[0.16em]">
        <span>LIBERTY DIGITAL</span><span>ITALY</span>
      </div>
      <div className="absolute inset-x-5 bottom-[33%] space-y-3">
        <div className="h-1 w-10 bg-[#ead7a4]"/>
        <p className="text-xl font-extrabold leading-tight drop-shadow-md">{scene.caption}</p>
      </div>
      <div aria-live="off" className="absolute inset-x-4 bottom-[19%] rounded-lg bg-black/80 p-2 text-center text-xs font-semibold">
        {phrase}
      </div>
      <div className="absolute inset-x-5 bottom-6 space-y-2 text-[10px]">
        <div className="h-1 overflow-hidden bg-white/30">
          <div className="h-full bg-[#ead7a4]" style={{width:String(total?elapsed/total*100:0)+"%"}}/>
        </div>
        <p>Independent document support · {index+1}/{scenes.length}</p>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold">Timed storyboard</h4>
        <p className="text-xs text-[var(--color-navy-soft)]">
          Draft timing and selected imagery only. Play the rendered MP4 to check final narration and audio.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={()=>{
          if(elapsed>=total)setElapsed(0);
          setPlaying(value=>!value);
        }} className="min-h-11 rounded-lg bg-[var(--color-navy)] px-5 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
          {playing?"Pause preview":"Play preview"}
        </button>
        <button type="button" onClick={()=>{setElapsed(0);setPlaying(false);}}
          className="min-h-11 rounded-lg border px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2">
          Reset
        </button>
        <output className="text-sm tabular-nums">{asTime(elapsed)} / {asTime(total)}</output>
      </div>
      <label className="block text-xs font-semibold">
        Scrub preview
        <input type="range" min={0} max={Math.max(total,.25)} step={.25}
          value={Math.min(elapsed,Math.max(total,.25))} onChange={e=>{setPlaying(false);setElapsed(Number(e.target.value));}}
          className="mt-2 w-full accent-[#b18a51]" aria-label="Preview playhead"/>
      </label>
      <ol className="space-y-2">
        {scenes.map((item,i)=>{
          const offset=scenes.slice(0,i).reduce((sum,s)=>sum+s.seconds,0);
          return <li key={i}>
            <button type="button" onClick={()=>{setPlaying(false);setElapsed(offset);}}
              aria-current={i===index?"step":undefined}
              className={"min-h-11 w-full rounded-xl border p-3 text-left text-sm focus-visible:outline focus-visible:outline-2 "+
                (i===index?"border-[#b18a51] bg-[#fffaf3]":"border-[var(--color-line)]")}>
              <strong>{asTime(offset)} · {item.visual}</strong>
              <span className="ml-2 text-xs">{item.seconds}s</span>
              <span className="mt-1 block truncate text-xs text-[var(--color-navy-soft)]">{item.caption}</span>
            </button>
          </li>;
        })}
      </ol>
    </div>
  </section>;
}
