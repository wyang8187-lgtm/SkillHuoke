import assert from "node:assert/strict";
import { createSearchService } from "./search-service.mjs";

const calls = [];
const fakeFetch = async (url, options = {}) => {
  calls.push({ url, options });

  if (String(url).includes("customsearch")) {
    return {
      ok: true,
      json: async () => ({
        items: [
          {
            title: "Sydney Custom Joinery - Contact",
            link: "https://examplejoinery.com.au",
            snippet: "Custom kitchens and wardrobes in Sydney.",
          },
        ],
      }),
    };
  }

  if (String(url).includes("examplejoinery.com.au/contact")) {
    return {
      ok: true,
      text: async () => `
        <a href="https://www.linkedin.com/company/example-joinery">LinkedIn</a>
        <a href="https://wa.me/61412345678">WhatsApp</a>
        <p>sales@examplejoinery.com.au</p>
        <p>+61 2 9876 5432</p>
      `,
    };
  }

  return {
    ok: true,
    text: async () => '<a href="/contact">Contact</a>',
  };
};

const service = createSearchService({
  fetchImpl: fakeFetch,
  env: {
    GOOGLE_SEARCH_API_KEY: "google-key",
    GOOGLE_SEARCH_CX: "google-cx",
  },
});

const result = await service.search({
  provider: "google",
  query: "custom cabinetry Australia contact",
  country: "Australia",
  buyerType: "Builder",
  product: "custom cabinetry",
  enrichContact: true,
});

assert.equal(result.provider, "google");
assert.equal(result.query, "custom cabinetry Australia contact");
assert.equal(result.results.length, 1);
assert.equal(result.results[0].company, "Sydney Custom Joinery");
assert.equal(result.results[0].contact.emails[0], "sales@examplejoinery.com.au");
assert.equal(result.results[0].contact.phones[0], "+61 2 9876 5432");
assert.equal(result.results[0].contact.whatsapp[0], "https://wa.me/61412345678");
assert.equal(result.results[0].contact.linkedin[0], "https://www.linkedin.com/company/example-joinery");
assert.equal(result.results[0].parseStatus, "parsed");
assert.equal(result.results[0].quality.priority, "A");
assert.ok(result.results[0].quality.contactConfidence >= 80);
assert.ok(result.results[0].quality.reasons.includes("发现公开邮箱"));
assert.equal(calls[0].options.headers["User-Agent"], "SkillHuoke/1.3");

await assert.rejects(
  () =>
    createSearchService({ fetchImpl: fakeFetch, env: {} }).search({
      provider: "google",
      query: "kitchen company australia",
    }),
  /Missing GOOGLE_SEARCH_API_KEY/,
);

await assert.rejects(
  () =>
    createSearchService({
      fetchImpl: async () => ({
        ok: false,
        status: 403,
        text: async () => JSON.stringify({ error: { message: "Custom Search API has not been used" } }),
      }),
      env: {
        GOOGLE_SEARCH_API_KEY: "google-key",
        GOOGLE_SEARCH_CX: "google-cx",
      },
    }).search({
      provider: "google",
      query: "kitchen company australia",
    }),
  /Custom Search API has not been used/,
);

const fallbackCalls = [];
const fallbackService = createSearchService({
  fetchImpl: async (url, options = {}) => {
    fallbackCalls.push({ url, options });

    if (String(url).includes("customsearch")) {
      return {
        ok: false,
        status: 403,
        text: async () => JSON.stringify({ error: { message: "Google project has no Custom Search access" } }),
      };
    }

    if (String(url).includes("serpapi.com")) {
      return {
        ok: true,
        json: async () => ({
          organic_results: [
            {
              title: "Perth Cabinet Studio",
              link: "https://perthcabinet.example",
              snippet: "Cabinetry supplier for builders in Perth.",
            },
          ],
        }),
      };
    }

    throw new Error(`Unexpected URL ${url}`);
  },
  env: {
    GOOGLE_SEARCH_API_KEY: "google-key",
    GOOGLE_SEARCH_CX: "google-cx",
    SERPAPI_API_KEY: "serp-key",
  },
});

const fallbackResult = await fallbackService.search({
  provider: "google",
  query: "Australia custom cabinetry builder contact",
  enrichContact: false,
});

assert.equal(fallbackResult.provider, "serpapi");
assert.deepEqual(fallbackResult.attemptedProviders.map((item) => item.provider), ["google", "serpapi"]);
assert.equal(fallbackResult.attemptedProviders[0].ok, false);
assert.equal(fallbackResult.attemptedProviders[1].ok, true);
assert.equal(fallbackResult.results[0].company, "Perth Cabinet Studio");
assert.equal(fallbackCalls.length, 2);

console.log("search service tests passed");
