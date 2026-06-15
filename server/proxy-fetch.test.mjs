import assert from "node:assert/strict";
import { normalizeProxyUrl, parseCurlResponse, shouldUseProxy } from "./proxy-fetch.mjs";

assert.equal(normalizeProxyUrl("127.0.0.1:10808"), "http://127.0.0.1:10808");
assert.equal(normalizeProxyUrl("http://127.0.0.1:10808"), "http://127.0.0.1:10808");
assert.equal(normalizeProxyUrl(""), "");

assert.equal(shouldUseProxy("https://www.googleapis.com/customsearch/v1"), true);
assert.equal(shouldUseProxy("http://127.0.0.1:4174/api/health"), false);
assert.equal(shouldUseProxy("http://localhost:4174/api/health"), false);

const parsed = parseCurlResponse('{"ok":true}\n__SKILLHUOKE_STATUS__:200');
assert.equal(parsed.status, 200);
assert.equal(parsed.body, '{"ok":true}');

console.log("proxy fetch tests passed");
