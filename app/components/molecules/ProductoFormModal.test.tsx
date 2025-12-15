import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductoModal from '~/components/molecules/ProductoFormModal';
import type { ProductoResponse } from '~/components/api/productosCrud';

describe('ProductoFormModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    const defaultProps = {
        open: true,
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
        producto: null,
        loading: false
    };

    const mockProducto: ProductoResponse = {
        id: 1,
        nombre: 'Mouse Gamer',
        precio: 50000,
        stock: 20,
        imagen: 'https://example.com/mouse.jpg',
        descripcion: 'Mouse de alta precisión',
        categoriaId: 6,
        rating: 4.5,
        numResenas: 10,
        categoriaNombre: 'Mouse'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('debería renderizar el modal cuando open es true', () => {
        render(<ProductoModal {...defaultProps} />);
        
        expect(screen.getByText('+ Crear Producto')).toBeInTheDocument();
    });

    it('debería mostrar título de edición cuando hay producto', () => {
        render(<ProductoModal {...defaultProps} producto={mockProducto} />);
        
        expect(screen.getByText('✏️ Editar Producto')).toBeInTheDocument();
    });

    it('debería mostrar título de creación cuando no hay producto', () => {
        render(<ProductoModal {...defaultProps} producto={null} />);
        
        expect(screen.getByText('+ Crear Producto')).toBeInTheDocument();
    });

    it('debería mostrar todos los campos del formulario', () => {
        render(<ProductoModal {...defaultProps} />);
        
        expect(screen.getByText('Nombre del Producto')).toBeInTheDocument();
        expect(screen.getByText('Precio (CLP)')).toBeInTheDocument();
        expect(screen.getByText('Stock Disponible')).toBeInTheDocument();
        expect(screen.getByText('Categoría')).toBeInTheDocument();
        expect(screen.getByText('URL de la Imagen')).toBeInTheDocument();
        expect(screen.getByText('Descripción')).toBeInTheDocument();
    });

    it('debería prellenar el formulario cuando hay producto', async () => {
        render(<ProductoModal {...defaultProps} producto={mockProducto} />);
        
        await waitFor(() => {
        const nombreInput = screen.getByPlaceholderText(/mouse gamer logitech/i) as HTMLInputElement;
        expect(nombreInput.value).toBe('Mouse Gamer');
        });
    });

    it('debería mostrar campos de rating solo en modo edición', () => {
        const { rerender } = render(<ProductoModal {...defaultProps} producto={null} />);
        
        expect(screen.queryByText(/rating promedio/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/nº reseñas/i)).not.toBeInTheDocument();
        
        rerender(<ProductoModal {...defaultProps} producto={mockProducto} />);
        
        expect(screen.getByText(/rating promedio/i)).toBeInTheDocument();
        expect(screen.getByText(/nº reseñas/i)).toBeInTheDocument();
    });

    it('debería llamar a onClose cuando se hace click en cancelar', () => {
        render(<ProductoModal {...defaultProps} />);
        
        const cancelButton = screen.getByRole('button', { name: /cancelar/i });
        fireEvent.click(cancelButton);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debería mostrar el botón "Crear" en modo creación', () => {
        render(<ProductoModal {...defaultProps} producto={null} />);
        
        expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
    });

    it('debería mostrar el botón "Actualizar" en modo edición', () => {
        render(<ProductoModal {...defaultProps} producto={mockProducto} />);
        
        expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
    });

    it('debería mostrar mensaje informativo en modo creación', () => {
        render(<ProductoModal {...defaultProps} producto={null} />);
        
        expect(screen.getByText(/los campos de/i)).toBeInTheDocument();
        expect(screen.getByText(/rating/i)).toBeInTheDocument();
    });

    it('debería tener campos deshabilitados de rating en modo edición', () => {
        render(<ProductoModal {...defaultProps} producto={mockProducto} />);
        
        const inputs = screen.getAllByRole('spinbutton');
        const ratingInput = inputs.find(input => 
        input.getAttribute('placeholder') === '4.5'
        ) as HTMLInputElement;
        
        expect(ratingInput).toBeDisabled();
    });

    it('debería validar campos requeridos al enviar', async () => {
        render(<ProductoModal {...defaultProps} />);
        
        const okButton = screen.getByRole('button', { name: /crear/i });
        fireEvent.click(okButton);
        
        await waitFor(() => {
        expect(screen.getByText(/ingresa el nombre del producto/i)).toBeInTheDocument();
        });
    });

    it('debería tener estilos correctos del modal', () => {
        render(<ProductoModal {...defaultProps} />);

        const modal = document.body.querySelector('.ant-modal');
        expect(modal).toBeInTheDocument();
    });

    it('debería coincidir con el snapshot - modo creación', () => {
        const { container } = render(<ProductoModal {...defaultProps} producto={null} />);
        
        expect(container).toMatchSnapshot();
    });

    it('debería coincidir con el snapshot - modo edición', () => {
        const { container } = render(<ProductoModal {...defaultProps} producto={mockProducto} />);
        
        expect(container).toMatchSnapshot();
    });
});