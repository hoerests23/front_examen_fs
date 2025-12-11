export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

const CART_KEY = "levelup_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function addToCart(item: Omit<CartItem, "quantity">): void {
  const cart = getCart();
  const existingItem = cart.find(i => i.productId === item.productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
}

export function updateCartItemQuantity(productId: string, quantity: number): void {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

export function removeFromCart(productId: string): void {
  const cart = getCart();
  const filteredCart = cart.filter(i => i.productId !== productId);
  saveCart(filteredCart);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
}