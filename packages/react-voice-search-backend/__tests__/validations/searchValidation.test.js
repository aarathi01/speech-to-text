import { searchSchema } from "../../validations/searchValidation.js";

describe("searchSchema", () => {
  it("should pass with a valid query", () => {
    const result = searchSchema.validate({ q: "hello world" });
    expect(result.error).toBeUndefined();
    expect(result.value.q).toBe("hello world");
  });

  it("should fail if query is empty", () => {
    const result = searchSchema.validate({ q: "" });
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toBe("Search query is required");
  });

  it("should fail if query is missing", () => {
    const result = searchSchema.validate({});
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toBe("Search query is required");
  });

  it("should trim whitespace from query", () => {
    const result = searchSchema.validate({ q: "   search term   " });
    expect(result.error).toBeUndefined();
    expect(result.value.q).toBe("search term");
  });

  it("should fail if query is not a string", () => {
    const result = searchSchema.validate({ q: 123 });
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toMatch(/must be a string/);
  });
});
