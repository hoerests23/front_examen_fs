// routes/admin-ventas.tsx
import ProtectedRoute from "~/utils/ProtectedRoute";
import AdminVentasLayout from "~/components/layouts/AdminVentas";

export default function AdminVentasPage() {
  return (
    <ProtectedRoute rolesPermitidos={["ROLE_ADMIN"]}>
      <AdminVentasLayout />
    </ProtectedRoute>
  );
}