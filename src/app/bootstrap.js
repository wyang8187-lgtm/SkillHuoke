export function markSkillHuokeRuntime() {
  document.documentElement.dataset.skillhuokeRuntimeVersion = "1.6";
  document.documentElement.dataset.skillhuokeRuntimeMode = "trial-showcase";
  window.SkillHuokeRuntime = {
    ...(window.SkillHuokeRuntime || {}),
    version: "1.6",
    mode: "trial-showcase",
    bootedAt: new Date().toISOString(),
  };
}

export async function bootLegacyWorkbench() {
  await import("../app.js");
}
