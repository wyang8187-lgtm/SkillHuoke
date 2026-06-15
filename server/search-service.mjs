import { buildContactPageCandidates, extractContactSignals, mergeContactSignals } from "./contact-parser.mjs";
import { assessLeadCandidate } from "./lead-quality.mjs";

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

function hasProviderConfig(provider, env) {
  if (provider === "google") return Boolean(env.GOOGLE_SEARCH_API_KEY && env.GOOGLE_SEARCH_CX);
  if (provider === "bing") return Boolean(env.BING_SEARCH_API_KEY);
  if (provider === "serpapi") return Boolean(env.SERPAPI_API_KEY);
  return false;
}

function providerPriority(requestedProvider, env) {
  const defaultOrder = ["serpapi", "bing", "google"];
  const requested = requestedProvider && requestedProvider !== "auto" ? requestedProvider : "";
  const ordered = requested ? [requested, ...defaultOrder.filter((provider) => provider !== requested)] : defaultOrder;
  return ordered.filter((provider) => hasProviderConfig(provider, env));
}

async function fetchJson(fetchImpl, url, options) {
  const response = await fetchImpl(url, options);
  if (!response.ok) {
    const body = await response.text?.().catch(() => "");
    let message = "";
    try {
      const payload = JSON.parse(body);
      message = payload.error?.message || payload.message || "";
    } catch {
      message = body;
    }
    throw new Error(message || `Search provider request failed: ${response.status || "unknown"}`);
  }
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
  const candidate = {
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
  return {
    ...candidate,
    quality: assessLeadCandidate(candidate),
  };
}

export function createSearchService({ fetchImpl = globalThis.fetch, env = process.env } = {}) {
  if (!fetchImpl) throw new Error("fetch is not available in this Node runtime");

  return {
    async search(input) {
      const requestedProvider = input.provider || "auto";
      const query = clean(input.query);
      if (!query) throw new Error("Missing search query");

      const providers = providerPriority(requestedProvider, env);
      if (!providers.length) {
        searchUrl({ provider: requestedProvider === "auto" ? "serpapi" : requestedProvider, query, env });
      }

      const attemptedProviders = [];
      let lastError;

      for (const provider of providers) {
        try {
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

          attemptedProviders.push({ provider, ok: true, count: results.length });

          return {
            provider,
            requestedProvider,
            query,
            attemptedProviders,
            results,
          };
        } catch (error) {
          lastError = error;
          attemptedProviders.push({ provider, ok: false, error: error.message });
        }
      }

      const attemptedText = attemptedProviders.map((item) => `${item.provider}: ${item.error || "ok"}`).join("；");
      throw new Error(`所有搜索源均失败。${attemptedText || lastError?.message || ""}`);
    },
  };
}
