import { cleanLeadValue } from "./lead-model.mjs";

export function normalizedWebsiteKey(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return cleanLeadValue(url).toLowerCase();
  }
}

export function companyCountryKey(lead = {}) {
  return `${cleanLeadValue(lead.company).toLowerCase()}|${cleanLeadValue(lead.country).toLowerCase()}`;
}

export function leadDedupeKey(lead = {}) {
  return normalizedWebsiteKey(lead.website) || companyCountryKey(lead);
}

export function mergeLeadPreservingCrm(existing = {}, incoming = {}) {
  return {
    ...existing,
    ...incoming,
    crmStatus: existing.crmStatus || incoming.crmStatus || "New",
    followNote: existing.followNote || incoming.followNote || "",
    tags: existing.tags?.length ? existing.tags : incoming.tags || [],
    timeline: existing.timeline?.length ? existing.timeline : incoming.timeline || [],
  };
}
