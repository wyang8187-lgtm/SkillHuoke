export const workbenchElementIds = {
  workflowInstruction: "workflowInstruction",
  runWorkflow: "runWorkflow",
  productInput: "productInput",
  countryInput: "countryInput",
  buyerInput: "buyerInput",
  quantityInput: "quantityInput",
  leadRows: "leadRows",
  detail: "detail",
  searchResults: "searchResults",
  batchTaskLog: "batchTaskLog",
};

export function collectElements(ids = workbenchElementIds, root = document) {
  return Object.fromEntries(Object.entries(ids).map(([key, id]) => [key, root.getElementById(id)]));
}
