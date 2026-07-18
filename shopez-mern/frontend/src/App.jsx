import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/OrdersPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";

function Shell() {
  const { page, pageParams, showLogin, toasts } = useApp();

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "search": return <SearchPage />;
      case "product": return <ProductDetailPage productId={pageParams.productId} />;
      case "cart": return <CartPage />;
      case "wishlist": return <WishlistPage />;
      case "orders": return <OrdersPage />;
      case "account": return <AccountPage />;
      case "admin": return <AdminPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',Arial,sans-serif", minHeight: "100vh", background: "#f1f3f6", color: "#212121" }}>
      <Navbar />
      <main>{renderPage()}</main>
      <Footer />
      {showLogin && <LoginModal />}
      <Toast toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
