import { Layout, Space, Avatar, Dropdown, Card, Table, Button, Input, message, Modal, Tag } from "antd";
import { UserOutlined, LogoutOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken, getUserFromToken, getToken } from "~/utils/auth";
import { getAllProductos, createProducto, updateProducto, deleteProducto } from "~/components/api/productosCrud";
import type { ProductoForm, ProductoResponse } from "~/components/api/productosCrud";
import ProductoModal from "~/components/molecules/ProductoFormModal";
import { formatPrice } from "~/utils/cartUtils";

const { Header, Content } = Layout;

export default function AdminProductosLayout() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoResponse | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const data = await getAllProductos(token);
      setProductos(data);
    } catch (error) {
      message.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/", { replace: true });
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Mi Perfil",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const handleCreate = () => {
    setSelectedProducto(null);
    setModalOpen(true);
  };

  const handleEdit = (producto: ProductoResponse) => {
    setSelectedProducto(producto);
    setModalOpen(true);
  };

  const handleDelete = (id: number, nombre: string) => {
    Modal.confirm({
      title: "¿Eliminar producto?",
      content: `¿Estás seguro de eliminar "${nombre}"?`,
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        const token = getToken();
        if (!token) return;

        try {
          await deleteProducto(id, token);
          message.success("Producto eliminado");
          loadProductos();
        } catch (error) {
          message.error("Error al eliminar producto");
        }
      }
    });
  };

  const handleSubmit = async (values: ProductoForm) => {
    const token = getToken();
    if (!token) return;

    try {
      setSubmitLoading(true);
      if (selectedProducto) {
        await updateProducto(selectedProducto.id, values, token);
        message.success("Producto actualizado");
      } else {
        await createProducto(values, token);
        message.success("Producto creado");
      }
      setModalOpen(false);
      loadProductos();
    } catch (error: any) {
      message.error(error.message || "Error al guardar producto");
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoriaNombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      render: (nombre: string, record: ProductoResponse) => (
        <div>
          <div style={{ fontWeight: "bold", color: "#FFF" }}>{nombre}</div>
          <div style={{ fontSize: 12, color: "#D3D3D3" }}>{record.categoriaNombre}</div>
        </div>
      )
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      render: (precio: number) => (
        <span style={{ color: "#39FF14", fontFamily: "Orbitron, sans-serif", fontWeight: "bold" }}>
          {formatPrice(precio)}
        </span>
      )
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>
          {stock} unidades
        </Tag>
      )
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number, record: ProductoResponse) => (
        <div style={{ color: "#FFF" }}>
          ⭐ {rating?.toFixed(1) || "0.0"} ({record.numResenas || 0})
        </div>
      )
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 150,
      render: (_: any, record: ProductoResponse) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{
              background: "#1E90FF",
              border: "none"
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.nombre)}
          />
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#000000" }}>
      <Header
        style={{
          background: "#1a1a1a",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #1E90FF",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h1 style={{ 
          color: "#39FF14", 
          margin: 0,
          fontFamily: "Orbitron, sans-serif",
          fontSize: 24,
          textShadow: "0 0 10px #39FF14"
        }}>
          ADMIN - LEVEL-UP GAMER
        </h1>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: "#ff4d4f",
                border: "2px solid #39FF14"
              }} 
            />
            <span style={{ 
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif"
            }}>
              {user?.sub}
            </span>
          </Space>
        </Dropdown>
      </Header>

      <Content style={{ padding: "24px" }}>
        <Card
          style={{
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: 8,
            padding: 24
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2 style={{
              color: "#FFFFFF",
              fontFamily: "Orbitron, sans-serif",
              fontSize: 28,
              marginBottom: 8
            }}>
              Gestión de Productos
            </h2>
            <p style={{
              color: "#D3D3D3",
              fontFamily: "Roboto, sans-serif",
              fontSize: 14
            }}>
              Administra el catálogo completo de productos
            </p>
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            marginBottom: 24,
            gap: 16
          }}>
            <Input
              placeholder="Buscar productos..."
              prefix={<SearchOutlined style={{ color: "#1E90FF" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                maxWidth: 400,
                background: "#000",
                border: "1px solid #333",
                color: "#FFF"
              }}
              styles={{
                input: { color: "#FFF" }
              }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{
                background: "#39FF14",
                color: "#000",
                border: "none",
                fontFamily: "Orbitron, sans-serif",
                fontWeight: "bold",
                height: 40
              }}
            >
              Nuevo Producto
            </Button>
          </div>

          <div style={{ 
            background: "#000",
            border: "1px solid #333",
            borderRadius: 8,
            padding: 16
          }}>
            <Table
              dataSource={filteredProductos}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total: ${total} productos`,
                style: { color: "#FFF" }
              }}
              style={{
                background: "transparent"
              }}
            />
          </div>
        </Card>
      </Content>

      <ProductoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        producto={selectedProducto}
        loading={submitLoading}
      />
    </Layout>
  );
}