import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import SummaryPage from './pages/SummaryPage';

function ProtectedRoute({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

function Layout({ token, user, onLogout, cartCount }) {
  return (
    <header className="header">
      <div className="brand-logo-wrapper">
        <img
          className="brand-logo"
          src="https://placehold.co/80x80/2563eb/ffffff?text=SM"
          alt="Logo de Tester Market"
        />
        <div>
          <div className="brand">Tester Market</div>
          <p className="tagline">Tu supermercado digital de confianza</p>
        </div>
      </div>
      <nav>
        <Link to="/dashboard">Productos</Link>
        {token && (
          <Link to="/cart" aria-label={`Carrito de compras (${cartCount})`}>
            <span role="img" aria-hidden="true">🛒</span>
            {cartCount}
          </Link>
        )}
        {token ? (
          <>
            <span className="user-chip">Hola, {user?.name || 'Cliente'}</span>
            <button className="logout" onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register" className="secondary">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));
  const [lastOrder, setLastOrder] = useState(JSON.parse(localStorage.getItem('lastOrder') || 'null'));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (jwt, userData) => {
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setToken(null);
    setUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    window.alert(
      `Producto añadido al carrito:\n` +
      `• Nombre: ${product.name}\n` +
      `• Categoría: ${product.category || 'N/A'}\n` +
      `• Precio: $${product.price.toFixed(2)}\n` +
      `• Detalle: ${product.shortDescription || 'Sin descripción adicional'}`
    );
  };

  const handleAdd = (product) => {
    if (!token) {
      window.alert(
        `Debes iniciar sesión para agregar productos al carrito.\n` +
        `Producto: ${product.name}\n` +
        `Precio: $${product.price.toFixed(2)}`
      );
      return;
    }
    addToCart(product);
  };

  const updateCartItem = (id, quantity) => {
    setCart((prev) => prev
      .map((item) => item.id === id ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const removeCartItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const saveOrder = (order) => {
    localStorage.setItem('lastOrder', JSON.stringify(order));
    setLastOrder(order);
  };

  return (
    <BrowserRouter>
      <Layout token={token} user={user} onLogout={handleLogout} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
          <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={handleLogin} />} />
          <Route path="/dashboard" element={<DashboardPage onAdd={handleAdd} token={token} />} />
          <Route path="/product/:id" element={<ProductDetailPage onAdd={handleAdd} token={token} />} />
          <Route path="/cart" element={<ProtectedRoute token={token}><CartPage token={token} cart={cart} onUpdate={updateCartItem} onRemove={removeCartItem} onClear={clearCart} onCheckout={saveOrder} /></ProtectedRoute>} />
          <Route path="/summary" element={<ProtectedRoute token={token}><SummaryPage order={lastOrder} user={user} /></ProtectedRoute>} />
          <Route path="*" element={<div className="page"><h2>Página no encontrada</h2></div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
