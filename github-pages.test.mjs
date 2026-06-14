import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "index.html");

assert.equal(fs.existsSync(indexPath), true, "root index.html should exist for GitHub Pages");

const html = fs.readFileSync(indexPath, "utf8");

assert.match(html, /href="\.\/src\/styles\.css"/, "root index should load CSS from src");
assert.match(html, /src="\.\/src\/workflow-engine\.js"/, "root index should load workflow engine from src");
assert.match(html, /src="\.\/src\/app\.js"/, "root index should load app script from src");
