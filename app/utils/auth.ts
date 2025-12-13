import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwt"; 

export interface DecodedToken {
  sub: string;
  nombre: string;
  roles: string[];
  exp: number;
  iat: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

//guardar
export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

//log out
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUserFromToken(): DecodedToken | null {

  if (!isBrowser()) return null;

  const token = getToken();
  
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    //expiracion
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      removeToken();
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    removeToken();
    return null;
  }
}

export function hasRole(role: string): boolean {
  const user = getUserFromToken();
  return user?.roles.includes(role) ?? false;
}

export function isAuthenticated(): boolean {
  return getUserFromToken() !== null;
}