import assert from "node:assert/strict";
import {
  buildWorkspaceBackup,
  defaultProjectSettings,
  parseWorkspaceBackup,
  validateProjectSettings,
} from "./v10-rc-tools.mjs";

const settings = {
  product: "全屋定制、橱柜、衣柜、木门、家具出口",
  country: "Australia",
  buyerTypes: "Builder + Designer + Kitchen Company + Importer",
};

assert.deepEqual(validateProjectSettings({}), defaultProjectSettings);
assert.deepEqual(validateProjectSettings(settings), settings);

const backup = buildWorkspaceBackup({
  settings,
  leads: [{ id: 1, company: "Sydney Joinery Co", crmStatus: "New" }],
  selectedId: 1,
  taskStatus: "V1.0 RC test",
});

const parsed = JSON.parse(backup);
assert.equal(parsed.version, "1.0.0-rc");
assert.equal(parsed.leads[0].company, "Sydney Joinery Co");
assert.match(parsed.exportedAt, /^\d{4}-\d{2}-\d{2}T/);

const restored = parseWorkspaceBackup(backup);
assert.equal(restored.settings.country, "Australia");
assert.equal(restored.leads.length, 1);
assert.equal(restored.selectedId, 1);

assert.throws(() => parseWorkspaceBackup("{bad json"), /无法读取备份文件/);
assert.throws(() => parseWorkspaceBackup(JSON.stringify({ leads: "bad" })), /备份文件缺少客户列表/);

console.log("v1.0 rc tools tests passed");
