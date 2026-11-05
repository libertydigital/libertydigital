import assert from "node:assert/strict";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {mkdtemp,mkdir,readFile,rm,writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {dirname,join,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {createAmbientMusic, verifyRenderedVideoAudio} from "../audio.mjs";
import {generateNarration} from "../kokoro.mjs";

const run=promisify(execFile);
const worker=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const publicDir=join(worker,"public");
const dir=await mkdtemp(join(tmpdir(),"liberty-render-smoke-"));
try {
  await mkdir(publicDir,{recursive:true});
  const music=join(publicDir,"background.wav");
  const narration=join(publicDir,"narration.mp3");
  await createAmbientMusic({durationSeconds:32,outputPath:music});
  if (process.env.AUDIO_SMOKE_REAL_TTS === "1") {
    await generateNarration({text:"Check your identity documents before your appointment.",outputPath:narration});
  } else {
    // Fast deterministic test tone for renderer regressions.
    await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-f","lavfi","-i","sine=frequency=220:sample_rate=44100","-t","3","-c:a","libmp3lame",narration]);
  }
  const props={...JSON.parse(await readFile(join(worker,"demo.json"),"utf8")),withNarration:true,musicFile:"background.wav",musicVolume:0.14};
  const propsFile=join(dir,"props.json"),videoFile=join(dir,"smoke.mp4");
  await writeFile(propsFile,JSON.stringify(props));
  await run(process.platform==="win32"?"npx.cmd":"npx",["remotion","render","src/index.ts","LibertyShort",videoFile,"--props",propsFile,"--frames","0-149"],{cwd:worker,timeout:240000,maxBuffer:2_000_000});
  await verifyRenderedVideoAudio(videoFile);
  const {stdout}=await run("ffprobe",["-v","error","-show_entries","stream=codec_type","-of","csv=p=0",videoFile]);
  const streams=stdout.trim().split(/\s+/);
  assert.ok(streams.includes("audio"),"Rendered MP4 must include an audio stream");
  assert.ok(streams.includes("video"),"Rendered MP4 must include a video stream");
  const {stderr}=await run("ffmpeg",["-hide_banner","-i",videoFile,"-map","0:a:0","-af","volumedetect","-f","null","-"],{timeout:30000});
  const measured=stderr.match(/mean_volume:\s*(-?[\d.]+) dB/);
  assert.ok(measured,"MP4 must have measurable audio volume");
  assert.ok(Number(measured[1])>-65,"MP4 audio must not be effectively silent");
  console.log(`Audio smoke PASS (${process.env.AUDIO_SMOKE_REAL_TTS === "1" ? "real Kokoro" : "test tone"}): MP4 contains video and audible audio stream.`);
} finally {
  await rm(dir,{recursive:true,force:true});
  await Promise.all(["background.wav","narration.mp3"].map(name=>rm(join(publicDir,name),{force:true})));
}
