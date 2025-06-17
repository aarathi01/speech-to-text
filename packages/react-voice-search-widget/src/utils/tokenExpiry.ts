import { JwtPayload } from '../types/types';

export const decodeJWT = (token: string): JwtPayload | null => {
  try {
    const base64Payload = token.split(".")[1];
    const decoded = atob(base64Payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded?.exp < currentTime;
};


