export interface RegisterData {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  contrasenia: string;
  codigoReferido?: string;
  edad: number;
  isDuocStudent: boolean;
  descuentoPermanente: number;
}

export interface RegisterResponse {
  message: string;
  token?: string;
  userId?: string;
}

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  try {
    // DEBUG: Ver qué datos estamos enviando
    console.log("Datos enviados al backend:", data);
    
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // DEBUG: Ver la respuesta del servidor
    console.log("Status de respuesta:", response.status);
    
    if (!response.ok) {
      // Intentar leer el mensaje de error del backend
      const contentType = response.headers.get("content-type");
      let errorMessage = "Error al crear la cuenta";
      
      try {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.log("Error del backend (JSON):", errorData);
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
          console.log("Error del backend (Text):", errorText);
        }
      } catch (e) {
        console.error("No se pudo leer el error del backend:", e);
      }

      if (response.status === 409) {
        throw new Error("El correo ya está registrado");
      } else if (response.status === 400) {
        throw new Error(`Datos inválidos: ${errorMessage}`);
      } else if (response.status >= 500) {
        throw new Error("Error en el servidor. Intenta más tarde");
      } else {
        throw new Error(errorMessage);
      }
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
}