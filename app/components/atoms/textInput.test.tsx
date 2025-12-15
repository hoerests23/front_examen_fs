import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TextInput from '~/components/atoms/textInput';

describe('TextInput', () => {
  it('debería renderizar el input correctamente', () => {
    render(<TextInput placeholder="Ingresa texto" />);
    
    const input = screen.getByPlaceholderText('Ingresa texto');
    expect(input).toBeInTheDocument();
  });

  it('debería mostrar el placeholder correcto', () => {
    render(<TextInput placeholder="Email address" />);
    
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
  });

  it('debería tener type="text" por defecto', () => {
    render(<TextInput placeholder="Default type" />);
    
    const input = screen.getByPlaceholderText('Default type');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('debería aceptar type="password"', () => {
    render(<TextInput placeholder="Password" type="password" />);
    
    const input = screen.getByPlaceholderText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('debería aceptar type="email"', () => {
    render(<TextInput placeholder="Email" type="email" />);
    
    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('debería mostrar el value inicial', () => {
    render(<TextInput placeholder="Name" value="John Doe" />);
    
    const input = screen.getByPlaceholderText('Name') as HTMLInputElement;
    expect(input.value).toBe('John Doe');
  });

  it('debería llamar a onChange cuando el usuario escribe', () => {
    const onChange = vi.fn();
    render(<TextInput placeholder="Type here" onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'Hello World' } });
    
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('debería actualizar el valor cuando se escribe', () => {
    const onChange = vi.fn();
    render(<TextInput placeholder="Type" onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Type') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test' } });
    
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: 'Test'
      })
    }));
  });

  it('debería funcionar como input controlado', () => {
    const TestComponent = () => {
      const [value, setValue] = React.useState('');
      return (
        <TextInput
          placeholder="Controlled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    };

    render(<TestComponent />);
    
    const input = screen.getByPlaceholderText('Controlled') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Value' } });
    
    expect(input.value).toBe('New Value');
  });

  it('debería coincidir con el snapshot - input de texto', () => {
    const { container } = render(<TextInput placeholder="Snapshot test" />);
    
    expect(container.firstChild).toMatchSnapshot();
  });

  it('debería coincidir con el snapshot - input de password', () => {
    const { container } = render(<TextInput placeholder="Password" type="password" />);
    
    expect(container.firstChild).toMatchSnapshot();
  });

  it('debería coincidir con el snapshot - con valor inicial', () => {
    const { container } = render(<TextInput placeholder="Name" value="Initial Value" />);
    
    expect(container.firstChild).toMatchSnapshot();
  });
});