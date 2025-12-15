import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartBadge from '~/components/atoms/cartBadge';

const mockGetCartItemCount = vi.fn();

vi.mock('~/utils/cartUtils', () => ({
  getCartItemCount: () => mockGetCartItemCount()
}));

describe('CartBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el badge del carrito', () => {
    mockGetCartItemCount.mockReturnValue(0);
    const onClick = vi.fn();
    
    render(<CartBadge onClick={onClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('debería mostrar el conteo correcto de items', () => {
    mockGetCartItemCount.mockReturnValue(5);
    const onClick = vi.fn();
    
    const { container } = render(<CartBadge onClick={onClick} />);
    
    const badge = container.querySelector('.ant-badge-count');
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe('5');
  });

  it('debería llamar a onClick cuando se hace click', () => {
    mockGetCartItemCount.mockReturnValue(0);
    const onClick = vi.fn();
    
    render(<CartBadge onClick={onClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('debería actualizar el conteo cuando se dispara el evento cartUpdated', () => {
    mockGetCartItemCount.mockReturnValue(3);
    const onClick = vi.fn();
    
    const { container, rerender } = render(<CartBadge onClick={onClick} />);
    
    let badge = container.querySelector('.ant-badge-count');
    expect(badge?.textContent).toBe('3');
    
    // Simular actualización del carrito
    mockGetCartItemCount.mockReturnValue(7);
    window.dispatchEvent(new Event('cartUpdated'));
    
    rerender(<CartBadge onClick={onClick} />);
  });

  it('no debería mostrar el badge cuando el conteo es 0', () => {
    mockGetCartItemCount.mockReturnValue(0);
    const onClick = vi.fn();
    
    const { container } = render(<CartBadge onClick={onClick} />);
    
    // Ant Design no muestra el badge cuando count es 0
    const badge = container.querySelector('.ant-badge-count');
    expect(badge).not.toBeInTheDocument();
  });

  it('debería coincidir con el snapshot', () => {
    mockGetCartItemCount.mockReturnValue(5);
    const onClick = vi.fn();
    
    const { container } = render(<CartBadge onClick={onClick} />);
    
    expect(container.firstChild).toMatchSnapshot();
  });
});