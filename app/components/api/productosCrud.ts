export interface ProductoForm {
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
  descripcion: string;
  categoriaId: number;
  rating?: number;
  numResenas?: number;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
  rating?: number;
  numResenas?: number;
}

const API_URL = "http://localhost:8080/api/productos";

export async function getAllProductos(token: string): Promise<ProductoResponse[]> {
  const response = await fetch(API_URL, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return await response.json();
}

export async function createProducto(data: ProductoForm, token: string): Promise<ProductoResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Datos del producto inválidos");
    }
    throw new Error("Error al crear producto");
  }

  return await response.json();
}

export async function updateProducto(id: number, data: ProductoForm, token: string): Promise<ProductoResponse> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Producto no encontrado");
    }
    throw new Error("Error al actualizar producto");
  }

  return await response.json();
}

export async function deleteProducto(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Producto no encontrado");
    }
    throw new Error("Error al eliminar producto");
  }
}