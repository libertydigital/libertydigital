import {readFile,writeFile,mkdir,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {spawn} from "node:child_process";
import {createClient} from "@supabase/supabase-js";

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
async function makeNarration(text,file) {
  const apiKey=process.env.ELEVENLABS_API_KEY, voiceId=process.env.ELEVENLABS_VOICE_ID;
  if(!apiKey||!voiceId)return false;
  const response=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,{
    method:"POST",headers:{"xi-api-key":apiKey,"Content-Type":"application/json",Accept:"audio/mpeg"},
    body:JSON.stringify({text,model_id:"eleven_multilingual_v2"}),signal:AbortSignal.timeout(90000),
  });
  if(!response.ok)throw new Error(`Voice provider error HTTP ${response.status}`);
  await writeFile(file,Buffer.from(await response.arrayBuffer()));
  return true;
}
async function processJob(job){
  const dir=await import("node:fs/promises").then(fs=>fs.mkdtemp(join(tmpdir(),"liberty-video-")));
  const publicPath=resolve(import.meta.dirname,"public","narration.mp3");
  const target=join(dir,"clip.mp4"),propsPath=join(dir,"props.json");
  try{
    await mkdir(resolve(import.meta.dirname,"public"),{recursive:true});
    await rm(publicPath,{force:true});
    const hasVoice=await makeNarration(job.script,publicPath);
    await writeFile(propsPath,JSON.stringify({
      hook:job.hook,durationSeconds:job.durationSeconds,scenes:job.scenes,withNarration:hasVoice,
    }));
    await runCli(["src/index.ts","LibertyShort",target,"--props",propsPath,"--codec","h264","--crf","20"]);
    const video=await readFile(target);
    if(video.length<1024)throw new Error("Rendered MP4 is empty.");
    const {error}=await storage.storage.from("content-videos").uploadToSignedUrl(job.upload.path,job.upload.token,video,{
      contentType:"video/mp4",
    });
    if(error)throw new Error(`Upload failed: ${error.message}`);
    await jobRequest("POST",{action:"complete",id:job.id,storagePath:job.upload.path});
    console.log(`Job ${job.id} rendered and uploaded (${video.length} bytes)`);
  }finally{
    await rm(dir,{recursive:true,force:true});
    await rm(publicPath,{force:true});
  }
}
const {job}=await jobRequest("GET");
if(!job){console.log("No queued videos.");process.exit(0);}
try{await processJob(job);}catch(error){
  const message=error instanceof Error?error.message:String(error);
  console.error(`Job ${job.id} failed: ${message}`);
  try{await jobRequest("POST",{action:"fail",id:job.id,error:message});}catch(e){console.error("Could not report failure:",String(e));}
  process.exitCode=1;
}
