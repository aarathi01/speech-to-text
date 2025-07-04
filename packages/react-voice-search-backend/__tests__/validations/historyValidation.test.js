import { historyIdParamSchema,saveHistorySchema } from "../../validations/historyValidation.js";

describe("saveHistorySchema", () => {
  it("should pass with valid query and response", () => {
    const validData = {
      query: "example search",
      response: [
        {
          id: 1,
          name: "Item Name",
          category: "Books",
          matchedWords: ["example", "search"],
        },
      ],
    };

    const result = saveHistorySchema.validate(validData);
    expect(result.error).toBeUndefined();
  });

  it("should fail if query is missing", () => {
    const result = saveHistorySchema.validate({
      response: [{ name: "Item", category: "Test" }],
    });

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toBe("Query is required");
  });

  it("should fail if response is not an array", () => {
    const result = saveHistorySchema.validate({
      query: "hello",
      response: {},
    });

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toMatch(/must be an array/);
  });



  it("should allow unknown fields in response items", () => {
    const result = saveHistorySchema.validate({
      query: "hello",
      response: [
        {
          name: "Item",
          category: "Books",
          extraField: "allowed",
        },
      ],
    });

    expect(result.error).toBeUndefined();
  });
});

describe("historyIdParamSchema", () => {
  it("should pass with a valid hex id", () => {
    const result = historyIdParamSchema.validate({
      id: "64c8d1f9a8e61b7b1d1a1b1a",
    });

    expect(result.error).toBeUndefined();
  });

  it("should fail if id is not 24 characters", () => {
    const result = historyIdParamSchema.validate({
      id: "12345",
    });

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toBe("Invalid history ID");
  });

  it("should fail if id is not hex", () => {
    const result = historyIdParamSchema.validate({
      id: "g4c8d1f9a8e61b7b1d1a1b1g",
    });

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toBe("Invalid history ID format");
  });

  it("should fail if id is missing", () => {
    const result = historyIdParamSchema.validate({});

    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toBe("History ID is required");
  });
});
