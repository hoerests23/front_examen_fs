import { Navigate } from "react-router";
import { getUserFromToken } from "./getUserFromToken";
import type { ReactNode } from "react";

export default function ProtectedRoute({
   children,
   rolesPermitidos = [],
}: {
   children: ReactNode;
   rolesPermitidos?: string[];
}) {
   const user = getUserFromToken();

   if (!user) {
      return <Navigate to="/" replace />;
   }

   const tienePermiso =
      rolesPermitidos.length === 0 ||
      user.roles?.some((r: string) => rolesPermitidos.includes(r));

   if (!tienePermiso) {
      return <Navigate to="/" replace />;
   }

   return <>{children}</>;
}
