(function () {
  const storageKey = "skillhuoke:v0.2:workspace";

  const templateLibrary = [
    {
      id: "first-touch",
      name: "首次开发信",
      description: "适合第一次联系采购、项目负责人或设计负责人。",
    },
    {
      id: "follow-up",
      name: "二次跟进信",
      description: "适合已发送资料后 2-4 天再次跟进。",
    },
    {
      id: "quote-invite",
      name: "报价邀请信",
      description: "适合引导客户发送图纸、清单或项目需求。",
    },
  ];

  function createTemplateMessage(templateId, lead, product) {
    const productText = product || "custom cabinetry, kitchen cabinets, wardrobes, wood doors, and export furniture";
    const contactName = lead.contactPerson && lead.contactPerson !== "未公开" ? lead.contactPerson : `${lead.company} team`;

    if (templateId === "follow-up") {
      return `Subject: Following up on cabinetry supply for ${lead.company}

Hi ${contactName},

I wanted to follow up in case my previous message was missed.

We manufacture ${productText} for builders, designers, kitchen companies, and importers. Based on ${lead.company}'s work with ${lead.mainProducts}, I believe our factory could support your future cabinetry or project supply needs.

Would you like me to send our catalogue, project photos, and export capability sheet?

Best regards,`;
    }

    if (templateId === "quote-invite") {
      return `Subject: Quotation support for ${lead.company}

Hi ${contactName},

If ${lead.company} has upcoming projects involving ${lead.mainProducts}, we would be glad to support with a quotation.

We can produce ${productText}, including customized sizes, finishes, packaging, and export documentation. You can send drawings, BOQ, reference photos, or a product list, and we will help prepare a clear quotation for review.

Would it be useful to discuss one sample project first?

Best regards,`;
    }

    return `Subject: ${lead.company} and custom cabinetry supply

Hi ${contactName},

I noticed that ${lead.company} works with ${lead.mainProducts}. We manufacture ${productText} for builders, designers, kitchen companies, and importers.

Your current business looks relevant to our whole-house custom cabinetry, kitchen cabinet, wardrobe, wood door, and furniture export capability.

Would it be useful if I send a short catalogue and capability sheet?

Best regards,`;
  }

  function buildSavedState({ leads, selectedId, taskStatus }) {
    return {
      version: "0.2",
      savedAt: new Date().toISOString(),
      selectedId,
      taskStatus,
      leads,
      leadUpdates: leads.map((lead) => ({
        id: lead.id,
        crmStatus: lead.crmStatus,
        followNote: lead.followNote,
        selectedTemplateId: lead.selectedTemplateId || "first-touch",
      })),
    };
  }

  function mergeSavedLeads(baseLeads, savedState) {
    if (savedState?.leads?.length) {
      return savedState.leads;
    }
    const updates = new Map((savedState?.leadUpdates || []).map((lead) => [lead.id, lead]));
    return baseLeads.map((lead) => ({
      ...lead,
      ...(updates.get(lead.id) || {}),
    }));
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }

  function buildCsv(leads, { product, templateId } = {}) {
    const headers = [
      "公司名",
      "国家",
      "城市",
      "客户类型",
      "联系人",
      "WhatsApp",
      "电话",
      "邮箱",
      "LinkedIn",
      "评分",
      "优先级",
      "CRM状态",
      "下一步",
      "跟进备注",
      "开发信",
      "官网",
      "来源链接",
    ];

    const rows = leads.map((lead) => [
      lead.company,
      lead.country,
      lead.city,
      lead.buyerType,
      lead.contactPerson,
      lead.whatsappStatus,
      lead.phone,
      lead.email,
      lead.linkedin,
      lead.score,
      lead.priority,
      lead.crmStatus,
      lead.nextAction,
      lead.followNote,
      createTemplateMessage(templateId || lead.selectedTemplateId || "first-touch", lead, product),
      lead.website,
      lead.source,
    ]);

    return `\uFEFF${[headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n")}`;
  }

  window.SkillV02 = {
    storageKey,
    templateLibrary,
    createTemplateMessage,
    buildSavedState,
    mergeSavedLeads,
    buildCsv,
  };
})();
