const serverErrorMap = {
  "Missing GOOGLE_SEARCH_API_KEY": "缺少 Google Search API Key，请在 .env 里填写 GOOGLE_SEARCH_API_KEY。",
  "Missing GOOGLE_SEARCH_CX": "缺少 Google Custom Search CX，请在 .env 里填写 GOOGLE_SEARCH_CX。",
  "Missing BING_SEARCH_API_KEY": "缺少 Bing Search API Key，请在 .env 里填写 BING_SEARCH_API_KEY。",
  "Missing SERPAPI_API_KEY": "缺少 SerpAPI Key，请在 .env 里填写 SERPAPI_API_KEY。",
  "Missing search query": "缺少搜索关键词。",
  "Invalid JSON request body": "请求内容不是有效 JSON。",
  "Request body too large": "请求内容过大。",
  "fetch failed": "后端无法连接搜索接口，请检查网络、代理或搜索服务配置。",
};

export function translateServerError(message) {
  return serverErrorMap[message] || message;
}
