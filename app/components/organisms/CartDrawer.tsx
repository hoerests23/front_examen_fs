import { Drawer, Button, InputNumber, Space, Empty, Divider } from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { 
  getCart, 
  updateCartItemQuantity, 
  removeFromCart, 
  getCartTotal,
  formatPrice
} from "~/utils/cartUtils";
import type { CartItem } from "~/utils/cartUtils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  const total = getCartTotal();

  return (
    <Drawer
      title={
        <span style={{ 
          color: "#FFFFFF",
          fontFamily: "Orbitron, sans-serif",
          fontSize: 20
        }}>
          Mi Carrito
        </span>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      styles={{
        body: { background: "#000000", padding: 16 },
        header: { background: "#1a1a1a", borderBottom: "1px solid #333" }
      }}
      footer={
        cartItems.length > 0 ? (
          <div style={{ 
            background: "#1a1a1a", 
            padding: 16,
            borderTop: "1px solid #333"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              marginBottom: 16
            }}>
              <span style={{ 
                color: "#FFFFFF",
                fontFamily: "Roboto, sans-serif",
                fontSize: 16,
                fontWeight: "bold"
              }}>
                Total:
              </span>
              <span style={{ 
                color: "#39FF14",
                fontFamily: "Orbitron, sans-serif",
                fontSize: 20,
                fontWeight: "bold"
              }}>
                {formatPrice(total)}
              </span>
            </div>
            <Button
              type="primary"
              block
              size="large"
              icon={<ShoppingOutlined />}
              style={{
                background: "#1E90FF",
                border: "none",
                fontFamily: "Roboto, sans-serif",
                fontWeight: "bold",
                height: 48
              }}
            >
              Proceder al Pago
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
              fontFamily: "Roboto, sans-serif"
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
                padding: 12
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
                    background: "#000"
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
                    color: "#D3D3D3",
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
                <InputNumber
                  min={1}
                  max={99}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(item.productId, value)}
                  style={{ width: 80 }}
                  styles={{
                    input: { 
                      color: "#FFFFFF",
                      fontFamily: "Roboto, sans-serif"
                    }
                  }}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(item.productId)}
                  style={{
                    fontFamily: "Roboto, sans-serif"
                  }}
                >
                  Eliminar
                </Button>
              </div>

              <div style={{ 
                marginTop: 8,
                textAlign: "right",
                color: "#D3D3D3",
                fontFamily: "Roboto, sans-serif",
                fontSize: 12
              }}>
                Subtotal: {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </Space>
      )}
    </Drawer>
  );
}