export const defaultTags = ["高潜力", "需核验WhatsApp", "已发开发信", "已回复", "报价中", "重点客户"];

function clean(value) {
  return String(value ?? "").trim();
}

function uniqueTags(tags) {
  return [...new Set((tags || []).map(clean).filter(Boolean))];
}

export function addTag(lead, tag) {
  return {
    ...lead,
    tags: uniqueTags([...(lead.tags || []), tag]),
  };
}

export function removeTag(lead, tag) {
  return {
    ...lead,
    tags: uniqueTags(lead.tags).filter((item) => item !== tag),
  };
}

export function createFollowUp({ date, channel, content, result, nextAction }) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: date || new Date().toISOString().slice(0, 10),
    channel: clean(channel) || "Email",
    content: clean(content),
    result: clean(result),
    nextAction: clean(nextAction),
  };
}

function looksLikeUrl(value) {
  const text = clean(value);
  return !text || /^https?:\/\/[^.\s]+\.[^\s]+/i.test(text);
}

function looksLikeEmail(value) {
  const text = clean(value);
  return !text || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

function looksLikeLinkedIn(value) {
  const text = clean(value);
  return !text || /^https?:\/\/(www\.)?linkedin\.com\//i.test(text);
}

export function validateLeadInput(lead) {
  const issues = [];
  if (!clean(lead.company)) issues.push({ field: "公司名", message: "公司名为空，无法作为有效客户保存。" });
  if (!clean(lead.country)) issues.push({ field: "国家", message: "国家为空，后续市场筛选会不准确。" });
  if (!looksLikeUrl(lead.website)) issues.push({ field: "官网", message: "官网格式异常，建议以 https:// 开头。" });
  if (!looksLikeEmail(lead.email) && !["未填写", "未确认公开直邮；优先官网表单，邮箱为辅助补全"].includes(clean(lead.email))) {
    issues.push({ field: "邮箱", message: "邮箱格式异常，建议人工核验。" });
  }
  const hasContact = clean(lead.phone) && clean(lead.phone) !== "未填写";
  const hasWhatsapp = clean(lead.whatsappStatus) && !/未公开/.test(clean(lead.whatsappStatus));
  if (!hasContact && !hasWhatsapp) issues.push({ field: "联系方式", message: "电话或 WhatsApp 为空，建议补全后再开发。" });
  if (!looksLikeLinkedIn(lead.linkedin)) issues.push({ field: "LinkedIn", message: "LinkedIn 格式异常，建议使用完整公司页面或搜索链接。" });
  return issues;
}

export function dataQuality(lead) {
  const missingFields = [];
  if (!clean(lead.website)) missingFields.push("官网");
  if (!clean(lead.email) || ["未填写", "未确认公开直邮；优先官网表单，邮箱为辅助补全"].includes(clean(lead.email))) missingFields.push("邮箱");
  if (!clean(lead.phone) || clean(lead.phone) === "未填写") missingFields.push("电话");
  if (!clean(lead.contactPerson) || clean(lead.contactPerson) === "未公开") missingFields.push("联系人");
  if (!clean(lead.linkedin)) missingFields.push("LinkedIn");

  const issues = validateLeadInput(lead);
  const score = 100 - missingFields.length * 12 - issues.length * 10;
  const level = score >= 75 ? "高" : score >= 50 ? "中" : "低";
  const suggestions = [];
  if (missingFields.includes("官网")) suggestions.push("先补全官网，避免重复客户和来源不清。");
  if (missingFields.includes("联系人")) suggestions.push("优先查找采购、项目经理、设计负责人。");
  if (missingFields.includes("邮箱") || missingFields.includes("电话")) suggestions.push("先补全或核验联系方式，再进入开发动作。");
  if (!suggestions.length) suggestions.push("资料较完整，可以进入开发或报价跟进。");

  return {
    level,
    missingFields,
    issues,
    suggestions,
  };
}
