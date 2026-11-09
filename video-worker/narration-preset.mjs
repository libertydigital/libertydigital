/** Natural narration profile for this campaign only; no paid voice service. */
export const CAMPAIGN_VIDEO_ID="cmcf12bd49fdf635e1207b5e";
export function narrationEnvironment(jobId,env=process.env) {
  return jobId===CAMPAIGN_VIDEO_ID
    ? {...env,KOKORO_VOICE:"af_bella",KOKORO_SPEED:"0.98"}
    : env;
}
