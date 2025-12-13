import { Layout, Tabs, Row, Col, Input, Space, Avatar, Dropdown, message, Spin } from "antd";
import { UserOutlined, SearchOutlined, LogoutOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken, getUserFromToken } from "~/utils/auth";
import { getProducts } from "~/components/api/products";
import { addToCart } from "~/utils/cartUtils";
import ProductCard from "~/components/atoms/productCard";
import FilterSidebar from "~/components/molecules/FilterSidebar";
import CartBadge from "~/components/atoms/cartBadge";
import CartDrawer from "~/components/organisms/CartDrawer";

const { Header, Content } = Layout;

export default function UserLayout() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  // estados
  const [products, setProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [minRating, setMinRating] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);

  /// cargar productos
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      message.error("Error al cargar productos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/", { replace: true });
  };

  const userMenuItems = [
    {
      key: "miscompras",
      icon: <UserOutlined />,
      label: "Mis compras",
      onClick: () => navigate("/usuario/mis-compras"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      danger: true,
      onClick: handleLogout,
    },
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    message.success(`${product.name} agregado al carrito`);
  };

  const clearFilters = () => {
    setPriceRange([0, 2000000]);
    setMinRating(0);
    setSearchTerm("");
  };

  // filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = minRating === 0 || (product.rating && product.rating >= minRating);

    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  // obbtener categorias unicas
  const categories = ["Todos", ...new Set(products.map(p => p.category))];

  // tabs de categorias
  const categoryTabs = categories.map(cat => ({
    key: cat,
    label: cat === "Todos" ? "Todos los Productos" : cat
  }));

  return (
    <Layout style={{ minHeight: "100vh", background: "#000000" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <h1 style={{ 
            color: "#39FF14", 
            margin: 0,
            fontFamily: "Orbitron, sans-serif",
            fontSize: 24,
            textShadow: "0 0 10px #39FF14"
          }}>
            LEVEL-UP GAMER
          </h1>
        </div>

        <Space size="large">
          <Input
            placeholder="Buscar productos..."
            prefix={<SearchOutlined style={{ color: "#1E90FF" }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: 300,
              background: "#000",
              border: "1px solid #333",
              color: "#FFFFFF",
              fontFamily: "Roboto, sans-serif"
            }}
            styles={{
              input: { color: "#FFFFFF" }
            }}
          />

          <CartBadge onClick={() => setCartOpen(true)} />

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: "#1E90FF",
                  border: "2px solid #39FF14"
                }} 
              />
              <span style={{ 
                color: "#FFFFFF",
                fontFamily: "Roboto, sans-serif"
              }}>
                {user?.nombre || user?.sub}
              </span>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <div style={{ 
        background: "#1a1a1a", 
        borderBottom: "1px solid #333",
        position: "sticky",
        top: 64,
        zIndex: 999
      }}>
        <Tabs
          activeKey={selectedCategory}
          onChange={setSelectedCategory}
          items={categoryTabs}
          centered
          style={{ 
            padding: "0 24px",
          }}
        />
      </div>

      <Content style={{ padding: "24px" }}>
        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "60vh" 
          }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={24}>
            <Col xs={24} lg={6}>
              <div style={{ position: "sticky", top: 140 }}>
                <FilterSidebar
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  minRating={minRating}
                  onRatingChange={setMinRating}
                  onClearFilters={clearFilters}
                />
              </div>
            </Col>
            <Col xs={24} lg={18}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ 
                  color: "#FFFFFF",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: 20
                }}>
                  {selectedCategory === "Todos" ? "Todos los Productos" : selectedCategory}
                </h2>
                <p style={{ 
                  color: "#D3D3D3",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: 14
                }}>
                  {filteredProducts.length} productos encontrados
                </p>
              </div>

              <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                  <Col xs={24} sm={12} lg={8} key={product.id}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={handleAddToCart}
                    />
                  </Col>
                ))}
              </Row>

              {filteredProducts.length === 0 && (
                <div style={{ 
                  textAlign: "center", 
                  padding: 60,
                  color: "#D3D3D3",
                  fontFamily: "Roboto, sans-serif"
                }}>
                  <h3 style={{ color: "#FFFFFF" }}>No se encontraron productos</h3>
                  <p>Intenta ajustar los filtros o busca otro término</p>
                </div>
              )}
            </Col>
          </Row>
        )}
      </Content>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Layout>
  );
}