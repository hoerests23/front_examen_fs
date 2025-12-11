import { Card, Slider, Rate, Button, Space } from "antd";
import { ClearOutlined } from "@ant-design/icons";

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

export default function FilterSidebar({
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  onClearFilters
}: FilterSidebarProps) {
  return (
    <Card
      title={
        <span style={{ 
          color: "#FFFFFF",
          fontFamily: "Orbitron, sans-serif",
          fontSize: 18
        }}>
          Filtros
        </span>
      }
      style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: 8,
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div>
          <h4 style={{ 
            color: "#FFFFFF",
            fontFamily: "Roboto, sans-serif",
            marginBottom: 16
          }}>
            Rango de Precio
          </h4>
          <Slider
            range
            min={0}
            max={2000000}
            step={10000}
            value={priceRange}
            onChange={(value) => onPriceChange(value as [number, number])}
            tooltip={{
              formatter: (value) => `$${value?.toLocaleString('es-CL')}`
            }}
            styles={{
              track: { background: "#1E90FF" },
              tracks: { background: "#1E90FF" },
              rail: { background: "#333" }
            }}
          />
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            marginTop: 8
          }}>
            <span style={{ 
              color: "#D3D3D3",
              fontFamily: "Roboto, sans-serif",
              fontSize: 12
            }}>
              ${priceRange[0].toLocaleString('es-CL')}
            </span>
            <span style={{ 
              color: "#D3D3D3",
              fontFamily: "Roboto, sans-serif",
              fontSize: 12
            }}>
              ${priceRange[1].toLocaleString('es-CL')}
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ 
            color: "#FFFFFF",
            fontFamily: "Roboto, sans-serif",
            marginBottom: 16
          }}>
            Calificación Mínima
          </h4>
          <Rate
            value={minRating}
            onChange={onRatingChange}
            style={{ fontSize: 20 }}
          />
          <div style={{ 
            color: "#D3D3D3",
            fontFamily: "Roboto, sans-serif",
            fontSize: 12,
            marginTop: 8
          }}>
            {minRating > 0 ? `${minRating} estrellas o más` : "Todas las calificaciones"}
          </div>
        </div>
        <Button
          block
          icon={<ClearOutlined />}
          onClick={onClearFilters}
          style={{
            background: "#333",
            border: "1px solid #555",
            color: "#FFFFFF",
            fontFamily: "Roboto, sans-serif",
            fontWeight: "bold",
            height: 40
          }}
        >
          Limpiar Filtros
        </Button>
      </Space>
    </Card>
  );
}