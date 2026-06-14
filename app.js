const crmStatuses = ["New", "Verified", "Contacted", "Replied", "Quoting", "Sample", "Negotiating", "Won", "Lost", "Not Fit"];

const initialLeads = [
  {
    id: 1,
    company: "Kinsman Kitchens",
    country: "Australia",
    city: "Sydney",
    website: "https://kinsman.com.au/",
    source: "https://kinsman.com.au/contact-us/",
    buyerType: "Kitchen Company / Designer",
    mainProducts: "厨房、衣柜、洗衣房、家居收纳",
    productMatch: "整屋柜类、衣柜、厨房和洗衣房柜体匹配度高。",
    summary: "澳洲厨房和衣柜品牌，产品范围与全屋定制高度重合。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Kinsman%20Kitchens",
    contactPerson: "未公开",
    title: "Procurement / Sourcing / Design Director",
    score: 89,
    priority: "A",
    crmStatus: "New",
    nextAction: "找采购或项目负责人，发送整屋柜类能力介绍。",
    followNote: "优先开发，适合厨房+衣柜+洗衣房套单。",
    scoreBreakdown: [30, 20, 15, 12, 7, 5],
  },
  {
    id: 2,
    company: "Freedom Kitchens",
    country: "Australia",
    city: "Sydney",
    website: "https://freedomkitchens.com.au/",
    source: "https://freedomkitchens.com.au/contact-us/",
    buyerType: "Kitchen Company / Designer",
    mainProducts: "厨房、衣柜、洗衣房、家居收纳",
    productMatch: "全屋柜类套单匹配度高。",
    summary: "澳洲厨房和家居收纳公司，业务覆盖多房间柜类场景。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Freedom%20Kitchens",
    contactPerson: "未公开",
    title: "Procurement / Project Manager",
    score: 88,
    priority: "A",
    crmStatus: "Verified",
    nextAction: "用整屋柜类和 OEM/ODM 项目能力切入。",
    followNote: "官网有多品类空间，适合展示整屋解决方案。",
    scoreBreakdown: [30, 20, 15, 12, 7, 4],
  },
  {
    id: 3,
    company: "Wallspan Kitchens & Wardrobes",
    country: "Australia",
    city: "Adelaide",
    website: "https://www.wallspan.com.au/",
    source: "https://www.wallspan.com.au/contact-us/",
    buyerType: "Kitchen Company / Designer",
    mainProducts: "厨房、衣柜、洗衣房、收纳",
    productMatch: "厨房和衣柜均匹配，适合全屋定制出口。",
    summary: "明确覆盖厨房与衣柜，和平台目标产品高度一致。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Wallspan%20Kitchens%20Wardrobes",
    contactPerson: "未公开",
    title: "Owner / Design Director",
    score: 86,
    priority: "A",
    crmStatus: "New",
    nextAction: "发送厨房、衣柜、木门组合供货能力。",
    followNote: "适合先发目录和项目案例。",
    scoreBreakdown: [30, 20, 15, 11, 6, 4],
  },
  {
    id: 4,
    company: "Kitchen Connection",
    country: "Australia",
    city: "Brisbane",
    website: "https://www.kitchenconnection.com.au/",
    source: "https://www.kitchenconnection.com.au/contact-us/",
    buyerType: "Kitchen Company / Designer",
    mainProducts: "厨房翻新、橱柜、设计服务",
    productMatch: "橱柜和门板供应匹配，衣柜可作为扩展产品。",
    summary: "澳洲厨房翻新公司，有设计咨询和项目交付场景。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Kitchen%20Connection",
    contactPerson: "未公开",
    title: "Design Director / Project Manager",
    score: 85,
    priority: "A",
    crmStatus: "Contacted",
    nextAction: "跟进是否需要橱柜门板和项目补充产能。",
    followNote: "已准备第一封开发信。",
    scoreBreakdown: [29, 20, 15, 11, 6, 4],
  },
  {
    id: 5,
    company: "Apollo Kitchens",
    country: "Australia",
    city: "Sydney",
    website: "https://www.apollokitchens.com.au/",
    source: "https://www.apollokitchens.com.au/contact-us/",
    buyerType: "Kitchen Company / Builder Supplier",
    mainProducts: "厨房、joinery、住宅和商业项目",
    productMatch: "适合 builder/project supply，整屋柜类和工程批量单。",
    summary: "厨房和 joinery 公司，兼具住宅与项目渠道。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Apollo%20Kitchens",
    contactPerson: "未公开",
    title: "Project Manager / Procurement",
    score: 84,
    priority: "B",
    crmStatus: "New",
    nextAction: "突出工程交付、批量一致性和包装能力。",
    followNote: "适合走项目采购线。",
    scoreBreakdown: [28, 19, 15, 11, 6, 5],
  },
  {
    id: 6,
    company: "Kaboodle Kitchen",
    country: "Australia",
    city: "Melbourne",
    website: "https://www.kaboodle.com.au/",
    source: "https://www.kaboodle.com.au/contact-us",
    buyerType: "Kitchen Company / Importer",
    mainProducts: "平板包装厨房、橱柜、门板",
    productMatch: "RTA 柜体、门板、零售包装匹配。",
    summary: "澳洲 DIY/零售渠道厨房品牌，适合 RTA 橱柜和门板供应。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Kaboodle%20Kitchen",
    contactPerson: "未公开",
    title: "Category Manager / Sourcing",
    score: 84,
    priority: "B",
    crmStatus: "Verified",
    nextAction: "主推 RTA 柜体、门板、包装和五金配套。",
    followNote: "适合自有品牌和零售渠道。",
    scoreBreakdown: [28, 19, 15, 11, 6, 5],
  },
  {
    id: 7,
    company: "Bunnings",
    country: "Australia",
    city: "Melbourne",
    website: "https://www.bunnings.com.au/",
    source: "https://www.bunnings.com.au/contact-us",
    buyerType: "Importer / Retailer",
    mainProducts: "建材、厨房、门、衣柜、家具相关品类",
    productMatch: "建材零售和自有品牌方向匹配。",
    summary: "澳洲大型家居建材零售商，有厨房、门、收纳和建材品类。",
    whatsappStatus: "未公开WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "供应商入口/官网表单",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Bunnings",
    contactPerson: "未公开",
    title: "Category Buyer / Sourcing Manager",
    score: 82,
    priority: "B",
    crmStatus: "New",
    nextAction: "寻找供应商准入或 category buyer。",
    followNote: "门槛高，但渠道价值大。",
    scoreBreakdown: [25, 18, 15, 10, 8, 6],
  },
  {
    id: 8,
    company: "Stegbar",
    country: "Australia",
    city: "National",
    website: "https://www.stegbar.com.au/",
    source: "https://www.stegbar.com.au/contact-us/",
    buyerType: "Builder Supplier",
    mainProducts: "门窗、衣柜、淋浴屏",
    productMatch: "衣柜和门类相关度高，橱柜为辅助匹配。",
    summary: "澳洲建材品牌，覆盖 wardrobe 和 door 相关品类。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Stegbar",
    contactPerson: "未公开",
    title: "Procurement / Product Manager",
    score: 79,
    priority: "B",
    crmStatus: "New",
    nextAction: "重点推衣柜、木门、门板和 builder 配套。",
    followNote: "适合门类和衣柜供应链开发。",
    scoreBreakdown: [24, 18, 15, 11, 6, 5],
  },
  {
    id: 9,
    company: "Metricon Homes",
    country: "Australia",
    city: "Melbourne",
    website: "https://www.metricon.com.au/",
    source: "https://www.metricon.com.au/contact-us",
    buyerType: "Builder",
    mainProducts: "住宅建造、厨房和衣柜配置",
    productMatch: "新房项目需要厨房、衣柜、门和固定家具。",
    summary: "澳洲大型住宅 builder，适合标准户型项目配套。",
    whatsappStatus: "未公开WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Metricon%20Homes",
    contactPerson: "未公开",
    title: "Procurement / Specification Manager",
    score: 82,
    priority: "B",
    crmStatus: "New",
    nextAction: "联系采购/规格团队，推 builder package。",
    followNote: "适合样板房和批量项目切入。",
    scoreBreakdown: [27, 18, 15, 9, 7, 6],
  },
  {
    id: 10,
    company: "Hafele Australia",
    country: "Australia",
    city: "National",
    website: "https://www.hafele.com.au/",
    source: "https://www.hafele.com.au/en/info/contact/578/",
    buyerType: "Importer / Distributor",
    mainProducts: "家具五金、橱柜五金、厨房收纳",
    productMatch: "渠道与 cabinet maker、joinery、家具行业高度重合。",
    summary: "家具和建筑五金供应商，可作为渠道合作或客户地图入口。",
    whatsappStatus: "电话可核验WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Hafele%20Australia",
    contactPerson: "未公开",
    title: "Business Development / Sourcing",
    score: 81,
    priority: "B",
    crmStatus: "Verified",
    nextAction: "探索渠道合作或反向开发其客户网络。",
    followNote: "不是直接柜体客户，但渠道价值高。",
    scoreBreakdown: [23, 19, 15, 11, 8, 5],
  },
  {
    id: 11,
    company: "Corinthian Doors",
    country: "Australia",
    city: "National",
    website: "https://www.corinthian.com.au/",
    source: "https://www.corinthian.com.au/contact-us/",
    buyerType: "Builder Supplier",
    mainProducts: "室内门、入户门",
    productMatch: "木门出口高度相关，橱柜匹配较低。",
    summary: "澳洲门类品牌，面向住宅建筑渠道。",
    whatsappStatus: "未公开WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Corinthian%20Doors",
    contactPerson: "未公开",
    title: "Procurement / Product Manager",
    score: 73,
    priority: "C",
    crmStatus: "New",
    nextAction: "主推木门、门皮、门套和项目门类供应。",
    followNote: "作为木门专项客户开发。",
    scoreBreakdown: [22, 17, 15, 8, 6, 5],
  },
  {
    id: 12,
    company: "Laminex Australia",
    country: "Australia",
    city: "National",
    website: "https://www.laminex.com.au/",
    source: "https://www.laminex.com.au/contact-us",
    buyerType: "Builder Supplier / Distributor",
    mainProducts: "板材、装饰面、橱柜材料",
    productMatch: "服务橱柜、设计和建筑渠道，适合作为渠道入口。",
    summary: "板材和表面材料供应商，覆盖 cabinet maker 和设计渠道。",
    whatsappStatus: "未公开WhatsApp",
    phone: "官网联系页核验",
    emailStatus: "联系表单",
    email: "官网表单优先",
    linkedin: "https://www.linkedin.com/search/results/companies/?keywords=Laminex%20Australia",
    contactPerson: "未公开",
    title: "Partnership / Product Manager",
    score: 78,
    priority: "B",
    crmStatus: "New",
    nextAction: "开发渠道合作，或作为设计/橱柜客户地图入口。",
    followNote: "适合后续做渠道名单扩展。",
    scoreBreakdown: [24, 18, 15, 9, 7, 5],
  },
];

let leads = [...initialLeads];
let selectedId = leads[0].id;
let currentKeywords = [
  "custom cabinetry Australia builder",
  "kitchen company Australia custom cabinets",
  "wardrobe company Australia contact",
  "wood doors Australia builder supplier",
  "kitchen importer Australia cabinets",
  "joinery company Australia kitchen wardrobe",
];
let currentSteps = ["创建找客任务", "生成搜索关键词", "发现客户公司", "补全公司信息", "核验联系方式", "AI客户评分", "生成开发内容", "进入CRM跟进", "导出结果"];

const els = {
  rows: document.getElementById("leadRows"),
  search: document.getElementById("searchInput"),
  priorityFilter: document.getElementById("priorityFilter"),
  buyerFilter: document.getElementById("buyerFilter"),
  whatsappFilter: document.getElementById("whatsappFilter"),
  crmFilter: document.getElementById("crmFilter"),
  detailCompany: document.getElementById("detailCompany"),
  detailPriority: document.getElementById("detailPriority"),
  detailContent: document.getElementById("detailContent"),
  exportCsv: document.getElementById("exportCsv"),
  kpiVisible: document.getElementById("kpiVisible"),
  kpiPriority: document.getElementById("kpiPriority"),
  kpiPhone: document.getElementById("kpiPhone"),
  kpiFollow: document.getElementById("kpiFollow"),
  workflowInstruction: document.getElementById("workflowInstruction"),
  runWorkflow: document.getElementById("runWorkflow"),
  clearWorkflow: document.getElementById("clearWorkflow"),
  productInput: document.getElementById("productInput"),
  countryInput: document.getElementById("countryInput"),
  buyerInput: document.getElementById("buyerInput"),
  quantityInput: document.getElementById("quantityInput"),
  keywordList: document.getElementById("keywordList"),
  workflowSteps: document.getElementById("workflowSteps"),
  taskStatus: document.getElementById("taskStatus"),
  visibleSummary: document.getElementById("visibleSummary"),
};

function priorityClass(priorityValue) {
  return `priority-${priorityValue.toLowerCase()}`;
}

function scoreClass(score) {
  if (score >= 85) return "score-a";
  if (score >= 75) return "score-b";
  return "score-c";
}

function channelClass(status) {
  if (status === "已验证WhatsApp") return "channel-verified";
  if (status === "电话可核验WhatsApp") return "channel-check";
  return "channel-missing";
}

function firstEmail(lead) {
  if (lead.firstEmail) return lead.firstEmail;
  return `Subject: ${lead.company} and custom cabinetry supply

Hi ${lead.company} team,

I noticed that ${lead.company} works with ${lead.mainProducts}. We manufacture whole-house custom cabinetry, kitchen cabinets, wardrobes, wood doors, and export furniture for builders, designers, kitchen companies, and importers.

Would it be useful if I send a short catalogue and capability sheet for cabinets, wardrobes, wood doors, and furniture packages?

Best regards,`;
}

function whatsappOpener(lead) {
  if (lead.whatsappOpener) return lead.whatsappOpener;
  return `Hi ${lead.company} team, this is [Your Name]. I saw that your company works with ${lead.mainProducts}. We manufacture custom cabinetry, wardrobes, wood doors, and export furniture. May I send a short catalogue and project reference?`;
}

function filteredLeads() {
  const query = els.search.value.trim().toLowerCase();
  return leads.filter((lead) => {
    const haystack = `${lead.company} ${lead.country} ${lead.buyerType} ${lead.mainProducts} ${lead.productMatch}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesPriority = !els.priorityFilter.value || lead.priority === els.priorityFilter.value;
    const matchesBuyer = !els.buyerFilter.value || lead.buyerType.includes(els.buyerFilter.value);
    const matchesWhatsapp = !els.whatsappFilter.value || lead.whatsappStatus === els.whatsappFilter.value;
    const matchesCrm = !els.crmFilter.value || lead.crmStatus === els.crmFilter.value;
    return matchesQuery && matchesPriority && matchesBuyer && matchesWhatsapp && matchesCrm;
  });
}

function renderKpis(list) {
  els.kpiVisible.textContent = list.length;
  els.kpiPriority.textContent = list.filter((lead) => lead.priority === "A" || lead.priority === "B").length;
  els.kpiPhone.textContent = list.filter((lead) => lead.phone && lead.phone !== "未公开").length;
  els.kpiFollow.textContent = list.filter((lead) => !["Won", "Lost", "Not Fit"].includes(lead.crmStatus)).length;
  els.visibleSummary.textContent = `${list.length} 个客户`;
}

function renderRows() {
  const list = filteredLeads();
  renderKpis(list);

  if (!list.some((lead) => lead.id === selectedId) && list[0]) {
    selectedId = list[0].id;
  }

  els.rows.innerHTML = list
    .map(
      (lead) => `
        <tr class="${lead.id === selectedId ? "selected" : ""}" data-id="${lead.id}">
          <td class="company-cell">
            <strong>${lead.company}</strong>
            <span>${lead.country} · ${lead.city}</span>
          </td>
          <td>${lead.buyerType}</td>
          <td><span class="score ${scoreClass(lead.score)}">${lead.score}</span></td>
          <td>
            <span class="channel-chip ${channelClass(lead.whatsappStatus)}">${lead.whatsappStatus}</span>
            <div class="muted">${lead.phone}</div>
          </td>
          <td>
            <strong>${lead.emailStatus}</strong>
            <span class="muted">${lead.email}</span>
          </td>
          <td><a href="${lead.linkedin}" target="_blank" rel="noreferrer">打开</a></td>
          <td>${lead.crmStatus}</td>
          <td>${lead.nextAction}</td>
        </tr>
      `,
    )
    .join("");

  els.rows.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      selectedId = Number(row.dataset.id);
      render();
    });
  });
}

function renderDetail() {
  const lead = leads.find((item) => item.id === selectedId) || filteredLeads()[0];
  if (!lead) {
    els.detailCompany.textContent = "没有匹配客户";
    els.detailPriority.textContent = "-";
    els.detailContent.innerHTML = "<p class=\"muted\">请调整筛选条件。</p>";
    return;
  }

  els.detailCompany.textContent = lead.company;
  els.detailPriority.textContent = `${lead.priority}级 · ${lead.score}`;
  els.detailPriority.className = `status-pill ${priorityClass(lead.priority)}`;

  const scoreLabels = ["产品匹配", "客户类型", "市场", "联系方式", "来源", "潜力"];
  els.detailContent.innerHTML = `
    <div class="detail-block">
      <h3>公司信息</h3>
      <p>${lead.summary}</p>
      <p><strong>主营产品</strong>${lead.mainProducts}</p>
      <p><strong>匹配点</strong>${lead.productMatch}</p>
      <p><a href="${lead.website}" target="_blank" rel="noreferrer">官网</a> · <a href="${lead.source}" target="_blank" rel="noreferrer">来源/联系页</a></p>
    </div>

    <div class="detail-block">
      <h3>联系方式</h3>
      <p><strong>WhatsApp</strong><span class="channel-chip ${channelClass(lead.whatsappStatus)}">${lead.whatsappStatus}</span></p>
      <p><strong>电话</strong>${lead.phone}</p>
      <p><strong>邮箱</strong>${lead.emailStatus} · ${lead.email}</p>
      <p><strong>LinkedIn</strong><a href="${lead.linkedin}" target="_blank" rel="noreferrer">打开 LinkedIn 搜索</a></p>
      <p><strong>建议联系人</strong>${lead.title}</p>
    </div>

    <div class="detail-block">
      <h3>评分拆解</h3>
      <div class="score-grid">
        ${lead.scoreBreakdown
          .map((value, index) => `<div class="score-item"><strong>${scoreLabels[index]}</strong><span>${value} 分</span></div>`)
          .join("")}
      </div>
    </div>

    <div class="detail-block">
      <h3>CRM 跟进</h3>
      <label>
        CRM状态
        <select id="crmStatusEditor">
          ${crmStatuses.map((status) => `<option value="${status}" ${status === lead.crmStatus ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </label>
      <label>
        跟进备注
        <textarea id="followNoteEditor">${lead.followNote}</textarea>
      </label>
    </div>

    <div class="detail-block">
      <h3>首封英文开发信</h3>
      <div class="message-box" id="emailCopy">${firstEmail(lead)}</div>
      <div class="detail-actions">
        <button class="secondary-button" data-copy="emailCopy" type="button">复制开发信</button>
      </div>
    </div>

    <div class="detail-block">
      <h3>WhatsApp 开场白</h3>
      <div class="message-box" id="whatsappCopy">${whatsappOpener(lead)}</div>
      <div class="detail-actions">
        <button class="secondary-button" data-copy="whatsappCopy" type="button">复制 WhatsApp 话术</button>
      </div>
    </div>
  `;

  document.getElementById("crmStatusEditor").addEventListener("change", (event) => {
    lead.crmStatus = event.target.value;
    render();
  });

  document.getElementById("followNoteEditor").addEventListener("input", (event) => {
    lead.followNote = event.target.value;
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const node = document.getElementById(button.dataset.copy);
      await copyText(node.textContent);
      button.textContent = "已复制";
      window.setTimeout(() => {
        button.textContent = button.dataset.copy === "emailCopy" ? "复制开发信" : "复制 WhatsApp 话术";
      }, 1200);
    });
  });
}

function renderWorkflowOutput() {
  els.keywordList.innerHTML = currentKeywords.map((keyword) => `<span class="keyword-pill">${keyword}</span>`).join("");
  els.workflowSteps.innerHTML = currentSteps.map((step) => `<span class="step-pill">${step} ✅</span>`).join("");
}

function runWorkflowFromInput() {
  const run = window.SkillWorkflow.createWorkflowRun(els.workflowInstruction.value);
  leads = run.leads;
  selectedId = leads[0]?.id ?? 0;
  currentKeywords = run.keywords;
  currentSteps = run.steps.map((step) => step.name);
  els.productInput.value = run.task.product;
  els.countryInput.value = run.task.country;
  els.buyerInput.value = run.task.buyerTypes.join(" + ");
  els.quantityInput.value = run.task.quantity;
  els.taskStatus.textContent = "工作流已运行";
  els.search.value = "";
  els.priorityFilter.value = "";
  els.buyerFilter.value = "";
  els.whatsappFilter.value = "";
  els.crmFilter.value = "";
  render();
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function exportCsv() {
  const headers = [
    "公司名称",
    "国家",
    "城市",
    "官网",
    "客户类型",
    "主营产品",
    "WhatsApp状态",
    "电话",
    "邮箱状态",
    "邮箱",
    "LinkedIn",
    "评分",
    "优先级",
    "CRM状态",
    "首封英文开发信",
    "WhatsApp开场白",
    "来源链接",
  ];

  const lines = [headers.map(csvEscape).join(",")];
  filteredLeads().forEach((lead) => {
    lines.push(
      [
        lead.company,
        lead.country,
        lead.city,
        lead.website,
        lead.buyerType,
        lead.mainProducts,
        lead.whatsappStatus,
        lead.phone,
        lead.emailStatus,
        lead.email,
        lead.linkedin,
        lead.score,
        lead.priority,
        lead.crmStatus,
        firstEmail(lead),
        whatsappOpener(lead),
        lead.source,
      ]
        .map(csvEscape)
        .join(","),
    );
  });

  const blob = new Blob([`\uFEFF${lines.join("\n")}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "skillhuoke1-leads.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function render() {
  renderWorkflowOutput();
  renderRows();
  renderDetail();
}

[els.search, els.priorityFilter, els.buyerFilter, els.whatsappFilter, els.crmFilter].forEach((el) => {
  el.addEventListener("input", render);
});

els.exportCsv.addEventListener("click", exportCsv);
els.runWorkflow.addEventListener("click", runWorkflowFromInput);
els.clearWorkflow.addEventListener("click", () => {
  els.workflowInstruction.value = "";
  els.workflowInstruction.focus();
});

render();
