import { buildContactPageCandidates, extractContactSignals, mergeContactSignals } from "./contact-parser.mjs";

function clean(value) {
  return String(value ?? "").trim();
}

function stripCompanySuffix(title) {
  return clean(title)
    .replace(/\s*[-|–].*$/, "")
    .replace(/\s*(Contact|About Us|Home|Official Site)$/i, "")
    .trim();
}

function searchUrl({ provider, query, env }) {
  const encodedQuery = encodeURIComponent(query);

  if (provider === "google") {
    if (!env.GOOGLE_SEARCH_API_KEY) throw new Error("Missing GOOGLE_SEARCH_API_KEY");
    if (!env.GOOGLE_SEARCH_CX) throw new Error("Missing GOOGLE_SEARCH_CX");
    return `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(env.GOOGLE_SEARCH_API_KEY)}&cx=${encodeURIComponent(env.GOOGLE_SEARCH_CX)}&q=${encodedQuery}`;
  }

  if (provider === "bing") {
    if (!env.BING_SEARCH_API_KEY) throw new Error("Missing BING_SEARCH_API_KEY");
    return `https://api.bing.microsoft.com/v7.0/search?q=${encodedQuery}`;
  }

  if (provider === "serpapi") {
    if (!env.SERPAPI_API_KEY) throw new Error("Missing SERPAPI_API_KEY");
    return `https://serpapi.com/search.json?engine=google&api_key=${encodeURIComponent(env.SERPAPI_API_KEY)}&q=${encodedQuery}`;
  }

  throw new Error(`Unsupported search provider: ${provider}`);
}

function searchHeaders({ provider, env }) {
  const headers = { "User-Agent": "SkillHuoke/1.3" };
  if (provider === "bing") headers["Ocp-Apim-Subscription-Key"] = env.BING_SEARCH_API_KEY;
  return headers;
}

function normalizeProviderResults(provider, payload) {
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

async function fetchJson(fetchImpl, url, options) {
  const response = await fetchImpl(url, options);
  if (!response.ok) throw new Error(`Search provider request failed: ${response.status || "unknown"}`);
  return response.json();
}

async function fetchText(fetchImpl, url) {
  const response = await fetchImpl(url, {
    headers: { "User-Agent": "SkillHuoke/1.3" },
  });
  if (!response.ok) return "";
  return response.text();
}

async function enrichContact(fetchImpl, website) {
  const candidates = buildContactPageCandidates(website);
  const signals = [];

  for (const candidate of candidates.slice(0, 5)) {
    try {
      const html = await fetchText(fetchImpl, candidate);
      if (html) signals.push(extractContactSignals(html, candidate));
    } catch {
      signals.push({
        emails: [],
        phones: [],
        whatsapp: [],
        linkedin: [],
        contactPages: [],
        status: "parse-failed",
      });
    }
  }

  return mergeContactSignals(signals);
}

function toLeadCandidate(result, input, contact) {
  const company = stripCompanySuffix(result.title) || result.url;

  return {
    company,
    country: input.country || "待核验",
    buyerType: input.buyerType || "搜索发现客户",
    product: input.product || "",
    website: result.url,
    source: result.source,
    snippet: result.snippet,
    parseStatus: contact.status,
    contact,
  };
}

export function createSearchService({ fetchImpl = globalThis.fetch, env = process.env } = {}) {
  if (!fetchImpl) throw new Error("fetch is not available in this Node runtime");

  return {
    async search(input) {
      const provider = input.provider || "google";
      const query = clean(input.query);
      if (!query) throw new Error("Missing search query");

      const url = searchUrl({ provider, query, env });
      const payload = await fetchJson(fetchImpl, url, {
        headers: searchHeaders({ provider, env }),
      });

      const rawResults = normalizeProviderResults(provider, payload).filter((result) => result.url);
      const results = [];

      for (const result of rawResults) {
        const contact = input.enrichContact === false
          ? { emails: [], phones: [], whatsapp: [], linkedin: [], contactPages: [], status: "not-requested" }
          : await enrichContact(fetchImpl, result.url);
        results.push(toLeadCandidate(result, input, contact));
      }

      return {
        provider,
        query,
        results,
      };
    },
  };
}
