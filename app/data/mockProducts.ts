export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  rating: number;
  reviews: number;
}

export const categories = [
  "Juegos de Mesa",
  "Accesorios",
  "Consolas",
  "Computadores Gamers",
  "Sillas Gamers",
  "Mouse",
  "Mousepad",
  "Poleras Personalizadas",
  "Polerones Gamers Personalizados"
];

export const mockProducts: Product[] = [
  // JUEGOS DE MESA
  {
    id: "jm001",
    name: "Catan - Edición Estándar",
    category: "Juegos de Mesa",
    price: 35990,
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400",
    description: "El clásico juego de estrategia y construcción",
    stock: 15,
    rating: 4.8,
    reviews: 234
  },
  {
    id: "jm002",
    name: "Monopoly Gamer Edition",
    category: "Juegos de Mesa",
    price: 29990,
    image: "https://images.unsplash.com/photo-1566694271355-9ead56467fd0?w=400",
    description: "Monopoly con temática de videojuegos",
    stock: 20,
    rating: 4.5,
    reviews: 156
  },
  
  // ACCESORIOS
  {
    id: "ac001",
    name: "Auriculares HyperX Cloud II",
    category: "Accesorios",
    price: 89990,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=400",
    description: "Auriculares gaming con sonido 7.1 surround",
    stock: 30,
    rating: 4.9,
    reviews: 1024
  },
  {
    id: "ac002",
    name: "Teclado Mecánico RGB",
    category: "Accesorios",
    price: 79990,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    description: "Teclado mecánico con switches Cherry MX",
    stock: 25,
    rating: 4.7,
    reviews: 567
  },
  {
    id: "ac003",
    name: "Webcam Logitech C920",
    category: "Accesorios",
    price: 69990,
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
    description: "Webcam Full HD para streaming",
    stock: 18,
    rating: 4.6,
    reviews: 432
  },

  // CONSOLAS
  {
    id: "co001",
    name: "PlayStation 5",
    category: "Consolas",
    price: 599990,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    description: "Consola de última generación",
    stock: 8,
    rating: 5.0,
    reviews: 2341
  },
  {
    id: "co002",
    name: "Xbox Series X",
    category: "Consolas",
    price: 579990,
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400",
    description: "Potencia y velocidad sin límites",
    stock: 10,
    rating: 4.9,
    reviews: 1876
  },
  {
    id: "co003",
    name: "Nintendo Switch OLED",
    category: "Consolas",
    price: 399990,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400",
    description: "Portátil con pantalla OLED mejorada",
    stock: 12,
    rating: 4.8,
    reviews: 1543
  },

  // COMPUTADORES GAMERS
  {
    id: "pc001",
    name: "PC Gamer RTX 4070",
    category: "Computadores Gamers",
    price: 1899990,
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400",
    description: "Intel i7 13700K, 32GB RAM, RTX 4070",
    stock: 5,
    rating: 4.9,
    reviews: 234
  },
  {
    id: "pc002",
    name: "PC Gamer RTX 4060",
    category: "Computadores Gamers",
    price: 1299990,
    image: "https://images.unsplash.com/photo-1591238371109-e96d95e4c48e?w=400",
    description: "Intel i5 13600K, 16GB RAM, RTX 4060",
    stock: 7,
    rating: 4.7,
    reviews: 189
  },

  // SILLAS GAMERS
  {
    id: "si001",
    name: "Silla Gamer DXRacer",
    category: "Sillas Gamers",
    price: 249990,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400",
    description: "Silla ergonómica con soporte lumbar",
    stock: 12,
    rating: 4.6,
    reviews: 456
  },
  {
    id: "si002",
    name: "Silla Gamer Secretlab",
    category: "Sillas Gamers",
    price: 449990,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
    description: "Premium con cuero PU de alta calidad",
    stock: 8,
    rating: 4.9,
    reviews: 789
  },

  // MOUSE
  {
    id: "mo001",
    name: "Logitech G502 Hero",
    category: "Mouse",
    price: 59990,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
    description: "Mouse gaming de alta precisión 25600 DPI",
    stock: 40,
    rating: 4.8,
    reviews: 2134
  },
  {
    id: "mo002",
    name: "Razer DeathAdder V3",
    category: "Mouse",
    price: 69990,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400",
    description: "Mouse ultraligero con sensor óptico",
    stock: 35,
    rating: 4.7,
    reviews: 1876
  },

  // MOUSEPAD
  {
    id: "mp001",
    name: "SteelSeries QcK XXL",
    category: "Mousepad",
    price: 29990,
    image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=400",
    description: "Mousepad gaming de tela extra grande",
    stock: 50,
    rating: 4.6,
    reviews: 567
  },
  {
    id: "mp002",
    name: "Corsair MM300 Extended",
    category: "Mousepad",
    price: 24990,
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400",
    description: "Superficie optimizada para control",
    stock: 45,
    rating: 4.5,
    reviews: 432
  },

  // POLERAS PERSONALIZADAS
  {
    id: "po001",
    name: "Polera The Legend of Zelda",
    category: "Poleras Personalizadas",
    price: 19990,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
    description: "Polera 100% algodón con estampado oficial",
    stock: 30,
    rating: 4.4,
    reviews: 234
  },
  {
    id: "po002",
    name: "Polera Cyberpunk 2077",
    category: "Poleras Personalizadas",
    price: 21990,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400",
    description: "Diseño exclusivo con logo del juego",
    stock: 25,
    rating: 4.6,
    reviews: 189
  },

  // POLERONES GAMERS PERSONALIZADOS
  {
    id: "pr001",
    name: "Polerón God of War Ragnarök",
    category: "Polerones Gamers Personalizados",
    price: 39990,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    description: "Polerón con capucha y estampado frontal",
    stock: 20,
    rating: 4.7,
    reviews: 345
  },
  {
    id: "pr002",
    name: "Polerón Elden Ring",
    category: "Polerones Gamers Personalizados",
    price: 42990,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400",
    description: "Diseño premium con logo del Elden Ring",
    stock: 18,
    rating: 4.8,
    reviews: 267
  }
];