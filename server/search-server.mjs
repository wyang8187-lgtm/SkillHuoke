import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSearchService } from "./search-service.mjs";
import { createConfiguredFetch, resolveProxyUrl } from "./proxy-fetch.mjs";
import { runLeadBatch } from "./batch-workflow.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../src");
const port = Number(process.env.PORT || 4174);

const contentTypes = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".csv": "text/csv;charset=utf-8",
};

function loadDotEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!process.env[key]) process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON request body"));
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json;charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function translateServerError(message) {
  const map = {
    "Missing GOOGLE_SEARCH_API_KEY": "缺少谷歌搜索 API 密钥，请在 .env 里填写 GOOGLE_SEARCH_API_KEY。",
    "Missing GOOGLE_SEARCH_CX": "缺少谷歌搜索引擎编号，请在 .env 里填写 GOOGLE_SEARCH_CX。",
    "Missing BING_SEARCH_API_KEY": "缺少必应搜索 API 密钥，请在 .env 里填写 BING_SEARCH_API_KEY。",
    "Missing SERPAPI_API_KEY": "缺少 SerpAPI 密钥，请在 .env 里填写 SERPAPI_API_KEY。",
    "Missing search query": "缺少搜索关键词。",
    "fetch failed": "后端无法连接搜索接口，请检查网络、代理或改用可访问的搜索服务。",
    "Requests to this API customsearch method google.customsearch.v1.CustomSearchService.List are blocked.": "当前 API 密钥没有放行谷歌自定义搜索接口，请到 Google Cloud 的密钥设置里把 API 限制改为 Custom Search API，或临时选择不限制。",
    "Invalid JSON request body": "请求内容不是有效 JSON。",
    "Request body too large": "请求内容过大。",
  };
  return map[message] || message;
}

function serveStatic(request, response) {
  const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.resolve(root, `.${safePath}`);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(data);
  });
}

loadDotEnv();

const proxyUrl = resolveProxyUrl();
const searchService = createSearchService({
  fetchImpl: createConfiguredFetch({ proxyUrl }),
});

const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/api/health") {
    sendJson(response, 200, { ok: true, version: "1.5" });
    return;
  }

  if (request.method === "POST" && request.url === "/api/search") {
    try {
      const input = await readJsonBody(request);
      const result = await searchService.search(input);
      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 400, { error: translateServerError(error.message) });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/batch-search") {
    try {
      const input = await readJsonBody(request);
      const result = await runLeadBatch({ searchService, input });
      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 400, { error: translateServerError(error.message) });
    }
    return;
  }

  serveStatic(request, response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`SkillHuoke v1.5 running at http://127.0.0.1:${port}`);
  console.log("Search API: POST http://127.0.0.1:4174/api/search");
  console.log(proxyUrl ? `Proxy enabled: ${proxyUrl}` : "Proxy disabled");
});
