import {copyFile, mkdir, rename, rm, writeFile} from "node:fs/promises";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {extname, join, resolve} from "node:path";

const run = promisify(execFile);
const sampleRate = 32000;

export function parseMusicVolume(raw) {
  if (raw === undefined || raw === "") return 0.14;
  const volume = Number(raw);
  if (!Number.isFinite(volume) || volume < 0 || volume > 1) {
    throw new Error("VIDEO_MUSIC_VOLUME must be a number between 0 and 1.");
  }
  return volume;
}

export async function probeDurationSeconds(file) {
  let output;
  try {
    ({stdout:output} = await run("ffprobe",["-v","error","-show_entries","format=duration",
      "-of","default=noprint_wrappers=1:nokey=1",file],{timeout:15000}));
  } catch {
    throw new Error("Cannot read audio duration: ffprobe is required and the audio must be valid.");
  }
  const duration = Number(output.trim());
  if (!Number.isFinite(duration) || duration <= 0) throw new Error("Audio file has invalid duration.");
  return duration;
}

export async function fitNarrationToDuration(file, videoSeconds) {
  if (!Number.isFinite(videoSeconds) || videoSeconds < 2) throw new Error("Invalid video duration.");
  const maxSeconds = videoSeconds - 0.5; // small buffer for end of sentence and audio codec padding
  const before = await probeDurationSeconds(file);
  if (before <= maxSeconds) return {before,after:before,tempo:1};
  const tempo = before/maxSeconds;
  if (tempo > 1.30) {
    throw new Error(`Narration is too long (${before.toFixed(1)}s for ${videoSeconds}s video); shorten the storyboard text before retrying.`);
  }
  const tempFile = file.replace(/\.mp3$/i,".fitted.mp3");
  if (tempFile === file) throw new Error("Narration output must be an MP3 file.");
  try {
    await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-i",file,
      "-filter:a",`atempo=${tempo.toFixed(6)}`,"-c:a","libmp3lame","-q:a","3",tempFile],{timeout:60000});
    const after = await probeDurationSeconds(tempFile);
    if (after > maxSeconds + 0.15) throw new Error("Narration remains longer than the video after tempo adjustment.");
    await rename(tempFile,file);
    return {before,after,tempo};
  } finally {
    await rm(tempFile,{force:true});
  }
}

const note = (semitones) => 440 * 2 ** ((semitones - 69)/12);
const progressions = [
  [48,52,55,59], // Cmaj7
  [45,48,52,55], // Am7
  [41,45,48,52], // Fmaj7
  [43,47,50,57], // Gadd9
];
const melody = [0,2,1,3,2,1,0,1];
const sin = Math.sin;
const tau = 2*Math.PI;

function chordSample(notes, time) {
  let sum = 0;
  for (const midi of notes) {
    const freq = note(midi);
    sum += 0.065*sin(tau*freq*time) + 0.012*sin(tau*2*freq*time);
  }
  return sum;
}

/** Synthesize an original instrumental ambience; no third-party sound samples are used. */
export async function createAmbientMusic({durationSeconds,outputPath}) {
  if (!Number.isInteger(durationSeconds) || durationSeconds < 2 || durationSeconds > 120) {
    throw new Error("Background music duration must be 2–120 whole seconds.");
  }
  const samples = durationSeconds * sampleRate;
  const bytes = Buffer.allocUnsafe(44 + samples*2);
  bytes.write("RIFF",0,"ascii");
  bytes.writeUInt32LE(bytes.length-8,4);
  bytes.write("WAVEfmt ",8,"ascii");
  bytes.writeUInt32LE(16,16); // PCM fmt chunk
  bytes.writeUInt16LE(1,20); // PCM
  bytes.writeUInt16LE(1,22); // mono
  bytes.writeUInt32LE(sampleRate,24);
  bytes.writeUInt32LE(sampleRate*2,28);
  bytes.writeUInt16LE(2,32);
  bytes.writeUInt16LE(16,34);
  bytes.write("data",36,"ascii");
  bytes.writeUInt32LE(samples*2,40);
  for (let i=0;i<samples;i++) {
    const time=i/sampleRate;
    const chordPosition=time/6;
    const index=Math.floor(chordPosition)%progressions.length;
    const position=time%6;
    const fadeToNext=Math.max(0,Math.min(1,(position-5.3)/0.7));
    const current=chordSample(progressions[index],time);
    const next=chordSample(progressions[(index+1)%progressions.length],time);
    const pad=current*(1-fadeToNext)+next*fadeToNext;
    const beatTime=time%0.75;
    const pluckNote=progressions[index][melody[Math.floor(time/0.75)%melody.length]%4]+12;
    const pluck=0.08*Math.exp(-beatTime*5)*(sin(tau*note(pluckNote)*time)+0.25*sin(tau*note(pluckNote)*2*time));
    const fadeIn=Math.min(1,time/1.2);
    const fadeOut=Math.min(1,(durationSeconds-time)/2.2);
    const value=Math.max(-1,Math.min(1,(pad+pluck)*fadeIn*fadeOut));
    bytes.writeInt16LE(Math.round(value*32767),44+i*2);
  }
  await writeFile(outputPath,bytes);
}

export async function provisionBackgroundMusic({durationSeconds,publicDirectory,trackPath}) {
  await mkdir(publicDirectory,{recursive:true});
  if (trackPath?.trim()) {
    const extension=extname(trackPath).toLowerCase();
    if (![".mp3",".wav"].includes(extension)) throw new Error("Background track must be a local MP3 or WAV file.");
    const name=`background${extension}`;
    const destination=join(publicDirectory,name);
    await copyFile(resolve(trackPath),destination);
    try {
      if (await probeDurationSeconds(destination) < 1) throw new Error("Background track is too short.");
    } catch (error) {
      await rm(destination,{force:true});
      throw error;
    }
    return name;
  }
  await createAmbientMusic({durationSeconds,outputPath:join(publicDirectory,"background.wav")});
  return "background.wav";
}

/** Refuse READY status for MP4s with no audio track or effectively silent audio. */
export async function verifyRenderedVideoAudio(file) {
  let streams;
  try {
    ({stdout:streams}=await run('ffprobe',['-v','error','-select_streams','a:0',
      '-show_entries','stream=codec_type','-of','default=noprint_wrappers=1:nokey=1',file],{timeout:15000}));
  } catch {
    throw new Error('Rendered MP4 could not be inspected with ffprobe.');
  }
  if (!streams.split(/\s+/).includes('audio')) throw new Error('Rendered MP4 is missing an audio stream.');
  await verifyAudioHasSound(file);
}

/** Silence detection works for generated WAV, MP3, and final video audio tracks. */
export async function verifyAudioHasSound(file) {
  let stderr;
  try {
    ({stderr}=await run('ffmpeg',['-hide_banner','-i',file,'-map','0:a:0',
      '-af','volumedetect','-f','null','-'],{timeout:45000,maxBuffer:1024*1024}));
  } catch {
    throw new Error('Audio could not be checked for silence using ffmpeg.');
  }
  const volume=stderr.match(/max_volume:\s*(-?\d+(?:\.\d+)?|-inf)\s*dB/i);
  if (!volume || !Number.isFinite(Number(volume[1])) || Number(volume[1])<-65) {
    throw new Error('Rendered audio is silent or effectively silent.');
  }
}
