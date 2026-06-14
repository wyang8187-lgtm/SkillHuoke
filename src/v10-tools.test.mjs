import assert from "node:assert/strict";
import {
  authenticityScore,
  buildDevelopmentPlan,
  buildSearchStrategy,
  classifyLeadStage,
} from "./v10-tools.mjs";

const strongLead = {
  company: "Sydney Joinery Co",
  country: "Australia",
  website: "https://sydneyjoinery.example.com",
  source: "https://sydneyjoinery.example.com/contact",
  buyerType: "Kitchen Company / Builder",
  mainProducts: "厨房、衣柜、定制 joinery",
  phone: "+61 2 9000 0000",
  email: "procurement@sydneyjoinery.example.com",
  whatsappStatus: "电话可核验WhatsApp",
  contactPerson: "Michael Stone",
  title: "Procurement Manager",
  linkedin: "https://www.linkedin.com/company/sydney-joinery",
};

const weakLead = {
  company: "Random Leads List",
  country: "",
  website: "",
  source: "",
  buyerType: "Unknown",
  mainProducts: "",
  phone: "未填写",
  email: "random@gmail.com",
  whatsappStatus: "未公开WhatsApp",
  contactPerson: "未公开",
  title: "",
  linkedin: "linkedin-company",
};

const strongScore = authenticityScore(strongLead, "全屋定制、橱柜、衣柜、木门、家具出口");
assert.equal(strongScore.level, "高");
assert.ok(strongScore.score >= 75);
assert.ok(strongScore.reasons.some((item) => item.includes("官网")));
assert.ok(strongScore.reasons.some((item) => item.includes("企业邮箱")));

const weakScore = authenticityScore(weakLead, "全屋定制");
assert.equal(weakScore.level, "风险");
assert.ok(weakScore.score < 45);
assert.ok(weakScore.risks.some((item) => item.includes("缺少官网")));
assert.ok(weakScore.risks.some((item) => item.includes("免费邮箱")));

const strategy = buildSearchStrategy({
  product: "全屋定制、橱柜、衣柜、木门、家具出口",
  country: "Australia",
  buyerTypes: ["Builder", "Designer", "Kitchen Company", "Importer"],
});

assert.ok(strategy.googleQueries.some((query) => query.includes("custom cabinetry Australia")));
assert.ok(strategy.linkedinQueries.some((query) => query.includes("Procurement")));
assert.ok(strategy.sourceTypes.includes("官网 Contact 页面"));

const plan = buildDevelopmentPlan(strongLead, strongScore);
assert.equal(plan.channel, "Email + LinkedIn");
assert.ok(plan.actions.length >= 3);
assert.match(plan.opening, /Sydney Joinery Co/);

assert.equal(classifyLeadStage(strongScore), "优先开发");
assert.equal(classifyLeadStage(weakScore), "暂缓开发");

console.log("v1.0 tools tests passed");
