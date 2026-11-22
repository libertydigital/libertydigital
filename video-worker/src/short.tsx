import React from "react";
import {AbsoluteFill,Audio,Img,OffthreadVideo,interpolate,Sequence,staticFile,useCurrentFrame,useVideoConfig} from "remotion";

type Scene={
  caption:string;
  visual:"hook"|"checklist"|"warning"|"document"|"cta";
  seconds:number;
  narration?:string;
  motion?:"slow-zoom"|"pan-left"|"still";
  mediaFile?:string;
  mediaKind?:"photo"|"video";
};
export type VideoProps={
  hook:string;
  durationSeconds:number;
  scenes:Scene[];
  withNarration?:boolean;
  musicFile?:string;
  musicVolume?:number;
  sceneSpeechSeconds?:number[];
};
const colors={deep:"#112031",gold:"#ead7a4",white:"#fffaf3",muted:"#e8e5de"};
const phrases=(text:string):string[]=>{
  const words=text.trim().split(/\s+/).filter(Boolean),result:string[]=[];
  for(let i=0;i<words.length;i+=4)result.push(words.slice(i,i+4).join(" "));
  return result.length?result:[""];
};
function Background({scene}:{scene:Scene}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const progress=Math.min(1,frame/Math.max(1,scene.seconds*fps));
  const scale=scene.motion==="still"?1:1.04+progress*0.075;
  const left=scene.motion==="pan-left"?interpolate(progress,[0,1],[16,-16]):0;
  const mediaStyle:React.CSSProperties={width:"100%",height:"100%",objectFit:"cover",
    transform:"translateX("+left+"px) scale("+scale+")",filter:"saturate(.92) contrast(1.04)"};
  if(scene.mediaFile){
    return <AbsoluteFill>{scene.mediaKind==="video"
      ? <OffthreadVideo src={staticFile(scene.mediaFile)} muted style={mediaStyle}/>
      : <Img src={staticFile(scene.mediaFile)} style={mediaStyle}/>}</AbsoluteFill>;
  }
  // Older storyboards remain renderable without media metadata.
  return <AbsoluteFill style={{background:"linear-gradient(140deg,#254137,#112031 65%,#172c37)"}}>
    <div style={{position:"absolute",inset:95,border:"2px solid rgba(234,215,164,.18)",borderRadius:28}}/>
    <div style={{position:"absolute",top:465,left:110,right:110,
      fontSize:150,textAlign:"center",color:colors.gold,opacity:.24,fontWeight:900}}>
      {scene.visual==="warning"?"!":scene.visual==="checklist"?"✓":scene.visual==="cta"?"→":"LD"}
    </div>
  </AbsoluteFill>;
}
function Clip({scene,index,total,speechSeconds}:{scene:Scene;index:number;total:number;speechSeconds?:number}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const seconds=frame/fps,opacity=interpolate(frame,[0,9],[0,1],{extrapolateRight:"clamp"});
  const progress=Math.min(1,frame/(scene.seconds*fps));
  const caption=scene.caption.trim(),groups=phrases(scene.narration||caption);
  const captionFont=caption.length>125?47:caption.length>85?55:caption.length>55?66:77;
  const voiced=Math.max(.2,Math.min(scene.seconds-.25,speechSeconds??scene.seconds-.7));
  const active=Math.min(groups.length-1,Math.floor(seconds/voiced*groups.length));
  return <AbsoluteFill style={{background:colors.deep,color:colors.white,
    fontFamily:"Arial, Helvetica, sans-serif",overflow:"hidden"}}>
    <Background scene={scene}/>
    <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(4,15,20,.5) 0%,rgba(4,15,20,.03) 32%,rgba(4,15,20,.45) 57%,rgba(4,15,20,.94) 100%)"}}/>
    <div style={{position:"absolute",left:74,right:74,top:96,display:"flex",
      justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:29,fontWeight:900,letterSpacing:3,
        textShadow:"0 2px 15px rgba(0,0,0,.7)"}}>LIBERTY DIGITAL</span>
      <span style={{fontSize:23,fontWeight:700,color:colors.gold}}>ITALY</span>
    </div>
    <div style={{position:"absolute",left:75,right:75,top:810,opacity,
      transform:"translateY("+((1-opacity)*24)+"px"}}>
      <div style={{width:95,height:7,background:colors.gold,marginBottom:36}}/>
      <div style={{fontSize:captionFont,lineHeight:1.14,fontWeight:800,letterSpacing:-1.2,
        overflowWrap:"break-word",textShadow:"0 8px 34px rgba(0,0,0,.6)"}}>{caption}</div>
    </div>
    <div style={{position:"absolute",left:75,right:75,top:1240,minHeight:170,
      display:"flex",justifyContent:"center",alignItems:"center"}}>
      <div style={{padding:"17px 28px",borderRadius:14,background:"rgba(4,15,20,.82)",
        fontSize:41,lineHeight:1.25,fontWeight:700,textAlign:"center",
        textShadow:"0 2px 9px rgba(0,0,0,.5)"}}>{groups[active]}</div>
    </div>
    {scene.visual==="cta"&&<div style={{position:"absolute",left:75,right:75,bottom:290,
      padding:"17px 21px",border:"2px solid rgba(234,215,164,.7)",borderRadius:12,
      background:"rgba(16,33,28,.88)",fontSize:33,fontWeight:700,color:colors.gold}}>
      WhatsApp: +39 353 390 3464
    </div>}
    <div style={{position:"absolute",left:75,right:75,bottom:195,height:5,background:"rgba(255,255,255,.3)"}}>
      <div style={{height:"100%",width:String(progress*100)+"%",background:colors.gold}}/>
    </div>
    <div style={{position:"absolute",left:75,right:75,bottom:116,display:"flex",justifyContent:"space-between",
      color:colors.muted,fontSize:24,letterSpacing:1}}>
      <span>Independent document support</span><span>{index+1}/{total}</span>
    </div>
    <div style={{position:"absolute",left:75,bottom:60,fontSize:24,fontWeight:600}}>
      libertydigitalconsulting.com
    </div>
  </AbsoluteFill>;
}
export const LibertyShort:React.FC<VideoProps>=({scenes,durationSeconds,withNarration=false,musicFile,musicVolume=0.14,sceneSpeechSeconds})=>{
  return <AbsoluteFill style={{background:colors.deep}}>
    {scenes.map((scene,index)=>{
      const start=scenes.slice(0,index).reduce((sum,prior)=>sum+prior.seconds*30,0);
      return <Sequence key={index} from={start} durationInFrames={scene.seconds*30}>
        <Clip scene={scene} index={index} total={scenes.length} speechSeconds={sceneSpeechSeconds?.[index]}/>
      </Sequence>;
    })}
    {musicFile&&<Audio src={staticFile(musicFile)} loop loopVolumeCurveBehavior="extend" volume={(frame)=>{
      const fadeIn=Math.min(1,frame/30);
      const fadeOut=Math.min(1,Math.max(0,(durationSeconds*30-frame)/75));
      return musicVolume*Math.max(0,Math.min(fadeIn,fadeOut));
    }}/>}
    {withNarration&&<Audio src={staticFile("narration.mp3")} volume={1}/>}
  </AbsoluteFill>;
};
