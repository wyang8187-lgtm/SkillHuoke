const NOISE_HOSTS = [
  "facebook.com",
  "instagram.com",
  "tiktok.com",
  "youtube.com",
  "pinterest.com",
  "reddit.com",
  "yellowpages",
  "yelp.",
  "gumtree.",
];

const BUSINESS_TERMS = [
  "cabinet",
  "cabinetry",
  "kitchen",
  "wardrobe",
  "joinery",
  "builder",
  "interior",
  "designer",
  "import",
  "door",
  "furniture",
  "橱柜",
  "衣柜",
  "全屋",
  "木门",
  "家具",
];

function clean(value) {
  return String(value ?? "").trim();
}

function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function emailDomain(email) {
  return clean(email).split("@")[1]?.toLowerCase() || "";
}

function sameDomain(email, website) {
  const domain = emailDomain(email);
  const host = hostFromUrl(website);
  return Boolean(domain && host && (host === domain || host.endsWith(`.${domain}`) || domain.endsWith(host)));
}

function containsAny(text, terms) {
  const haystack = clean(text).toLowerCase();
  return terms.some((term) => haystack.includes(term.toLowerCase()));
}

function clamp(score) {
  return Math.max(0, Math.min(100, score));
}

function priorityFromScore(score, risks) {
  if (score >= 82 && risks.length <= 1) return "A";
  if (score >= 65) return "B";
  if (score >= 48) return "C";
  return "D";
}

function verdictFromPriority(priority) {
  return {
    A: "优先开发",
    B: "先核验再开发",
    C: "信息不足",
    D: "疑似噪音",
  }[priority];
}

function nextActionFromPriority(priority, contact) {
  if (priority === "A") return "优先核验联系人和联系方式，确认客户类型后发送开发信。";
  if (priority === "B") return "先打开官网联系页面和领英，补充联系人后再开发。";
  if (priority === "C") return "先补充官网、邮箱、电话或领英信息，再决定是否开发。";
  return "不要直接开发，先确认是否为真实公司官网和目标客户。";
}

export function assessLeadCandidate(candidate) {
  const contact = candidate.contact || {};
  const website = clean(candidate.website);
  const host = hostFromUrl(website);
  const combinedText = `${candidate.company} ${candidate.snippet} ${candidate.product} ${candidate.buyerType}`;
  const reasons = [];
  const risks = [];
  let score = 35;
  let contactConfidence = 15;

  if (host) {
    score += 12;
    reasons.push("有公开网址");
  }

  if (host && !NOISE_HOSTS.some((noise) => host.includes(noise))) {
    score += 15;
    reasons.push("疑似公司官网");
  } else if (host) {
    score -= 25;
    risks.push("社媒帖子或目录页");
  }

  if (containsAny(combinedText, BUSINESS_TERMS)) {
    score += 15;
    reasons.push("业务关键词匹配");
  } else {
    risks.push("业务关键词不足");
  }

  if (contact.contactPages?.length) {
    score += 10;
    contactConfidence += 15;
    reasons.push("有公开联系页面");
  }

  if (contact.emails?.length) {
    score += 10;
    contactConfidence += 20;
    reasons.push("发现公开邮箱");
    if (contact.emails.some((email) => sameDomain(email, website))) {
      score += 10;
      contactConfidence += 20;
      reasons.push("官网域名邮箱");
    }
  }

  if (contact.phones?.length) {
    score += 8;
    contactConfidence += 15;
    reasons.push("发现公开电话");
  }

  if (contact.whatsapp?.length) {
    score += 6;
    contactConfidence += 15;
    reasons.push("发现公开即时通讯");
  }

  if (contact.linkedin?.length) {
    score += 6;
    contactConfidence += 10;
    reasons.push("发现领英线索");
  }

  if (!contact.emails?.length && !contact.phones?.length && !contact.whatsapp?.length) {
    risks.push("缺少直接联系方式");
  }

  score = clamp(score);
  contactConfidence = clamp(contactConfidence);

  const priority = priorityFromScore(score, risks);

  return {
    score,
    priority,
    verdict: verdictFromPriority(priority),
    contactConfidence,
    reasons,
    risks,
    nextAction: nextActionFromPriority(priority, contact),
  };
}
