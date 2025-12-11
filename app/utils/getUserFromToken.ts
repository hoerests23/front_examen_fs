import { jwtDecode } from "jwt-decode";

export function getUserFromToken() {
  const token = localStorage.getItem("jwt");
  if (!token) return null;

  try {
    return jwtDecode<{
      sub: string;
      roles: string[];
      exp: number;
      iat: number;
    }>(token);
  } catch (err) {
    return null;
  }
}
