export function priorityFromScore(score, risks = []) {
  const value = Number(score) || 0;
  if (value >= 82 && risks.length <= 1) return "A";
  if (value >= 65) return "B";
  if (value >= 48) return "C";
  return "D";
}

export function developmentAction(priority) {
  return {
    A: "优先开发",
    B: "先核验再开发",
    C: "补全资料",
    D: "暂缓开发",
  }[priority] || "补全资料";
}
