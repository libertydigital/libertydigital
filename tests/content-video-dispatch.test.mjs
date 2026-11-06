import test from "node:test";
import assert from "node:assert/strict";
import { dispatchContentVideoWorker } from "../src/lib/content/worker-dispatch.ts";

test("no token leaves rendering safely queued for the scheduled worker", async () => {
  assert.deepEqual(await dispatchContentVideoWorker({token: ""}), {
    dispatched: false, reason: "GitHub dispatch token not configured",
  });
});
test("configured token triggers existing workflow on main", async () => {
  let seen = 0;
  const result = await dispatchContentVideoWorker({token: "test-token", request: async (url, opts) => {
    seen++;
    assert.equal(url, "https://api.github.com/repos/libertydigital/libertydigital/actions/workflows/content-video-worker.yml/dispatches");
    assert.equal(opts.method, "POST");
    assert.equal(opts.headers.Authorization, "Bearer test-token");
    assert.deepEqual(JSON.parse(opts.body), {ref: "main"});
    return {status: 204};
  }});
  assert.equal(seen, 1);
  assert.deepEqual(result, {dispatched: true});
});
test("non-204 GitHub response preserves queue", async () => {
  assert.deepEqual(await dispatchContentVideoWorker({token:"test-token", request: async () => ({status: 403})}), {
    dispatched: false, reason: "GitHub dispatch HTTP 403",
  });
});
test("network failure preserves queue", async () => {
  assert.deepEqual(await dispatchContentVideoWorker({token:"test-token", request: async () => {throw new Error("offline")}}), {
    dispatched: false, reason: "GitHub dispatch request failed",
  });
});
