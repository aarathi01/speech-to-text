import { loginSchema,registerSchema } from "../../validations/authValidation.js";

describe("Auth Validation Schemas", () => {
  describe("registerSchema", () => {
    it("should pass with valid data", () => {
      const result = registerSchema.validate({
        username: "Aarathi",
        email: "aarathi@example.com",
        country: "India",
        password: "securepass",
        phone: "9876543210",
      });

      expect(result.error).toBeUndefined();
    });

    it("should fail when required fields are missing", () => {
      const result = registerSchema.validate({});
      expect(result.error).toBeDefined();
      expect(result.error.details.length).toBeGreaterThan(0);
    });

    it("should fail when email is invalid", () => {
      const result = registerSchema.validate({
        username: "Aarathi",
        email: "not-an-email",
        country: "India",
        password: "secret123",
      });

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/email/i);
    });

    it("should fail with short password", () => {
      const result = registerSchema.validate({
        username: "Aarathi",
        email: "a@b.com",
        country: "India",
        password: "123",
      });

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/length must be at least 6 characters/i);
    });

    it("should fail with invalid phone number", () => {
      const result = registerSchema.validate({
        username: "Aarathi",
        email: "a@b.com",
        country: "India",
        password: "123456",
        phone: "abcd123456",
      });

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/fails to match the required pattern/i);
    });

    it("should fail with invalid country", () => {
      const result = registerSchema.validate({
        username: "Aarathi",
        email: "a@b.com",
        country: "Ind1a",
        password: "123456",
      });

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toBe("Country can only contain letters and spaces");
    });
  });

  describe("loginSchema", () => {
    it("should pass with valid login data", () => {
      const result = loginSchema.validate({
        email: "test@example.com",
        password: "somepass",
      });

      expect(result.error).toBeUndefined();
    });

    it("should fail if email is missing", () => {
      const result = loginSchema.validate({ password: "123456" });
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch("\"email\" is required");
    });

    it("should fail if password is missing", () => {
      const result = loginSchema.validate({ email: "a@b.com" });
      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch( "\"password\" is required");
    });

    it("should fail with invalid email format", () => {
      const result = loginSchema.validate({
        email: "invalid-email",
        password: "123456",
      });

      expect(result.error).toBeDefined();
      expect(result.error.details[0].message).toMatch(/must be a valid email/i);
    });
  });
});
