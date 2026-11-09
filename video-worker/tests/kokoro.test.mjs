import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {splitSpeechText, generateNarration, selectVoice, selectSpeed, KOKORO_MODEL} from '../kokoro.mjs';
import {probeDurationSeconds} from '../audio.mjs';

const run = promisify(execFile);
const makeDir = () => mkdtemp(join(tmpdir(),'liberty-kokoro-test-'));

async function tone(path, seconds = 0.65) {
  await run('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','sine=frequency=410:sample_rate=24000','-t',String(seconds),'-ac','1','-c:a','pcm_s16le',path]);
}

test('splits long narration into bounded chunks without losing words',()=>{
  const input = 'Check your passport. '.repeat(45) + 'This final sentence should be included.';
  const pieces=splitSpeechText(input,280);
  assert.ok(pieces.length>=3);
  assert.ok(pieces.every(piece=>piece.length<=280 && piece.trim()===piece));
  assert.equal(pieces.join(' ').replace(/\s+/g,' '),input.trim().replace(/\s+/g,' '));
});

test('handles an exceptionally long sentence and rejects an empty one',()=>{
  assert.deepEqual(splitSpeechText('   \n '),[]);
  const pieces=splitSpeechText(Array(100).fill('preparation').join(' '),120);
  assert.ok(pieces.length>3);
  assert.ok(pieces.every(piece=>piece.length<=120));
});

test('chooses a supported free voice and rejects unknown voice identifiers',()=>{
  assert.equal(selectVoice({}), 'af_heart');
  assert.equal(selectVoice({KOKORO_VOICE:'bf_emma'}), 'bf_emma');
  assert.throws(()=>selectVoice({KOKORO_VOICE:'untrusted-voice'}),/KOKORO_VOICE/);
  assert.equal(KOKORO_MODEL,'onnx-community/Kokoro-82M-v1.0-ONNX');
  assert.equal(selectSpeed({}),1);
  assert.equal(selectSpeed({KOKORO_SPEED:"0.98"}),0.98);
  assert.throws(()=>selectSpeed({KOKORO_SPEED:"0.4"}),/KOKORO_SPEED/);
});

test('requires non-empty narration without loading any models',async()=>{
  const dir=await makeDir();
  try {
    await assert.rejects(generateNarration({text:' ',outputPath:join(dir,'narration.mp3'),loadModel:()=>{throw Error('unexpected load');}}),/Narration script is empty/);
  } finally {await rm(dir,{recursive:true,force:true});}
});

test('generates local narration chunks and combines them into a playable MP3',async()=>{
  const dir=await makeDir();
  try {
    const voice='bf_emma';
    let loadCount=0;
    const requests=[];
    const wav=join(dir,'sample.wav');
    await tone(wav);
    const original = await readFile(wav);
    const fakeModel={generate:async(text,options)=>{
      requests.push({text,voice:options.voice,speed:options.speed});
      return {save:async(path)=>writeFile(path,original)};
    }};
    const target=join(dir,'narration.mp3');
    await generateNarration({text:'Review your identity documents carefully. '.repeat(22),outputPath:target,
      env:{KOKORO_VOICE:voice},loadModel:async(model,config)=>{
        loadCount++;
        assert.equal(model,KOKORO_MODEL);
        assert.deepEqual(config,{dtype:'q8',device:'cpu'});
        return fakeModel;
      }});
    assert.equal(loadCount,1);
    assert.ok(requests.length>1);
    assert.ok(requests.every(item=>item.voice===voice&&item.speed===1));
    assert.ok((await probeDurationSeconds(target))>requests.length*0.55);
    const result = await readFile(target);
    assert.ok(result.length>1000);
  } finally {await rm(dir,{recursive:true,force:true});}
});

test('failed model inference does not produce a success-shaped MP3',async()=>{
  const dir=await makeDir();
  try {
    const target=join(dir,'narration.mp3');
    await assert.rejects(generateNarration({text:'Something about document preparation.',outputPath:target,
      loadModel:async()=>({generate:async()=>{throw Error('runtime failure');}})}),/Kokoro narration failed.*runtime failure/);
    await assert.rejects(readFile(target),{code:'ENOENT'});
  } finally {await rm(dir,{recursive:true,force:true});}
});

test('rejects Kokoro output containing only silence before it can be mixed with music',async()=>{
  const dir=await makeDir();
  try {
    const source=join(dir,'silent.wav');
    await run('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','lavfi','-i','anullsrc=channel_layout=mono:sample_rate=24000','-t','0.8','-c:a','pcm_s16le',source]);
    const bytes=await readFile(source);
    const destination=join(dir,'narration.mp3');
    await assert.rejects(generateNarration({text:'Please verify your documents.',outputPath:destination,
      loadModel:async()=>({generate:async()=>({save:async(path)=>writeFile(path,bytes)})})}),/silent/i);
    await assert.rejects(readFile(destination),{code:'ENOENT'});
  } finally {await rm(dir,{recursive:true,force:true});}
});
