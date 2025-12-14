import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserFromToken } from "./auth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  rolesPermitidos?: string[];
}

export default function ProtectedRoute({
  children,
  rolesPermitidos = [],
}: ProtectedRouteProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (rolesPermitidos.length > 0) {
    const tienePermiso = user.roles.some((rol) =>
      rolesPermitidos.includes(rol)
    );

    if (!tienePermiso) {
      if (user.roles.includes("ROLE_ADMIN")) {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/usuario" replace />;
      }
    }
  }

  return <>{children}</>;
}