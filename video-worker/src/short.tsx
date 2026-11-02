import React from "react";
import {AbsoluteFill,Audio,interpolate,Sequence,spring,staticFile,useCurrentFrame,useVideoConfig} from "remotion";

type Scene={caption:string;visual:"hook"|"checklist"|"warning"|"document"|"cta";seconds:number};
export type VideoProps={hook:string;durationSeconds:number;scenes:Scene[];withNarration?:boolean};
const palette={deep:"#0d2735",teal:"#127b7c",gold:"#c9ad76",white:"#fffdf7",muted:"#b9cfce"};

function SceneGraphic({visual}:{visual:Scene["visual"]}){
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const emerge=spring({frame,fps,config:{stiffness:90,damping:16}});
  const float=Math.sin(frame/15)*8;
  const panel:React.CSSProperties={
    position:"absolute",borderRadius:32,boxShadow:"0 38px 100px rgba(2,10,16,0.30)",
    border:"3px solid rgba(255,255,255,0.14)",background:"#e9e7de",color:palette.deep,
  };
  const line=(width:string):React.CSSProperties=>({width,height:14,background:"#b4c2c2",borderRadius:10,marginBottom:19});
  const transform={transform:`translateY(${(1-emerge)*90+float}px) scale(${0.86+emerge*0.14})`,opacity:emerge};
  return <div style={{position:"absolute",top:325,left:80,width:920,height:435,...transform}}>
    {visual==="hook"&&<>
      <div style={{...panel,left:200,top:14,width:500,height:338,background:"#0e5465",transform:"rotate(-9deg)",overflow:"hidden"}}>
        <div style={{position:"absolute",top:38,left:50,fontWeight:900,color:palette.gold,fontSize:29,letterSpacing:4}}>DOCUMENT GUIDE</div>
        <div style={{position:"absolute",top:100,left:70,width:125,height:125,borderRadius:"50%",border:"9px double rgba(255,255,255,.5)"}}/>
        <div style={{position:"absolute",top:112,left:275,width:165,height:18,background:"rgba(255,255,255,.38)",borderRadius:9}}/>
        <div style={{position:"absolute",top:170,left:275,width:120,height:18,background:"rgba(255,255,255,.28)",borderRadius:9}}/>
        <div style={{position:"absolute",bottom:36,left:54,color:palette.white,fontSize:23}}>PREPARE · CHECK · VERIFY</div>
      </div>
      <div style={{...panel,left:585,top:185,width:170,height:165,borderRadius:85,background:palette.gold,
        fontWeight:900,fontSize:99,display:"flex",alignItems:"center",justifyContent:"center"}}>?</div>
    </>}
    {visual==="document"&&<>
      <div style={{...panel,left:190,top:30,width:460,height:360,padding:45,transform:"rotate(-7deg)"}}>
        <div style={{fontSize:26,fontWeight:900,letterSpacing:3,color:palette.teal,marginBottom:37}}>IDENTITY DETAILS</div>
        <div style={line("84%")}/><div style={line("55%")}/><div style={line("72%")}/>
        <div style={{display:"flex",gap:18,alignItems:"center",marginTop:28}}>
          <div style={{width:82,height:70,borderRadius:16,background:"#b2c9ca"}}/>
          <div style={{flex:1}}><div style={line("95%")}/><div style={line("65%")}/></div>
        </div>
      </div>
      <div style={{...panel,left:550,top:180,width:185,height:175,borderRadius:35,background:palette.teal,
        fontSize:120,fontWeight:900,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>✓</div>
    </>}
    {visual==="warning"&&<>
      <div style={{position:"absolute",left:235,top:-20,width:460,height:380,filter:"drop-shadow(0 30px 55px rgba(0,0,0,.35))"}}>
        <svg viewBox="0 0 500 420" width="460" height="390" role="img" aria-label="Important warning">
          <path d="M250 25 L482 385 Q491 407 465 407 H35 Q9 407 18 385 Z" fill="#dfc282" stroke="#fff6dc" strokeWidth="10"/>
          <rect x="227" y="147" width="46" height="145" rx="21" fill="#173642"/>
          <circle cx="250" cy="344" r="24" fill="#173642"/>
        </svg>
      </div>
      <div style={{position:"absolute",left:80,top:322,background:palette.deep,border:"3px solid rgba(255,255,255,.2)",borderRadius:20,
        padding:"19px 46px",color:palette.white,fontSize:32,fontWeight:800,letterSpacing:7}}>CHECK FIRST</div>
    </>}
    {visual==="checklist"&&<div style={{...panel,left:185,top:10,width:570,height:400,padding:"42px 48px"}}>
      <div style={{fontSize:32,fontWeight:900,letterSpacing:4,marginBottom:29,color:palette.teal}}>BEFORE YOU START</div>
      {["MATCH RECORDS","KEEP COPIES","VERIFY DETAILS"].map((name,index)=>
        <div key={name} style={{display:"flex",alignItems:"center",gap:24,marginBottom:24,
          opacity:interpolate(frame,[7+index*8,14+index*8],[0,1],{extrapolateRight:"clamp"})}}>
          <span style={{display:"flex",alignItems:"center",justifyContent:"center",height:60,width:60,
            flexShrink:0,borderRadius:15,color:"white",background:palette.teal,fontWeight:900,fontSize:40}}>✓</span>
          <span style={{fontSize:29,fontWeight:800,letterSpacing:2}}>{name}</span>
        </div>)}
    </div>}
    {visual==="cta"&&<>
      <div style={{...panel,left:205,top:-4,width:340,height:414,background:"#173947",borderRadius:50,
        padding:22,border:"7px solid #819a9a"}}>
        <div style={{height:24,width:128,borderRadius:15,background:"#91aaa8",margin:"0 auto 25px"}}/>
        <div style={{background:"#e4f0e7",borderRadius:26,padding:25,marginTop:32}}>
          <div style={{fontSize:30,color:palette.deep,fontWeight:900}}>Need help?</div>
          <div style={{fontSize:22,color:palette.deep,lineHeight:1.5,marginTop:14}}>Ask about independent document support.</div>
        </div>
        <div style={{borderRadius:25,background:palette.teal,padding:15,color:"#fff",textAlign:"center",fontWeight:800,fontSize:23,marginTop:34}}>CONTACT LIBERTY</div>
      </div>
      <div style={{position:"absolute",left:610,top:172,width:160,height:160,borderRadius:80,
        background:palette.gold,display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:102,fontWeight:900,color:palette.deep,boxShadow:"0 25px 70px rgba(0,0,0,.25)"}}>→</div>
    </>}
  </div>;
}

function Clip({scene,index,total}:{scene:Scene;index:number;total:number}){
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const move=spring({frame,fps,config:{damping:20,stiffness:100}});
  const opacity=interpolate(frame,[0,9],[0,1],{extrapolateRight:"clamp"});
  const progress=Math.min(1,frame/(scene.seconds*fps));
  const bg=scene.visual==="warning"?"#213b44":scene.visual==="cta"?"#113a47":palette.deep;
  const label=scene.visual==="hook"?"THE ESSENTIALS":scene.visual==="cta"?"GET GUIDANCE":`STEP ${index} / ${total-2}`;
  const fontSize=scene.caption.length>150?55:scene.caption.length>105?64:scene.caption.length>65?73:84;
  return <AbsoluteFill style={{background:bg,color:palette.white,overflow:"hidden",fontFamily:"Arial, Helvetica, sans-serif"}}>
    <AbsoluteFill style={{background:"radial-gradient(circle at 95% 18%,rgba(35,180,168,0.30),transparent 41%),radial-gradient(circle at 0% 99%,rgba(211,174,106,0.22),transparent 46%)"}}/>
    <div style={{position:"absolute",right:0,top:0,width:430,height:500,opacity:.11,
      backgroundImage:"radial-gradient(circle, white 2px, transparent 2px)",backgroundSize:"45px 45px"}}/>
    <div style={{position:"absolute",left:74,top:96,display:"flex",alignItems:"center",gap:24,
      fontSize:30,fontWeight:800,letterSpacing:4}}>
      <div style={{width:60,height:60,borderRadius:18,background:palette.gold,color:palette.deep,
        fontSize:37,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>L</div>
      LIBERTY DIGITAL
    </div>
    <div style={{position:"absolute",top:214,left:78,color:palette.gold,fontSize:31,
      fontWeight:800,letterSpacing:4}}>{label}</div>
    <SceneGraphic visual={scene.visual}/>
    <div style={{position:"absolute",top:825,left:80,right:135,opacity,
      transform:`translateY(${(1-move)*105}px)`}}>
      <div style={{width:108,height:8,borderRadius:5,background:palette.gold,marginBottom:35}}/>
      <div style={{fontSize,lineHeight:1.16,fontWeight:800,letterSpacing:-1.9,
        overflowWrap:"break-word",textShadow:"0 12px 50px rgba(0,0,0,.18)"}}>{scene.caption}</div>
    </div>
    <div style={{position:"absolute",left:79,right:180,bottom:251,height:9,background:"rgba(255,255,255,.2)",borderRadius:9}}>
      <div style={{height:"100%",background:palette.gold,width:`${progress*100}%`,borderRadius:9}}/>
    </div>
    <div style={{position:"absolute",left:79,right:130,bottom:162,
      fontSize:24,color:palette.muted,letterSpacing:1}}>PREPARE  •  VERIFY  •  PROCEED</div>
    <div style={{position:"absolute",left:79,right:110,bottom:106,
      fontSize:25,fontWeight:700}}>libertydigitalconsulting.com</div>
  </AbsoluteFill>;
}

export const LibertyShort:React.FC<VideoProps>=({scenes,withNarration=false})=>{
  return <AbsoluteFill style={{background:palette.deep}}>
    {scenes.map((scene,index)=>{
      const start=scenes.slice(0,index).reduce((sum,prior)=>sum+prior.seconds*30,0);
      return <Sequence key={index} from={start} durationInFrames={scene.seconds*30}>
        <Clip scene={scene} index={index} total={scenes.length}/>
      </Sequence>;
    })}
    {withNarration&&<Audio src={staticFile("narration.mp3")}/>}
  </AbsoluteFill>;
};
