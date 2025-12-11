import { Badge, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getCartItemCount } from "~/utils/cartUtils";

interface CartBadgeProps {
  onClick: () => void;
}

export default function CartBadge({ onClick }: CartBadgeProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartItemCount());

    //cambios carrito
    const handleCartUpdate = () => {
      setCount(getCartItemCount());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <Badge 
      count={count} 
      offset={[-5, 5]}
      style={{ 
        backgroundColor: "#39FF14",
        color: "#000",
        fontWeight: "bold",
        fontFamily: "Roboto, sans-serif"
      }}
    >
      <Button
        type="primary"
        icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
        size="large"
        onClick={onClick}
        style={{
          background: "#1E90FF",
          border: "none",
          height: 48,
          width: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      />
    </Badge>
  );
}