import { Card, Button, Tag, Rate } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import type { Product } from "~/data/mockProducts";
import { formatPrice } from "~/utils/cartUtils";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card
      hoverable
      cover={
        <div style={{ 
          height: 240, 
          overflow: "hidden",
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <img
            alt={product.name}
            src={product.image}
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover" 
            }}
          />
        </div>
      }
      style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: 8,
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ marginBottom: 8 }}>
        <Tag 
          color="#1E90FF" 
          style={{ 
            border: "none",
            fontSize: 10,
            fontFamily: "Roboto, sans-serif"
          }}
        >
          {product.category}
        </Tag>
        {product.stock < 10 && (
          <Tag 
            color="#ff4d4f"
            style={{ border: "none", fontSize: 10 }}
          >
            ¡Últimas unidades!
          </Tag>
        )}
      </div>

      <h3 style={{ 
        color: "#FFFFFF", 
        fontSize: 16,
        fontFamily: "Orbitron, sans-serif",
        marginBottom: 8,
        minHeight: 48
      }}>
        {product.name}
      </h3>

      <p style={{ 
        color: "#D3D3D3", 
        fontSize: 12,
        fontFamily: "Roboto, sans-serif",
        marginBottom: 12,
        minHeight: 36,
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical"
      }}>
        {product.description}
      </p>

      <div style={{ marginBottom: 12 }}>
        <Rate 
          disabled 
          defaultValue={product.rating} 
          style={{ fontSize: 12 }} 
        />
        <span style={{ 
          color: "#D3D3D3", 
          fontSize: 12, 
          marginLeft: 8,
          fontFamily: "Roboto, sans-serif"
        }}>
          ({product.reviews})
        </span>
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginTop: 16
      }}>
        <span style={{ 
          color: "#39FF14", 
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "Orbitron, sans-serif"
        }}>
          {formatPrice(product.price)}
        </span>
        
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          style={{
            background: "#1E90FF",
            border: "none",
            fontFamily: "Roboto, sans-serif",
            fontWeight: "bold"
          }}
        >
          Agregar
        </Button>
      </div>

      {product.stock === 0 && (
        <div style={{ 
          marginTop: 8, 
          color: "#ff4d4f", 
          fontSize: 12,
          fontFamily: "Roboto, sans-serif",
          textAlign: "center"
        }}>
          Sin stock
        </div>
      )}
    </Card>
  );
}