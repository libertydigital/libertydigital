import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,readFile,stat,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {
  fitNarrationToDuration, probeDurationSeconds,
  createAmbientMusic, provisionBackgroundMusic, parseMusicVolume,
} from "../audio.mjs";

const exec = promisify(execFile);
const makeDir = () => mkdtemp(join(tmpdir(), "liberty-audio-test-"));

async function createTone(file, seconds) {
  await exec("ffmpeg",["-hide_banner","-loglevel","error","-y","-f","lavfi", "-i","sine=frequency=440:sample_rate=44100", "-t",String(seconds),"-codec:a","libmp3lame",file]);
}

test("narration is tempo-fitted to prevent the end being cut off",async()=>{
  const dir=await makeDir();
  try {
    const file=join(dir,"narration.mp3");
    await createTone(file,3.5);
    await fitNarrationToDuration(file,3.5); // 0.5s reserved at end; mild speed-up.
    assert.ok((await probeDurationSeconds(file))<=3.15);
  } finally {await rm(dir,{recursive:true,force:true});}
});

test("narration within allowed duration is kept unchanged",async()=>{
  const dir=await makeDir();
  try {
    const file=join(dir,"narration.mp3");
    await createTone(file,1);
    const before=await readFile(file);
    const result=await fitNarrationToDuration(file,3);
    assert.equal(result.tempo,1);
    assert.deepEqual(await readFile(file),before);
  } finally {await rm(dir,{recursive:true,force:true});}
});

test("extremely long narration fails clearly instead of being cut off",async()=>{
  const dir=await makeDir();
  try {
    const file=join(dir,"narration.mp3");
    await createTone(file,4);
    await assert.rejects(fitNarrationToDuration(file,2.5),/too long.*shorten/i);
  } finally {await rm(dir,{recursive:true,force:true});}
});

function rms(buffer,startSec,endSec,sampleRate=32000) {
  let sum=0, count=0;
  for(let i=Math.round(startSec*sampleRate);i<Math.round(endSec*sampleRate);i++){
    const sample=buffer.readInt16LE(44+i*2)/32768;
    sum+=sample*sample;
    count++;
  }
  return Math.sqrt(sum/count);
}

test("original music bed is audible, deterministic and fades at both ends",async()=>{
  const dir=await makeDir();
  try {
    const file=join(dir,"music.wav"),file2=join(dir,"music2.wav");
    await createAmbientMusic({durationSeconds:8,outputPath:file});
    await createAmbientMusic({durationSeconds:8,outputPath:file2});
    const bytes=await readFile(file);
    assert.equal(bytes.toString("ascii",0,4),"RIFF");
    assert.equal(bytes.toString("ascii",8,12),"WAVE");
    assert.equal(bytes.length,44+8*32000*2);
    assert.ok(rms(bytes,2,4)>0.01,"music must be non-silent");
    assert.ok(rms(bytes,0,0.2)<rms(bytes,2,4)*0.5,"opening must fade in");
    assert.ok(rms(bytes,7.8,8)<rms(bytes,2,4)*0.5,"end must fade out");
    assert.deepEqual(bytes,await readFile(file2));
  } finally {await rm(dir,{recursive:true,force:true});}
});

test("background music accepts a local supplied track and rejects unsupported extensions",async()=>{
  const dir=await makeDir();
  try {
    const supplied=join(dir,"licensed.mp3");
    await createTone(supplied,1);
    const out=join(dir,"public");
    assert.equal(await provisionBackgroundMusic({durationSeconds:3,publicDirectory:out,trackPath:supplied}),"background.mp3");
    assert.ok((await stat(join(out,"background.mp3"))).size>1000);
    await assert.rejects(provisionBackgroundMusic({durationSeconds:3,publicDirectory:out,trackPath:join(dir,"bad.txt")}),/MP3 or WAV/);
  } finally {await rm(dir,{recursive:true,force:true});}
});

test("default music provisioning creates an original soundtrack for the full clip",async()=>{
  const dir=await makeDir();
  try {
    const publicDirectory=join(dir,"public");
    assert.equal(await provisionBackgroundMusic({durationSeconds:3,publicDirectory}),"background.wav");
    assert.ok((await probeDurationSeconds(join(publicDirectory,"background.wav")))>=3);
  } finally {await rm(dir,{recursive:true,force:true});}
});

test("music volume defaults conservatively and rejects invalid settings",()=>{
  assert.equal(parseMusicVolume(undefined),0.14);
  assert.equal(parseMusicVolume("0.2"),0.2);
  assert.equal(parseMusicVolume("0"),0);
  assert.throws(()=>parseMusicVolume("1.2"),/VIDEO_MUSIC_VOLUME/);
  assert.throws(()=>parseMusicVolume("foo"),/VIDEO_MUSIC_VOLUME/);
});
