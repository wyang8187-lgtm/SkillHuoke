(function () {
  function clean(value) {
    return String(value ?? "").trim();
  }

  function hasRealWebsite(lead) {
    return /^https?:\/\/[^.\s]+\.[^\s]+/i.test(clean(lead.website));
  }

  function hasContactPage(lead) {
    return /contact|about|enquiry|quote/i.test(`${lead.source} ${lead.website}`);
  }

  function hasBusinessEmail(lead) {
    const email = clean(lead.email).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    return !/@(gmail|hotmail|outlook|yahoo|qq|163)\./i.test(email);
  }

  function hasFreeEmail(lead) {
    return /@(gmail|hotmail|outlook|yahoo|qq|163)\./i.test(clean(lead.email));
  }

  function hasReasonablePerson(lead) {
    return clean(lead.contactPerson) && clean(lead.contactPerson) !== "未公开" && clean(lead.title);
  }

  function hasLinkedIn(lead) {
    return /^https?:\/\/(www\.)?linkedin\.com\//i.test(clean(lead.linkedin));
  }

  function hasRelevantBusiness(lead, product) {
    const text = `${lead.buyerType} ${lead.mainProducts} ${lead.productMatch || ""} ${product}`.toLowerCase();
    return /builder|designer|kitchen|importer|joinery|cabinet|wardrobe|door|furniture|橱柜|衣柜|木门|家具|全屋/.test(text);
  }

  function hasPhoneOrWhatsapp(lead) {
    const phone = clean(lead.phone);
    const whatsapp = clean(lead.whatsappStatus);
    return (phone && !/未填写|未公开/.test(phone)) || (whatsapp && !/未公开/.test(whatsapp));
  }

  function authenticityScore(lead, product = "") {
    const reasons = [];
    const risks = [];
    let score = 0;

    if (hasRealWebsite(lead)) {
      score += 18;
      reasons.push("官网格式正常，可作为公司存在性依据。");
    } else {
      risks.push("缺少官网或官网格式异常。");
    }

    if (hasContactPage(lead)) {
      score += 8;
      reasons.push("存在 Contact/About/Enquiry 等来源页面线索。");
    }

    if (hasBusinessEmail(lead)) {
      score += 16;
      reasons.push("邮箱为企业邮箱，可信度较高。");
    } else if (hasFreeEmail(lead)) {
      score -= 8;
      risks.push("邮箱为免费邮箱，需要人工核验。");
    } else {
      risks.push("未确认企业邮箱。");
    }

    if (hasPhoneOrWhatsapp(lead)) {
      score += 14;
      reasons.push("存在电话或 WhatsApp 可核验线索。");
    } else {
      risks.push("缺少电话或 WhatsApp。");
    }

    if (hasReasonablePerson(lead)) {
      score += 12;
      reasons.push("存在联系人和职位，真人线索较强。");
    } else {
      risks.push("缺少具体联系人或职位。");
    }

    if (hasLinkedIn(lead)) {
      score += 12;
      reasons.push("LinkedIn 链接格式正常，可进一步核验公司或联系人。");
    } else {
      risks.push("LinkedIn 缺失或格式异常。");
    }

    if (hasRelevantBusiness(lead, product)) {
      score += 20;
      reasons.push("业务类型与目标产品或客户类型匹配。");
    } else {
      risks.push("业务匹配度不明确。");
    }

    const finalScore = Math.max(0, Math.min(100, score));
    const level = finalScore >= 75 ? "高" : finalScore >= 55 ? "中" : finalScore >= 45 ? "低" : "风险";

    return {
      score: finalScore,
      level,
      reasons,
      risks,
    };
  }

  function classifyLeadStage(result) {
    if (result.score >= 75) return "优先开发";
    if (result.score >= 55) return "先核验再开发";
    if (result.score >= 45) return "补全资料";
    return "暂缓开发";
  }

  function buildSearchStrategy({ product, country, buyerTypes }) {
    const countryText = clean(country) || "Australia";
    const productText = clean(product) || "custom cabinetry";
    const buyers = buyerTypes?.length ? buyerTypes : ["Builder", "Designer", "Kitchen Company", "Importer"];

    return {
      googleQueries: [
        `custom cabinetry ${countryText} builder contact`,
        `kitchen company ${countryText} procurement`,
        `wardrobe joinery ${countryText} contact`,
        `wood door supplier ${countryText} builder`,
        `${productText} ${countryText} importer distributor`,
      ],
      linkedinQueries: buyers.map((buyer) => `${buyer} ${countryText} Procurement Sourcing Project Manager`),
      sourceTypes: ["官网 Contact 页面", "官网 About 页面", "LinkedIn 公司页", "行业目录", "Builder / Joinery / Kitchen Association"],
      verificationRules: ["官网能打开", "公司名与域名接近", "邮箱域名与官网匹配", "电话符合国家格式", "LinkedIn 公司或员工线索匹配"],
    };
  }

  function buildDevelopmentPlan(lead, authenticity) {
    const stage = classifyLeadStage(authenticity);
    const channel = authenticity.score >= 75 ? "Email + LinkedIn" : authenticity.score >= 55 ? "官网表单 + LinkedIn" : "先核验资料";
    const opening = `Hi ${lead.company} team, I found your company while reviewing ${lead.buyerType || "relevant"} suppliers and projects.`;
    const actions = [];

    if (stage === "优先开发") {
      actions.push("发送首次英文开发信，并附公司能力简介。");
      actions.push("LinkedIn 搜索采购、项目经理或负责人。");
      actions.push("3 天后记录跟进结果，未回复则发送二次跟进。");
    } else if (stage === "先核验再开发") {
      actions.push("优先核验官网、邮箱、电话和 LinkedIn。");
      actions.push("确认客户类型后再选择开发信模板。");
      actions.push("补充联系人后进入 CRM 跟进。");
    } else if (stage === "补全资料") {
      actions.push("补全官网、联系人和联系方式。");
      actions.push("暂不发送正式开发信。");
    } else {
      actions.push("暂缓开发，避免浪费业务员时间。");
      actions.push("只有补全官网和联系方式后再重新评分。");
    }

    return {
      stage,
      channel,
      opening,
      actions,
    };
  }

  window.SkillV10 = {
    authenticityScore,
    buildDevelopmentPlan,
    buildSearchStrategy,
    classifyLeadStage,
  };
})();
