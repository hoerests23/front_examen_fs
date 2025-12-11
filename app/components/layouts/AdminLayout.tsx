import { Layout, Space, Avatar, Dropdown, Card } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { removeToken, getUserFromToken } from "~/utils/auth";

const { Header, Content } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    removeToken();
    navigate("/", { replace: true });
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Mi Perfil",
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
      {/* header */}
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
          ADMIN - LEVEL-UP GAMER
        </h1>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: "#ff4d4f",
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
            minHeight: "calc(100vh - 120px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ 
              color: "#FFFFFF",
              fontFamily: "Orbitron, sans-serif",
              fontSize: 32,
              marginBottom: 16
            }}>
              Panel de .. abeja ..
            </h2>
            <p style={{ 
              color: "#D3D3D3",
              fontFamily: "Roboto, sans-serif",
              fontSize: 16,
              marginBottom: 24
            }}>
              Bienvenido, {user?.sub}
            </p>
            <div style={{
              background: "#000",
              border: "2px solid #1E90FF",
              borderRadius: 8,
              padding: 40,
              marginTop: 24
            }}>
              <p style={{ 
                color: "#39FF14",
                fontFamily: "Orbitron, sans-serif",
                fontSize: 18,
                margin: 0
              }}>
                Ejemplo temporaaaaaaaal Je Je Je
              </p>
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}