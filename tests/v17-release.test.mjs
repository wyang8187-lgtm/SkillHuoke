import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildUploadReport, uploadPackageExcludes } from "../scripts/upload-report.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8").replace(/^\uFEFF/, "");
}

const packageJson = JSON.parse(read("package.json"));
assert.equal(packageJson.version, "1.7.0-beta");
assert.equal(packageJson.scripts.start, "node server/main.mjs");
assert.match(packageJson.scripts.test, /tests\/v17-release\.test\.mjs/);

const bootstrap = read("src/app/bootstrap.js");
assert.match(bootstrap, /skillhuokeRuntimeVersion = "1\.7"/);
assert.match(bootstrap, /version: "1\.7"/);

const serverMain = read("server/main.mjs");
assert.match(serverMain, /version:\s*"1\.7"/);
assert.match(serverMain, /stage:\s*"trial-showcase"/);

const indexHtml = read("src/index.html");
assert.match(indexHtml, /SkillHuoke V1\.7/);
assert.match(indexHtml, /type="module" src="\.\/main\.js"/);

const report = buildUploadReport({
  version: "1.7",
  packageName: "SkillHuoke-V1.7-Upload.zip",
  generatedAt: "2026-06-15 17:00",
});

assert.match(report, /SkillHuoke V1\.7 上传报告/);
assert.match(report, /上传备注/);
assert.match(report, /试运营展示版/);
assert.match(report, /SkillHuoke-V1\.7-Upload\.zip/);
assert.equal(uploadPackageExcludes.includes(".env"), true);
assert.equal(uploadPackageExcludes.includes(".superpowers"), true);
assert.equal(uploadPackageExcludes.includes(".v16-server.pid"), true);

console.log("V1.7 release metadata and upload report are ready.");
