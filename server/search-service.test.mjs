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
assert.equal(calls[0].options.headers["User-Agent"], "SkillHuoke/1.3");

await assert.rejects(
  () =>
    createSearchService({ fetchImpl: fakeFetch, env: {} }).search({
      provider: "google",
      query: "kitchen company australia",
    }),
  /Missing GOOGLE_SEARCH_API_KEY/,
);

console.log("search service tests passed");
