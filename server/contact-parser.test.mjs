import assert from "node:assert/strict";
import {
  buildContactPageCandidates,
  extractContactSignals,
  mergeContactSignals,
} from "./contact-parser.mjs";

const html = `
  <html>
    <body>
      <a href="/contact-us">Contact us</a>
      <a href="https://www.linkedin.com/company/example-joinery">LinkedIn</a>
      <a href="https://wa.me/61412345678">WhatsApp</a>
      <p>Email: sales@examplejoinery.com.au</p>
      <p>Phone: +61 2 9876 5432</p>
    </body>
  </html>
`;

const signals = extractContactSignals(html, "https://examplejoinery.com.au/");

assert.deepEqual(signals.emails, ["sales@examplejoinery.com.au"]);
assert.deepEqual(signals.whatsapp, ["https://wa.me/61412345678"]);
assert.deepEqual(signals.linkedin, ["https://www.linkedin.com/company/example-joinery"]);
assert.equal(signals.phones[0], "+61 2 9876 5432");
assert.deepEqual(signals.contactPages, ["https://examplejoinery.com.au/contact-us"]);
assert.equal(signals.status, "parsed");

const candidates = buildContactPageCandidates("https://examplejoinery.com.au/projects/kitchens");
assert.deepEqual(candidates, [
  "https://examplejoinery.com.au/",
  "https://examplejoinery.com.au/contact",
  "https://examplejoinery.com.au/contact-us",
  "https://examplejoinery.com.au/about",
  "https://examplejoinery.com.au/about-us",
]);

const merged = mergeContactSignals([
  { emails: ["sales@example.com"], phones: [], whatsapp: [], linkedin: [], contactPages: [], status: "parsed" },
  { emails: ["sales@example.com", "info@example.com"], phones: ["+61 3 9000 0000"], whatsapp: [], linkedin: [], contactPages: ["https://example.com/contact"], status: "parsed" },
]);

assert.deepEqual(merged.emails, ["sales@example.com", "info@example.com"]);
assert.deepEqual(merged.phones, ["+61 3 9000 0000"]);
assert.deepEqual(merged.contactPages, ["https://example.com/contact"]);
assert.equal(merged.status, "parsed");

console.log("contact parser tests passed");
