import { Modal, Button, Divider } from "antd";
import { PrinterOutlined, CloseOutlined } from "@ant-design/icons";
import type { VentaResponse } from "~/components/api/ventas";
import { formatPrice } from "~/utils/cartUtils";

interface BoletaModalProps {
  open: boolean;
  onClose: () => void;
  venta: VentaResponse | null;
}

export default function BoletaModal({ open, onClose, venta }: BoletaModalProps) {
  if (!venta) return null;

  const subtotal = Math.round(venta.total / 1.19);
  const iva = venta.total - subtotal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      closeIcon={<CloseOutlined style={{ color: "#FFFFFF" }} />}
      styles={{
        body: { background: "#000000", padding: 0 },
        header: { background: "#1a1a1a", borderBottom: "2px solid #1E90FF" },
      }}
    >
      <div 
        id="boleta-content"
        style={{ 
          padding: 32,
          background: "#FFFFFF",
          color: "#000",
          fontFamily: "Roboto, monospace"
        }}
      >
        {/* ENCABEZADO TIENDA */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ 
            margin: 0,
            fontSize: 28,
            fontFamily: "Orbitron, sans-serif",
            color: "#000",
            marginBottom: 8
          }}>
            LEVEL-UP GAMER
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
            Tienda Online de Productos Gamer
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
            Santiago, Chile
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
            Teléfono: +56 9 2305 4611
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
            www.levelupgamer.cl
          </p>
        </div>

        <Divider style={{ margin: "16px 0", borderColor: "#000" }} />

        {/* DATOS DE LA BOLETA */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ 
            background: "#f0f0f0",
            padding: 12,
            borderRadius: 4,
            marginBottom: 12
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              marginBottom: 4
            }}>
              <strong>BOLETA ELECTRÓNICA</strong>
              <span>N° {String(venta.id).padStart(8, "0")}</span>
            </div>
            <div style={{ fontSize: 11, color: "#666" }}>
              Fecha: {new Date(venta.fechaVenta).toLocaleDateString('es-CL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div style={{ marginBottom: 20 }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            fontSize: 12
          }}>
            <thead>
              <tr style={{ 
                borderBottom: "2px solid #000",
                textAlign: "left"
              }}>
                <th style={{ padding: "8px 4px" }}>CANT</th>
                <th style={{ padding: "8px 4px" }}>DESCRIPCIÓN</th>
                <th style={{ padding: "8px 4px", textAlign: "right" }}>P. UNIT</th>
                <th style={{ padding: "8px 4px", textAlign: "right" }}>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {venta.detalles.map((detalle, index) => (
                <tr 
                  key={detalle.id}
                  style={{ 
                    borderBottom: index === venta.detalles.length - 1 ? "2px solid #000" : "1px solid #ddd"
                  }}
                >
                  <td style={{ padding: "8px 4px" }}>{detalle.cantidad}</td>
                  <td style={{ padding: "8px 4px" }}>
                    <div style={{ fontWeight: "bold" }}>
                      {detalle.producto.nombre}
                    </div>
                    <div style={{ fontSize: 10, color: "#666" }}>
                      {detalle.producto.categoriaNombre}
                    </div>
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "right" }}>
                    {formatPrice(detalle.precioUnitario)}
                  </td>
                  <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "bold" }}>
                    {formatPrice(detalle.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALES */}
        <div style={{ marginTop: 20 }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            padding: "4px 0",
            fontSize: 13
          }}>
            <span>SUBTOTAL:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            padding: "4px 0",
            fontSize: 13
          }}>
            <span>IVA (19%):</span>
            <span>{formatPrice(iva)}</span>
          </div>
          <Divider style={{ margin: "8px 0", borderColor: "#000" }} />
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            padding: "8px 0",
            fontSize: 18,
            fontWeight: "bold"
          }}>
            <span>TOTAL:</span>
            <span>{formatPrice(venta.total)}</span>
          </div>
        </div>

        <Divider style={{ margin: "16px 0", borderColor: "#000" }} />

        {/* PIE DE BOLETA */}
        <div style={{ 
          textAlign: "center",
          fontSize: 10,
          color: "#666",
          marginTop: 20
        }}>
          <p style={{ margin: "4px 0" }}>
            *** BOLETA ELECTRÓNICA ***
          </p>
          <p style={{ margin: "4px 0" }}>
            Gracias por tu compra
          </p>
          <p style={{ margin: "4px 0" }}>
            ¡Sigue jugando con Level-Up Gamer!
          </p>
          <p style={{ margin: "12px 0 4px 0", fontSize: 9 }}>
            Documento Tributario Electrónico
          </p>
          <p style={{ margin: "4px 0", fontSize: 9 }}>
            Timbre Electrónico SII
          </p>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div style={{ 
        padding: 16,
        background: "#1a1a1a",
        borderTop: "1px solid #333",
        display: "flex",
        gap: 12,
        justifyContent: "flex-end"
      }}>
        <Button
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          style={{
            background: "#1E90FF",
            color: "#FFF",
            border: "none",
            fontFamily: "Roboto, sans-serif"
          }}
        >
          Imprimir
        </Button>
        <Button
          onClick={onClose}
          style={{
            background: "#333",
            color: "#FFF",
            border: "1px solid #555",
            fontFamily: "Roboto, sans-serif"
          }}
        >
          Cerrar
        </Button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #boleta-content, #boleta-content * {
            visibility: visible;
          }
          #boleta-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </Modal>
  );
}