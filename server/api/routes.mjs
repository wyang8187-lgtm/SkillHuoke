import { runLeadBatch } from "../services/batch-workflow.mjs";
import { translateServerError } from "./errors.mjs";

export function readJsonBody(request) {
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

export function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json;charset=utf-8" });
  response.end(JSON.stringify(payload));
}

export function createApiRouter({ searchService, version = "1.6" }) {
  return async function routeApiRequest(request, response) {
    if (request.method === "GET" && request.url === "/api/health") {
      sendJson(response, 200, { ok: true, version });
      return true;
    }

    if (request.method === "POST" && request.url === "/api/search") {
      try {
        const input = await readJsonBody(request);
        const result = await searchService.search(input);
        sendJson(response, 200, result);
      } catch (error) {
        sendJson(response, 400, { error: translateServerError(error.message) });
      }
      return true;
    }

    if (request.method === "POST" && request.url === "/api/batch-search") {
      try {
        const input = await readJsonBody(request);
        const result = await runLeadBatch({ searchService, input });
        sendJson(response, 200, result);
      } catch (error) {
        sendJson(response, 400, { error: translateServerError(error.message) });
      }
      return true;
    }

    return false;
  };
}
