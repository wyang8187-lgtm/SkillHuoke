function clean(value) {
  return String(value ?? "").trim();
}

function splitBuyerTypes(value) {
  return clean(value)
    .split(/\s*\+\s*|[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizedWebsiteKey(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return clean(url).toLowerCase();
  }
}

export function buildBatchQueries({ product, country, buyerType, quantity }) {
  const targetCountry = clean(country) || "Australia";
  const productText = clean(product) || "custom cabinetry";
  const buyerTypes = splitBuyerTypes(buyerType);
  const coreBuyerTypes = buyerTypes.length ? buyerTypes : ["Builder", "Designer", "Kitchen Company", "Importer"];
  const queryLimit = Math.min(Math.max(Math.ceil((Number(quantity) || 20) / 8), 4), 10);

  const queries = [];
  for (const type of coreBuyerTypes) {
    queries.push(`${targetCountry} ${productText} ${type} contact`);
  }

  for (const type of coreBuyerTypes) {
    queries.push(`${targetCountry} ${type} ${productText} supplier email`);
  }

  queries.push(`${targetCountry} custom joinery company contact`);
  queries.push(`${targetCountry} kitchen cabinet company importer`);
  queries.push(`${targetCountry} wardrobe cabinet supplier builder`);

  return [...new Set(queries)].slice(0, queryLimit);
}

export async function runLeadBatch({ searchService, input }) {
  const queries = input.queries?.length ? input.queries : buildBatchQueries(input);
  const maxTasks = Math.min(Number(input.maxTasks) || queries.length, queries.length);
  const tasks = [];
  const candidates = [];
  const seen = new Set();
  const skipped = { duplicates: 0, noise: 0, failures: 0 };

  for (const query of queries.slice(0, maxTasks)) {
    const task = {
      query,
      status: "running",
      provider: "",
      found: 0,
      accepted: 0,
      skippedNoise: 0,
      skippedDuplicates: 0,
      error: "",
    };
    tasks.push(task);

    try {
      const result = await searchService.search({
        provider: input.provider || "auto",
        query,
        country: input.country,
        buyerType: input.buyerType,
        product: input.product,
        enrichContact: input.enrichContact,
      });

      task.provider = result.provider;
      task.found = result.results.length;
      task.attemptedProviders = result.attemptedProviders;

      for (const candidate of result.results) {
        const quality = candidate.quality || {};
        const key = normalizedWebsiteKey(candidate.website);

        if (quality.priority === "D") {
          skipped.noise += 1;
          task.skippedNoise += 1;
          continue;
        }

        if (seen.has(key)) {
          skipped.duplicates += 1;
          task.skippedDuplicates += 1;
          continue;
        }

        seen.add(key);
        task.accepted += 1;
        candidates.push({
          ...candidate,
          batchKeyword: query,
          batchProvider: result.provider,
        });
      }

      task.status = "completed";
    } catch (error) {
      skipped.failures += 1;
      task.status = "failed";
      task.error = error.message;
    }
  }

  return {
    product: input.product || "",
    country: input.country || "",
    buyerType: input.buyerType || "",
    tasks,
    candidates,
    skipped,
    summary: {
      totalTasks: tasks.length,
      completedTasks: tasks.filter((task) => task.status === "completed").length,
      accepted: candidates.length,
      skippedNoise: skipped.noise,
      skippedDuplicates: skipped.duplicates,
      failures: skipped.failures,
    },
  };
}
