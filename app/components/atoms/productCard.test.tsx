import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '~/components/atoms/productCard';
import type { Product } from '~/data/mockProducts';

vi.mock('~/utils/cartUtils', () => ({
  formatPrice: (price: number) => `$${price.toLocaleString('es-CL')}`
}));

const mockProduct: Product = {
    id: '1',
    name: 'Producto de Prueba',
    description: 'Esta es una descripción de prueba del producto',
    price: 50000,
    image: '/test-image.jpg',
    category: 'Categoría de Prueba',
    stock: 15,
    rating: 4.5,
    reviews: 10
};

describe('ProductCard', () => {
  it('debería renderizar la información del producto correctamente', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    expect(screen.getByText('Producto de Prueba')).toBeInTheDocument();
    expect(screen.getByText(/Esta es una descripción de prueba/)).toBeInTheDocument();
    expect(screen.getByText('Categoría de Prueba')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('debería renderizar la imagen del producto con alt text correcto', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const image = screen.getByAltText('Producto de Prueba');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('debería llamar a onAddToCart cuando se hace click en agregar', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const addButton = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(addButton);

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('debería mostrar tag "Últimas unidades" cuando el stock es menor a 10', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 };
    const onAddToCart = vi.fn();
    render(<ProductCard product={lowStockProduct} onAddToCart={onAddToCart} />);

    expect(screen.getByText('¡Últimas unidades!')).toBeInTheDocument();
  });

  it('NO debería mostrar tag "Últimas unidades" cuando el stock es 10 o más', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    expect(screen.queryByText('¡Últimas unidades!')).not.toBeInTheDocument();
  });

  it('debería deshabilitar el botón y mostrar "Sin stock" cuando stock es 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    const onAddToCart = vi.fn();
    render(<ProductCard product={outOfStockProduct} onAddToCart={onAddToCart} />);

    const addButton = screen.getByRole('button', { name: /agregar/i });
    expect(addButton).toBeDisabled();
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
  });

  it('NO debería llamar a onAddToCart cuando el botón está deshabilitado (stock 0)', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    const onAddToCart = vi.fn();
    render(<ProductCard product={outOfStockProduct} onAddToCart={onAddToCart} />);

    const addButton = screen.getByRole('button', { name: /agregar/i });
    fireEvent.click(addButton);

    expect(onAddToCart).not.toHaveBeenCalled();
  });

  it('debería renderizar el rating correctamente', () => {
    const onAddToCart = vi.fn();
    const { container } = render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    // Verificar que el componente Rate está presente
    const rateElement = container.querySelector('.ant-rate');
    expect(rateElement).toBeInTheDocument();
    
    // Verificar que hay reviews mostradas
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('debería mostrar el precio formateado', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    expect(screen.getByText(/50\.000/)).toBeInTheDocument();
  });

  it('debería coincidir con el snapshot', () => {
    const onAddToCart = vi.fn();
    const { container } = render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    expect(container.firstChild).toMatchSnapshot();
  });
});