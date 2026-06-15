import { execFileSync, spawn } from "node:child_process";

const STATUS_MARKER = "__SKILLHUOKE_STATUS__:";

export function normalizeProxyUrl(proxyUrl) {
  const value = String(proxyUrl || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || /^socks[45]?:\/\//i.test(value)) return value;
  return `http://${value}`;
}

export function shouldUseProxy(url) {
  try {
    const target = new URL(url);
    return !["127.0.0.1", "localhost", "::1"].includes(target.hostname);
  } catch {
    return false;
  }
}

export function parseCurlResponse(output) {
  const text = String(output);
  const markerIndex = text.lastIndexOf(STATUS_MARKER);
  if (markerIndex < 0) return { status: 0, body: text };

  const body = text.slice(0, markerIndex).replace(/\r?\n$/, "");
  const status = Number(text.slice(markerIndex + STATUS_MARKER.length).trim()) || 0;
  return { status, body };
}

export function readWindowsProxy() {
  if (process.platform !== "win32") return "";

  try {
    const output = execFileSync("reg", [
      "query",
      "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings",
      "/v",
      "ProxyServer",
    ], { encoding: "utf8" });
    const match = output.match(/ProxyServer\s+REG_SZ\s+(.+)/i);
    return normalizeProxyUrl(match?.[1] || "");
  } catch {
    return "";
  }
}

export function resolveProxyUrl(env = process.env) {
  return normalizeProxyUrl(env.SKILLHUOKE_PROXY || env.HTTPS_PROXY || env.HTTP_PROXY || readWindowsProxy());
}

function curlRequest(url, options, proxyUrl) {
  return new Promise((resolve, reject) => {
    const headers = options.headers || {};
    const method = options.method || "GET";
    const args = [
      "-sS",
      "-L",
      "--max-time",
      "30",
      "-w",
      `\n${STATUS_MARKER}%{http_code}`,
      "-x",
      proxyUrl,
      "-X",
      method,
    ];

    for (const [key, value] of Object.entries(headers)) {
      args.push("-H", `${key}: ${value}`);
    }

    if (options.body != null) {
      args.push("--data-binary", "@-");
    }

    args.push(url);

    const child = spawn("curl.exe", args, { windowsHide: true });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim() || `代理请求失败，curl 退出码 ${code}`));
        return;
      }
      const parsed = parseCurlResponse(stdout);
      resolve({
        ok: parsed.status >= 200 && parsed.status < 300,
        status: parsed.status,
        text: async () => parsed.body,
        json: async () => JSON.parse(parsed.body),
      });
    });

    if (options.body != null) child.stdin.end(options.body);
    else child.stdin.end();
  });
}

export function createConfiguredFetch({ proxyUrl = resolveProxyUrl(), fetchImpl = globalThis.fetch } = {}) {
  const normalizedProxy = normalizeProxyUrl(proxyUrl);

  return async function configuredFetch(url, options = {}) {
    if (normalizedProxy && shouldUseProxy(url)) {
      return curlRequest(String(url), options, normalizedProxy);
    }
    return fetchImpl(url, options);
  };
}
