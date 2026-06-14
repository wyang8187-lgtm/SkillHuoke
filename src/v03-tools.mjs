const headers = ["公司名", "国家", "城市", "客户类型", "官网", "联系人", "职位", "WhatsApp", "电话", "邮箱", "LinkedIn", "备注"];

function clean(value) {
  return String(value ?? "").trim();
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === "\"" && quoted && next === "\"") {
      current += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells.map(clean);
}

function parseCsv(text) {
  return clean(text)
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => clean(line))
    .map(splitCsvLine);
}

function leadKey(lead) {
  const website = clean(lead.website).toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (website) return `site:${website}`;
  return `name:${clean(lead.company).toLowerCase()}|${clean(lead.country).toLowerCase()}`;
}

export function createManualLead(input, id) {
  const company = clean(input.company);
  const country = clean(input.country) || "Australia";
  const buyerType = clean(input.buyerType) || "Importer";
  const website = clean(input.website);
  const phone = clean(input.phone);
  const whatsapp = clean(input.whatsapp);
  const email = clean(input.email);

  return {
    id,
    company,
    country,
    city: clean(input.city),
    website,
    source: website,
    buyerType,
    mainProducts: clean(input.mainProducts) || "真实客户手动录入",
    productMatch: "手动录入客户，需人工判断产品匹配。",
    summary: `${company} 是手动录入或导入的真实客户。`,
    whatsappStatus: whatsapp ? "已提供WhatsApp" : "未公开WhatsApp",
    phone: phone || whatsapp || "未填写",
    emailStatus: email ? "已提供邮箱" : "未填写邮箱",
    email: email || "未填写",
    linkedin: clean(input.linkedin),
    contactPerson: clean(input.contactPerson) || "未公开",
    title: clean(input.title) || "未填写",
    score: 76,
    priority: "B",
    crmStatus: "New",
    nextAction: "人工核验客户信息，选择合适模板进行首次联系。",
    followNote: clean(input.followNote) || clean(input.note) || "真实客户名单导入。",
    scoreBreakdown: [24, 17, 12, whatsapp || phone || email ? 12 : 8, website ? 7 : 4, 4],
    selectedTemplateId: "first-touch",
  };
}

export function parseCustomerCsv(text, startId = 1) {
  const rows = parseCsv(text);
  if (rows.length <= 1) return [];

  const header = rows[0].map(clean);
  return rows.slice(1).map((row, index) => {
    const data = Object.fromEntries(header.map((name, cellIndex) => [name, row[cellIndex] || ""]));
    return createManualLead(
      {
        company: data["公司名"],
        country: data["国家"],
        city: data["城市"],
        buyerType: data["客户类型"],
        website: data["官网"],
        contactPerson: data["联系人"],
        title: data["职位"],
        whatsapp: data["WhatsApp"],
        phone: data["电话"],
        email: data["邮箱"],
        linkedin: data["LinkedIn"],
        note: data["备注"],
      },
      startId + index,
    );
  });
}

function mergeEmptyFields(base, incoming) {
  const merged = { ...base };
  Object.entries(incoming).forEach(([key, value]) => {
    if ((merged[key] === "" || merged[key] === "未填写" || merged[key] === "未公开" || merged[key] == null) && value) {
      merged[key] = value;
    }
  });
  return {
    ...merged,
    crmStatus: base.crmStatus,
    followNote: base.followNote,
    selectedTemplateId: base.selectedTemplateId || incoming.selectedTemplateId || "first-touch",
  };
}

export function mergeImportedLeads(existingLeads, importedLeads, startId = existingLeads.length + 1) {
  const leads = [...existingLeads];
  const seenIncoming = new Set();
  let nextId = startId;
  let added = 0;
  let updated = 0;
  let skipped = 0;

  importedLeads.forEach((incoming) => {
    const key = leadKey(incoming);
    if (seenIncoming.has(key)) {
      skipped += 1;
      return;
    }
    seenIncoming.add(key);

    const existingIndex = leads.findIndex((lead) => leadKey(lead) === key);
    if (existingIndex >= 0) {
      leads[existingIndex] = mergeEmptyFields(leads[existingIndex], incoming);
      updated += 1;
      return;
    }

    leads.push({ ...incoming, id: nextId });
    nextId += 1;
    added += 1;
  });

  return { leads, added, updated, skipped };
}

export function buildCsvTemplate() {
  const example = ["Sydney Joinery Co", "Australia", "Sydney", "Builder", "https://example.com", "Michael", "Director", "+61 400 000 000", "+61 2 0000 0000", "sales@example.com", "https://linkedin.com/company/example", "真实客户备注"];
  return `\uFEFF${headers.join(",")}\n${example.map((value) => `"${value}"`).join(",")}`;
}
