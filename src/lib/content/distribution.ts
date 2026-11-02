export type SocialPlatform="TIKTOK"|"INSTAGRAM"|"FACEBOOK"|"YOUTUBE";
const domains:Record<SocialPlatform,readonly string[]>={
  TIKTOK:["tiktok.com"],
  INSTAGRAM:["instagram.com"],
  FACEBOOK:["facebook.com","fb.watch"],
  YOUTUBE:["youtube.com","youtu.be"],
};
export function isPublishedPostUrl(platform:SocialPlatform,raw:string):boolean{
  try {
    const url=new URL(raw);
    if(url.protocol!=="https:"||url.username||url.password)return false;
    if(!url.pathname||url.pathname==="/")return false;
    const host=url.hostname.toLowerCase();
    return domains[platform].some(domain=>host===domain||host.endsWith("."+domain));
  }catch{return false;}
}
