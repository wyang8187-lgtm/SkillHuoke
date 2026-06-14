import assert from "node:assert/strict";
import {
  addTag,
  createFollowUp,
  dataQuality,
  removeTag,
  validateLeadInput,
} from "./v04-tools.mjs";

const lead = {
  id: 1,
  company: "Sydney Joinery Co",
  country: "Australia",
  website: "example.com",
  email: "bad-email",
  phone: "",
  whatsappStatus: "未公开WhatsApp",
  linkedin: "linkedin-company",
  contactPerson: "未公开",
  tags: ["高潜力"],
  followUps: [],
};

const withTags = addTag(lead, "需核验WhatsApp");
assert.deepEqual(withTags.tags, ["高潜力", "需核验WhatsApp"]);
assert.deepEqual(addTag(withTags, "高潜力").tags, ["高潜力", "需核验WhatsApp"]);
assert.deepEqual(removeTag(withTags, "高潜力").tags, ["需核验WhatsApp"]);

const followUp = createFollowUp({
  channel: "Email",
  content: "Sent first email",
  result: "Waiting",
  nextAction: "Follow up in 3 days",
});
assert.equal(followUp.channel, "Email");
assert.match(followUp.date, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(followUp.content, "Sent first email");

const validation = validateLeadInput(lead);
assert.ok(validation.some((item) => item.field === "官网"));
assert.ok(validation.some((item) => item.field === "邮箱"));
assert.ok(validation.some((item) => item.field === "联系方式"));
assert.ok(validation.some((item) => item.field === "LinkedIn"));

const quality = dataQuality(lead);
assert.equal(quality.level, "低");
assert.ok(quality.missingFields.includes("联系人"));
assert.ok(quality.suggestions.includes("先补全或核验联系方式，再进入开发动作。"));

const strongQuality = dataQuality({
  ...lead,
  website: "https://example.com",
  email: "sales@example.com",
  phone: "+61 2 0000 0000",
  linkedin: "https://linkedin.com/company/example",
  contactPerson: "Michael",
});
assert.equal(strongQuality.level, "高");

console.log("v0.4 tools tests passed");
