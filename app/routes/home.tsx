import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getUserFromToken } from "~/utils/getUserFromToken";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();

    if (!user) {
      navigate("/login");  
      return;
    }

    if (user.rol === "ADMIN") navigate("/admin");
    else navigate("/usuario");
  }, []);

  return null;
}