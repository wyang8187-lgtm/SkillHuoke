import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createSearchService } from "./services/search-service.mjs";
import { createConfiguredFetch, resolveProxyUrl } from "./services/proxy-fetch.mjs";
import { createApiRouter } from "./api/routes.mjs";
import { loadDotEnv } from "./config/env.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../src");
const port = Number(process.env.PORT || 4174);
const serverMetadata = { version: "1.7", stage: "trial-showcase" };
const version = serverMetadata.version;

const contentTypes = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".csv": "text/csv;charset=utf-8",
};

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

loadDotEnv(path.resolve(__dirname, "../.env"));

const proxyUrl = resolveProxyUrl();
const searchService = createSearchService({
  fetchImpl: createConfiguredFetch({ proxyUrl }),
});
const routeApiRequest = createApiRouter({ searchService, version });

const server = http.createServer(async (request, response) => {
  if (await routeApiRequest(request, response)) return;
  serveStatic(request, response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`SkillHuoke v${version} running at http://127.0.0.1:${port}`);
  console.log(`Search API: POST http://127.0.0.1:${port}/api/search`);
  console.log(proxyUrl ? `Proxy enabled: ${proxyUrl}` : "Proxy disabled");
});
