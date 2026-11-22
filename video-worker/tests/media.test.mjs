import test from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,rm,stat} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {stageApprovedMedia,getMediaById} from "../media.mjs";
test("only checked-in site photos can be staged",async()=>{
  const dir=await mkdtemp(join(tmpdir(),"liberty-assets-"));
  try{
    const scenes=await stageApprovedMedia([{caption:"Desk",seconds:5,mediaId:"office-intro"},
      {caption:"CTA",seconds:6}],dir);
    assert.equal(scenes[0].mediaKind,"photo");
    assert.ok((await stat(join(dir,scenes[0].mediaFile))).size>1024);
    assert.equal(scenes[1].mediaFile,undefined);
    assert.equal(getMediaById("https://evil.test/a.png"),undefined);
    await assert.rejects(stageApprovedMedia([{mediaId:"../../private",seconds:5}],dir),/Unapproved/);
  }finally{await rm(dir,{recursive:true,force:true});}
});
