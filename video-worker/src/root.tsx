import React from "react";
import {Composition} from "remotion";
import {LibertyShort, type VideoProps} from "./short";

const initial:VideoProps={
  hook:"3 document-preparation mistakes to avoid",
  durationSeconds:32,
  scenes:[
    {caption:"3 document-preparation mistakes to avoid",visual:"hook",seconds:5},
    {caption:"Check that your names match across records.",visual:"document",seconds:7},
    {caption:"Do not rely on outdated third-party instructions.",visual:"warning",seconds:7},
    {caption:"Keep clear copies and verified appointment details.",visual:"checklist",seconds:7},
    {caption:"Need preparation support in Italy? Ask Liberty Digital. Confirm current official rules.",visual:"cta",seconds:6},
  ],
};
export const VideoRoot=()=> <Composition id="LibertyShort" component={LibertyShort}
  width={1080} height={1920} fps={30} durationInFrames={960}
  defaultProps={initial} calculateMetadata={({props})=>({
    durationInFrames:Math.round(props.durationSeconds*30),
    props,
  })}/>;
