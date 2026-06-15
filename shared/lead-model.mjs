export function cleanLeadValue(value) {
  return String(value ?? "").trim();
}

export function normalizeLeadModel(lead = {}) {
  return {
    company: cleanLeadValue(lead.company),
    country: cleanLeadValue(lead.country),
    city: cleanLeadValue(lead.city),
    website: cleanLeadValue(lead.website),
    source: cleanLeadValue(lead.source),
    buyerType: cleanLeadValue(lead.buyerType),
    crmStatus: cleanLeadValue(lead.crmStatus) || "New",
    followNote: cleanLeadValue(lead.followNote),
  };
}
