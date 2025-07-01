/* eslint-disable no-fallthrough */
export const validateField = (name: string, value: string) => {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (!/^[a-zA-Z\s]+$/.test(value))
        return "Name can only contain letters, spaces";

    case "email":
      if (!value.trim()) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";

    case "country":
      if (!value.trim()) return "Country is required";
      if (!/^[a-zA-Z\s]+$/.test(value))
        return "Country can only contain letters, spaces";

    case "phone":
      if (!value.trim()) return "Phone number is required";
      if (!/^\d{10}$/.test(value)) return "Invalid phone number";

    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";

    default:
      break;
  }

  return ""; // No error
};
