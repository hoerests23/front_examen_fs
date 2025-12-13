export interface ProductoBackend {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
  categoriaId: number;
} //interfaz para coincidir con el backend

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

//mapeo
const categoryMap: Record<number, string> = {
  1: "Juegos de Mesa",
  2: "Accesorios",
  3: "Consolas",
  4: "Computadores Gamers",
  5: "Sillas Gamers",
  6: "Mouse",
  7: "Mousepad",
  8: "Poleras Personalizadas",
  9: "Polerones Gamers Personalizados"
};

function mapProductoToFrontend(producto: ProductoBackend): Product {
  return {
    id: producto.id.toString(),
    name: producto.nombre,
    category: categoryMap[producto.categoriaId] || "Sin categoría",
    price: producto.precio,
    image: producto.imagen || "https://via.placeholder.com/400",
    description: "", 
    stock: producto.stock,
    rating: 0, 
    reviews: 0 
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch("http://localhost:8080/api/productos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }

    const data: ProductoBackend[] = await response.json();
    
    // convertir productos del backend al formato frontend
    return data.map(mapProductoToFrontend);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  try {
    const response = await fetch(`http://localhost:8080/api/productos/categoria/${categoryId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener productos por categoría");
    }

    const data: ProductoBackend[] = await response.json();
    return data.map(mapProductoToFrontend);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
}