import {writeFile, rm} from "node:fs/promises";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {probeDurationSeconds,verifyAudioHasSound} from "./audio.mjs";

const run=promisify(execFile);
const MAX_VOICE_BYTES=20*1024*1024;

/** Configure only one video to use an independently recorded human voice. */
export function requiresHumanVoice(jobId, requiredId) {
  return Boolean(requiredId && jobId===requiredId);
}

/**
 * Download a human recording from a PRIVATE, short-lived signed Supabase Storage URL.
 * No text-to-speech or voice-cloning services are called in this code path.
 * The owner must confirm that the recording was made by a human narrator.
 */
export async function prepareHumanNarration({
  url, supabaseUrl, outputPath, request=fetch,
}) {
  if(!url?.trim())throw new Error("Human narration URL missing: upload a real voice recording and configure HUMAN_VOICEOVER_URL before queuing.");
  let source,project;
  try {source=new URL(url);project=new URL(supabaseUrl);}
  catch {throw new Error("Invalid human narration URL or Supabase project URL.");}
  if(source.protocol!=="https:" || source.origin!==project.origin ||
     source.username || source.password ||
     !source.pathname.startsWith("/storage/v1/object/sign/content-videos/") ||
     !source.searchParams.has("token")) {
    throw new Error("Human narration must use a private signed HTTPS content-videos URL from this Supabase project.");
  }
  const response=await request(source.toString(),{
    method:"GET",redirect:"error",cache:"no-store",signal:AbortSignal.timeout(30000),
  });
  if(!response.ok)throw new Error(`Human narration download failed (HTTP ${response.status}). Refresh its signed URL.`);
  const declaredSize=Number(response.headers.get("content-length")||0);
  if(declaredSize>MAX_VOICE_BYTES)throw new Error("Human narration recording exceeds 20 MB.");
  if(!response.body)throw new Error("Human narration download returned no body.");
  const chunks=[];let size=0;
  for await (const chunk of response.body) {
    size+=chunk.byteLength;
    if(size>MAX_VOICE_BYTES)throw new Error("Human narration recording exceeds 20 MB.");
    chunks.push(Buffer.from(chunk));
  }
  if(size<512)throw new Error("Human narration recording is empty or invalid.");
  const sourceFile=outputPath+".input";
  try {
    await writeFile(sourceFile,Buffer.concat(chunks));
    await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",sourceFile,
      "-map","0:a:0","-vn","-ar","44100","-c:a","libmp3lame","-b:a","160k",outputPath],
      {timeout:60000,maxBuffer:1024*1024});
    await verifyAudioHasSound(outputPath);
    return await probeDurationSeconds(outputPath);
  } catch(error) {
    throw new Error(`Human narration audio could not be used: ${error instanceof Error?error.message:"invalid audio"}`);
  } finally {
    await rm(sourceFile,{force:true});
  }
}
