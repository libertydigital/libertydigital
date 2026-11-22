import assets from "../media/approved-assets.json" with {type:"json"};
import {copyFile,mkdir,rm} from "node:fs/promises";
import {resolve,join,sep,extname} from "node:path";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
const run=promisify(execFile);
const publicRoot=resolve(import.meta.dirname,"..","public");
const byId=new Map(assets.map(asset=>[asset.id,asset]));
export const getMediaById=id=>typeof id==="string"?byId.get(id):undefined;

/** Stage only approved checked-in site media. Never download editor-supplied URLs. */
export async function stageApprovedMedia(scenes,publicDirectory) {
  const dest=join(publicDirectory,"media");
  await rm(dest,{recursive:true,force:true});
  await mkdir(dest,{recursive:true});
  try {
    const result=[];
    for(let i=0;i<scenes.length;i++){
      const scene=scenes[i];
      if(!scene.mediaId){result.push(scene);continue;}
      const asset=getMediaById(scene.mediaId);
      if(!asset)throw new Error("Unapproved scene media asset.");
      const source=resolve(import.meta.dirname,"..",asset.path);
      if(!source.startsWith(publicRoot+sep))throw new Error("Curated media must reside in site public directory.");
      if(asset.kind==="photo") {
        const ext=extname(source).toLowerCase();
        if(![".png",".jpg",".jpeg",".webp"].includes(ext))throw new Error("Unsupported image type.");
        const name=String(i)+"-"+asset.id+ext;
        await copyFile(source,join(dest,name));
        result.push({...scene,mediaFile:"media/"+name,mediaKind:"photo"});
      } else if(asset.kind==="video") {
        const name=String(i)+"-"+asset.id+".mp4";
        await run("ffmpeg",["-hide_banner","-loglevel","error","-y","-stream_loop","-1","-i",source,
          "-t",String(scene.seconds),"-an",
          "-vf","scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280",
          "-c:v","libx264","-preset","veryfast","-crf","24","-pix_fmt","yuv420p",join(dest,name)],
          {timeout:180000,maxBuffer:1024*1024});
        result.push({...scene,mediaFile:"media/"+name,mediaKind:"video"});
      } else throw new Error("Unknown approved media type.");
    }
    return result;
  }catch(error){
    await rm(dest,{recursive:true,force:true});
    throw error;
  }
}
