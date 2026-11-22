import curatedAssets from "../../../media/approved-assets.json" with {type:"json"};
const approvedMediaIds=new Set(curatedAssets.map(asset=>asset.id));

export type VideoFormat = "EXPLAINER" | "TIPS" | "UPDATE" | "SCENARIO" | "SERVICE" | "BEHIND_SCENES";
export type VideoVisual = "hook" | "checklist" | "warning" | "document" | "cta";
export type VideoMotion = "slow-zoom" | "pan-left" | "still";
export type VideoScene = {
  caption: string;
  visual: VideoVisual;
  seconds: number;
  narration?: string;
  mediaId?: string;
  motion?: VideoMotion;
};
export type Storyboard = {
  hook: string;
  script: string;
  scenes: VideoScene[];
  durationSeconds: number;
};
export type ArticleInput = {title:string;excerpt:string;body:string};
export const DOCUMENT_NOTICE = "Official requirements may change. Confirm current instructions with the relevant authority.";

export function slugify(value:string):string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").replace(/^-+|-+$/g,"").slice(0,80);
}
export function extractSentences(markdown:string):string[] {
  return markdown.replace(/<[^>]*>/g," ").replace(/\[[^\]]+\]\([^)]*\)/g," ")
    .replace(/[#*_>`]/g," ").replace(/\s+/g," ")
    .split(/(?<=[.!?])\s+/).map(part=>part.trim())
    .filter(part=>part.length>=20).slice(0,12);
}
const visuals=new Set<VideoVisual>(["hook","checklist","warning","document","cta"]);
const motions=new Set<VideoMotion>(["slow-zoom","pan-left","still"]);

export function validateScenes(value:unknown):VideoScene[] {
  if(!Array.isArray(value)||value.length<2||value.length>8)throw new Error("Storyboard needs 2–8 scenes.");
  const scenes:VideoScene[]=value.map((item:unknown)=>{
    if(!item||typeof item!=="object")throw new Error("Invalid scene.");
    const scene=item as Record<string,unknown>;
    if(typeof scene.caption!=="string"||!scene.caption.trim()||scene.caption.length>200||
      typeof scene.visual!=="string"||!visuals.has(scene.visual as VideoVisual)||
      !Number.isInteger(scene.seconds)||(scene.seconds as number)<2||(scene.seconds as number)>20)
      throw new Error("Invalid scene caption, visual or duration.");
    if(scene.narration!==undefined&&(typeof scene.narration!=="string"||!scene.narration.trim()||scene.narration.length>220))
      throw new Error("Invalid scene narration.");
    if((scene.mediaId!==undefined&&(typeof scene.mediaId!=="string"||!approvedMediaIds.has(scene.mediaId))))
      throw new Error("Unapproved media asset.");
    if(scene.motion!==undefined&&(typeof scene.motion!=="string"||!motions.has(scene.motion as VideoMotion)))
      throw new Error("Invalid scene motion.");
    if(scene.narration) {
      const words=(scene.narration as string).trim().split(/\s+/).length;
      if(words>Math.ceil((scene.seconds as number)*3.2))
        throw new Error("Narration is too long for its scene. Shorten the voiceover or extend the scene.");
    }
    return {
      caption:(scene.caption as string).trim(),
      visual:scene.visual as VideoVisual,
      seconds:scene.seconds as number,
      ...(scene.narration?{narration:(scene.narration as string).trim()}:{}),
      ...(scene.mediaId?{mediaId:scene.mediaId as string}:{}),
      ...(scene.motion?{motion:scene.motion as VideoMotion}:{}),
    };
  });
  const total=scenes.reduce((sum,scene)=>sum+scene.seconds,0);
  if(total<15||total>60)throw new Error("Total video duration must be 15–60 seconds.");
  return scenes;
}
const compact=(raw:string,maximum=16)=>raw.trim().split(/\s+/).slice(0,maximum).join(" ").slice(0,190);
function chooseMedia(title:string) {
  if(/passport/i.test(title))return "passport";
  if(/\bnin\b|national identification/i.test(title))return "nin";
  if(/\bbvn\b|bank verification/i.test(title))return "bvn";
  return "office-consultation";
}
function assemble(scenes:VideoScene[]):Storyboard {
  const validated=validateScenes(scenes);
  return {
    hook:validated[0].caption,
    scenes:validated,
    script:validated.map(scene=>scene.narration??scene.caption).join("\n\n"),
    durationSeconds:validated.reduce((sum,scene)=>sum+scene.seconds,0),
  };
}
export function createStoryboard(article:ArticleInput,format:VideoFormat="EXPLAINER"):Storyboard {
  const title=article.title.trim();
  if(!title)throw new Error("Article title is required.");
  const sentences=[...new Set(extractSentences(article.body))].slice(0,3);
  while(sentences.length<3)sentences.push(article.excerpt.trim()||"Check current requirements before proceeding.");
  const [first,second,third]=sentences.map(sentence=>compact(sentence,15));
  const subject=compact(title.replace(/[.!?]+$/,""),8);
  const primary=chooseMedia(title);
  const cta:VideoScene={visual:"cta",caption:"Need help in Italy? Message Liberty Digital.",narration:"Message Liberty Digital for independent support. Confirm current official requirements.",mediaId:"office-support",motion:"still",seconds:6};
  if(format==="SCENARIO")return assemble([
    {visual:"hook",caption:"Living in Italy? This could affect your documents.",narration:"Living in Italy and dealing with Nigerian paperwork?",mediaId:primary,seconds:4},
    {visual:"document",caption:"Start with the details.",narration:first,mediaId:"office-process",seconds:7},
    {visual:"warning",caption:"Avoid a costly oversight.",narration:second,mediaId:"document-desk",seconds:7},
    {visual:"checklist",caption:"Know your next step.",narration:third,mediaId:"office-consultation",seconds:6},
    cta,
  ]);
  if(format==="SERVICE")return assemble([
    {visual:"hook",caption:subject,narration:compact("Need support with "+subject+" in Italy?",12),mediaId:primary,seconds:4},
    {visual:"document",caption:"What to check first",narration:first,mediaId:"office-consultation",seconds:7},
    {visual:"checklist",caption:"Prepare before you apply",narration:second,mediaId:"office-process",seconds:7},
    {visual:"warning",caption:"Requirements can change",narration:compact(third,12),mediaId:"document-desk",seconds:6},
    cta,
  ]);
  if(format==="BEHIND_SCENES")return assemble([
    {visual:"hook",caption:"A look at document preparation",narration:"Document support starts with checking the details.",mediaId:"office-intro",seconds:4},
    {visual:"document",caption:"Review the information",narration:first,mediaId:"office-process",seconds:7},
    {visual:"checklist",caption:"Check for differences",narration:second,mediaId:"office-consultation",seconds:7},
    {visual:"warning",caption:"Confirm the next step",narration:third,mediaId:"office-support",seconds:6},
    cta,
  ]);
  const label=format==="TIPS"?"Three things to check":format==="UPDATE"?"Before you act, check this":subject;
  return assemble([
    {visual:"hook",caption:compact(label+": "+subject,12),narration:compact(label+". "+subject,14),mediaId:primary,seconds:5},
    {visual:"document",caption:first,narration:first,mediaId:"office-process",seconds:7},
    {visual:format==="TIPS"?"checklist":"warning",caption:second,narration:second,mediaId:"document-desk",seconds:7},
    {visual:"checklist",caption:third,narration:third,mediaId:"office-consultation",seconds:7},
    cta,
  ]);
}
export function mayQueue(status:string):boolean{return status==="APPROVED";}
export function mayPublishDistribution(status:string):boolean{return status==="READY";}
export function mayPublishArticle(status:string):boolean{return status==="REVIEW";}
