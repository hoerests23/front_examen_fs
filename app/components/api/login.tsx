export interface LoginCredentials {
  correo: string;
  contrasenia: string;
}

export interface LoginResponse {
  token: string;
}

export async function loginUser(data: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // manejo de errores
      if (response.status === 401) {
        throw new Error("Correo o contraseña incorrectos");
      } else if (response.status === 404) {
        throw new Error("Usuario no encontrado");
      } else if (response.status >= 500) {
        throw new Error("Error en el servidor. Intenta más tarde");
      } else {
        throw new Error("Error al iniciar sesión");
      }
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
}