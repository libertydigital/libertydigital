import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,readFile,rm,writeFile} from "node:fs/promises";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {generateTimedSceneNarration} from "../kokoro.mjs";
import {probeDurationSeconds} from "../audio.mjs";
const run=promisify(execFile);
test("one model load pads audible narration to scene boundaries",async()=>{
  const dir=await mkdtemp(join(tmpdir(),"liberty-scenes-"));
  try{
    const sample=join(dir,"tone.wav"),out=join(dir,"narration.mp3");
    await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-f","lavfi",
      "-i","sine=frequency=480:sample_rate=24000","-t","0.8","-ac","1","-c:a","pcm_s16le",sample]);
    const bytes=await readFile(sample);
    let loads=0,calls=0;
    const result=await generateTimedSceneNarration({scenes:[
      {caption:"First",narration:"Review documents.",seconds:3},
      {caption:"Second",narration:"Confirm details.",seconds:4}],outputPath:out,
      loadModel:async()=>{loads++;return {generate:async()=>{calls++;return {save:async(path)=>writeFile(path,bytes)};}};}});
    assert.equal(loads,1);
    assert.equal(calls,2);
    assert.equal(result.totalSeconds,7);
    assert.equal(result.speechSeconds.length,2);
    assert.ok(result.speechSeconds.every(s=>s>0.5&&s<2));
    assert.ok(Math.abs((await probeDurationSeconds(out))-7)<0.3);
  }finally{await rm(dir,{recursive:true,force:true});}
});
