import { Drawer, Button, InputNumber, Space, Empty, Divider, message, Modal } from "antd";
import { DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  getCartSummary,
  formatPrice,
  clearCart
} from "~/utils/cartUtils";
import type { CartItem } from "~/utils/cartUtils";
import { createVenta } from "~/components/api/ventas";
import { getToken } from "~/utils/auth";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setCartItems(getCart());
    }

    const handleCartUpdate = () => {
      setCartItems(getCart());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [open]);

  const handleQuantityChange = (productId: string, quantity: number | null) => {
    if (quantity) {
      updateCartItemQuantity(productId, quantity);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const { subtotal, iva, total } = getCartSummary();

  const handleCheckout = async () => {
    const token = getToken();
    
    if (!token) {
      message.error("Debes iniciar sesión para realizar una compra");
      navigate("/");
      return;
    }

    if (cartItems.length === 0) {
      message.warning("Tu carrito está vacío");
      return;
    }

    setLoading(true);

    try {
      const ventaData = {
        items: cartItems.map(item => ({
          productoId: parseInt(item.productId),
          cantidad: item.quantity
        })),
        total: total
      };

      const result = await createVenta(ventaData, token);

      message.success({
        content: (
          <span style={{ fontFamily: "Roboto, sans-serif" }}>
            ✓ Compra realizada - Venta #{result.id}
          </span>
        ),
        duration: 3
      });

      setTimeout(() => {
        clearCart();
        onClose();
        navigate("/usuario/mis-compras");
      }, 1500);

    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Error al procesar la compra");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={
        <span style={{ 
          color: "#FFFFFF",
          fontFamily: "Orbitron, sans-serif",
          fontSize: 20
        }}>
          🛒 Mi Carrito
        </span>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={480}
      styles={{
        body: { background: "#000000", padding: 16 },
        header: { 
          background: "#1a1a1a", 
          borderBottom: "2px solid #1E90FF" 
        }
      }}
      footer={
        cartItems.length > 0 ? (
          <div style={{ 
            background: "#1a1a1a", 
            padding: 16,
            borderTop: "2px solid #1E90FF"
          }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: 8
              }}>
                <span style={{ 
                  color: "#D3D3D3",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: 14
                }}>
                  Subtotal:
                </span>
                <span style={{ 
                  color: "#FFFFFF",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: 14
                }}>
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: 12
              }}>
                <span style={{ 
                  color: "#D3D3D3",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: 14
                }}>
                  IVA (19%):
                </span>
                <span style={{ 
                  color: "#FFFFFF",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: 14
                }}>
                  {formatPrice(iva)}
                </span>
              </div>

              <Divider style={{ margin: "12px 0", borderColor: "#39FF14" }} />

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: 16
              }}>
                <span style={{ 
                  color: "#FFFFFF",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: 18,
                  fontWeight: "bold"
                }}>
                  Total:
                </span>
                <span style={{ 
                  color: "#39FF14",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: 24,
                  fontWeight: "bold",
                  textShadow: "0 0 10px #39FF14"
                }}>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={<CheckCircleOutlined />}
              loading={loading}
              onClick={handleCheckout}
              style={{
                background: "linear-gradient(135deg, #39FF14 0%, #2ecc71 100%)",
                color: "#000",
                border: "none",
                fontFamily: "Orbitron, sans-serif",
                fontWeight: "bold",
                height: 48,
                fontSize: 16,
                boxShadow: "0 0 20px rgba(57, 255, 20, 0.4)"
              }}
            >
              {loading ? "Procesando..." : "Confirmar Compra"}
            </Button>
          </div>
        ) : null
      }
    >
      {cartItems.length === 0 ? (
        <Empty
          description={
            <span style={{ 
              color: "#D3D3D3",
              fontFamily: "Roboto, sans-serif",
              fontSize: 16
            }}>
              Tu carrito está vacío
            </span>
          }
          style={{ marginTop: 60 }}
        />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: 8,
                padding: 12,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#1E90FF";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(30, 144, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#333";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 4,
                    background: "#000",
                    border: "1px solid #333"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    color: "#FFFFFF",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: 14,
                    marginBottom: 4
                  }}>
                    {item.name}
                  </h4>
                  <p style={{ 
                    color: "#1E90FF",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: 11,
                    marginBottom: 8
                  }}>
                    {item.category}
                  </p>
                  <div style={{ 
                    color: "#39FF14",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: 16,
                    fontWeight: "bold"
                  }}>
                    {formatPrice(item.price)}
                  </div>
                </div>
              </div>

              <Divider style={{ 
                margin: "12px 0",
                borderColor: "#333"
              }} />

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ 
                    color: "#D3D3D3",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: 12
                  }}>
                    Cantidad:
                  </span>
                  <InputNumber
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.productId, value)}
                    style={{ width: 70 }}
                  />
                </div>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(item.productId)}
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: 12
                  }}
                >
                  Eliminar
                </Button>
              </div>

              <div style={{ 
                marginTop: 8,
                textAlign: "right",
                color: "#FFFFFF",
                fontFamily: "Roboto, sans-serif",
                fontSize: 13,
                fontWeight: 500
              }}>
                Subtotal: <span style={{ color: "#39FF14" }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </Space>
      )}
    </Drawer>
  );
}