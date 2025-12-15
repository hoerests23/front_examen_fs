import { Modal, Form, Input, InputNumber, Select, ConfigProvider } from "antd";
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
  }, [producto, form, open]);

  const handleSubmit = (values: ProductoForm) => {
    const dataToSend = {
      ...values,
      rating: values.rating ?? 0,
      numResenas: values.numResenas ?? 0
    };
    onSubmit(dataToSend);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: '#1a1a1a',
            headerBg: '#1a1a1a',
            footerBg: '#1a1a1a',
          },
          Input: {
            colorBgContainer: '#000000',
            colorBorder: '#333333',
            colorText: '#FFFFFF',
            colorTextPlaceholder: '#666666',
          },
          InputNumber: {
            colorBgContainer: '#1e90ffff',
            colorBorder: '#333333',
            colorText: '#FFFFFF',
          },
          Select: {
            colorBgContainer: '#000000',
            colorBorder: '#333333',
            colorText: '#FFFFFF',
            colorBgElevated: '#1a1a1a',
            optionSelectedBg: '#1e90ffff',
          },
        },
      }}
    >
      <Modal
        title={
          <span style={{ 
            color: "#FFFFFF",
            fontFamily: "Orbitron, sans-serif",
            fontSize: 20
          }}>
            {producto ? "✏️ Editar Producto" : " + Crear Producto"}
          </span>
        }
        open={open}
        onCancel={onClose}
        onOk={() => form.submit()}
        okText={producto ? "Actualizar" : "Crear"}
        cancelText="Cancelar"
        confirmLoading={loading}
        width={800}
        okButtonProps={{
          style: {
            background: "#1E90FF",
            color: "#FFF",
            border: "none",
            fontFamily: "Roboto, sans-serif",
            fontWeight: "bold",
            height: 40
          }
        }}
        cancelButtonProps={{
          style: {
            background: "#333",
            color: "#FFF",
            border: "1px solid #555",
            fontFamily: "Roboto, sans-serif",
            height: 40
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            rating: 0,
            numResenas: 0
          }}
        >
          <Form.Item
            label={<span style={{ color: "#FFF", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>Nombre del Producto</span>}
            name="nombre"
            rules={[{ required: true, message: "Ingresa el nombre del producto" }]}
          >
            <Input 
              placeholder="Ej: Mouse Gamer Logitech G502"
              size="large"
            />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item
              label={<span style={{ color: "#FFF", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>Precio (CLP)</span>}
              name="precio"
              rules={[
                { required: true, message: "Ingresa el precio" },
                { type: "number", min: 0, message: "El precio debe ser positivo" }
              ]}
            >
              <InputNumber 
                placeholder="29990" 
                style={{ width: "100%" }}
                size="large"
                min={0}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(value) => value?.replace(/\$\s?|(\.*)/g, '') as any}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#FFF", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>Stock Disponible</span>}
              name="stock"
              rules={[
                { required: true, message: "Ingresa el stock" },
                { type: "number", min: 0, message: "El stock debe ser positivo" }
              ]}
            >
              <InputNumber 
                placeholder="50" 
                style={{ width: "100%" }}
                size="large"
                min={0}
              />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: producto ? "1fr 1fr 1fr" : "1fr", gap: 16 }}>
            <Form.Item
              label={<span style={{ color: "#FFF", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>Categoría</span>}
              name="categoriaId"
              rules={[{ required: true, message: "Selecciona una categoría" }]}
            >
              <Select 
                placeholder="Selecciona una categoría"
                size="large"
              >
                {categorias.map(cat => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {producto && (
              <>
                <Form.Item
                  label={
                    <span style={{ color: "#FFF", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>
                      Rating Promedio ⭐
                    </span>
                  }
                  name="rating"
                  tooltip="Este campo se calcula automáticamente con las reseñas"
                >
                  <InputNumber 
                    placeholder="4.5" 
                    style={{ width: "100%" }}
                    size="large"
                    min={0}
                    max={5}
                    step={0.1}
                    disabled
                    readOnly
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span style={{ color: "#FFF", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>
                      Nº Reseñas 💬
                    </span>
                  }
                  name="numResenas"
                  tooltip="Este campo se actualiza automáticamente"
                >
                  <InputNumber 
                    placeholder="120" 
                    style={{ width: "100%" }}
                    size="large"
                    min={0}
                    disabled
                    readOnly
                  />
                </Form.Item>
              </>
            )}
          </div>

          <Form.Item
            label={<span style={{ color: "#FFF", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>URL de la Imagen</span>}
            name="imagen"
            rules={[
              { required: true, message: "Ingresa la URL de la imagen" },
              { type: "url", message: "Debe ser una URL válida" }
            ]}
          >
            <Input 
              placeholder="https://ejemplo.com/imagen.jpg"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#FFF", fontWeight: 500, fontFamily: "Roboto, sans-serif" }}>Descripción</span>}
            name="descripcion"
            rules={[
              { required: true, message: "Ingresa una descripción" },
              { min: 10, message: "La descripción debe tener al menos 10 caracteres" }
            ]}
          >
            <Input.TextArea 
              placeholder="Describe las características principales del producto..."
              rows={4}
              showCount
              maxLength={500}
              size="large"
            />
          </Form.Item>

          {!producto && (
            <div style={{
              background: "rgba(30, 144, 255, 0.1)",
              border: "1px solid #1E90FF",
              borderRadius: 8,
              padding: 12,
              marginTop: 8
            }}>
              <p style={{ 
                color: "#1E90FF", 
                margin: 0, 
                fontSize: 13,
                fontFamily: "Roboto, sans-serif"
              }}>
                ℹ️ Los campos de <strong>Rating</strong> y <strong>Número de Reseñas</strong> se inicializarán en 0 y se actualizarán automáticamente cuando los usuarios dejen opiniones.
              </p>
            </div>
          )}
        </Form>
      </Modal>
    </ConfigProvider>
  );
}