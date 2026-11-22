import {mkdtemp,mkdir,readFile,rm,writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {stageApprovedMedia} from "../media.mjs";
import {generateTimedSceneNarration} from "../kokoro.mjs";
import {createAmbientMusic,verifyRenderedVideoAudio} from "../audio.mjs";
const run=promisify(execFile);
const work=resolve(import.meta.dirname,".."),publicDir=join(work,"public");
const storyboard=JSON.parse(await readFile(join(work,"campaigns","2026-11-23-services-ad.json"),"utf8"));
const total=storyboard.scenes.reduce((n,scene)=>n+scene.seconds,0);
if(total!==60||storyboard.scenes.length!==8)throw new Error("Advert must have eight scenes totalling exactly 60 seconds.");
const output=resolve(process.env.OUTPUT_MP4||join(work,"liberty-services-ad-60s.mp4"));
const temp=await mkdtemp(join(tmpdir(),"liberty-weekly-ad-"));
try {
  await mkdir(publicDir,{recursive:true});
  const scenes=await stageApprovedMedia(storyboard.scenes,publicDir);
  const narration=join(publicDir,"narration.mp3");
  const music=join(publicDir,"background.wav");
  const profile={...process.env,KOKORO_VOICE:"af_bella",KOKORO_SPEED:"1.00"};
  const speech=await generateTimedSceneNarration({scenes,outputPath:narration,env:profile});
  await createAmbientMusic({durationSeconds:60,outputPath:music});
  const props={hook:storyboard.hook,durationSeconds:60,scenes,sceneSpeechSeconds:speech.speechSeconds,withNarration:true,musicFile:"background.wav",musicVolume:0.12};
  const propsPath=join(temp,"props.json");
  await writeFile(propsPath,JSON.stringify(props));
  await run(process.platform==="win32"?"npx.cmd":"npx",["remotion","render","src/index.ts","LibertyShort",output,"--props",propsPath,"--codec","h264","--crf","22","--concurrency","2"],{cwd:work,timeout:1500000,maxBuffer:5_000_000,env:{...process.env,REMOTION_NO_COLOR:"1"}});
  await verifyRenderedVideoAudio(output);
  const {stdout}=await run("ffprobe",["-v","error","-show_entries","format=duration,size:stream=codec_type,width,height","-of","json",output]);
  const meta=JSON.parse(stdout);
  if(Math.abs(Number(meta.format.duration)-60)>0.5||!meta.streams.some(s=>s.codec_type==="video")||!meta.streams.some(s=>s.codec_type==="audio"))throw new Error("MP4 failed duration or stream verification.");
  console.log("LIBERTY_AD_RENDER_PASS "+JSON.stringify(meta));
}finally{
  await rm(temp,{recursive:true,force:true});
  await rm(join(publicDir,"media"),{recursive:true,force:true});
  await Promise.all(["narration.mp3","background.wav"].map(x=>rm(join(publicDir,x),{force:true})));
}
