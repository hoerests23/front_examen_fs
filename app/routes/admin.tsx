import ProtectedRoute from "../utils/ProtectedRoute";
import AdminLayout from "../components/layouts/AdminLayout";

export default function AdminPage() {
  return (
    <ProtectedRoute rolesPermitidos={["ROLE_ADMIN"]}>
      <AdminLayout />
    </ProtectedRoute>
  );
}