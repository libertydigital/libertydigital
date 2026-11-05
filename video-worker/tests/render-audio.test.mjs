import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {verifyRenderedVideoAudio} from '../audio.mjs';

const run=promisify(execFile);
async function fixture(name,audioKind){
  const dir=await mkdtemp(join(tmpdir(),'liberty-render-audio-'));
  const output=join(dir,name);
  const args=['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','color=c=black:s=160x284:r=15'];
  if(audioKind==='tone')args.push('-f','lavfi','-i','sine=frequency=500:sample_rate=24000');
  else if(audioKind==='silent')args.push('-f','lavfi','-i','anullsrc=channel_layout=mono:sample_rate=24000');
  args.push('-t','1','-c:v','mpeg4','-q:v','10');
  if(audioKind)args.push('-c:a','aac','-b:a','96k');
  args.push(output);
  await run('ffmpeg',args);
  return {dir,output};
}

test('accepts a rendered MP4 only if it has measurable audible audio',async()=>{
  const {dir,output}=await fixture('tone.mp4','tone');
  try { await assert.doesNotReject(verifyRenderedVideoAudio(output)); }
  finally {await rm(dir,{recursive:true,force:true});}
});

test('rejects a rendered MP4 without any audio stream',async()=>{
  const {dir,output}=await fixture('mute.mp4',null);
  try {await assert.rejects(verifyRenderedVideoAudio(output),/audio stream/i);}
  finally {await rm(dir,{recursive:true,force:true});}
});

test('rejects a rendered MP4 whose audio stream is silence',async()=>{
  const {dir,output}=await fixture('silent.mp4','silent');
  try {await assert.rejects(verifyRenderedVideoAudio(output),/silent/i);}
  finally {await rm(dir,{recursive:true,force:true});}
});
