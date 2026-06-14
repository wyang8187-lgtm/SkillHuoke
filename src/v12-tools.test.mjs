import assert from "node:assert/strict";
import {
  buildLeadSourcePlan,
  normalizeProductForEnglish,
  publicContactFields,
  rewriteEnglishMessage,
} from "./v12-tools.mjs";

const product = "全屋定制、橱柜、衣柜、木门、家具出口";
assert.equal(
  normalizeProductForEnglish(product),
  "whole-house custom cabinetry, kitchen cabinets, wardrobes, wood doors, and export furniture",
);

const message = rewriteEnglishMessage(
  "We manufacture 全屋定制、橱柜、衣柜、木门、家具出口 for builders.",
  product,
);
assert.equal(
  message,
  "We manufacture whole-house custom cabinetry, kitchen cabinets, wardrobes, wood doors, and export furniture for builders.",
);

const plan = buildLeadSourcePlan({
  product,
  country: "Australia",
  buyerTypes: ["Builder", "Designer", "Kitchen Company", "Importer"],
});

assert.equal(plan.mode, "public-source-api-ready");
assert.ok(plan.googleQueries.some((query) => query.includes("custom cabinetry Australia builder contact")));
assert.ok(plan.socialQueries.some((query) => query.includes("site:facebook.com")));
assert.ok(plan.socialQueries.some((query) => query.includes("site:tiktok.com")));
assert.ok(plan.linkedinQueries.some((query) => query.includes("site:linkedin.com/company")));
assert.ok(plan.apiProviders.includes("Google Custom Search API"));
assert.ok(plan.apiProviders.includes("SerpAPI"));
assert.deepEqual(publicContactFields.slice(0, 4), ["公司名", "官网", "国家", "城市"]);

console.log("v1.2 tools tests passed");
