import assert from "node:assert/strict";
import { buildBatchQueries, runLeadBatch } from "./batch-workflow.mjs";

const queries = buildBatchQueries({
  product: "全屋定制、橱柜、衣柜、木门、家具出口",
  country: "Australia",
  buyerType: "Builder + Designer + Kitchen Company + Importer",
  quantity: 50,
});

assert.ok(queries.length >= 6);
assert.ok(queries[0].includes("Australia"));
assert.ok(queries.some((query) => query.includes("Builder")));
assert.ok(queries.some((query) => query.includes("contact")));

const searchCalls = [];
const fakeSearchService = {
  async search(input) {
    searchCalls.push(input.query);

    if (input.query.includes("Builder")) {
      return {
        provider: "serpapi",
        attemptedProviders: [{ provider: "serpapi", ok: true, count: 2 }],
        results: [
          {
            company: "Sydney Joinery Works",
            website: "https://sydneyjoinery.com.au",
            source: "SerpAPI",
            snippet: "Custom cabinetry for builders.",
            quality: { priority: "A", score: 91, verdict: "优先开发", risks: [], reasons: ["业务关键词匹配"] },
          },
          {
            company: "Facebook Group Post",
            website: "https://www.facebook.com/groups/123/posts/456",
            source: "SerpAPI",
            snippet: "A public social post.",
            quality: { priority: "D", score: 35, verdict: "疑似噪音", risks: ["社媒帖子或目录页"], reasons: [] },
          },
        ],
      };
    }

    return {
      provider: "serpapi",
      attemptedProviders: [{ provider: "serpapi", ok: true, count: 1 }],
      results: [
        {
          company: "Sydney Joinery Duplicate",
          website: "https://sydneyjoinery.com.au/contact",
          source: "SerpAPI",
          snippet: "Duplicate contact page.",
          quality: { priority: "B", score: 75, verdict: "先核验再开发", risks: [], reasons: ["有公开网址"] },
        },
      ],
    };
  },
};

const batch = await runLeadBatch({
  searchService: fakeSearchService,
  input: {
    provider: "auto",
    product: "custom cabinetry",
    country: "Australia",
    buyerType: "Builder + Designer",
    quantity: 20,
    enrichContact: false,
    maxTasks: 2,
  },
});

assert.equal(batch.tasks.length, 2);
assert.equal(batch.candidates.length, 1);
assert.equal(batch.candidates[0].company, "Sydney Joinery Works");
assert.equal(batch.candidates[0].batchKeyword, batch.tasks[0].query);
assert.equal(batch.skipped.noise, 1);
assert.equal(batch.skipped.duplicates, 1);
assert.equal(searchCalls.length, 2);

console.log("batch workflow tests passed");
