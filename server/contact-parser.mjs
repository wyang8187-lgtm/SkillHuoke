const CONTACT_PATHS = ["/", "/contact", "/contact-us", "/about", "/about-us"];

function unique(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()))];
}

function resolveUrl(href, baseUrl) {
  try {
    return new URL(href, baseUrl).href.replace(/\/$/, href === "/" ? "/" : "");
  } catch {
    return "";
  }
}

function stripHtmlEntities(value) {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&#64;/g, "@")
    .replace(/&commat;/g, "@");
}

export function buildContactPageCandidates(website) {
  let origin;
  try {
    origin = new URL(website).origin;
  } catch {
    return [];
  }

  return CONTACT_PATHS.map((path) => `${origin}${path === "/" ? "/" : path}`);
}

export function extractContactSignals(html, pageUrl) {
  const source = stripHtmlEntities(html);
  const links = [...source.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
  const emails = unique(source.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []);
  const textForPhone = source.replace(/href=["'][^"']+["']/gi, "");
  const phones = unique(textForPhone.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{1,4}\)?[\s.-]?){3,6}\d{2,4}/g) || [])
    .filter((phone) => phone.replace(/\D/g, "").length >= 8);

  const whatsapp = unique(
    links
      .filter((href) => /(?:wa\.me|api\.whatsapp\.com|whatsapp)/i.test(href))
      .map((href) => resolveUrl(href, pageUrl)),
  );

  const linkedin = unique(
    links
      .filter((href) => /linkedin\.com\/(?:company|in)\//i.test(href))
      .map((href) => resolveUrl(href, pageUrl)),
  );

  const contactPages = unique(
    links
      .filter((href) => /contact|about/i.test(href))
      .map((href) => resolveUrl(href, pageUrl))
      .filter((href) => {
        try {
          const target = new URL(href);
          const base = new URL(pageUrl);
          return target.origin === base.origin;
        } catch {
          return false;
        }
      }),
  );

  const hasSignal = emails.length || phones.length || whatsapp.length || linkedin.length || contactPages.length;

  return {
    emails,
    phones,
    whatsapp,
    linkedin,
    contactPages,
    status: hasSignal ? "parsed" : "no-public-contact-found",
  };
}

export function mergeContactSignals(signalList) {
  const signals = signalList.filter(Boolean);

  return {
    emails: unique(signals.flatMap((signal) => signal.emails || [])),
    phones: unique(signals.flatMap((signal) => signal.phones || [])),
    whatsapp: unique(signals.flatMap((signal) => signal.whatsapp || [])),
    linkedin: unique(signals.flatMap((signal) => signal.linkedin || [])),
    contactPages: unique(signals.flatMap((signal) => signal.contactPages || [])),
    status: signals.some((signal) => signal.status === "parsed") ? "parsed" : "no-public-contact-found",
  };
}
