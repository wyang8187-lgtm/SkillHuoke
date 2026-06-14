import assert from "node:assert/strict";
import {
  buildCsvTemplate,
  createManualLead,
  mergeImportedLeads,
  parseCustomerCsv,
} from "./v03-tools.mjs";

const csv = `公司名,国家,城市,客户类型,官网,联系人,职位,WhatsApp,电话,邮箱,LinkedIn,备注
"Sydney Joinery Co","Australia","Sydney","Builder","https://example.com","Michael","Director","+61 400 000 000","+61 2 0000 0000","sales@example.com","https://linkedin.com/company/example","真实客户"
"Sydney Joinery Co","Australia","Sydney","Builder","https://example.com","","","","","","","重复客户"
"Melbourne Cabinets","Australia","Melbourne","Kitchen Company","","Sarah","Owner","","+61 3 0000 0000","hello@melcab.example","","待核验"`;

const parsed = parseCustomerCsv(csv);
assert.equal(parsed.length, 3);
assert.equal(parsed[0].company, "Sydney Joinery Co");
assert.equal(parsed[0].crmStatus, "New");
assert.equal(parsed[0].whatsappStatus, "已提供WhatsApp");
assert.equal(parsed[2].website, "");

const manual = createManualLead(
  {
    company: "Brisbane Builder",
    country: "Australia",
    buyerType: "Builder",
    website: "https://builder.example",
  },
  20,
);

assert.equal(manual.id, 20);
assert.equal(manual.crmStatus, "New");
assert.equal(manual.priority, "B");
assert.equal(manual.score, 76);

const existing = [
  {
    id: 1,
    company: "Sydney Joinery Co",
    country: "Australia",
    website: "https://example.com",
    crmStatus: "Contacted",
    followNote: "保留已有跟进",
    email: "",
  },
];

const merged = mergeImportedLeads(existing, parsed, 2);
assert.equal(merged.leads.length, 2);
assert.equal(merged.added, 1);
assert.equal(merged.updated, 1);
assert.equal(merged.skipped, 1);
assert.equal(merged.leads[0].crmStatus, "Contacted");
assert.equal(merged.leads[0].followNote, "保留已有跟进");
assert.equal(merged.leads[0].email, "sales@example.com");
assert.equal(merged.leads[1].id, 2);

const template = buildCsvTemplate();
assert.match(template, /^﻿公司名,国家,城市,客户类型,官网,联系人,职位,WhatsApp,电话,邮箱,LinkedIn,备注/);

console.log("v0.3 tools tests passed");
