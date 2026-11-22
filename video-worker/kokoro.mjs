import {mkdtemp, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {probeDurationSeconds, verifyAudioHasSound,fitNarrationToDuration} from './audio.mjs';

const run=promisify(execFile);
export const KOKORO_MODEL='onnx-community/Kokoro-82M-v1.0-ONNX';
const voices=new Set(['af_heart','af_bella','af_sarah','af_nicole','bf_emma','bf_isabella','bm_george','bm_fable','am_michael','am_fenrir']);
const CHUNK_LIMIT=280;

export function selectVoice(env=process.env) {
  const voice=(env.KOKORO_VOICE || 'af_heart').trim();
  if (!voices.has(voice)) throw new Error('KOKORO_VOICE must be a supported English Kokoro voice (e.g. af_heart, bf_emma, bm_george).');
  return voice;
}
export function selectSpeed(env=process.env) {
  const raw=env.KOKORO_SPEED;
  if(raw===undefined || raw==="")return 1;
  const speed=Number(raw);
  if(!Number.isFinite(speed)||speed<0.9||speed>1.15)throw new Error("KOKORO_SPEED must be between 0.9 and 1.15.");
  return speed;
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
  const speed=selectSpeed(env);
  const chunks=splitSpeechText(text);
  const directory=await mkdtemp(join(tmpdir(),'liberty-kokoro-'));
  try {
    const tts=await loadModel(KOKORO_MODEL,{dtype:'q8',device:'cpu'});
    const files=[];
    for(let index=0;index<chunks.length;index++) {
      const wav=join(directory,`${String(index).padStart(3,'0')}.wav`);
      const audio=await tts.generate(chunks[index],{voice,speed});
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

/** Build a single MP3 whose speech starts at each scene boundary. Reuse one TTS model. */
export async function generateTimedSceneNarration({scenes,outputPath,env=process.env,loadModel=loadDefaultModel}) {
  if(!Array.isArray(scenes)||scenes.length<2||scenes.length>8||
      scenes.some(s=>!Number.isInteger(s.seconds)||s.seconds<2||s.seconds>20||
      typeof (s.narration||s.caption)!=="string"||!(s.narration||s.caption).trim()))
    throw new Error("Timed narration needs valid scene speech and durations.");
  const voice=selectVoice(env),speed=selectSpeed(env);
  const directory=await mkdtemp(join(tmpdir(),"liberty-scene-tts-"));
  try {
    const model=await loadModel(KOKORO_MODEL,{dtype:"q8",device:"cpu"});
    const padded=[],timings=[];
    for(let i=0;i<scenes.length;i++){
      const part=scenes[i],segments=splitSpeechText(part.narration||part.caption),wavs=[];
      for(let j=0;j<segments.length;j++){
        const path=join(directory,"chunk-"+i+"-"+j+".wav");
        const audio=await model.generate(segments[j],{voice,speed});
        if(!audio||typeof audio.save!=="function")throw new Error("Scene audio missing.");
        await audio.save(path);
        const bytes=await readFile(path);
        if(bytes.length<1024||bytes.toString("ascii",0,4)!=="RIFF"||bytes.toString("ascii",8,12)!=="WAVE")
          throw new Error("Invalid scene narration WAV.");
        await verifyAudioHasSound(path);
        wavs.push(path);
      }
      const list=join(directory,"chunks-"+i+".txt");
      await writeFile(list,wavs.map(path=>"file '"+path.replaceAll("'","'\\''")+"'").join("\n")+"\n");
      const speech=join(directory,"speech-"+i+".mp3");
      await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",list,
        "-ar","24000","-ac","1","-c:a","libmp3lame","-q:a","3",speech],{timeout:60000});
      const fitted=await fitNarrationToDuration(speech,part.seconds);
      timings.push(Number(fitted.after.toFixed(3)));
      const paddedPath=join(directory,"padded-"+i+".wav");
      await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",speech,"-af","apad",
        "-t",String(part.seconds),"-ar","24000","-ac","1","-c:a","pcm_s16le",paddedPath],{timeout:60000});
      padded.push(paddedPath);
    }
    const list=join(directory,"scenes.txt");
    await writeFile(list,padded.map(path=>"file '"+path.replaceAll("'","'\\''")+"'").join("\n")+"\n");
    await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",list,
      "-ar","24000","-ac","1","-c:a","libmp3lame","-q:a","3",outputPath],{timeout:90000});
    await verifyAudioHasSound(outputPath);
    const totalSeconds=scenes.reduce((sum,s)=>sum+s.seconds,0);
    if(Math.abs((await probeDurationSeconds(outputPath))-totalSeconds)>0.3)
      throw new Error("Timed audio duration mismatch.");
    return {speechSeconds:timings,totalSeconds};
  }catch(error){
    await rm(outputPath,{force:true});
    throw new Error("Scene narration failed: "+(error instanceof Error?error.message:String(error)));
  }finally{await rm(directory,{recursive:true,force:true});}
}
