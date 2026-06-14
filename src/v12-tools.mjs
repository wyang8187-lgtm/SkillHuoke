const productTerms = [
  ["全屋定制", "whole-house custom cabinetry"],
  ["橱柜", "kitchen cabinets"],
  ["衣柜", "wardrobes"],
  ["木门", "wood doors"],
  ["家具出口", "export furniture"],
  ["家具", "furniture"],
];

export const publicContactFields = [
  "公司名",
  "官网",
  "国家",
  "城市",
  "客户类型",
  "Contact页面",
  "About页面",
  "邮箱",
  "电话",
  "WhatsApp核验状态",
  "LinkedIn公司页",
  "Facebook公开主页",
  "TikTok公开主页",
  "联系人",
  "职位",
  "来源URL",
  "真实性评分",
];

export function normalizeProductForEnglish(product = "") {
  const normalizedSource = product.includes("家具出口") ? product.replaceAll("家具出口", "") : product;
  const matched = productTerms.filter(([cn]) => product.includes(cn) && (cn === "家具出口" || normalizedSource.includes(cn))).map(([, en]) => en);
  const unique = [...new Set(matched)];
  if (!unique.length) return product || "custom cabinetry and export furniture";
  if (unique.length === 1) return unique[0];
  return `${unique.slice(0, -1).join(", ")}, and ${unique.at(-1)}`;
}

export function rewriteEnglishMessage(message, product = "") {
  let output = message;
  output = output.replaceAll(product, normalizeProductForEnglish(product));
  productTerms.forEach(([cn, en]) => {
    output = output.replaceAll(cn, en);
  });
  output = output.replace(/、/g, ", ");
  return output;
}

function countryText(country) {
  if (/澳洲|澳大利亚/i.test(country)) return "Australia";
  return country || "Australia";
}

export function buildLeadSourcePlan({ product, country, buyerTypes }) {
  const market = countryText(country);
  const englishProduct = normalizeProductForEnglish(product);
  const buyers = buyerTypes?.length ? buyerTypes : ["Builder", "Designer", "Kitchen Company", "Importer"];

  return {
    mode: "public-source-api-ready",
    apiProviders: ["Google Custom Search API", "SerpAPI", "Bing Web Search API", "Hunter/Snov/Apollo email enrichment"],
    googleQueries: [
      `custom cabinetry ${market} builder contact`,
      `kitchen company ${market} procurement email`,
      `wardrobe joinery ${market} contact us`,
      `wood doors ${market} builder supplier`,
      `"${englishProduct}" ${market} importer distributor`,
    ],
    linkedinQueries: buyers.map((buyer) => `site:linkedin.com/company ${buyer} ${market} cabinetry procurement`),
    socialQueries: [
      `site:facebook.com ${market} kitchen company cabinets`,
      `site:facebook.com ${market} joinery wardrobes`,
      `site:tiktok.com ${market} kitchen renovation company`,
      `site:tiktok.com ${market} custom cabinetry`,
    ],
    extractionTargets: publicContactFields,
    complianceNotes: [
      "只处理公开网页和公开公司主页，不抓取私密账号或绕过登录。",
      "联系方式进入客户池后标记为待核验，人工确认后再开发。",
      "不自动发送邮件或 WhatsApp，避免封号和误发。",
    ],
  };
}
