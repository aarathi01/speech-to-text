export type Role = "user" | "admin" | "superadmin";

export type User = {
  id: string;
  email: string;
  role: Role;
  phone: string;
  username: string;
};

export type PrivateRouteProps = {
  children: React.ReactNode;
  role?: ("user" | "admin" | "superadmin")[];
};
