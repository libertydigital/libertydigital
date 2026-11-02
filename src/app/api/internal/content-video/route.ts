import {NextRequest,NextResponse} from "next/server";
import {timingSafeEqual} from "node:crypto";
import {getPrisma} from "@/lib/prisma";
import {getSupabaseAdminClient} from "@/lib/supabase/admin";
import {validateScenes} from "@/lib/content/storyboard";

export const runtime="nodejs";
export const dynamic="force-dynamic";

function authorized(req:NextRequest):boolean {
  const secret=process.env.VIDEO_WORKER_TOKEN;
  if(!secret || secret.length<32)return false;
  const provided=req.headers.get("authorization");
  if(!provided?.startsWith("Bearer "))return false;
  const left=Buffer.from(provided.slice(7)),right=Buffer.from(secret);
  return left.length===right.length && timingSafeEqual(left,right);
}
function reject(){return NextResponse.json({error:"Unauthorized"},{status:401,headers:{"Cache-Control":"no-store"}});}
function ok(data:unknown,status=200){return NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}});}
export async function GET(req:NextRequest){
  if(!authorized(req))return reject();
  const db=getPrisma();
  // Stalled jobs are surfaced for explicit retry rather than silently remaining in-progress forever.
  await db.contentVideo.updateMany({
    where:{status:"RENDERING",claimedAt:{lt:new Date(Date.now()-45*60*1000)}},
    data:{status:"FAILED",error:"Render worker timeout. Review and retry."},
  });
  for(let attempt=0;attempt<3;attempt++){
    const job=await db.contentVideo.findFirst({where:{status:"QUEUED"},orderBy:{createdAt:"asc"}});
    if(!job)return ok({job:null});
    const claimed=await db.contentVideo.updateMany({
      where:{id:job.id,status:"QUEUED"},
      data:{status:"RENDERING",claimedAt:new Date(),attemptCount:{increment:1},error:null},
    });
    if(claimed.count!==1)continue;
    try{
      const path=`${job.id}/render-${Date.now()}.mp4`;
      const {data,error}=await getSupabaseAdminClient().storage.from("content-videos").createSignedUploadUrl(path);
      if(error || !data)throw new Error(error?.message||"Unable to sign media upload.");
      return ok({job:{
        id:job.id,format:job.format,hook:job.hook,script:job.script,
        scenes:validateScenes(job.scenes),durationSeconds:job.durationSeconds,
        upload:{path,token:data.token},
      }});
    }catch(error){
      await db.contentVideo.update({where:{id:job.id},data:{status:"FAILED",error:error instanceof Error?error.message:"Storage unavailable"}});
      return ok({error:"Storage upload could not be prepared."},503);
    }
  }
  return ok({job:null});
}
export async function POST(req:NextRequest){
  if(!authorized(req))return reject();
  let body:unknown;
  try{body=await req.json();}catch{return ok({error:"Invalid JSON"},400);}
  if(!body || typeof body!=="object")return ok({error:"Invalid payload"},400);
  const data=body as Record<string,unknown>;
  if(typeof data.id!=="string" || !/^[a-z0-9]+$/.test(data.id))return ok({error:"Invalid job ID"},400);
  if(data.action==="complete"){
    const storagePath=data.storagePath;
    if(typeof storagePath!=="string" || !storagePath.startsWith(data.id+"/") || !/^[-a-zA-Z0-9/]+\.mp4$/.test(storagePath))
      return ok({error:"Invalid storage path"},400);
    const result=await getPrisma().contentVideo.updateMany({
      where:{id:data.id,status:"RENDERING"},
      data:{status:"READY",storagePath,error:null},
    });
    return result.count===1?ok({ok:true}):ok({error:"Job is not rendering"},409);
  }
  if(data.action==="fail"){
    const error=typeof data.error==="string"?data.error.slice(0,400):"Video rendering failed";
    const result=await getPrisma().contentVideo.updateMany({
      where:{id:data.id,status:"RENDERING"},
      data:{status:"FAILED",error},
    });
    return result.count===1?ok({ok:true}):ok({error:"Job is not rendering"},409);
  }
  return ok({error:"Unknown action"},400);
}
