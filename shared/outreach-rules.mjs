export const outreachTemplates = {
  firstTouch: "Initial outreach",
  secondFollowUp: "Second follow-up",
  quoteInvite: "Quote invitation",
};

export function recommendedContactRoles(buyerType = "") {
  const text = String(buyerType).toLowerCase();
  if (text.includes("builder") || text.includes("project")) return ["Owner", "Project", "Procurement"];
  if (text.includes("designer") || text.includes("kitchen")) return ["Owner", "Design", "Project"];
  if (text.includes("import") || text.includes("sourcing")) return ["Owner", "Sourcing", "Procurement"];
  return ["Owner", "Procurement", "Project", "Design", "Sourcing"];
}
