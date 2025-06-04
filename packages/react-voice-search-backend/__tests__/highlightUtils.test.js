import { extractWords, highlightField } from "../utils/highlightUtils.js";

describe("extractWords", () => {
  it("should return an array of words with length >= 3", () => {
    const result = extractWords("Get me a new Samsung phone!");
    expect(result).toEqual(["get", "new", "samsung", "phone"]);
  });

  it("should return an empty array for input with no valid words", () => {
    const result = extractWords("a i at is to");
    expect(result).toEqual([]);
  });

  it("should remove punctuation", () => {
    const result = extractWords("Hello, world! Are you there?");
    expect(result).toEqual(["hello", "world", "are", "you", "there"]);
  });

  it("should handle non-string input gracefully", () => {
    expect(extractWords(null)).toEqual([]);
    expect(extractWords(undefined)).toEqual([]);
    expect(extractWords(1234)).toEqual([]);
  });
});

describe("highlightField", () => {
  const sampleHighlights = [
    {
      path: "name",
      texts: [
        { value: "Samsung ", type: "text" },
        { value: "Galaxy", type: "hit" },
        { value: " M31", type: "text" }
      ]
    },
    {
      path: "category",
      texts: [
        { value: "Mobile", type: "text" }
      ]
    }
  ];

  it("should highlight 'hit' text in the name field", () => {
    const result = highlightField("Samsung Galaxy M31", sampleHighlights, "name");
    expect(result).toBe("Samsung Galaxy M31");
  });

  it("should return original text if no matching path", () => {
    const result = highlightField("Dell Precision", sampleHighlights, "brand");
    expect(result).toBe("Dell Precision");
  });

  it("should return original text if highlights are undefined", () => {
    const result = highlightField("iPhone 13", null, "name");
    expect(result).toBe("iPhone 13");
  });
});
