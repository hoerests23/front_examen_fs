import ProtectedRoute from "../utils/ProtectedRoute";
import UserLayout from "../components/layouts/UserLayout";

export default function UsuarioPage() {
  return (
    <ProtectedRoute rolesPermitidos={["ROLE_USER", "ROLE_ADMIN"]}>
      <UserLayout />
    </ProtectedRoute>
  );
}