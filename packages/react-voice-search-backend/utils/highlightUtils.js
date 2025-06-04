export function extractWords(text) {
  if (typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .split(/\s+/) // split into words
    .filter((word) => word.length >= 3);
}

export function highlightField(text, highlights, path) {
  const fieldHighlight = highlights?.find(h => h.path === path);
  if (!fieldHighlight || !fieldHighlight.texts) return text;

  return fieldHighlight.texts.map(t => {
    if (t.type === "hit") {
      return `${t.value}`;
    }
    return t.value;
  }).join("");
}