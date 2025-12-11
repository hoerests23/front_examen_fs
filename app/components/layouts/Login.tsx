import LoginForm from "../molecules/Login/formLogin";
import { Flex } from "antd";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils/getUserFromToken";
import { saveToken } from "../../utils/auth";


// logica de conexión al backend
export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (values: { correo: string; password: string }) => {
    try {
      const data = await loginUser(values); // llama a la función de api
      saveToken(data.token);

      // guarda el token correctamente
      localStorage.setItem("jwt", data.token);

      // decodifica el token desde localStorage
      const user = getUserFromToken();

      if (!user) {
        alert("Error al decodificar token");
        return;
      }

      // redireccion según rol
      if (user.roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/usuario");
      }

    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <Flex align="center" justify="center" style={{ height: "100vh" }}>
      <LoginForm onSubmit={handleLogin} />
    </Flex>
  );
}
