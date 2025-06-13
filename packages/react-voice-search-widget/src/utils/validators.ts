export const validateField = (name: string, value: string) => {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (!/^[a-zA-Z\s]+$/.test(value))
        return "Name can only contain letters, spaces";
      break;

    case "email":
      if (!value.trim()) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      break;

    case "country":
      if (!value.trim()) return "Country is required";
      break;

    case "phone":
      if (!value.trim()) return "Phone number is required";
      if (!/^\d{10}$/.test(value)) return "Invalid phone number";
      break;

    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      break;

    default:
      break;
  }

  return ""; // No error
};
