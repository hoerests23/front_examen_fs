import { Modal, Form, Input, InputNumber, Select } from "antd";
import { useEffect } from "react";
import type { ProductoForm, ProductoResponse } from "~/components/api/productosCrud";

interface ProductoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductoForm) => void;
  producto: ProductoResponse | null;
  loading: boolean;
}

const categorias = [
  { id: 1, nombre: "Juegos de Mesa" },
  { id: 2, nombre: "Accesorios" },
  { id: 3, nombre: "Consolas" },
  { id: 4, nombre: "Computadores Gamers" },
  { id: 5, nombre: "Sillas Gamers" },
  { id: 6, nombre: "Mouse" },
  { id: 7, nombre: "Mousepad" },
  { id: 8, nombre: "Poleras Personalizadas" },
  { id: 9, nombre: "Polerones Gamers Personalizados" }
];

export default function ProductoModal({ 
  open, 
  onClose, 
  onSubmit, 
  producto, 
  loading 
}: ProductoModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (producto) {
      form.setFieldsValue({
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        imagen: producto.imagen,
        descripcion: producto.descripcion,
        categoriaId: producto.categoriaId,
        rating: producto.rating || 0,
        numResenas: producto.numResenas || 0
      });
    } else {
      form.resetFields();
    }
  }, [producto, form]);

  const handleSubmit = (values: ProductoForm) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={
        <span style={{ 
          color: "#FFFFFF",
          fontFamily: "Orbitron, sans-serif",
          fontSize: 20
        }}>
          {producto ? "Editar Producto" : "Crear Producto"}
        </span>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={producto ? "Actualizar" : "Crear"}
      cancelText="Cancelar"
      confirmLoading={loading}
      width={600}
      styles={{
        body: { background: "#1a1a1a" },
        header: { background: "#1a1a1a", borderBottom: "1px solid #333" }
      }}
      okButtonProps={{
        style: {
          background: "#39FF14",
          color: "#000",
          border: "none",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "bold"
        }
      }}
      cancelButtonProps={{
        style: {
          background: "#333",
          color: "#FFF",
          border: "1px solid #555",
          fontFamily: "Roboto, sans-serif"
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label={<span style={{ color: "#FFF" }}>Nombre</span>}
          name="nombre"
          rules={[{ required: true, message: "Ingresa el nombre" }]}
        >
          <Input placeholder="Nombre del producto" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#FFF" }}>Precio</span>}
          name="precio"
          rules={[{ required: true, message: "Ingresa el precio" }]}
        >
          <InputNumber 
            placeholder="Precio" 
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#FFF" }}>Stock</span>}
          name="stock"
          rules={[{ required: true, message: "Ingresa el stock" }]}
        >
          <InputNumber 
            placeholder="Stock disponible" 
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#FFF" }}>URL de Imagen</span>}
          name="imagen"
          rules={[{ required: true, message: "Ingresa la URL de la imagen" }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#FFF" }}>Descripción</span>}
          name="descripcion"
          rules={[{ required: true, message: "Ingresa la descripción" }]}
        >
          <Input.TextArea 
            placeholder="Descripción del producto" 
            rows={4}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "#FFF" }}>Categoría</span>}
          name="categoriaId"
          rules={[{ required: true, message: "Selecciona una categoría" }]}
        >
          <Select placeholder="Selecciona una categoría">
            {categorias.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.nombre}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}