import { validateField } from "../../utils/validators";

describe("validateField", () => {
  describe("name field", () => {
    it("returns error if name is empty", () => {
      expect(validateField("name", "")).toBe("Name is required");
    });

    it("returns error if name contains invalid characters", () => {
      expect(validateField("name", "John123")).toBe("Name can only contain letters, spaces");
    });

    it("returns empty string for valid name", () => {
      expect(validateField("name", "John Doe")).toBe("");
    });
  });

  describe("email field", () => {
    it("returns error if email is empty", () => {
      expect(validateField("email", "")).toBe("Email is required");
    });

    it("returns error for invalid email format", () => {
      expect(validateField("email", "john@invalid")).toBe("Invalid email format");
    });

    it("returns empty string for valid email", () => {
      expect(validateField("email", "john@example.com")).toBe("");
    });
  });

  describe("country field", () => {
    it("returns error if country is empty", () => {
      expect(validateField("country", "")).toBe("Country is required");
    });

    it("returns empty string for valid country", () => {
      expect(validateField("country", "India")).toBe("");
    });
  });

  describe("phone field", () => {
    it("returns error if phone is empty", () => {
      expect(validateField("phone", "")).toBe("Phone number is required");
    });

    it("returns error for invalid phone number", () => {
      expect(validateField("phone", "12345")).toBe("Invalid phone number");
    });

    it("returns empty string for valid phone number", () => {
      expect(validateField("phone", "9876543210")).toBe("");
    });
  });

  describe("password field", () => {
    it("returns error if password is empty", () => {
      expect(validateField("password", "")).toBe("Password is required");
    });

    it("returns error if password is too short", () => {
      expect(validateField("password", "123")).toBe("Password must be at least 6 characters");
    });

    it("returns empty string for valid password", () => {
      expect(validateField("password", "abcdef")).toBe("");
    });
  });

  describe("default case", () => {
    it("returns empty string for unknown field", () => {
      expect(validateField("unknown", "some value")).toBe("");
    });
  });
});
