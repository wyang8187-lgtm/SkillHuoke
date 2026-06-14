(function () {
  function clean(value) {
    return String(value ?? "").trim();
  }

  function recommendedContacts(buyerType = "") {
    const text = buyerType.toLowerCase();
    const contacts = [];

    if (/builder/.test(text)) {
      contacts.push("Procurement Manager", "Project Manager", "Specification Manager");
    }
    if (/kitchen|joinery/.test(text)) {
      contacts.push("Owner / Managing Director", "Procurement Manager", "Production Manager");
    }
    if (/designer|design/.test(text)) {
      contacts.push("Design Director", "Studio Owner / Lead Designer");
    }
    if (/importer|retailer|distributor/.test(text)) {
      contacts.push("Sourcing Manager", "Category Buyer", "Purchasing Manager");
    }

    const fallback = ["Owner / Managing Director", "Procurement Manager", "Project Manager"];
    return [...new Set(contacts.length ? contacts : fallback)];
  }

  function hasGenericEmail(lead) {
    return /表单|未确认|未填写|info@|sales@/i.test(clean(lead.email));
  }

  function lacksPerson(lead) {
    return !clean(lead.contactPerson) || clean(lead.contactPerson) === "未公开";
  }

  function riskBasedActions(lead, authenticity) {
    const actions = [];
    if (lacksPerson(lead) || authenticity.risks?.some((risk) => risk.includes("联系人"))) {
      actions.push(`用 LinkedIn 搜索 ${lead.company} + Procurement / Project / Design，先找真人联系人。`);
    }
    if (hasGenericEmail(lead) || authenticity.risks?.some((risk) => risk.includes("邮箱"))) {
      actions.push("未确认直邮时，先用官网表单发送短开发信，同时记录表单入口。");
    }
    if (/电话可核验WhatsApp/.test(clean(lead.whatsappStatus))) {
      actions.push("电话可作为 WhatsApp 核验线索，但不要默认直接当 WhatsApp 群发。");
    }
    if (!clean(lead.website)) {
      actions.push("缺少官网时先暂停开发，优先补全公司官网和来源。");
    }
    return actions.length ? actions : ["客户信息较完整，可以直接进入首次开发并设置 3 天跟进。"];
  }

  function stageFromScore(score) {
    if (score >= 75) return "优先开发";
    if (score >= 55) return "先核验再开发";
    if (score >= 45) return "补全资料";
    return "暂缓开发";
  }

  function channelFromStage(stage) {
    if (stage === "优先开发") return "Email + LinkedIn + 官网表单备选";
    if (stage === "先核验再开发") return "官网表单 + LinkedIn 公司页 + LinkedIn 人员搜索";
    if (stage === "补全资料") return "LinkedIn 搜索 + 官网核验";
    return "先核验资料";
  }

  function productPhrase(product) {
    if (/全屋|橱柜|衣柜|木门|家具/.test(product)) {
      return "custom cabinetry, wardrobes, wood doors, and export furniture";
    }
    return product || "custom cabinetry and export furniture";
  }

  function businessPhrase(lead) {
    const text = `${lead.buyerType} ${lead.mainProducts}`.toLowerCase();
    if (/kitchen|厨房/.test(text) && /wardrobe|衣柜/.test(text)) return "kitchen and wardrobe solutions";
    if (/builder/.test(text)) return "builder and project supply";
    if (/designer|design/.test(text)) return "design-led residential projects";
    if (/importer|retailer|distributor/.test(text)) return "import and distribution channels";
    return "cabinetry and project supply";
  }

  function buildEnhancedDevelopmentPlan(lead, authenticity, product) {
    const stage = stageFromScore(authenticity.score);
    const contacts = recommendedContacts(lead.buyerType);
    const channel = channelFromStage(stage);
    const opening = `Hi ${lead.company} team, I noticed your work in ${businessPhrase(lead)} in ${lead.country || "your market"}. We manufacture ${productPhrase(product)} for project and retail supply. May I send a short capability sheet for your sourcing or project team?`;
    const searchName = `${lead.company} + Procurement / Project / Design`;
    const steps = [
      `打开官网 Contact 页面，确认电话、表单、地址和公司业务是否一致。`,
      `用 LinkedIn 搜索 ${searchName}，优先找 ${contacts.slice(0, 3).join(" / ")}。`,
      hasGenericEmail(lead) ? "如果找不到真人直邮，先用官网表单发送简短开发信。" : "优先给企业邮箱发送开发信，同时在 LinkedIn 找备选联系人。",
      "3 天后记录跟进结果，未回复则发送二次跟进信。",
      "如果客户回复，进入 Replied；如果要求价格或图纸，进入 Quoting。",
    ];

    return {
      version: "v1.1",
      stage,
      channel,
      contacts,
      opening,
      steps: [...steps, ...riskBasedActions(lead, authenticity)],
    };
  }

  window.SkillV11 = {
    buildEnhancedDevelopmentPlan,
    recommendedContacts,
    riskBasedActions,
  };
})();
