function clean(value) {
  return String(value ?? "").trim();
}

function stripCompanySuffix(title) {
  return clean(title)
    .replace(/\s*[-|–].*$/, "")
    .replace(/\s*(Contact|About Us|Home|Official Site)$/i, "")
    .trim();
}

function hostFromUrl(url) {
  try {
    return new URL(url).origin;
  } catch {
    return clean(url);
  }
}

export function normalizeSearchResults(provider, payload) {
  if (provider === "google") {
    return (payload.items || []).map((item) => ({
      title: clean(item.title),
      url: clean(item.link),
      snippet: clean(item.snippet),
      source: "Google Custom Search",
    }));
  }

  if (provider === "bing") {
    return (payload.webPages?.value || []).map((item) => ({
      title: clean(item.name),
      url: clean(item.url),
      snippet: clean(item.snippet),
      source: "Bing Web Search",
    }));
  }

  if (provider === "serpapi") {
    return (payload.organic_results || []).map((item) => ({
      title: clean(item.title),
      url: clean(item.link),
      snippet: clean(item.snippet),
      source: "SerpAPI",
    }));
  }

  return [];
}

export function convertResultToLead(result, { id, country, buyerType, product }) {
  const company = stripCompanySuffix(result.title) || hostFromUrl(result.url);
  const website = clean(result.url);
  const rootWebsite = hostFromUrl(website);

  return {
    id,
    company,
    country: country || "Australia",
    city: "待核验",
    website,
    source: website,
    buyerType: buyerType || "搜索发现客户",
    mainProducts: result.snippet || "公开搜索结果，需人工核验主营业务。",
    productMatch: `搜索结果与 ${product || "目标产品"} 存在关键词相关，需核验真实匹配度。`,
    summary: result.snippet || `${company} 来自公开搜索结果。`,
    whatsappStatus: "未公开WhatsApp",
    phone: "待官网 Contact 页面核验",
    emailStatus: "待核验",
    email: "待补全",
    linkedin: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(company)}`,
    contactPerson: "未公开",
    title: "待 LinkedIn / 官网核验",
    score: 72,
    priority: "B",
    crmStatus: "New",
    nextAction: "打开官网和 LinkedIn，核验联系人、邮箱、电话和客户类型。",
    followNote: "搜索发现：Google/Bing/SerpAPI 公开结果，加入后需人工核验官网、联系人和联系方式。",
    scoreBreakdown: [22, 15, 12, 8, 8, 7],
    selectedTemplateId: "first-touch",
    tags: ["搜索发现", "待核验"],
    followUps: [],
    leadSource: "搜索发现",
    searchSource: result.source,
    rootWebsite,
  };
}

export function buildSearchUrl({ provider, apiKey, query, searchEngineId }) {
  const encodedQuery = encodeURIComponent(query);
  const encodedKey = encodeURIComponent(apiKey);

  if (provider === "google") {
    return `https://www.googleapis.com/customsearch/v1?key=${encodedKey}&cx=${encodeURIComponent(searchEngineId || "")}&q=${encodedQuery}`;
  }

  if (provider === "bing") {
    return `https://api.bing.microsoft.com/v7.0/search?q=${encodedQuery}`;
  }

  if (provider === "serpapi") {
    return `https://serpapi.com/search.json?engine=google&api_key=${encodedKey}&q=${encodedQuery}`;
  }

  throw new Error("Unsupported search provider");
}
