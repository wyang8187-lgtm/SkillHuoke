import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "index.html");

assert.equal(fs.existsSync(indexPath), true, "root index.html should exist for GitHub Pages");

const html = fs.readFileSync(indexPath, "utf8");

assert.match(html, /SkillHuoke V1\.6 试运营版/, "root index should show V1.6 trial version");
assert.match(html, /Skill获客/, "root index should show the SaaS product brand");
assert.match(html, /把外贸找客户变成可运行的 AI 工作流/, "root index should show the SaaS landing headline");
assert.match(html, /开始试运营/, "root index should show the primary trial CTA");
assert.match(html, /查看工作台/, "root index should show the workspace CTA");
assert.match(html, /id="trial"/, "root index should expose the trial workspace anchor");
assert.match(html, /产品功能/, "root index should show the reference-style product nav");
assert.match(html, /解决方案/, "root index should show the reference-style solution nav");
assert.match(html, /从找客户到成交，AI 工作流全流程覆盖/, "root index should show the reference workflow headline");
assert.match(html, /CRM 跟进计划/, "root index should show the CRM follow-up preview");
assert.doesNotMatch(html, /登录/, "root index should not show login before auth exists");
assert.doesNotMatch(html, /价格/, "root index should not show pricing before a pricing model exists");
assert.doesNotMatch(html, /客户案例/, "root index should not show case studies before real cases exist");
assert.doesNotMatch(html, /海关数据/, "root index should not claim customs data before it exists");
assert.doesNotMatch(html, /v0\.7|v0\.6|v1\.1/, "root index should not expose internal iteration labels");
assert.match(html, /href="\.\/src\/styles\.css"/, "root index should load CSS from src");
assert.match(html, /src="\.\/src\/v02-tools\.js"/, "root index should load v0.2 tools from src");
assert.match(html, /src="\.\/src\/v03-tools\.js"/, "root index should load v0.3 tools from src");
assert.match(html, /src="\.\/src\/v04-tools\.js"/, "root index should load v0.4 tools from src");
assert.match(html, /src="\.\/src\/v10-tools\.js"/, "root index should load v1.0 tools from src");
assert.match(html, /src="\.\/src\/v11-tools\.js"/, "root index should load v1.1 tools from src");
assert.match(html, /src="\.\/src\/v12-tools\.js"/, "root index should load v1.2 tools from src");
assert.match(html, /src="\.\/src\/v12b-search\.js"/, "root index should load v1.2B search tools from src");
assert.match(html, /src="\.\/src\/workflow-engine\.js"/, "root index should load workflow engine from src");
assert.match(html, /type="module" src="\.\/src\/main\.js"/, "root index should load V1.6 main program from src");
assert.doesNotMatch(html, /src="\.\/src\/app\.js"/, "root index should not load the legacy app script directly");
