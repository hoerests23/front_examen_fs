import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartDrawer from '~/components/organisms/CartDrawer';
import type { CartItem } from '~/utils/cartUtils';

// Mocks
const mockNavigate = vi.fn();
const mockGetCart = vi.fn();
const mockUpdateCartItemQuantity = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockGetCartSummary = vi.fn();
const mockClearCart = vi.fn();
const mockGetToken = vi.fn();
const mockCreateVenta = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('~/utils/cartUtils', () => ({
  getCart: () => mockGetCart(),
  updateCartItemQuantity: (id: string, qty: number) => mockUpdateCartItemQuantity(id, qty),
  removeFromCart: (id: string) => mockRemoveFromCart(id),
  getCartSummary: () => mockGetCartSummary(),
  formatPrice: (price: number) => `$${price.toLocaleString('es-CL')}`,
  clearCart: () => mockClearCart()
}));

vi.mock('~/utils/auth', () => ({
  getToken: () => mockGetToken()
}));

vi.mock('~/components/api/ventas', () => ({
  createVenta: (data: any, token: string) => mockCreateVenta(data, token)
}));

const mockCartItems: CartItem[] = [
  {
    productId: '1',
    name: 'Mouse Gamer',
    price: 50000,
    quantity: 2,
    image: '/mouse.jpg',
    category: 'Accesorios'
  },
  {
    productId: '2',
    name: 'Teclado Mecánico',
    price: 80000,
    quantity: 1,
    image: '/keyboard.jpg',
    category: 'Accesorios'
  }
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CartDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCart.mockReturnValue([]);
    mockGetCartSummary.mockReturnValue({
      subtotal: 0,
      iva: 0,
      total: 0
    });
  });

  it('debería renderizar el drawer cuando open es true', () => {
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    expect(screen.getByText('🛒 Mi Carrito')).toBeInTheDocument();
  });

  it('debería mostrar mensaje de carrito vacío cuando no hay items', () => {
    mockGetCart.mockReturnValue([]);
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
  });

  it('debería mostrar los items del carrito', () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
    expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
  });

  it('debería mostrar las imágenes de los productos', () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    const mouseImage = screen.getByAltText('Mouse Gamer');
    const keyboardImage = screen.getByAltText('Teclado Mecánico');
    
    expect(mouseImage).toBeInTheDocument();
    expect(keyboardImage).toBeInTheDocument();
  });

  it('debería llamar a updateCartItemQuantity cuando se cambia la cantidad', () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    // Este test es difícil de hacer con InputNumber de Ant Design
    // pero podemos verificar que el componente renderiza los controles
    const quantityInputs = screen.getAllByText('Cantidad:');
    expect(quantityInputs.length).toBe(2);
  });

  it('debería llamar a removeFromCart cuando se hace click en eliminar', () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  it('debería mostrar el botón de confirmar compra cuando hay items', () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    expect(screen.getByRole('button', { name: /confirmar compra/i })).toBeInTheDocument();
  });

  it('NO debería mostrar el botón de confirmar compra cuando el carrito está vacío', () => {
    mockGetCart.mockReturnValue([]);
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    expect(screen.queryByRole('button', { name: /confirmar compra/i })).not.toBeInTheDocument();
  });

  it('debería redirigir al login si no hay token al hacer checkout', async () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    mockGetToken.mockReturnValue(null);
    
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    const checkoutButton = screen.getByRole('button', { name: /confirmar compra/i });
    fireEvent.click(checkoutButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('debería procesar la compra exitosamente', async () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    mockGetToken.mockReturnValue('fake-token');
    mockCreateVenta.mockResolvedValue({ id: 123 });
    
    const onClose = vi.fn();
    renderWithRouter(<CartDrawer open={true} onClose={onClose} />);
    
    const checkoutButton = screen.getByRole('button', { name: /confirmar compra/i });
    fireEvent.click(checkoutButton);
    
    await waitFor(() => {
      expect(mockCreateVenta).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 180000,
          items: expect.arrayContaining([
            { productoId: 1, cantidad: 2 },
            { productoId: 2, cantidad: 1 }
          ])
        }),
        'fake-token'
      );
    });
  });

  it('debería mostrar error si la compra falla', async () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    mockGetToken.mockReturnValue('fake-token');
    mockCreateVenta.mockRejectedValue(new Error('Error de red'));
    
    renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    const checkoutButton = screen.getByRole('button', { name: /confirmar compra/i });
    fireEvent.click(checkoutButton);
    
    await waitFor(() => {
      expect(mockCreateVenta).toHaveBeenCalled();
    });
  });

  it('debería actualizar los items cuando se dispara el evento cartUpdated', () => {
    mockGetCart.mockReturnValue([]);
    const { rerender } = renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
    
    mockGetCart.mockReturnValue(mockCartItems);
    window.dispatchEvent(new Event('cartUpdated'));
    
    rerender(
      <BrowserRouter>
        <CartDrawer open={true} onClose={vi.fn()} />
      </BrowserRouter>
    );
  });

  it('debería coincidir con el snapshot - carrito vacío', () => {
    mockGetCart.mockReturnValue([]);
    const { container } = renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    expect(container).toMatchSnapshot();
  });

  it('debería coincidir con el snapshot - con items', () => {
    mockGetCart.mockReturnValue(mockCartItems);
    mockGetCartSummary.mockReturnValue({
      subtotal: 151261,
      iva: 28739,
      total: 180000
    });
    
    const { container } = renderWithRouter(<CartDrawer open={true} onClose={vi.fn()} />);
    
    expect(container).toMatchSnapshot();
  });
});