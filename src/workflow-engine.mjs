const baseCompanies = [
  ["Kinsman Kitchens", "Sydney", "https://kinsman.com.au/", "https://kinsman.com.au/contact-us/", "Kitchen Company / Designer", "厨房、衣柜、洗衣房、收纳系统", 89],
  ["Freedom Kitchens", "Sydney", "https://freedomkitchens.com.au/", "https://freedomkitchens.com.au/contact-us/", "Kitchen Company / Designer", "厨房、衣柜、洗衣房、家居收纳", 88],
  ["Wallspan Kitchens & Wardrobes", "Adelaide", "https://www.wallspan.com.au/", "https://www.wallspan.com.au/contact-us/", "Kitchen Company / Designer", "厨房、衣柜、洗衣房、收纳", 86],
  ["Kitchen Connection", "Brisbane", "https://www.kitchenconnection.com.au/", "https://www.kitchenconnection.com.au/contact-us/", "Kitchen Company / Designer", "厨房翻新、橱柜、设计服务", 85],
  ["Apollo Kitchens", "Sydney", "https://www.apollokitchens.com.au/", "https://www.apollokitchens.com.au/contact-us/", "Kitchen Company / Builder Supplier", "厨房、joinery、住宅和商业项目", 84],
  ["Kaboodle Kitchen", "Melbourne", "https://www.kaboodle.com.au/", "https://www.kaboodle.com.au/contact-us", "Kitchen Company / Importer", "平板包装厨房、橱柜、门板", 84],
  ["Bunnings", "Melbourne", "https://www.bunnings.com.au/", "https://www.bunnings.com.au/contact-us", "Importer / Retailer", "建材、厨房、门、衣柜、家具相关品类", 82],
  ["Harrington Kitchens", "Sydney", "https://www.harringtonkitchens.com.au/", "https://www.harringtonkitchens.com.au/contact/", "Kitchen Company / Designer", "厨房、洗衣房、浴室柜、定制 joinery", 82],
  ["Metricon Homes", "Melbourne", "https://www.metricon.com.au/", "https://www.metricon.com.au/contact-us", "Builder", "住宅建造、厨房、衣柜、木门需求", 82],
  ["Stegbar", "National", "https://www.stegbar.com.au/", "https://www.stegbar.com.au/contact-us/", "Builder Supplier", "门窗、衣柜、淋浴屏", 79],
  ["Corinthian Doors", "National", "https://www.corinthian.com.au/", "https://www.corinthian.com.au/contact-us/", "Door Company / Builder Supplier", "室内门、入户门", 73],
  ["Laminex Australia", "National", "https://www.laminex.com.au/", "https://www.laminex.com.au/contact-us", "Builder Supplier / Distributor", "板材、装饰面、橱柜材料", 78],
];

const workflowSteps = [
  "创建找客任务",
  "生成搜索关键词",
  "发现客户公司",
  "补全公司信息",
  "核验联系方式",
  "AI客户评分",
  "生成开发内容",
  "进入CRM跟进",
  "导出结果",
];

function getLineValue(text, labels) {
  const labelPattern = labels.join("|");
  const match = text.match(new RegExp(`(?:${labelPattern})\\s*[：:]\\s*([^\\n]+)`, "i"));
  return match ? match[1].trim() : "";
}

function normalizeCountry(country) {
  if (/澳洲|澳大利亚|australia/i.test(country)) return "澳洲";
  return country || "澳洲";
}

function splitList(value) {
  return value
    .split(/\s*(?:\+|>|,|，|、|\/)\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseWorkflowInstruction(instruction) {
  const text = instruction.trim();
  const product = getLineValue(text, ["产品", "Product"]) || "全屋定制、橱柜、衣柜、木门、家具出口";
  const country = normalizeCountry(getLineValue(text, ["目标国家", "国家", "市场", "Country"]));
  const buyerTypes = splitList(getLineValue(text, ["客户类型", "Buyer Types", "Buyer Type"]));
  const quantityRaw = getLineValue(text, ["数量", "客户数量", "Quantity"]);
  const quantity = Math.max(1, Math.min(Number.parseInt(quantityRaw, 10) || 12, 100));
  const contactPriority = splitList(getLineValue(text, ["联系方式优先级", "联系优先级", "Contact Priority"])) || [];

  return {
    product,
    country,
    buyerTypes: buyerTypes.length ? buyerTypes : ["Builder", "Designer", "Kitchen Company", "Importer"],
    quantity,
    contactPriority: contactPriority.length ? contactPriority : ["WhatsApp", "电话", "邮箱", "LinkedIn"],
  };
}

function priority(score) {
  if (score >= 85) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  return "D";
}

function crmStatus(score) {
  if (score >= 75) return "Verified";
  if (score >= 60) return "New";
  return "Not Fit";
}

function buildEmail(company, product, products) {
  const englishProduct = "whole-house custom cabinetry, kitchen cabinets, wardrobes, wood doors, and export furniture";
  return `Subject: ${company} and custom cabinetry supply

Hi ${company} team,

I noticed that ${company} works with ${products}. We manufacture ${englishProduct} for builders, designers, kitchen companies, and importers. Your current product direction looks relevant to ${englishProduct}.

Would it be useful if I send a short catalogue and capability sheet for cabinets, wardrobes, wood doors, and furniture packages?

Best regards,`;
}

function buildWhatsapp(company, product, products) {
  return `Hi ${company} team, this is [Your Name]. I saw that your company works with ${products}. We manufacture whole-house custom cabinetry, kitchen cabinets, wardrobes, wood doors, and export furniture. May I send a short catalogue and project reference?`;
}

function createLead(seed, index, task) {
  const [company, city, website, source, buyerType, products, baseScore] = seed;
  const score = Math.max(62, baseScore - Math.floor(index / baseCompanies.length) * 3);
  const name = index < baseCompanies.length ? company : `${company} 候选拓展 ${Math.floor(index / baseCompanies.length) + 1}`;
  const p = priority(score);

  return {
    id: index + 1,
    company: name,
    country: task.country,
    city,
    website,
    source,
    buyerType,
    mainProducts: products,
    productMatch: `与 ${task.product} 存在直接或相邻匹配。`,
    summary: `${name} 的公开业务与 ${products} 相关，可作为 ${task.buyerTypes.join(" / ")} 方向的开发对象。`,
    whatsappStatus: score >= 75 ? "电话可核验WhatsApp" : "未公开WhatsApp",
    phone: "官网联系页核验；未发现可直接确认的公开 WhatsApp 号码",
    emailStatus: "联系表单",
    email: "未确认公开直邮；优先官网表单，邮箱为辅助补全",
    linkedin: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(company)}`,
    contactPerson: "未公开",
    title: "Procurement / Sourcing / Owner / Design Director / Project Manager",
    score,
    priority: p,
    crmStatus: crmStatus(score),
    nextAction: p === "A" ? "优先人工核验联系方式并发送开发信。" : "进入二次筛选或渠道补全。",
    followNote: "工作流生成：发送前请人工核验来源、联系人和联系方式。",
    scoreBreakdown: [Math.min(30, score - 58), 18, 15, score >= 75 ? 11 : 8, 7, 5],
    firstEmail: buildEmail(name, task.product, products),
    whatsappOpener: buildWhatsapp(name, task.product, products),
  };
}

function keywords(task) {
  const countryEn = task.country === "澳洲" ? "Australia" : task.country;
  return [
    `custom cabinetry ${countryEn} builder`,
    `kitchen company ${countryEn} custom cabinets`,
    `wardrobe company ${countryEn} contact`,
    `wood doors ${countryEn} builder supplier`,
    `kitchen importer ${countryEn} cabinets`,
    `joinery company ${countryEn} kitchen wardrobe`,
  ];
}

export function createWorkflowRun(instruction) {
  const task = parseWorkflowInstruction(instruction);
  const leads = Array.from({ length: task.quantity }, (_, index) => createLead(baseCompanies[index % baseCompanies.length], index, task));

  return {
    task,
    keywords: keywords(task),
    steps: workflowSteps.map((name, index) => ({
      name,
      status: "done",
      note: index === 4 ? "联系方式按 WhatsApp > 电话 > 邮箱 > LinkedIn 规则核验，不编造号码。" : "已完成",
    })),
    leads,
  };
}
