import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const worker=readFileSync(new URL("../worker.mjs",import.meta.url),"utf8");
const composition=readFileSync(new URL("../src/short.tsx",import.meta.url),"utf8");

test("worker cannot silently render without required narration",()=>{
  assert.match(worker,/await generateNarration\(/);
  assert.doesNotMatch(worker,/requestNarration|ELEVENLABS_API_KEY|ELEVENLABS_VOICE_ID/);
  assert.match(worker,/await fitNarrationToDuration\(/);
  assert.match(worker,/await verifyRenderedVideoAudio\(target\)/);
  assert.match(worker,/withNarration:true/);
  assert.doesNotMatch(worker,/if\(!apiKey\|\|!voiceId\)return false/);
});

test("worker supplies original music to Remotion and removes temporary assets",()=>{
  assert.match(worker,/await provisionBackgroundMusic\(/);
  assert.match(worker,/withNarration:true,musicFile,musicVolume/);
  assert.match(worker,/"background\.wav"/);
  assert.match(composition,/<Audio src=\{staticFile\(musicFile\)\} loop loopVolumeCurveBehavior="extend" volume=/);
  assert.match(composition,/<Audio src=\{staticFile\("narration\.mp3"\)\} volume=\{1\}/);
});

test("CI exercises real Kokoro synthesis and the automatic worker schedule",()=>{
  const ci=readFileSync(new URL("../../.github/workflows/content-studio-ci.yml",import.meta.url),"utf8");
  const workflow=readFileSync(new URL("../../.github/workflows/content-video-worker.yml",import.meta.url),"utf8");
  const smoke=readFileSync(new URL("../scripts/audio-smoke.mjs",import.meta.url),"utf8");
  assert.match(ci,/AUDIO_SMOKE_REAL_TTS: "1"/);
  assert.match(ci,/sudo apt-get install -y ffmpeg/);
  assert.match(workflow,/sudo apt-get install -y ffmpeg/);
  assert.match(smoke,/await generateNarration\(/);
  assert.match(smoke,/verifyRenderedVideoAudio\(/);
  assert.match(workflow,/cron: "7,22,37,52 \\* \\* \\* \\*"/);
  assert.match(workflow,/^  push:\n    branches: \[main\]\n    paths:\n      - "\.github\/workflows\/content-video-worker\.yml"/m);
});
