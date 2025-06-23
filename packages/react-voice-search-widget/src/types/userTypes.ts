export type Role = "user" | "admin" | "superadmin";

export type User = {
  id: string;
  email: string;
  role: Role;
};
