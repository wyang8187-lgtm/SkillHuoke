import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^\uFEFF/, "");
}

const expectedFiles = [
  "src/main.js",
  "src/app/bootstrap.js",
  "src/app/dom.js",
  "src/app/events.js",
  "src/app/render.js",
  "src/app/state.js",
  "src/features/workflow/index.js",
  "src/features/search/index.js",
  "src/features/leads/index.js",
  "src/features/crm/index.js",
  "src/features/outreach/index.js",
  "src/features/import-export/index.js",
  "src/shared/constants.js",
  "src/shared/csv.js",
  "src/shared/storage.js",
  "src/shared/text.js",
  "server/main.mjs",
  "server/api/routes.mjs",
  "server/api/errors.mjs",
  "server/config/env.mjs",
  "server/services/search-service.mjs",
  "server/services/contact-parser.mjs",
  "server/services/lead-quality.mjs",
  "server/services/batch-workflow.mjs",
  "server/services/proxy-fetch.mjs",
  "shared/lead-model.mjs",
  "shared/lead-dedupe.mjs",
  "shared/lead-scoring.mjs",
  "shared/search-strategy.mjs",
  "shared/outreach-rules.mjs",
];

for (const file of expectedFiles) {
  assert.equal(exists(file), true, `${file} should exist in the layered trial-showcase structure`);
}

const indexHtml = read("src/index.html");
assert.match(indexHtml, /<script type="module" src="\.\/main\.js"><\/script>/);
assert.doesNotMatch(indexHtml, /<script src="\.\/app\.js"><\/script>/);

const packageJson = JSON.parse(read("package.json"));
assert.equal(packageJson.scripts.start, "node server/main.mjs");
assert.match(packageJson.scripts.test, /tests\/v16-layering\.test\.mjs/);

const serverMain = read("server/main.mjs");
assert.match(serverMain, /version:\s*"1\.7"/);

console.log("Layered trial-showcase structure is present.");
