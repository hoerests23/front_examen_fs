import { Card, Form, Input, DatePicker, Checkbox, Space, Typography } from "antd";
import { useState } from "react";
import { 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  MailOutlined, 
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  GiftOutlined
} from "@ant-design/icons";
import PrimaryButton from "../../atoms/primaryButton";
import { Link as RouterLink } from "react-router-dom";

const { Text, Link } = Typography;

interface RegisterFormProps {
  onSubmit: (values: any) => void;
  loading?: boolean;
}

export default function RegisterForm({ onSubmit, loading = false }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDuocEmail, setIsDuocEmail] = useState(false);
  const [form] = Form.useForm();

  // Validar si es mayor de 18
  const validateAge = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error("Por favor selecciona tu fecha de nacimiento"));
    }
    
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return Promise.reject(new Error("Debes ser mayor de 18 años para registrarte"));
    }
    
    return Promise.resolve();
  };

  // Detectar correo @duoc.cl
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.toLowerCase();
    setIsDuocEmail(email.includes("@duoc.cl") || email.includes("@duocuc.cl"));
  };

  const handleSubmit = (values: any) => {
    // Calcular edad
    const birthDate = new Date(values.fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const formattedValues = {
        nombreCompleto: values.nombreCompleto,
        correo: values.correo,
        telefono: values.telefono,
        fechaNacimiento: values.fechaNacimiento,
        contrasenia: values.contrasenia,
        codigoReferido: values.codigoReferido,
        edad: age,
        isDuocStudent: isDuocEmail,
        descuentoPermanente: isDuocEmail ? 20 : 0,
    };
    
    onSubmit(formattedValues);
  };

  return (
    <Card 
      style={{ 
        width: 500, 
        background: "#1a1a1a",
        border: "2px solid #1E90FF",
        borderRadius: 12,
        boxShadow: "0 0 20px rgba(30, 144, 255, 0.3)",
        maxHeight: "90vh",
        overflowY: "auto"
      }}
      styles={{
        body: { padding: 32 }
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ 
          fontFamily: "Orbitron, sans-serif",
          fontSize: 28,
          color: "#39FF14",
          textShadow: "0 0 15px #39FF14",
          marginBottom: 8,
          letterSpacing: 2
        }}>
          ÚNETE A LEVEL-UP
        </h1>
        <Text style={{ 
          color: "#D3D3D3",
          fontFamily: "Roboto, sans-serif",
          fontSize: 14
        }}>
          Crea tu cuenta y comienza a ganar
        </Text>
      </div>

      <Form 
        form={form}
        layout="vertical" 
        onFinish={handleSubmit}
        requiredMark={false}
        scrollToFirstError
      >
        {/* NOMBRE COMPLETO */}
        <Form.Item 
          label={<span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>Nombre Completo</span>}
          name="nombreCompleto" 
          rules={[
            { required: true, message: "Por favor ingresa tu nombre completo" },
            { min: 3, message: "El nombre debe tener al menos 3 caracteres" }
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#1E90FF" }} />}
            placeholder="Juan Pérez García"
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

        {/* CORREO */}
        <Form.Item 
          label={<span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>Correo Electrónico</span>}
          name="correo" 
          rules={[
            { required: true, message: "Por favor ingresa tu correo" },
            { type: "email", message: "Ingresa un correo válido" }
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#1E90FF" }} />}
            placeholder="ejemplo@correo.com"
            size="large"
            onChange={handleEmailChange}
            style={{
              background: "#000000",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif"
            }}
          />
        </Form.Item>

        {/* ALERTA DESCUENTO DUOC */}
        {isDuocEmail && (
          <div style={{
            marginBottom: 16,
            padding: 12,
            background: "linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(30, 144, 255, 0.15) 100%)",
            border: "2px solid #39FF14",
            borderRadius: 8,
            textAlign: "center",
            animation: "pulse 2s infinite"
          }}>
            <Text style={{ 
              color: "#39FF14",
              fontFamily: "Orbitron, sans-serif",
              fontSize: 14,
              fontWeight: 600
            }}>
              🎉 ¡DESCUENTO ACTIVADO! 🎉
            </Text>
            <br />
            <Text style={{ 
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif",
              fontSize: 12
            }}>
              20% de descuento permanente detectado
            </Text>
          </div>
        )}

        {/* TELÉFONO */}
        <Form.Item 
          label={<span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>Teléfono</span>}
          name="telefono" 
          rules={[
            { required: true, message: "Por favor ingresa tu teléfono" },
            { pattern: /^[0-9]{9}$/, message: "Ingresa un teléfono válido (9 dígitos)" }
          ]}
        >
          <Input
            prefix={<PhoneOutlined style={{ color: "#1E90FF" }} />}
            placeholder="912345678"
            size="large"
            maxLength={9}
            style={{
              background: "#000000",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif"
            }}
          />
        </Form.Item>

        {/* FECHA DE NACIMIENTO */}
        <Form.Item 
          label={<span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>Fecha de Nacimiento</span>}
          name="fechaNacimiento" 
          rules={[
            { required: true, message: "Por favor selecciona tu fecha de nacimiento" },
            { validator: validateAge }
          ]}
        >
          <DatePicker
            placeholder="Selecciona tu fecha"
            size="large"
            format="DD/MM/YYYY"
            style={{
              width: "100%",
              background: "#000000",
              border: "1px solid #333",
              borderRadius: 8,
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif"
            }}
          />
        </Form.Item>

        {/* CÓDIGO DE REFERIDO (OPCIONAL) */}
        <Form.Item 
          label={
            <Space>
              <span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>
                Código de Referido
              </span>
              <span style={{ color: "#39FF14", fontSize: 11 }}>(Opcional)</span>
            </Space>
          }
          name="codigoReferido"
        >
          <Input
            prefix={<GiftOutlined style={{ color: "#39FF14" }} />}
            placeholder="Ingresa el código de tu amigo"
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

        {/* CONTRASEÑA */}
        <Form.Item 
          label={<span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>Contraseña</span>}
          name="contrasenia" 
          rules={[
            { required: true, message: "Por favor ingresa tu contraseña" },
            { min: 8, message: "La contraseña debe tener al menos 8 caracteres" },
            { 
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
              message: "Debe contener mayúsculas, minúsculas y números" 
            }
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

        {/* CONFIRMAR CONTRASEÑA */}
        <Form.Item 
          label={<span style={{ color: "#FFFFFF", fontFamily: "Roboto, sans-serif" }}>Confirmar Contraseña</span>}
          name="confirmContrasenia" 
          dependencies={['contrasenia']}
          rules={[
            { required: true, message: "Por favor confirma tu contraseña" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('contrasenia') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Las contraseñas no coinciden"));
              },
            }),
          ]}
        >
          <Input
            prefix={<LockOutlined style={{ color: "#1E90FF" }} />}
            placeholder="••••••••"
            type={showConfirmPassword ? "text" : "password"}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: "pointer", color: "#1E90FF" }}
              >
                {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            }
          />
        </Form.Item>

        {/* TÉRMINOS Y CONDICIONES */}
        <Form.Item 
          name="aceptaTerminos" 
          valuePropName="checked"
          rules={[
            { 
              validator: (_, value) => 
                value ? Promise.resolve() : Promise.reject(new Error("Debes aceptar los términos")) 
            }
          ]}
        >
          <Checkbox style={{ 
            color: "#D3D3D3",
            fontFamily: "Roboto, sans-serif",
            fontSize: 13
          }}>
            Acepto los{" "}
            <Link 
              href="#" 
              style={{ 
                color: "#1E90FF",
                fontFamily: "Roboto, sans-serif"
              }}
            >
              términos y condiciones
            </Link>
            {" "}y la{" "}
            <Link 
              href="#" 
              style={{ 
                color: "#1E90FF",
                fontFamily: "Roboto, sans-serif"
              }}
            >
              política de privacidad
            </Link>
          </Checkbox>
        </Form.Item>

        {/* BOTÓN REGISTRAR */}
        <Form.Item style={{ marginBottom: 16 }}>
          <PrimaryButton 
            text={loading ? "Creando cuenta..." : "Crear Cuenta"} 
            disabled={loading}
          />
        </Form.Item>

        {/* LOGIN */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text style={{ 
                color: "#D3D3D3",
                fontFamily: "Roboto, sans-serif",
                fontSize: 14
                }}>
                ¿Ya tienes cuenta?{" "}
                <RouterLink 
                    to="/"
                    style={{ 
                    color: "#39FF14",
                    fontWeight: 500,
                    fontFamily: "Roboto, sans-serif",
                    textDecoration: "none"
                    }}
                >
                    Inicia sesión aquí
                </RouterLink>
            </Text>
        </div>
      </Form>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </Card>
  );
}