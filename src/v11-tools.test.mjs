import assert from "node:assert/strict";
import {
  buildEnhancedDevelopmentPlan,
  recommendedContacts,
  riskBasedActions,
} from "./v11-tools.mjs";

const lead = {
  company: "Kinsman Kitchens",
  country: "Australia",
  website: "https://kinsman.com.au/",
  source: "https://kinsman.com.au/contact-us/",
  buyerType: "Kitchen Company / Designer",
  mainProducts: "厨房、衣柜、洗衣房、家居收纳",
  email: "官网表单优先",
  phone: "官网联系页核验",
  whatsappStatus: "电话可核验WhatsApp",
  contactPerson: "未公开",
  title: "Procurement / Sourcing / Design Director",
  linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Kinsman%20Kitchens",
};

const authenticity = {
  score: 62,
  level: "中",
  risks: ["未确认企业邮箱。", "缺少具体联系人或职位。"],
};

assert.deepEqual(recommendedContacts("Kitchen Company / Designer"), [
  "Owner / Managing Director",
  "Procurement Manager",
  "Production Manager",
  "Design Director",
  "Studio Owner / Lead Designer",
]);

const riskActions = riskBasedActions(lead, authenticity);
assert.ok(riskActions.some((item) => item.includes("LinkedIn")));
assert.ok(riskActions.some((item) => item.includes("官网表单")));

const plan = buildEnhancedDevelopmentPlan(lead, authenticity, "全屋定制、橱柜、衣柜、木门、家具出口");
assert.equal(plan.version, "v1.1");
assert.equal(plan.stage, "先核验再开发");
assert.equal(plan.channel, "官网表单 + LinkedIn 公司页 + LinkedIn 人员搜索");
assert.ok(plan.contacts.includes("Design Director"));
assert.ok(plan.steps[0].includes("Contact 页面"));
assert.ok(plan.steps.some((step) => step.includes("Kinsman Kitchens + Procurement")));
assert.match(plan.opening, /kitchen and wardrobe/i);
assert.match(plan.opening, /capability sheet/i);

console.log("v1.1 tools tests passed");
