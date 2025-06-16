import api from "./api";
import { LoginPayload, RegisterPayload } from "../types/types";

export const login = (data: LoginPayload) => api.post("/login", data);
export const register = (data: RegisterPayload) => api.post("/register", data);

