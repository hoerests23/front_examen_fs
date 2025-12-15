import { Layout, Space, Avatar, Dropdown, Card, Spin, Empty, Tag, Collapse, Button } from "antd";
import { UserOutlined, LogoutOutlined, ArrowLeftOutlined, CalendarOutlined, ShoppingOutlined, FileTextOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken, getUserFromToken, getToken } from "~/utils/auth";
import { getMisVentas } from "~/components/api/ventas";
import type { VentaResponse } from "~/components/api/ventas";
import { formatPrice } from "~/utils/cartUtils";
import BoletaModal from "~/components/organisms/BoletaModal";

const { Header, Content } = Layout;

export default function MisComprasLayout() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const [ventas, setVentas] = useState<VentaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [boletaOpen, setBoletaOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState<VentaResponse | null>(null);

  useEffect(() => {
    const fetchVentas = async () => {
      const token = getToken();
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const data = await getMisVentas(token);
        setVentas(data);
      } catch (error) {
        console.error("Error al cargar ventas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, [navigate]);

  const handleLogout = () => {
    removeToken();
    navigate("/", { replace: true });
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Mis compras",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      danger: true,
      onClick: handleLogout,
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
        <h1 style={{ 
          color: "#39FF14", 
          margin: 0,
          fontFamily: "Orbitron, sans-serif",
          fontSize: 24,
          textShadow: "0 0 10px #39FF14"
        }}>
          LEVEL-UP GAMER
        </h1>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: "#1E90FF",
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
            minHeight: "calc(100vh - 120px)"
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/usuario")}
            style={{
              marginBottom: 24,
              background: "#000",
              border: "1px solid #1E90FF",
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif"
            }}
          >
            Volver a la tienda
          </Button>

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ 
              color: "#FFFFFF",
              fontFamily: "Orbitron, sans-serif",
              fontSize: 32,
              marginBottom: 8
            }}>
              🛒 Mis Compras
            </h2>
            <p style={{ 
              color: "#D3D3D3",
              fontFamily: "Roboto, sans-serif",
              fontSize: 16,
              marginBottom: 0
            }}>
              Historial completo de tus compras realizadas
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Spin size="large" />
              <p style={{ 
                color: "#D3D3D3", 
                marginTop: 16,
                fontFamily: "Roboto, sans-serif"
              }}>
                Cargando tus compras...
              </p>
            </div>
          ) : ventas.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Empty
                description={
                  <span style={{ 
                    color: "#D3D3D3",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: 16
                  }}>
                    Aún no has realizado ninguna compra
                  </span>
                }
              />
              <Button
                type="primary"
                icon={<ShoppingOutlined />}
                onClick={() => navigate("/usuario")}
                style={{
                  marginTop: 24,
                  background: "#1E90FF",
                  fontFamily: "Roboto, sans-serif"
                }}
              >
                Ir a comprar
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {ventas.map((venta) => (
                <div
                  key={venta.id}
                  style={{
                    background: "#000",
                    border: "1px solid #333",
                    borderRadius: 8,
                    padding: 20
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16
                  }}>
                    <div>
                      <Tag 
                        color="#1E90FF"
                        style={{ 
                          fontSize: 14,
                          padding: "4px 12px",
                          fontFamily: "Orbitron, sans-serif",
                          border: "none"
                        }}
                      >
                        Orden #{venta.id}
                      </Tag>
                      <Button
                        type="primary"
                        size="small"
                        icon={<FileTextOutlined />}
                        onClick={() => {
                          setSelectedVenta(venta);
                          setBoletaOpen(true);
                        }}
                        style={{
                          background: "#39FF14",
                          color: "#000",
                          border: "none",
                          fontFamily: "Roboto, sans-serif",
                          fontWeight: "bold",
                          marginLeft: 8
                        }}
                      >
                        Ver Boleta
                      </Button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        color: "#D3D3D3",
                        fontSize: 12,
                        fontFamily: "Roboto, sans-serif",
                        marginBottom: 4
                      }}>
                        <CalendarOutlined /> {new Date(venta.fechaVenta).toLocaleString('es-CL')}
                      </div>
                      <div style={{
                        color: "#39FF14",
                        fontSize: 20,
                        fontFamily: "Orbitron, sans-serif",
                        fontWeight: "bold",
                        textShadow: "0 0 10px #39FF14"
                      }}>
                        {formatPrice(venta.total)}
                      </div>
                    </div>
                  </div>

                  <Collapse
                    ghost
                    items={[
                      {
                        key: venta.id,
                        label: (
                          <span style={{ 
                            color: "#1E90FF",
                            fontFamily: "Roboto, sans-serif",
                            fontSize: 14
                          }}>
                            Ver {venta.detalles.length} producto(s)
                          </span>
                        ),
                        children: (
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {venta.detalles.map((detalle) => (
                              <div
                                key={detalle.id}
                                style={{
                                  background: "#1a1a1a",
                                  border: "1px solid #333",
                                  borderRadius: 6,
                                  padding: 12,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center"
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    color: "#FFFFFF",
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: 14,
                                    marginBottom: 4
                                  }}>
                                    {detalle.producto.nombre}
                                  </div>
                                  <div style={{
                                    color: "#D3D3D3",
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: 12
                                  }}>
                                    {detalle.producto.categoriaNombre} • Cantidad: {detalle.cantidad}
                                  </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{
                                    color: "#39FF14",
                                    fontFamily: "Orbitron, sans-serif",
                                    fontSize: 16,
                                    fontWeight: "bold"
                                  }}>
                                    {formatPrice(detalle.subtotal)}
                                  </div>
                                  <div style={{
                                    color: "#D3D3D3",
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: 11
                                  }}>
                                    {formatPrice(detalle.precioUnitario)} c/u
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ),
                      },
                    ]}
                    style={{
                      background: "transparent",
                      border: "none"
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </Content>

      <BoletaModal 
        open={boletaOpen} 
        onClose={() => setBoletaOpen(false)} 
        venta={selectedVenta}
      />
    </Layout>
  );
}