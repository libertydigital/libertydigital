import {ImageResponse} from "next/og";
import {findPublishedBlogPost} from "@/lib/content/public-posts";

export const size={width:1200,height:630};
export const contentType="image/png";
export const runtime="nodejs";
export const dynamic="force-dynamic";

export default async function OpenGraphImage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const post=await findPublishedBlogPost(slug);
  const title=post?.title||"Nigerian document preparation in Italy";
  return new ImageResponse(
    <div style={{display:"flex",height:"100%",width:"100%",position:"relative",overflow:"hidden",
      flexDirection:"column",justifyContent:"space-between",padding:"66px 84px",
      background:"linear-gradient(130deg,#0a2230 0%,#123947 60%,#0d2b36 100%)",
      fontFamily:"Arial, sans-serif",color:"#fff"}}>
      <div style={{position:"absolute",width:520,height:520,right:-180,top:-155,borderRadius:"50%",background:"#238d85",opacity:0.25}}/>
      <div style={{position:"absolute",width:350,height:350,right:80,bottom:-190,borderRadius:"50%",background:"#d6b77c",opacity:0.18}}/>
      <div style={{display:"flex",alignItems:"center",gap:19,fontWeight:800,letterSpacing:4,fontSize:25}}>
        <div style={{display:"flex",width:57,height:57,background:"#d6b77c",
          borderRadius:18,alignItems:"center",justifyContent:"center",color:"#123947",fontSize:38}}>L</div>
        LIBERTY DIGITAL
      </div>
      <div style={{display:"flex",flexDirection:"column",maxWidth:960,gap:25,justifyContent:"center",flexGrow:1}}>
        <div style={{display:"flex",height:8,width:130,background:"#d6b77c",borderRadius:5}}/>
        <div style={{display:"flex",fontSize:title.length>67?51:60,lineHeight:1.13,
          fontWeight:800,letterSpacing:-1.3}}>{title}</div>
        <div style={{display:"flex",fontSize:23,color:"#c8ddda"}}>
          Practical guidance for Nigerians living in Italy
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:22,color:"#ebd1a3"}}>
        <div>DOCUMENT PREPARATION · ROME</div>
        <div>libertydigitalconsulting.com</div>
      </div>
    </div>,
    {...size},
  );
}
