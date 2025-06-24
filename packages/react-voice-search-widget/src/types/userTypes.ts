export type Role = "user" | "admin" | "superadmin";

export type User = {
  _id: string;
  email: string;
  role: Role;
  phone: string;
  username: string;
  country: string;
  isBlocked: boolean;
};

export type PrivateRouteProps = {
  children: React.ReactNode;
  role?: ("user" | "admin" | "superadmin")[];
};
