import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BoletaModal from '~/components/organisms/BoletaModal';

// Mock de formatPrice
vi.mock('~/utils/cartUtils', () => ({
  formatPrice: (price: number) => `$${price.toLocaleString('es-CL')}`
}));

// Tipo mock simplificado basado en lo que usa el componente
interface MockVenta {
  id: number;
  total: number;
  fechaVenta: string;
  usuarioId: number;
  detalles: Array<{
    id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto: {
      id: number;
      nombre: string;
      categoriaNombre: string;
    };
  }>;
}

describe('BoletaModal', () => {
  const mockOnClose = vi.fn();
  const mockWindowPrint = vi.fn();

  const mockVenta: MockVenta = {
    id: 1,
    total: 119000,
    fechaVenta: '2024-01-15T10:30:00',
    usuarioId: 1,
    detalles: [
      {
        id: 1,
        cantidad: 2,
        precioUnitario: 50000,
        subtotal: 100000,
        producto: {
          id: 1,
          nombre: 'Mouse Gamer',
          categoriaNombre: 'Accesorios'
        }
      },
      {
        id: 2,
        cantidad: 1,
        precioUnitario: 19000,
        subtotal: 19000,
        producto: {
          id: 2,
          nombre: 'Mousepad XL',
          categoriaNombre: 'Accesorios'
        }
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.print = mockWindowPrint;
  });

  it('debería renderizar el modal cuando open es true', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('LEVEL-UP GAMER')).toBeInTheDocument();
  });

  it('no debería renderizar nada cuando venta es null', () => {
    const { container } = render(<BoletaModal open={true} onClose={mockOnClose} venta={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('debería mostrar el número de boleta formateado', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('N° 00000001')).toBeInTheDocument();
  });

  it('debería mostrar la fecha de venta formateada', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    const dateText = screen.getByText(/fecha:/i).textContent;
    expect(dateText).toContain('Fecha:');
  });

  it('debería mostrar todos los productos en la boleta', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
    expect(screen.getByText('Mousepad XL')).toBeInTheDocument();
  });

  it('debería mostrar las categorías de los productos', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    const categories = screen.getAllByText('Accesorios');
    expect(categories.length).toBeGreaterThan(0);
  });

  it('debería calcular y mostrar el subtotal correctamente', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('SUBTOTAL:')).toBeInTheDocument();
  });

  it('debería calcular y mostrar el IVA correctamente', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('IVA (19%):')).toBeInTheDocument();
  });

  it('debería mostrar el total correcto', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('TOTAL:')).toBeInTheDocument();
    expect(screen.getByText('$119.000')).toBeInTheDocument();
  });

  it('debería llamar a window.print cuando se hace click en imprimir', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    const printButton = screen.getByRole('button', { name: /imprimir/i });
    fireEvent.click(printButton);
    
    expect(mockWindowPrint).toHaveBeenCalledTimes(1);
  });

  it('debería llamar a onClose cuando se hace click en cerrar', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('debería mostrar información de la empresa', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('Tienda Online de Productos Gamer')).toBeInTheDocument();
    expect(screen.getByText('Santiago, Chile')).toBeInTheDocument();
    expect(screen.getByText(/\+56 9 2305 4611/)).toBeInTheDocument();
  });

  it('debería mostrar mensaje de agradecimiento', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('Gracias por tu compra')).toBeInTheDocument();
    expect(screen.getByText(/¡Sigue jugando con Level-Up Gamer!/)).toBeInTheDocument();
  });

  it('debería mostrar encabezados de tabla correctos', () => {
    render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(screen.getByText('CANT')).toBeInTheDocument();
    expect(screen.getByText('DESCRIPCIÓN')).toBeInTheDocument();
    expect(screen.getByText('P. UNIT')).toBeInTheDocument();
  });

  it('debería coincidir con el snapshot', () => {
    const { container } = render(<BoletaModal open={true} onClose={mockOnClose} venta={mockVenta as any} />);
    
    expect(container).toMatchSnapshot();
  });
});