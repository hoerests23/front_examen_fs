export interface VentaItem {
  productoId: number;
  cantidad: number;
}

export interface VentaRequest {
  items: VentaItem[];  
  total: number;
}

export interface VentaResponse {
  id: number;
  fechaVenta: string;
  total: number;
  detalles: {
    id: number;
    producto: {
      id: number;
      nombre: string;
      categoriaId: number;
      categoriaNombre: string;
    };
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}

export async function createVenta(data: VentaRequest, token: string): Promise<VentaResponse> {
  try {
    console.log("🚀 Enviando al backend:", JSON.stringify(data, null, 2));

    const response = await fetch("http://localhost:8080/api/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error del backend:", errorText);
      
      if (response.status === 400) {
        throw new Error("Datos de venta inválidos");
      } else if (response.status === 401) {
        throw new Error("Debes iniciar sesión para realizar una compra");
      } else if (response.status === 404) {
        throw new Error("Uno o más productos no fueron encontrados");
      } else if (response.status >= 500) {
        throw new Error("Error en el servidor. Intenta más tarde");
      } else {
        throw new Error("Error al procesar la venta");
      }
    }

    const result = await response.json();
    console.log("✅ Venta creada:", result);
    return result;

  } catch (error) {
    console.error("Error en createVenta:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
}

/**
 * Obtener las ventas del usuario autenticado
 */
export async function getMisVentas(token: string): Promise<VentaResponse[]> {
  try {
    const response = await fetch("http://localhost:8080/api/ventas/mis-ventas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Debes iniciar sesión");
      }
      throw new Error("Error al obtener las ventas");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ventas:", error);
    throw error;
  }
}