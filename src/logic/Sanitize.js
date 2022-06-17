
import sanitizeHtml from "sanitize-html";

export function sanitizeDisplayText(dirty) {
  const clean = sanitizeHtml(dirty, {
    allowedTags: ["a"],
    allowedAttributes: {
      a: ["href", "rel", "target"],
    },
  });
  return clean;
}
