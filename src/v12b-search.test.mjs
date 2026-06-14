import assert from "node:assert/strict";
import {
  buildSearchUrl,
  convertResultToLead,
  normalizeSearchResults,
} from "./v12b-search.mjs";

const googlePayload = {
  items: [
    {
      title: "Sydney Custom Joinery - Contact",
      link: "https://sydneyjoinery.example/contact",
      snippet: "Custom kitchens, wardrobes and joinery in Sydney.",
    },
  ],
};

const bingPayload = {
  webPages: {
    value: [
      {
        name: "Melbourne Cabinet Makers",
        url: "https://melbournecabinet.example",
        snippet: "Kitchen cabinets and wardrobes for builders.",
      },
    ],
  },
};

const serpPayload = {
  organic_results: [
    {
      title: "Brisbane Kitchen Company",
      link: "https://brisbanekitchen.example",
      snippet: "Kitchen renovation and cabinetry showroom.",
    },
  ],
};

assert.equal(normalizeSearchResults("google", googlePayload)[0].title, "Sydney Custom Joinery - Contact");
assert.equal(normalizeSearchResults("bing", bingPayload)[0].url, "https://melbournecabinet.example");
assert.equal(normalizeSearchResults("serpapi", serpPayload)[0].snippet, "Kitchen renovation and cabinetry showroom.");

const lead = convertResultToLead(normalizeSearchResults("google", googlePayload)[0], {
  id: 30,
  country: "Australia",
  buyerType: "Kitchen Company",
  product: "全屋定制、橱柜、衣柜、木门、家具出口",
});

assert.equal(lead.id, 30);
assert.equal(lead.company, "Sydney Custom Joinery");
assert.equal(lead.website, "https://sydneyjoinery.example/contact");
assert.equal(lead.crmStatus, "New");
assert.equal(lead.priority, "B");
assert.equal(lead.followNote, "搜索发现：Google/Bing/SerpAPI 公开结果，加入后需人工核验官网、联系人和联系方式。");
assert.equal(lead.leadSource, "搜索发现");

const googleUrl = buildSearchUrl({
  provider: "google",
  apiKey: "KEY",
  query: "custom cabinetry Australia",
  searchEngineId: "CX",
});
assert.match(googleUrl, /^https:\/\/www.googleapis.com\/customsearch\/v1\?/);
assert.match(googleUrl, /key=KEY/);
assert.match(googleUrl, /cx=CX/);

const bingUrl = buildSearchUrl({ provider: "bing", apiKey: "KEY", query: "kitchen Australia" });
assert.match(bingUrl, /^https:\/\/api.bing.microsoft.com\/v7\.0\/search\?/);

const serpUrl = buildSearchUrl({ provider: "serpapi", apiKey: "KEY", query: "joinery Australia" });
assert.match(serpUrl, /^https:\/\/serpapi\.com\/search\.json\?/);

const enrichedLead = convertResultToLead(
  {
    title: "Perth Cabinet Studio",
    url: "https://perthcabinet.example",
    snippet: "Custom cabinets for builders.",
    source: "SkillHuoke Backend",
    parseStatus: "parsed",
    contact: {
      emails: ["sales@perthcabinet.example"],
      phones: ["+61 8 9000 0000"],
      whatsapp: ["https://wa.me/61890000000"],
      linkedin: ["https://www.linkedin.com/company/perth-cabinet-studio"],
      contactPages: ["https://perthcabinet.example/contact"],
    },
  },
  {
    id: 31,
    country: "Australia",
    buyerType: "Builder",
    product: "custom cabinetry",
  },
);

assert.equal(enrichedLead.email, "sales@perthcabinet.example");
assert.equal(enrichedLead.phone, "+61 8 9000 0000");
assert.equal(enrichedLead.whatsappStatus, "https://wa.me/61890000000");
assert.equal(enrichedLead.linkedin, "https://www.linkedin.com/company/perth-cabinet-studio");
assert.match(enrichedLead.nextAction, /perthcabinet\.example\/contact/);

console.log("v1.2B search tests passed");
