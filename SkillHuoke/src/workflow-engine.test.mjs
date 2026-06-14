import assert from "node:assert/strict";
import { createWorkflowRun, parseWorkflowInstruction } from "./workflow-engine.mjs";

const instruction = `产品：全屋定制、橱柜、衣柜、木门、家具出口
目标国家：澳洲
客户类型：Builder + Designer + Kitchen Company + Importer
数量：5
联系方式优先级：WhatsApp > 电话 > 邮箱 > LinkedIn`;

const parsed = parseWorkflowInstruction(instruction);
assert.equal(parsed.product, "全屋定制、橱柜、衣柜、木门、家具出口");
assert.equal(parsed.country, "澳洲");
assert.deepEqual(parsed.buyerTypes, ["Builder", "Designer", "Kitchen Company", "Importer"]);
assert.equal(parsed.quantity, 5);
assert.deepEqual(parsed.contactPriority, ["WhatsApp", "电话", "邮箱", "LinkedIn"]);

const run = createWorkflowRun(instruction);
assert.equal(run.task.product, parsed.product);
assert.equal(run.task.country, "澳洲");
assert.equal(run.leads.length, 5);
assert.equal(run.steps.length, 9);
assert.ok(run.steps.every((step) => step.status === "done"));
assert.ok(run.leads[0].firstEmail.includes("whole-house custom cabinetry"));
assert.ok(run.leads[0].whatsappOpener.includes("May I send"));
assert.ok(["Verified", "New", "Not Fit"].includes(run.leads[0].crmStatus));

console.log("workflow-engine tests passed");
