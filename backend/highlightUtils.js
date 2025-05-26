export function extractWords(text) {
  if (typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .split(/\s+/) // split into words
    .filter((word) => word.length >= 3);
}

export function highlightText(text, words) {
  if (!Array.isArray(words)) return text;

  let highlighted = text;
  words.forEach((word) => {
    const regex = new RegExp(`(${word})`, "gi");
    highlighted = highlighted.replace(regex, "$1");
  });

  return highlighted;
}
