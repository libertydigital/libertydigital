import {mkdtemp, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {probeDurationSeconds, verifyAudioHasSound} from './audio.mjs';

const run=promisify(execFile);
export const KOKORO_MODEL='onnx-community/Kokoro-82M-v1.0-ONNX';
const voices=new Set(['af_heart','af_bella','af_sarah','af_nicole','bf_emma','bf_isabella','bm_george','bm_fable','am_michael','am_fenrir']);
const CHUNK_LIMIT=280;

export function selectVoice(env=process.env) {
  const voice=(env.KOKORO_VOICE || 'af_heart').trim();
  if (!voices.has(voice)) throw new Error('KOKORO_VOICE must be a supported English Kokoro voice (e.g. af_heart, bf_emma, bm_george).');
  return voice;
}

/** Kokoro limits phonemes per inference. Bound each call and preserve all words. */
export function splitSpeechText(input,maxCharacters=CHUNK_LIMIT) {
  if (typeof input!=='string') return [];
  const normalized=input.replace(/\s+/g,' ').trim();
  if (!normalized) return [];
  if (!Number.isInteger(maxCharacters) || maxCharacters<20 || maxCharacters>400) throw new Error('Invalid narration chunk size.');
  const pieces=[];
  let current='';
  const flush=()=>{if(current){pieces.push(current);current='';}};
  for (const token of normalized.split(' ')) {
    let remaining=token;
    while (remaining) {
      const space=current?' ':'';
      const room=maxCharacters-current.length-space.length;
      if (room===0) {flush();continue;}
      if (remaining.length<=room) {
        current+=space+remaining;
        remaining='';
      } else if (current) {
        flush();
      } else {
        pieces.push(remaining.slice(0,maxCharacters));
        remaining=remaining.slice(maxCharacters);
      }
    }
    if (/[.!?]$/.test(token) && current.length>=120) flush();
  }
  flush();
  return pieces;
}

const loadDefaultModel=async(model,options)=>{
  const {KokoroTTS}=await import('kokoro-js');
  return KokoroTTS.from_pretrained(model,options);
};

/** Synthesize MP3 locally. The model downloads once into the runner cache on first use. */
export async function generateNarration({text,outputPath,env=process.env,loadModel=loadDefaultModel}) {
  if (typeof text!=='string' || !text.trim()) throw new Error('Narration script is empty.');
  const voice=selectVoice(env);
  const chunks=splitSpeechText(text);
  const directory=await mkdtemp(join(tmpdir(),'liberty-kokoro-'));
  try {
    const tts=await loadModel(KOKORO_MODEL,{dtype:'q8',device:'cpu'});
    const files=[];
    for(let index=0;index<chunks.length;index++) {
      const wav=join(directory,`${String(index).padStart(3,'0')}.wav`);
      const audio=await tts.generate(chunks[index],{voice});
      if (!audio || typeof audio.save!=='function') throw new Error('Kokoro generated no WAV data.');
      await audio.save(wav);
      const bytes=await readFile(wav);
      if (bytes.length<1024 || bytes.toString('ascii',0,4)!=='RIFF' || bytes.toString('ascii',8,12)!=='WAVE') {
        throw new Error('Kokoro generated empty or invalid WAV data.');
      }
      if ((await probeDurationSeconds(wav))<=0) throw new Error('Kokoro generated silent or invalid audio.');
      await verifyAudioHasSound(wav);
      files.push(wav);
    }
    const listFile=join(directory,'clips.txt');
    // The file names are generated in our private temporary directory, not user input.
    await writeFile(listFile,files.map(file=>`file '${file.replaceAll("'","'\\''")}'`).join('\n')+'\n');
    await run('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',listFile,
      '-ar','24000','-ac','1','-c:a','libmp3lame','-q:a','3',outputPath],{timeout:180000});
    if ((await stat(outputPath)).size<1024 || (await probeDurationSeconds(outputPath))<=0) {
      throw new Error('Kokoro generated an empty MP3.');
    }
    await verifyAudioHasSound(outputPath);
  } catch(error) {
    await rm(outputPath,{force:true});
    throw new Error(`Kokoro narration failed: ${error instanceof Error?error.message:String(error)}`);
  } finally {
    await rm(directory,{recursive:true,force:true});
  }
}
