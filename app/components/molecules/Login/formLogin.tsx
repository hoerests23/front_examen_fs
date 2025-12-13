import { Card, Form, Input, Checkbox, Space, Typography } from "antd";
import { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link as RouterLink } from "react-router-dom"; //sin alias no funciona xd 
import PrimaryButton from "../../atoms/primaryButton";

const { Text, Link } = Typography;

interface LoginFormProps {
  onSubmit: (values: { correo: string; password: string }) => void;
  loading?: boolean;
}

export default function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card 
      style={{ 
        width: 400, 
        background: "#1a1a1a",
        border: "2px solid #1E90FF",
        borderRadius: 12,
        boxShadow: "0 0 20px rgba(30, 144, 255, 0.3)",
      }}
      styles={{
        body: { padding: 32 } 
      }}
    >
      {/* header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ 
          fontFamily: "Orbitron, sans-serif",
          fontSize: 28,
          color: "#39FF14",
          textShadow: "0 0 15px #39FF14",
          marginBottom: 8,
          letterSpacing: 2
        }}>
          LEVEL-UP GAMER
        </h1>
        <Text style={{ 
          color: "#D3D3D3",
          fontFamily: "Roboto, sans-serif",
          fontSize: 14
        }}>
          Inicia sesión para continuar
        </Text>
      </div>

      <Form 
        layout="vertical" 
        onFinish={onSubmit}
        requiredMark={false}
      >
        {/*correo */}
        <Form.Item 
          label={<span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>Correo Electrónico</span>}
          name="correo" 
          rules={[
            { required: true, message: "Por favor ingresa tu correo" },
            //{ type: "email", message: "Ingresa un correo válido" },
            { 
              pattern: /^[^\s@]+@[^\s@]+$/, 
              message: "Ingresa un correo válido" 
            }
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#1E90FF" }} />}
            placeholder="ejemplo@correo.com"
            size="large"
            style={{
              background: "#000000",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif"
            }}
          />
        </Form.Item>

        {/* contra */}
        <Form.Item 
          label={<span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>Contraseña</span>}
          name="contrasenia" 
          rules={[
            { required: true, message: "Por favor ingresa tu contraseña" },
            { min: 6, message: "La contraseña debe tener al menos 6 caracteres" }
          ]}
        >
          <Input
            prefix={<LockOutlined style={{ color: "#1E90FF" }} />}
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            size="large"
            style={{
              background: "#000000",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif"
            }}
            suffix={
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer", color: "#1E90FF" }}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            }
          />
        </Form.Item>

        {/* RECORDAR Y OLVIDÉ CONTRASEÑA */}
        <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 24 }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ 
              color: "#D3D3D3",
              fontFamily: "Roboto, sans-serif"
            }}>
              Recordarme
            </Checkbox>
          </Form.Item>
          
          <Link 
            href="#" 
            style={{ 
              color: "#1E90FF",
              fontFamily: "Roboto, sans-serif",
              fontSize: 14
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Space>

        {/* BOTÓN INGRESAR */}
        <Form.Item style={{ marginBottom: 16 }}>
          <PrimaryButton 
            text={loading ? "Ingresando..." : "Ingresar"}
            disabled={loading}
            loading={loading}
          />
        </Form.Item>

        {/* REGISTRO */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text style={{ 
            color: "#D3D3D3",
            fontFamily: "Roboto, sans-serif",
            fontSize: 14
          }}>
            ¿No tienes cuenta?{" "}
            <RouterLink 
              to="/registro"
              style={{ 
                color: "#39FF14",
                fontWeight: 500,
                fontFamily: "Roboto, sans-serif",
                textDecoration: "none"
              }}
            >
              Regístrate aquí
            </RouterLink>
          </Text>
        </div>

        {/* DESCUENTO DUOC */}
        <div style={{
          marginTop: 24,
          padding: 16,
          background: "linear-gradient(135deg, rgba(30, 144, 255, 0.1) 0%, rgba(57, 255, 20, 0.1) 100%)",
          border: "1px solid #1E90FF",
          borderRadius: 8,
          textAlign: "center"
        }}>
          <Text style={{ 
            color: "#39FF14",
            fontFamily: "Orbitron, sans-serif",
            fontSize: 12,
            fontWeight: 500
          }}>
            🎓 ¡ESTUDIANTES DUOC UC!
          </Text>
          <br />
          <Text style={{ 
            color: "#D3D3D3",
            fontFamily: "Roboto, sans-serif",
            fontSize: 11
          }}>
            20% de descuento de por vida registrándote con correo @duoc.cl
          </Text>
        </div>
      </Form>
    </Card>
  );
}