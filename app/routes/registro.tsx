import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import RegisterForm from "~/components/molecules/Login/formRegister";
import { registerUser } from "~/components/api/register";
import { saveToken } from "~/utils/auth";

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const response = await registerUser(values);
      message.success("¡Cuenta creada exitosamente! 🎮");
      
      // Si el backend devuelve un token, guardarlo y redirigir
      if (response.token) {
        saveToken(response.token);
        navigate("/usuario", { replace: true });
      } else {
        // Redirigir a la raíz donde está el login
        navigate("/", { replace: true });  // ← Cambiar de "/login" a "/"
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Error al crear la cuenta");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }}>
      <RegisterForm onSubmit={handleRegister} loading={loading} />
    </div>
  );
}