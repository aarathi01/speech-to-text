import {
  adminDeleteHistorySchema,
  historyIdParamSchema,
  idParamSchema,
  updateUserSchema,
} from "../../validations/adminValidation.js";

describe("Validation Schemas", () => {
  describe("idParamSchema", () => {
    it("should pass with valid 24-char hex id", () => {
      const result = idParamSchema.validate({ id: "60c72b2f9b1d4a3f8e3d3b45" });
      expect(result.error).toBeUndefined();
    });

    it("should fail with invalid id", () => {
      const result = idParamSchema.validate({ id: "invalid_id" });
      expect(result.error).toBeDefined();
    });
  });

  describe("adminDeleteHistorySchema", () => {
    it("should pass with valid user id and history id", () => {
      const result = adminDeleteHistorySchema.validate({
        id: "60c72b2f9b1d4a3f8e3d3b45",
        historyId: "1234567890abcdef12345678",
      });
      expect(result.error).toBeUndefined();
    });

    it("should fail when id or historyId is missing", () => {
      const result = adminDeleteHistorySchema.validate({
        id: "60c72b2f9b1d4a3f8e3d3b45",
      });
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toContain(
        "History ID is required"
      );
    });

    it("should fail on invalid id format", () => {
      const result = adminDeleteHistorySchema.validate({
        id: "123",
        historyId: "invalid_hex",
      });
      expect(result.error).toBeDefined();
    });
  });

  describe("historyIdParamSchema", () => {
    it("should pass with valid history id", () => {
      const result = historyIdParamSchema.validate({
        id: "abcdefabcdefabcdefabcdef",
      });
      expect(result.error).toBeUndefined();
    });

    it("should fail with short or non-hex id", () => {
      const result = historyIdParamSchema.validate({ id: "short-id" });
      expect(result.error).toBeDefined();
    });
  });

  describe("updateUserSchema", () => {
    it("should pass with one valid field", () => {
      const result = updateUserSchema.validate({ username: "sampleusername" });
      expect(result.error).toBeUndefined();
    });

    it("should fail with empty body", () => {
      const result = updateUserSchema.validate({});
      expect(result.error).toBeDefined();
    });

    it("should fail with invalid phone number", () => {
      const result = updateUserSchema.validate({ phone: "12345" });
      expect(result.error).toBeDefined();
    });

    it("should fail with invalid country format", () => {
      const result = updateUserSchema.validate({ country: "India123" });
      expect(result.error).toBeDefined();
    });

    it("should pass with all valid fields", () => {
      const result = updateUserSchema.validate({
        username: "Aarathi",
        phone: "9876543210",
        country: "India",
      });
      expect(result.error).toBeUndefined();
    });
  });
});
