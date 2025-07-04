import { showError, showSuccess } from "../../utils/errorHandler";
import { toast } from "react-toastify";

// Mock toast methods
vi.mock("react-toastify", async () => {
  const actual = await vi.importActual("react-toastify");
  return {
    ...actual,
    toast: {
      error: vi.fn(),
      success: vi.fn(),
      dismiss: vi.fn(),
    },
  };
});

describe("errorHandler utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("showError", () => {
    it("shows error with string message", () => {
      (toast.error as vi.mock).mockImplementation((msg: string, options: vi.mock) => {
        options.onClose();
        return "toast-id";
      });

      const toastId = showError("Test error");
      expect(toast.error).toHaveBeenCalledWith("Test error", expect.any(Object));
      expect(toastId).toBe("toast-id");
    });

    it("shows error with error object with response data", () => {
      const mockError = {
        response: { data: { message: "Server error" } },
      };
      const toastId = showError(mockError);
      expect(toast.error).toHaveBeenCalledWith("Server error", expect.any(Object));
      expect(toastId).toBeDefined();
    });

    it("shows error with Error object", () => {
      const err = new Error("Runtime error");
      const toastId = showError(err);
      expect(toast.error).toHaveBeenCalledWith("Runtime error", expect.any(Object));
      expect(toastId).toBeDefined();
    });

    it("shows fallback message for unknown error", () => {
      const toastId = showError(null);
      expect(toast.error).toHaveBeenCalledWith("Something went wrong", expect.any(Object));
      expect(toastId).toBeDefined();
    });

  });

  describe("showSuccess", () => {
    it("dismisses previous toasts and shows success", () => {
      showSuccess("Success message");
      expect(toast.dismiss).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Success message");
    });
  });
});
