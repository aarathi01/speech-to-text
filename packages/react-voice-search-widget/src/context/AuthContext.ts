import { createContext } from "react";
import { User } from "../types/userTypes";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<AuthContextType["user"]>>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => { },
  loading: false
});
