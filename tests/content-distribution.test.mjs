import test from "node:test";
import assert from "node:assert/strict";
import {isPublishedPostUrl} from "../src/lib/content/distribution.ts";
test("requires a real social-platform HTTPS URL",()=>{
  assert.equal(isPublishedPostUrl("TIKTOK","https://www.tiktok.com/@creator/video/123"),true);
  assert.equal(isPublishedPostUrl("YOUTUBE","https://youtu.be/testid"),true);
  assert.equal(isPublishedPostUrl("TIKTOK","https://tiktok.com.evil.test/@person"),false);
  assert.equal(isPublishedPostUrl("INSTAGRAM","http://www.instagram.com/p/123"),false);
  assert.equal(isPublishedPostUrl("FACEBOOK","https://user:password@facebook.com/something"),false);
  assert.equal(isPublishedPostUrl("YOUTUBE","javascript:alert(1)"),false);
});
