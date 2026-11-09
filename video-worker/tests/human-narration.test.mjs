import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,rm,readFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {requiresHumanVoice,prepareHumanNarration} from "../human-narration.mjs";

const run=promisify(execFile);
const SUPABASE_URL="https://example.supabase.co";
const signedUrl=SUPABASE_URL+"/storage/v1/object/sign/content-videos/voiceovers/demo.mp3?token=test";

test("only the exact configured video is assigned a human voice",()=>{
  assert.equal(requiresHumanVoice("job-one","job-one"),true);
  assert.equal(requiresHumanVoice("job-two","job-one"),false);
  assert.equal(requiresHumanVoice("job-one",""),false);
});

test("rejects missing audio rather than silently generating an AI voice",async()=>{
  await assert.rejects(prepareHumanNarration({url:"",supabaseUrl:SUPABASE_URL,outputPath:"ignored.mp3"}),/Human narration URL missing/);
});

test("refuses non-HTTPS, foreign hosts, public links and unsigned URLs",async()=>{
  for(const url of [
    "http://example.supabase.co/storage/v1/object/sign/content-videos/a.mp3?token=x",
    "https://another.supabase.co/storage/v1/object/sign/content-videos/a.mp3?token=x",
    "https://example.supabase.co/storage/v1/object/public/content-videos/a.mp3",
    "https://example.supabase.co/storage/v1/object/sign/content-videos/a.mp3",
  ])await assert.rejects(prepareHumanNarration({url,supabaseUrl:SUPABASE_URL,outputPath:"ignored.mp3"}),/private signed HTTPS/);
});

test("downloads a signed human audio input, validates it and transcodes to MP3 without TTS",async()=>{
  const dir=await mkdtemp(join(tmpdir(),"liberty-human-narration-test-"));
  try {
    const fixture=join(dir,"human-input.wav");
    await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-f","lavfi",
      "-i","sine=frequency=460:duration=1.5:sample_rate=24000",fixture]);
    const bytes=await readFile(fixture);
    let called=0;
    const request=async(input,options)=>{
      called++;
      assert.equal(input,signedUrl);
      assert.equal(options.redirect,"error");
      return new Response(bytes,{status:200,headers:{"content-length":String(bytes.length)}});
    };
    const output=join(dir,"narration.mp3");
    const seconds=await prepareHumanNarration({url:signedUrl,supabaseUrl:SUPABASE_URL,outputPath:output,request});
    assert.equal(called,1);
    assert.ok(seconds>1 && seconds<2);
    assert.ok((await readFile(output)).length>1024);
  } finally {await rm(dir,{recursive:true,force:true});}
});
