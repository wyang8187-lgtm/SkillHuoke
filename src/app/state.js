export function createRuntimeState(seed = {}) {
  return {
    leads: [],
    selectedId: null,
    searchCandidates: [],
    filters: {},
    ...seed,
  };
}
