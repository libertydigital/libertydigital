export type VideoInsights={views:number;averageWatchSeconds:number|null;linkClicks:number;qualifiedInquiries:number};
function count(value:unknown,name:string):number{
  if(typeof value!=="string"||!/^\d{1,10}$/.test(value))throw new Error(name+" must be a nonnegative whole number.");
  const amount=Number(value);
  if(!Number.isSafeInteger(amount)||amount>1_000_000_000)throw new Error(name+" is outside the accepted range.");
  return amount;
}
export function parseVideoInsights(raw:Record<string,unknown>,durationSeconds:number):VideoInsights{
  if(!Number.isFinite(durationSeconds)||durationSeconds<=0||durationSeconds>60)throw new Error("Invalid video duration.");
  const views=count(raw.views,"Views");
  const linkClicks=count(raw.linkClicks,"Link clicks");
  const qualifiedInquiries=count(raw.qualifiedInquiries,"Qualified inquiries");
  const watch=raw.averageWatchSeconds;
  let averageWatchSeconds:number|null=null;
  if(watch!==null&&watch!==undefined&&watch!==""){
    if(typeof watch!=="string"||!/^\d+(?:\.\d{1,2})?$/.test(watch))throw new Error("Average watch time must be numeric.");
    averageWatchSeconds=Number(watch);
    if(!Number.isFinite(averageWatchSeconds)||averageWatchSeconds>durationSeconds)
      throw new Error("Average watch time cannot exceed video duration.");
  }
  return {views,averageWatchSeconds,linkClicks,qualifiedInquiries};
}
