"use client";

import {useState} from "react";
import {saveContentVideo} from "@/actions/content-actions";
import {approvedMediaAssets} from "@/lib/content/media-library";
import type {VideoScene,VideoVisual,VideoMotion} from "@/lib/content/storyboard";
import {VideoStoryboardPreview} from "./video-storyboard-preview";

type Props={videoId:string;title:string;initialHook:string;initialScenes:VideoScene[];editable:boolean};
const input="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-white p-3 text-sm text-[var(--color-navy)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b18a51]";
export function VideoWorkspace({videoId,title,initialHook,initialScenes,editable}:Props) {
  const [scenes,setScenes]=useState(initialScenes);
  const [hook,setHook]=useState(initialHook);
  const total=scenes.reduce((sum,scene)=>sum+scene.seconds,0);
  const invalid=scenes.some(scene=>!scene.caption.trim()||scene.caption.length>200||
    (scene.narration||"").trim().split(/\s+/).filter(Boolean).length>Math.ceil(scene.seconds*3.2))||
    total<15||total>60||hook.length<8||hook.length>200;
  function change<K extends keyof VideoScene>(index:number,key:K,value:VideoScene[K]) {
    setScenes(previous=>previous.map((scene,i)=>i===index?{...scene,[key]:value}:scene));
  }
  return <div className="space-y-5">
    <VideoStoryboardPreview scenes={scenes} title={title}/>
    {editable&&<form action={saveContentVideo} className="space-y-5 border-t border-[var(--color-line)] pt-5">
      <input type="hidden" name="videoId" value={videoId}/>
      <input type="hidden" name="scenes" value={JSON.stringify(scenes)}/>
      <label className="block text-sm font-semibold">Opening hook
        <input name="hook" required minLength={8} maxLength={200} value={hook} onChange={e=>setHook(e.target.value)} className={input}/>
      </label>
      <div className="space-y-3">
        <div>
          <h4 className="text-base font-semibold">Edit scenes</h4>
          <p className="mt-1 text-xs text-[var(--color-navy-soft)]">
            Captions appear on screen. Voiceover is spoken separately. Select a checked-in photo or clip for a more realistic video.
          </p>
        </div>
        {scenes.map((scene,index)=><fieldset key={index} className="grid gap-3 rounded-xl border border-[var(--color-line)] p-4 sm:grid-cols-2">
          <legend className="px-2 text-sm font-bold">Scene {index+1}</legend>
          <label className="block text-xs font-semibold sm:col-span-2">On-screen caption
            <textarea className={input} rows={2} maxLength={200} value={scene.caption}
              onChange={e=>change(index,"caption",e.target.value)}/>
          </label>
          <label className="block text-xs font-semibold sm:col-span-2">Spoken voiceover
            <textarea className={input} rows={2} maxLength={220} value={scene.narration||""}
              placeholder="What the narrator should say during this scene"
              onChange={e=>change(index,"narration",e.target.value||undefined)}/>
          </label>
          <label className="block text-xs font-semibold">Visual purpose
            <select className={input} value={scene.visual} onChange={e=>change(index,"visual",e.target.value as VideoVisual)}>
              {["hook","document","warning","checklist","cta"].map(v=><option value={v} key={v}>{v}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold">Duration (seconds)
            <input className={input} type="number" min={2} max={20} step={1} value={scene.seconds}
              onChange={e=>change(index,"seconds",Number(e.target.value)||2)}/>
          </label>
          <label className="block text-xs font-semibold">Approved media
            <select className={input} value={scene.mediaId||""} onChange={e=>change(index,"mediaId",e.target.value||undefined)}>
              <option value="">Graphic fallback (legacy)</option>
              {approvedMediaAssets.map(asset=><option value={asset.id} key={asset.id}>
                {asset.title} · {asset.kind}
              </option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold">Camera movement
            <select className={input} value={scene.motion||"slow-zoom"} onChange={e=>change(index,"motion",e.target.value as VideoMotion)}>
              <option value="slow-zoom">Subtle zoom</option>
              <option value="pan-left">Gentle pan</option>
              <option value="still">Still frame</option>
            </select>
          </label>
        </fieldset>)}
      </div>
      <p className="text-xs text-[var(--color-navy-soft)]">
        Media comes from existing website files. Confirm photography and clip reuse rights before approving the video.
        More approved footage can be added to the catalog through a reviewed code change.
      </p>
      <p className={"text-sm font-semibold "+(invalid?"text-red-700":"text-[var(--color-navy)]")} role={invalid?"alert":"status"}>
        Total duration: {total}s (15–60s allowed). {invalid?"Shorten long narration or correct timing before saving.":"Saving resets approval."}
      </p>
      <button type="submit" disabled={invalid}
        className="min-h-11 rounded-xl bg-[var(--color-navy)] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
        Save storyboard and reset approval
      </button>
    </form>}
  </div>;
}
