import { paginationSchema } from "../../validations/commonValidation.js";

describe("Pagination Schema", () => {
  it("should pass with valid page number", () => {
    const result = paginationSchema.validate({ page: 3 });
    expect(result.error).toBeUndefined();
    expect(result.value.page).toBe(3);
  });

  it("should default to page 1 when page is not provided", () => {
    const result = paginationSchema.validate({});
    expect(result.error).toBeUndefined();
    expect(result.value.page).toBe(1);
  });

  it("should fail with negative page number", () => {
    const result = paginationSchema.validate({ page: -1 });
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toMatch(/must be greater than or equal to 1/);
  });

  it("should fail with non-integer value", () => {
    const result = paginationSchema.validate({ page: 2.5 });
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toMatch(/must be an integer/);
  });

  it("should fail with non-numeric input", () => {
    const result = paginationSchema.validate({ page: "abc" });
    expect(result.error).toBeDefined();
    expect(result.error.details[0].message).toMatch(/must be a number/);
  });
});
