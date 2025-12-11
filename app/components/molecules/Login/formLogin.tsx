import { Card, Form, Input } from "antd";
import { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import TextInput from "../../atoms/textInput";
import PrimaryButton from "../../atoms/primaryButton";

interface LoginFormProps {
  onSubmit: (values: { correo: string; password: string }) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card style={{ width: 350, padding: 16 }}>
      <Form layout="vertical" onFinish={onSubmit}>

        {/* CORREO */}
        <Form.Item label="Correo" name="correo" rules={[{ required: true }]}>
          <TextInput placeholder="Ingresa tu correo" type="email" />
        </Form.Item>

        {/* CONTRASEÑA CON VER/OCULTAR */}
        <Form.Item label="Contraseña" name="contrasenia" rules={[{ required: true }]}>
          <Input
            placeholder="Ingresa tu contraseña"
            type={showPassword ? "text" : "password"}
            suffix={
              showPassword ? (
                <EyeInvisibleOutlined onClick={() => setShowPassword(false)} />
              ) : (
                <EyeOutlined onClick={() => setShowPassword(true)} />
              )
            }
          />
        </Form.Item>

        <PrimaryButton text="Ingresar" />
      </Form>
    </Card>
  );
}
