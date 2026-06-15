import { cleanLeadValue } from "./lead-model.mjs";

export function buildSearchStrategy({ product, country, buyerType }) {
  const productText = cleanLeadValue(product) || "custom cabinetry";
  const countryText = cleanLeadValue(country) || "Australia";
  const buyerText = cleanLeadValue(buyerType) || "Builder Designer Importer";

  return {
    google: `${countryText} ${productText} ${buyerText} contact`,
    linkedin: `site:linkedin.com/company ${countryText} ${productText} ${buyerText}`,
    facebook: `site:facebook.com ${countryText} ${productText} ${buyerText}`,
    tiktok: `site:tiktok.com ${countryText} ${productText} ${buyerText}`,
    sourceTypes: ["official website", "contact page", "about page", "company social page"],
    verificationRules: ["verify website domain", "verify public contact channel", "avoid directory-only results"],
  };
}
