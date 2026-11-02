import React from "react";
import {AbsoluteFill,Audio,interpolate,Sequence,spring,staticFile,useCurrentFrame,useVideoConfig} from "remotion";

type Scene={caption:string;visual:"hook"|"checklist"|"warning"|"document"|"cta";seconds:number};
export type VideoProps={hook:string;durationSeconds:number;scenes:Scene[];withNarration?:boolean};
const colors={navy:"#102b37",teal:"#0e7479",champagne:"#c3a778",white:"#fffdf7"};
function Motif({kind}:{kind:Scene["visual"]}){
  const frame=useCurrentFrame();
  const float=Math.sin(frame/18)*15;
  const symbol=kind==="warning"?"!":kind==="checklist"?"✓":kind==="cta"?"→":kind==="hook"?"?":"ID";
  return <div style={{display:"flex",justifyContent:"center",marginTop:110,transform:`translateY(${float}px)`}}>
    <div style={{width:460,height:350,borderRadius:54,background:"rgba(255,255,255,0.09)",border:"3px solid rgba(255,255,255,0.24)",
      boxShadow:"0 25px 90px rgba(0,0,0,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:150,
      fontWeight:800,color:colors.champagne}}>{symbol}</div>
  </div>;
}
function Clip({scene,index,total}:{scene:Scene;index:number;total:number}){
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const move=spring({frame,fps,config:{damping:18,stiffness:110}});
  const opacity=interpolate(frame,[0,8],[0,1],{extrapolateRight:"clamp"});
  const progress=Math.min(1,frame/(scene.seconds*fps));
  const bg=scene.visual==="warning"?"#27464b":scene.visual==="cta"?"#183d4b":colors.navy;
  return <AbsoluteFill style={{background:bg,color:colors.white,overflow:"hidden",fontFamily:"Arial, Helvetica, sans-serif"}}>
    <AbsoluteFill style={{background:"radial-gradient(circle at 95% 18%,rgba(49,179,172,0.45),transparent 43%),radial-gradient(circle at -20% 92%,rgba(195,167,120,0.3),transparent 45%)"}}/>
    <div style={{position:"absolute",left:75,top:95,display:"flex",alignItems:"center",gap:17,letterSpacing:5,fontSize:30,fontWeight:700}}>
      <div style={{width:52,height:52,borderRadius:14,background:colors.champagne}}/>
      LIBERTY DIGITAL
    </div>
    <div style={{position:"absolute",top:205,left:75,color:colors.champagne,fontSize:32,fontWeight:800,letterSpacing:4}}>
      {scene.visual==="hook"?"IMPORTANT":scene.visual==="cta"?"YOUR NEXT STEP":`POINT ${index} OF ${total-2}`}
    </div>
    <Motif kind={scene.visual}/>
    <div style={{position:"absolute",top:760,left:78,right:78,opacity,transform:`translateY(${(1-move)*120}px)`}}>
      <div style={{width:120,height:8,borderRadius:4,background:colors.champagne,marginBottom:46}}/>
      <div style={{fontSize:scene.caption.length>125?62:scene.caption.length>75?72:86,lineHeight:1.19,fontWeight:800,letterSpacing:-2,
        overflowWrap:"break-word",textShadow:"0 12px 48px rgba(0,0,0,0.15)"}}>
        {scene.caption}
      </div>
    </div>
    <div style={{position:"absolute",left:75,right:75,bottom:210,height:8,background:"rgba(255,255,255,0.2)",borderRadius:30,overflow:"hidden"}}>
      <div style={{width:`${progress*100}%`,height:"100%",background:colors.champagne}}/>
    </div>
    <div style={{position:"absolute",left:75,right:75,bottom:105,fontSize:27,color:"#e3ebec",letterSpacing:1}}>
      Document support in Italy · libertydigitalconsulting.com
    </div>
  </AbsoluteFill>;
}
export const LibertyShort:React.FC<VideoProps>=({scenes,withNarration=false})=>{
  let offset=0;
  const sequences=scenes.map((scene,index)=>{
    const start=offset;
    offset+=scene.seconds*30;
    return <Sequence key={index} from={start} durationInFrames={scene.seconds*30}>
      <Clip scene={scene} index={index} total={scenes.length}/>
    </Sequence>;
  });
  return <AbsoluteFill style={{background:colors.navy}}>
    {sequences}
    {withNarration&&<Audio src={staticFile("narration.mp3")}/>}
  </AbsoluteFill>;
};
