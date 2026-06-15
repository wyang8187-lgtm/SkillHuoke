import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "index.html");

assert.equal(fs.existsSync(indexPath), true, "root index.html should exist for GitHub Pages");

const html = fs.readFileSync(indexPath, "utf8");

assert.match(html, /SkillHuoke v1\.5/, "root index should show v1.5 version");
assert.match(html, /href="\.\/src\/styles\.css"/, "root index should load CSS from src");
assert.match(html, /src="\.\/src\/v02-tools\.js"/, "root index should load v0.2 tools from src");
assert.match(html, /src="\.\/src\/v03-tools\.js"/, "root index should load v0.3 tools from src");
assert.match(html, /src="\.\/src\/v04-tools\.js"/, "root index should load v0.4 tools from src");
assert.match(html, /src="\.\/src\/v10-tools\.js"/, "root index should load v1.0 tools from src");
assert.match(html, /src="\.\/src\/v11-tools\.js"/, "root index should load v1.1 tools from src");
assert.match(html, /src="\.\/src\/v12-tools\.js"/, "root index should load v1.2 tools from src");
assert.match(html, /src="\.\/src\/v12b-search\.js"/, "root index should load v1.2B search tools from src");
assert.match(html, /src="\.\/src\/workflow-engine\.js"/, "root index should load workflow engine from src");
assert.match(html, /src="\.\/src\/app\.js"/, "root index should load app script from src");
