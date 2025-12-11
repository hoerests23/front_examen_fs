
//conexión con el backend 
export async function loginUser(data: { correo: string; password: string }) {
  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: data.correo,
      contrasenia: data.password
    }),
  });

  if (!response.ok) {
    throw new Error("Error en el login");
  }

  return await response.json();
}
