import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, registerUser } from "../api/authApi";
import { fetchProducts } from "../api/productApi";
import {
  fetchCart,
  addToCartApi,
  updateCartItemApi,
  removeFromCartApi,
  clearCartApi,
} from "../api/cartApi";
import {
  fetchWishlist,
  toggleWishlistApi,
  removeFromWishlistApi,
} from "../api/wishlistApi";
import {
  placeOrderApi,
  fetchMyOrders,
  advanceTrackingApi,
  cancelOrderApi,
} from "../api/orderApi";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const TOKEN_KEY = "shopez_token";
const USER_KEY = "shopez_user";

export function AppProvider({ children }) {
  const [page, setPage] = useState("home");
  const [pageParams, setPageParams] = useState({});
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [filterCat, setFilterCat] = useState(null);
  const [promoFilter, setPromoFilter] = useState(null);
  const [toasts, setToasts] = useState([]);

  const navigate = (p, params = {}) => {
    setPage(p);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const showToast = (msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  // Load the full catalog once on mount
  useEffect(() => {
    (async () => {
      try {
        setProductsLoading(true);
        const { products: list } = await fetchProducts({ limit: 100 });
        setProducts(list);
      } catch (err) {
        showToast("Could not load products from the server.", "error");
      } finally {
        setProductsLoading(false);
      }
    })();
  }, []);

  // If a session exists, pull the user's cart/wishlist/orders from the backend
  useEffect(() => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      setOrders([]);
      return;
    }
    (async () => {
      try {
        const [c, w, o] = await Promise.all([fetchCart(), fetchWishlist(), fetchMyOrders()]);
        setCart(c);
        setWishlist(w);
        setOrders(o);
      } catch (err) {
        // Token may have expired
        logout(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ───────────── AUTH ───────────── */
  const login = async (email, password) => {
    const { user: u, token } = await loginUser({ email, password });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const { user: u, token } = await registerUser({ name, email, password });
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = (silent = false) => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    if (!silent) {
      showToast("Logged out successfully", "info");
      navigate("home");
    }
  };

  /* ───────────── CART ─────────────
     Guests get a local, in-memory cart (same behaviour as the original app).
     Once logged in, every mutation goes through the backend cart API. */
  const addToCart = async (product) => {
    const selectedSize = product.selectedSize || "";
    const qty = product.qty || 1;
    if (user) {
      try {
        const updated = await addToCartApi(product.id, selectedSize, qty);
        setCart(updated);
      } catch (err) {
        showToast("Could not add item to cart.", "error");
      }
      return;
    }
    const cartId = `${product.id}-${selectedSize}`;
    setCart((prev) => {
      const ex = prev.find((c) => c.cartId === cartId);
      if (ex) {
        return prev.map((c) =>
          c.cartId === cartId ? { ...c, qty: Math.min(product.stock, c.qty + qty) } : c
        );
      }
      return [...prev, { ...product, cartId, qty }];
    });
  };

  const changeCartQty = async (item, newQty) => {
    const qty = Math.max(1, Math.min(item.stock, newQty));
    if (user) {
      try {
        const updated = await updateCartItemApi(item.id, item.selectedSize || "", qty);
        setCart(updated);
      } catch (err) {
        showToast("Could not update quantity.", "error");
      }
      return;
    }
    setCart((prev) => prev.map((c) => (c.cartId === item.cartId ? { ...c, qty } : c)));
  };

  const removeFromCart = async (item) => {
    if (user) {
      try {
        const updated = await removeFromCartApi(item.id, item.selectedSize || "");
        setCart(updated);
      } catch (err) {
        showToast("Could not remove item.", "error");
      }
      return;
    }
    setCart((prev) => prev.filter((c) => c.cartId !== item.cartId));
  };

  const clearCart = async () => {
    if (user) {
      try {
        await clearCartApi();
      } catch (err) {
        /* ignore */
      }
    }
    setCart([]);
  };

  /* ───────────── WISHLIST ───────────── */
  const toggleWishlist = async (product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    try {
      const { wishlist: updated, added } = await toggleWishlistApi(product.id);
      setWishlist(updated);
      showToast(added ? "Added to wishlist ♥" : "Removed from wishlist", added ? "success" : "info");
    } catch (err) {
      showToast("Could not update wishlist.", "error");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const updated = await removeFromWishlistApi(productId);
      setWishlist(updated);
    } catch (err) {
      showToast("Could not update wishlist.", "error");
    }
  };

  /* ───────────── ORDERS ───────────── */
  const refreshOrders = useCallback(async () => {
    if (!user) return;
    try {
      const list = await fetchMyOrders();
      setOrders(list);
    } catch (err) {
      /* ignore */
    }
  }, [user]);

  const placeOrder = async (payload) => {
    const order = await placeOrderApi(payload); // throws on validation error — caller (CartPage) handles it
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  };

  const trackOrder = async (orderId) => {
    try {
      const updated = await advanceTrackingApi(orderId);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      showToast(`Tracking update: ${updated.trackingMessage}`, "success");
    } catch (err) {
      showToast(err?.response?.data?.message || "Could not update tracking.", "error");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const updated = await cancelOrderApi(orderId);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      showToast("Order cancelled successfully.", "success");
    } catch (err) {
      showToast(err?.response?.data?.message || "Could not cancel order.", "error");
    }
  };

  const ctx = {
    page, navigate, pageParams,
    products, productsLoading,
    cart, addToCart, changeCartQty, removeFromCart, clearCart,
    wishlist, toggleWishlist, removeFromWishlist,
    orders, refreshOrders, placeOrder, trackOrder, cancelOrder,
    user, login, register, logout,
    showLogin, setShowLogin,
    searchQ, setSearchQ, filterCat, setFilterCat, promoFilter, setPromoFilter,
    showToast,
  };

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
