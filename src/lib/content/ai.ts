import "server-only";
import {createStoryboard,validateScenes,type ArticleInput,type VideoFormat,type Storyboard} from "./storyboard";
import {approvedMediaAssets} from "./media-library";

export async function draftVideoStoryboard(article:ArticleInput,format:VideoFormat):Promise<Storyboard>{
  const fallback=createStoryboard(article,format);
  const key=process.env.OPENAI_API_KEY;
  if(!key)return fallback;
  try{
    const response=await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},
      body:JSON.stringify({model:process.env.CONTENT_AI_MODEL||"gpt-4.1-mini",temperature:0.5,
        response_format:{type:"json_object"},
        messages:[
          {role:"system",content:"Produce a natural 15–60 second vertical social storyboard JSON object: "+
            "hook (string), scenes (3–6 items with caption, narration, visual, seconds, mediaId, motion). "+
            "Captions are concise overlays. Narration is conversational and no more than 3 words per second. "+
            "Valid visual: hook, checklist, warning, document, cta. "+
            "Valid motion: slow-zoom, pan-left, still. Valid mediaId: "+
            approvedMediaAssets.map(asset=>asset.id).join(", ")+". "+
            "Use factual information from the supplied article ONLY. No invented client stories, "+
            "embassy status, approvals, processing guarantees or private personal details. "+
            "Finish with independent Liberty Digital support, and confirm current official requirements."},
          {role:"user",content:JSON.stringify({format,article})},
        ],
      }),signal:AbortSignal.timeout(20000),cache:"no-store",
    });
    if(!response.ok)throw new Error("Storyboard provider unavailable.");
    const payload=await response.json();
    const parsed=JSON.parse(payload.choices?.[0]?.message?.content||"{}");
    if(typeof parsed.hook!=="string"||!parsed.hook.trim())throw new Error("Missing hook.");
    const raw=validateScenes(parsed.scenes);
    const scenes=validateScenes(raw.map((scene,index)=>({
      ...scene,
      mediaId:scene.mediaId||fallback.scenes[Math.min(index,fallback.scenes.length-1)].mediaId,
      motion:scene.motion||"slow-zoom",
      narration:scene.narration||scene.caption.split(/\s+/).slice(0,Math.floor(scene.seconds*2.5)).join(" "),
    })));
    const last=scenes.at(-1);
    if(last&&!/official|authority|requirement/i.test(last.narration||"")){
      last.narration=((last.narration||"")+" Confirm current official requirements.").slice(0,220);
      validateScenes(scenes);
    }
    return {hook:parsed.hook.slice(0,200),scenes,
      script:scenes.map(scene=>scene.narration||scene.caption).join("\n\n"),
      durationSeconds:scenes.reduce((sum,scene)=>sum+scene.seconds,0)};
  }catch{return fallback;}
}
