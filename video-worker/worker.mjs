import {readFile,writeFile,mkdir,rm,mkdtemp} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {spawn} from "node:child_process";
import {createClient} from "@supabase/supabase-js";
import {fitNarrationToDuration,provisionBackgroundMusic,parseMusicVolume,verifyRenderedVideoAudio} from "./audio.mjs";
import {generateNarration} from "./kokoro.mjs";
import {narrationEnvironment} from "./narration-preset.mjs";
import {requiresHumanVoice,prepareHumanNarration} from "./human-narration.mjs";

const base=(process.env.CONTENT_VIDEO_API_BASE_URL||"").replace(/\/$/,"");
const token=process.env.VIDEO_WORKER_TOKEN;
const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if(!base||!token||!supabaseUrl||!anonKey)throw new Error("Missing worker API, token or Supabase configuration.");
if(!base.startsWith("https://")&&!base.startsWith("http://localhost:"))throw new Error("Worker API must use HTTPS.");
const headers={Authorization:`Bearer ${token}`};
const storage=createClient(supabaseUrl,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
async function jobRequest(method,payload) {
  const response=await fetch(base+"/api/internal/content-video",{
    method,headers:{...headers,...(payload?{"Content-Type":"application/json"}:{})},
    body:payload?JSON.stringify(payload):undefined,signal:AbortSignal.timeout(25000),
  });
  if(!response.ok)throw new Error(`Worker endpoint failed with HTTP ${response.status}`);
  return response.json();
}
function runCli(args){
  return new Promise((resolvePromise,rejectPromise)=>{
    const proc=spawn(process.platform==="win32"?"npx.cmd":"npx",["remotion","render",...args],{
      cwd:resolve(import.meta.dirname),stdio:"inherit",env:{...process.env,REMOTION_NO_COLOR:"1"},
    });
    proc.on("error",rejectPromise);
    proc.on("close",code=>code===0?resolvePromise():rejectPromise(new Error(`Remotion exited ${code}`)));
  });
}
async function processJob(job){
  const dir=await mkdtemp(join(tmpdir(),"liberty-video-"));
  const publicDirectory=resolve(import.meta.dirname,"public");
  const narrationPath=join(publicDirectory,"narration.mp3");
  const target=join(dir,"clip.mp4"),propsPath=join(dir,"props.json");
  try{
    await mkdir(publicDirectory,{recursive:true});
    await Promise.all(["narration.mp3","background.mp3","background.wav"].map(name=>rm(join(publicDirectory,name),{force:true})));
    const human=requiresHumanVoice(job.id,process.env.HUMAN_VOICEOVER_VIDEO_ID);
    if(human) {
      await prepareHumanNarration({
        url:process.env.HUMAN_VOICEOVER_URL,
        supabaseUrl,
        outputPath:narrationPath,
      });
    } else {
      await generateNarration({text:job.script,outputPath:narrationPath,env:narrationEnvironment(job.id)});
    }
    const timing=await fitNarrationToDuration(narrationPath,job.durationSeconds);
    console.log(human?"Verified the supplied human recording, with no TTS synthesis.":"Narration generated through Kokoro.");
    const musicFile=await provisionBackgroundMusic({
      durationSeconds:job.durationSeconds,
      publicDirectory,
      trackPath:process.env.VIDEO_BACKGROUND_MUSIC_PATH,
    });
    await writeFile(propsPath,JSON.stringify({
      hook:job.hook,durationSeconds:job.durationSeconds,scenes:job.scenes,
      withNarration:true,musicFile,musicVolume:parseMusicVolume(process.env.VIDEO_MUSIC_VOLUME),
    }));
    console.log(`Narration prepared (${timing.after.toFixed(1)}s for ${job.durationSeconds}s video).`);
    await runCli(["src/index.ts","LibertyShort",target,"--props",propsPath,"--codec","h264","--crf","20"]);
    const video=await readFile(target);
    if(video.length<1024)throw new Error("Rendered MP4 is empty.");
    await verifyRenderedVideoAudio(target);
    const {error}=await storage.storage.from("content-videos").uploadToSignedUrl(job.upload.path,job.upload.token,video,{
      contentType:"video/mp4",
    });
    if(error)throw new Error(`Upload failed: ${error.message}`);
    await jobRequest("POST",{action:"complete",id:job.id,attemptCount:job.attemptCount,storagePath:job.upload.path});
    console.log(`Job ${job.id} rendered and uploaded (${video.length} bytes)`);
  }finally{
    await rm(dir,{recursive:true,force:true});
    await Promise.all(["narration.mp3","background.mp3","background.wav"].map(name=>rm(join(publicDirectory,name),{force:true})));
  }
}
const {job}=await jobRequest("GET");
if(!job){console.log("No queued videos.");process.exit(0);}
try{await processJob(job);}catch(error){
  const message=error instanceof Error?error.message:String(error);
  console.error(`Job ${job.id} failed: ${message}`);
  try{await jobRequest("POST",{action:"fail",id:job.id,attemptCount:job.attemptCount,error:message});}catch(e){console.error("Could not report failure:",String(e));}
  process.exitCode=1;
}
