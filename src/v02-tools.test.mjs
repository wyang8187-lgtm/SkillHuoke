import assert from "node:assert/strict";
import {
  buildCsv,
  buildSavedState,
  createTemplateMessage,
  mergeSavedLeads,
  templateLibrary,
} from "./v02-tools.mjs";

const lead = {
  id: 1,
  company: "Kinsman Kitchens",
  country: "Australia",
  city: "Sydney",
  website: "https://kinsman.com.au/",
  buyerType: "Kitchen Company / Designer",
  mainProducts: "厨房、衣柜、洗衣房、收纳系统",
  whatsappStatus: "电话可核验WhatsApp",
  phone: "官网联系页核验",
  email: "官网表单优先",
  linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Kinsman%20Kitchens",
  contactPerson: "未公开",
  score: 89,
  priority: "A",
  crmStatus: "New",
  nextAction: "发送开发信",
  followNote: "初始备注",
  source: "https://kinsman.com.au/contact-us/",
};

assert.deepEqual(
  templateLibrary.map((template) => template.id),
  ["first-touch", "follow-up", "quote-invite"],
);

assert.match(createTemplateMessage("first-touch", lead, "全屋定制"), /Subject:/);
assert.match(createTemplateMessage("follow-up", lead, "全屋定制"), /following up/i);
assert.match(createTemplateMessage("quote-invite", lead, "全屋定制"), /quotation/i);

const savedState = buildSavedState({
  leads: [{ ...lead, crmStatus: "Contacted", followNote: "已发 WhatsApp" }],
  selectedId: 1,
  taskStatus: "v0.2 saved",
});

const restoredSnapshot = mergeSavedLeads([], savedState);
assert.equal(restoredSnapshot[0].company, "Kinsman Kitchens");
assert.equal(restoredSnapshot[0].crmStatus, "Contacted");

const merged = mergeSavedLeads([{ ...lead }], savedState);
assert.equal(merged[0].crmStatus, "Contacted");
assert.equal(merged[0].followNote, "已发 WhatsApp");

const csv = buildCsv([merged[0]], {
  product: "全屋定制",
  templateId: "quote-invite",
});

assert.match(csv, /^﻿"公司名","国家","城市","客户类型","联系人","WhatsApp","电话","邮箱","LinkedIn","评分","优先级","CRM状态","下一步","跟进备注","开发信","官网","来源链接"/);
assert.match(csv, /Kinsman Kitchens/);
assert.match(csv, /quotation/i);

console.log("v0.2 tools tests passed");
