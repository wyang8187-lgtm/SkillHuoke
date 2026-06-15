import assert from "node:assert/strict";
import { assessLeadCandidate } from "./lead-quality.mjs";

const strong = assessLeadCandidate({
  company: "Sydney Joinery Works",
  website: "https://sydneyjoinery.com.au",
  snippet: "Custom kitchens, wardrobes, cabinetry and builder joinery projects in Sydney.",
  product: "custom cabinetry, wardrobes, kitchen cabinets",
  buyerType: "Builder + Kitchen Company",
  contact: {
    emails: ["sales@sydneyjoinery.com.au"],
    phones: ["+61 2 9000 0000"],
    whatsapp: ["https://wa.me/61290000000"],
    linkedin: ["https://www.linkedin.com/company/sydney-joinery-works"],
    contactPages: ["https://sydneyjoinery.com.au/contact"],
  },
});

assert.equal(strong.priority, "A");
assert.equal(strong.verdict, "优先开发");
assert.ok(strong.score >= 85);
assert.ok(strong.contactConfidence >= 85);
assert.ok(strong.reasons.includes("官网域名邮箱"));
assert.ok(strong.reasons.includes("有公开联系页面"));
assert.ok(strong.nextAction.includes("优先核验"));

const noisy = assessLeadCandidate({
  company: "Random Facebook Post",
  website: "https://www.facebook.com/groups/123/posts/456",
  snippet: "Someone asked about cabinets in a public group.",
  product: "custom cabinetry",
  buyerType: "Builder",
  contact: {
    emails: [],
    phones: [],
    whatsapp: [],
    linkedin: [],
    contactPages: [],
  },
});

assert.equal(noisy.priority, "D");
assert.equal(noisy.verdict, "疑似噪音");
assert.ok(noisy.score <= 45);
assert.ok(noisy.risks.includes("社媒帖子或目录页"));
assert.ok(noisy.nextAction.includes("不要直接开发"));

console.log("lead quality tests passed");
