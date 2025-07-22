import { createContext } from "react";
import { User } from "../types/userTypes";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<AuthContextType["user"]>>; // It ensures `setUser` always accepts the same type as the `user` property in the context — good type safety.
  loading: boolean;
}

// Creates the actual AuthContext object that components like AuthProvider will use to provide values.
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: false,
});
