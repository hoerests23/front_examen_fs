import ProtectedRoute from "../utils/ProtectedRoute";
import MisComprasLayout from "../components/layouts/MisComprasLayout";

export default function MisComprasPage() {
  return (
    <ProtectedRoute rolesPermitidos={["ROLE_USER", "ROLE_ADMIN"]}>
      <MisComprasLayout />
    </ProtectedRoute>
  );
}