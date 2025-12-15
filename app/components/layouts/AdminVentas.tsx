import {
  Layout,
  Space,
  Avatar,
  Dropdown,
  Card,
  Table,
  message,
  Spin,
  Tag,
  Statistic,
  Row,
  Col,
  Button,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken, getUserFromToken, getToken } from "~/utils/auth";
import { formatPrice } from "~/utils/cartUtils";
import { getAllVentas } from "~/components/api/ventasDetalle";
import type { VentaResponse, DetalleVentaResponse } from "~/components/api/ventasDetalle";

const { Header, Content } = Layout;

interface ResumenDia {
  totalVentas: number;
  cantidadVentas: number;
  productoMasVendido: string;
  cantidadProductos: number;
}

export default function AdminVentas() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const [ventas, setVentas] = useState<VentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumen, setResumen] = useState<ResumenDia>({
    totalVentas: 0,
    cantidadVentas: 0,
    productoMasVendido: "-",
    cantidadProductos: 0,
  });

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    const token = getToken();
    if (!token) {
      message.error("No se encontró token de autenticación");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const data = await getAllVentas(token);
      setVentas(data);
      calcularResumen(data);
    } catch (error) {
      console.error("Error cargando ventas:", error);
      message.error("Error al cargar las ventas");
    } finally {
      setLoading(false);
    }
  };

  const calcularResumen = (ventasData: VentaResponse[]) => {
    const hoy = new Date().toDateString();
    const ventasHoy = ventasData.filter(
      (v) => new Date(v.fechaVenta).toDateString() === hoy
    );

    const totalVentas = ventasHoy.reduce((sum, v) => sum + v.total, 0);
    const cantidadVentas = ventasHoy.length;

    const productosVendidos: { [key: string]: number } = {};
    ventasHoy.forEach((venta) => {
      venta.detalles.forEach((detalle) => {
        const nombreProducto = detalle.producto.nombre;
        productosVendidos[nombreProducto] =
          (productosVendidos[nombreProducto] || 0) + detalle.cantidad;
      });
    });

    let productoMasVendido = "-";
    let maxCantidad = 0;
    Object.entries(productosVendidos).forEach(([producto, cantidad]) => {
      if (cantidad > maxCantidad) {
        maxCantidad = cantidad;
        productoMasVendido = producto;
      }
    });

    const cantidadProductos = Object.values(productosVendidos).reduce(
      (sum, c) => sum + c,
      0
    );

    setResumen({
      totalVentas,
      cantidadVentas,
      productoMasVendido,
      cantidadProductos,
    });
  };

  const handleLogout = () => {
    removeToken();
    navigate("/", { replace: true });
  };

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const expandedRowRender = (record: VentaResponse) => {
    const columns = [
      {
        title: <span style={{ color: "#FFF" }}>Producto</span>,
        dataIndex: ["producto", "nombre"],
        key: "productoNombre",
        render: (_: any, detalle: DetalleVentaResponse) => (
          <span style={{ color: "#FFF", fontFamily: "Roboto, sans-serif" }}>
            {detalle.producto.nombre}
          </span>
        ),
      },
      {
        title: <span style={{ color: "#FFF" }}>Categoría</span>,
        dataIndex: ["producto", "categoriaNombre"],
        key: "categoriaNombre",
        render: (_: any, detalle: DetalleVentaResponse) => (
          <Tag color="purple">{detalle.producto.categoriaNombre}</Tag>
        ),
      },
      {
        title: <span style={{ color: "#FFF" }}>Cantidad</span>,
        dataIndex: "cantidad",
        key: "cantidad",
        render: (cantidad: number) => <Tag color="blue">{cantidad}x</Tag>,
      },
      {
        title: <span style={{ color: "#FFF" }}>Precio Unitario</span>,
        dataIndex: "precioUnitario",
        key: "precioUnitario",
        render: (precio: number) => (
          <span
            style={{ color: "#1E90FF", fontFamily: "Roboto, sans-serif" }}
          >
            {formatPrice(precio)}
          </span>
        ),
      },
      {
        title: <span style={{ color: "#FFF" }}>Subtotal</span>,
        dataIndex: "subtotal",
        key: "subtotal",
        render: (subtotal: number) => (
          <span
            style={{
              color: "#39FF14",
              fontFamily: "Orbitron, sans-serif",
              fontWeight: "bold",
            }}
          >
            {formatPrice(subtotal)}
          </span>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.detalles}
        pagination={false}
        rowKey="id"
        size="small"
        style={{ background: "#0a0a0a", marginLeft: 40, marginRight: 40 }}
      />
    );
  };

  const columns = [
    {
      title: <span style={{ color: "#FFF" }}>ID Venta</span>,
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: number) => (
        <span style={{ color: "#1E90FF", fontWeight: "bold" }}>#{id}</span>
      ),
    },
    {
      title: <span style={{ color: "#FFF" }}>Fecha</span>,
      dataIndex: "fechaVenta",
      key: "fechaVenta",
      render: (fecha: string) => (
        <span style={{ color: "#D3D3D3", fontFamily: "Roboto, sans-serif" }}>
          {new Date(fecha).toLocaleString("es-CL")}
        </span>
      ),
    },
    {
      title: <span style={{ color: "#FFF" }}>Productos</span>,
      key: "productos",
      render: (_: any, record: VentaResponse) => (
        <span style={{ color: "#FFF", fontFamily: "Roboto, sans-serif" }}>
          {record.detalles.length} item{record.detalles.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      title: <span style={{ color: "#FFF" }}>Total</span>,
      dataIndex: "total",
      key: "total",
      render: (total: number) => (
        <span
          style={{
            color: "#39FF14",
            fontFamily: "Orbitron, sans-serif",
            fontWeight: "bold",
          }}
        >
          {formatPrice(total)}
        </span>
      ),
    },
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin")}
            style={{
              background: "transparent",
              border: "1px solid #39FF14",
              color: "#39FF14",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Volver
          </Button>
          <h1
            style={{
              color: "#39FF14",
              margin: 0,
              fontFamily: "Orbitron, sans-serif",
              fontSize: 24,
              textShadow: "0 0 10px #39FF14",
            }}
          >
            VENTAS - LEVEL-UP GAMER
          </h1>
        </div>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#ff4d4f",
                border: "2px solid #39FF14",
              }}
            />
            <span
              style={{
                color: "#FFFFFF",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              {user?.sub}
            </span>
          </Space>
        </Dropdown>
      </Header>

      <Content style={{ padding: "24px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
                border: "1px solid #39FF14",
                borderRadius: 8,
                boxShadow: "0 0 20px rgba(57, 255, 20, 0.2)",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{ color: "#D3D3D3", fontFamily: "Roboto, sans-serif" }}
                  >
                    Ventas de Hoy
                  </span>
                }
                value={resumen.cantidadVentas}
                prefix={<ShoppingCartOutlined style={{ color: "#39FF14" }} />}
                valueStyle={{
                  color: "#39FF14",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: 32,
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
                border: "1px solid #1E90FF",
                borderRadius: 8,
                boxShadow: "0 0 20px rgba(30, 144, 255, 0.2)",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{ color: "#D3D3D3", fontFamily: "Roboto, sans-serif" }}
                  >
                    Ganancias de Hoy
                  </span>
                }
                value={resumen.totalVentas}
                prefix={<DollarOutlined style={{ color: "#1E90FF" }} />}
                valueStyle={{
                  color: "#1E90FF",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: 28,
                }}
                formatter={(value) => formatPrice(Number(value))}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
                border: "1px solid #FFD700",
                borderRadius: 8,
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{ color: "#D3D3D3", fontFamily: "Roboto, sans-serif" }}
                  >
                    Producto Más Vendido
                  </span>
                }
                value={resumen.productoMasVendido}
                prefix={<TrophyOutlined style={{ color: "#FFD700" }} />}
                valueStyle={{
                  color: "#FFD700",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
                border: "1px solid #FF6B6B",
                borderRadius: 8,
                boxShadow: "0 0 20px rgba(255, 107, 107, 0.2)",
              }}
            >
              <Statistic
                title={
                  <span
                    style={{ color: "#D3D3D3", fontFamily: "Roboto, sans-serif" }}
                  >
                    Productos Vendidos
                  </span>
                }
                value={resumen.cantidadProductos}
                valueStyle={{
                  color: "#FF6B6B",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: 32,
                }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          style={{
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: 8,
            padding: 24,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                color: "#FFFFFF",
                fontFamily: "Orbitron, sans-serif",
                fontSize: 28,
                marginBottom: 8,
              }}
            >
              Historial de Ventas
            </h2>
            <p
              style={{
                color: "#D3D3D3",
                fontFamily: "Roboto, sans-serif",
                fontSize: 14,
              }}
            >
              Lista completa de todas las transacciones
            </p>
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <div
              style={{
                background: "#000",
                border: "1px solid #333",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <Table
                dataSource={ventas}
                columns={columns}
                rowKey="id"
                expandable={{
                  expandedRowRender,
                  expandRowByClick: true,
                }}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} ventas`,
                  style: { color: "#FFF" },
                }}
                style={{
                  background: "transparent",
                }}
              />
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
}