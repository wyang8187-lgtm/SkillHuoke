import fs from "node:fs";
import path from "node:path";

export function loadDotEnv(envPath = path.resolve(process.cwd(), ".env"), env = process.env) {
  if (!fs.existsSync(envPath)) return env;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!env[key]) env[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return env;
}
