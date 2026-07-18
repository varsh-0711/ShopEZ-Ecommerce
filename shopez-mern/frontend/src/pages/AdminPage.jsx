import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/categories";
import ProductImage from "../components/ProductImage";
import { fmt } from "../utils/format";
import { fetchAdminOverview, fetchAdminOrders, fetchAdminUsers, adminDeleteProduct } from "../api/adminApi";
import { fetchProducts } from "../api/productApi";

const Th = ({ children }) => <th style={{ background: "#f5f5f5", padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: .5 }}>{children}</th>;
const Td = ({ children, style }) => <td style={{ padding: "12px 14px", fontSize: 13, borderBottom: "1px solid #f0f0f0", verticalAlign: "middle", ...style }}>{children}</td>;

export default function AdminPage() {
  const { user, showToast } = useApp();
  const [section, setSection] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    const { products } = await fetchProducts({ limit: 100 });
    setAdminProducts(products);
  };

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    (async () => {
      try {
        setLoading(true);
        const [ov, orders, users] = await Promise.all([
          fetchAdminOverview(), fetchAdminOrders(), fetchAdminUsers(),
        ]);
        setOverview(ov);
        setAllOrders(orders);
        setAllUsers(users);
        await loadProducts();
      } catch (err) {
        showToast("Could not load admin data.", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDeleteProduct = async (id) => {
    try {
      await adminDeleteProduct(id);
      showToast("Product deleted", "success");
      await loadProducts();
    } catch (err) {
      showToast("Could not delete product.", "error");
    }
  };

  if (!user || user.role !== "ADMIN") return (
    <div style={{ textAlign: "center", padding: 80, color: "#878787" }}>
      <div style={{ fontSize: 64 }}>⛔</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 16, color: "#212121" }}>Access Denied</div>
      <div style={{ marginTop: 8 }}>Admin access required</div>
    </div>
  );

  if (loading) return <div style={{ textAlign: "center", padding: 80, color: "#878787" }}>Loading admin dashboard…</div>;

  const menu = [["📊", "Overview", "overview"], ["📦", "Products", "products"], ["🛒", "Orders", "orders"], ["👥", "Users", "users"], ["📈", "Analytics", "analytics"]];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 58px)" }}>
      <div style={{ background: "#1e2a3a", color: "#fff", padding: "20px 12px" }}>
        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 24, padding: "0 8px" }}>⚙️ Admin Panel</div>
        {menu.map(([ic, l, s]) => (
          <button key={s} onClick={() => setSection(s)} className="side-link"
            style={{
              display: "flex", gap: 10, alignItems: "center", width: "100%",
              background: section === s ? "rgba(255,255,255,.15)" : "none",
              border: "none", color: "#fff", padding: "10px 12px", borderRadius: 6,
              cursor: "pointer", marginBottom: 4, fontSize: 14, fontWeight: section === s ? 700 : 400,
              transition: "background .15s"
            }}>
            <span style={{ fontSize: 18 }}>{ic}</span><span>{l}</span>
          </button>
        ))}
      </div>
      <div style={{ padding: 24, background: "#f1f3f6", overflowY: "auto" }}>
        {section === "overview" && overview && (
          <>
            <h2 style={{ marginBottom: 20, fontSize: 22 }}>Dashboard Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
              {[["Total Revenue", fmt(overview.totalRevenue), "📈", "#2874f0"],
              ["Total Orders", overview.totalOrders, "📦", "#388e3c"],
              ["Products", overview.totalProducts, "🛍️", "#f57c00"],
              ["Users", overview.totalUsers, "👥", "#9c27b0"]].map(([l, v, ic, c]) => (
                <div key={l} style={{
                  background: "#fff", borderRadius: 8, padding: 18, textAlign: "center",
                  borderTop: `4px solid ${c}`, boxShadow: "0 1px 6px rgba(0,0,0,.08)"
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{ic}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: c }}>{v}</div>
                  <div style={{ fontSize: 12, color: "#878787", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Recent Orders</div>
            <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.08)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Order ID", "Customer", "Amount", "Status", "Date"].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                <tbody>
                  {overview.recentOrders.map(o => (
                    <tr key={o._id}>
                      <Td><code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: 3, fontSize: 12 }}>{o.orderNumber}</code></Td>
                      <Td>{o.user?.name || "—"}</Td>
                      <Td><strong>{fmt(o.total)}</strong></Td>
                      <Td><span style={{ background: "#e8f5e9", color: "#388e3c", borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 700 }}>{o.status}</span></Td>
                      <Td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</Td>
                    </tr>
                  ))}
                  {overview.recentOrders.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 30, color: "#878787" }}>No orders yet</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
        {section === "products" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22 }}>Products ({adminProducts.length})</h2>
              <button style={{
                background: "#2874f0", color: "#fff", border: "none", borderRadius: 4,
                padding: "9px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>+ Add Product</button>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.08)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["", "Name", "Category", "Price", "Stock", "Rating", "Actions"].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                <tbody>
                  {adminProducts.map(p => (
                    <tr key={p.id}>
                      <Td><div style={{ width: 40 }}><ProductImage product={p} height={40} emojiSize={22} /></div></Td>
                      <Td><div style={{ fontWeight: 600, maxWidth: 180 }}>{p.name}</div><div style={{ fontSize: 11, color: "#878787" }}>{p.brand}</div></Td>
                      <Td>{CATEGORIES.find(c => c.id === p.category)?.name}</Td>
                      <Td><strong>{fmt(p.price)}</strong><br /><span style={{ fontSize: 11, color: "#388e3c" }}>{p.discount}% off</span></Td>
                      <Td><span style={{ color: p.stock < 20 ? "#ff6161" : "#388e3c", fontWeight: 700 }}>{p.stock}</span></Td>
                      <Td><span style={{ background: "#388e3c", color: "#fff", borderRadius: 3, padding: "2px 6px", fontSize: 12, fontWeight: 700 }}>{p.rating} ★</span></Td>
                      <Td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={{ background: "#2874f0", color: "#fff", border: "none", borderRadius: 3, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ background: "#fff", color: "#ff6161", border: "1px solid #ff6161", borderRadius: 3, padding: "5px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Del</button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {section === "orders" && (
          <>
            <h2 style={{ marginBottom: 20, fontSize: 22 }}>All Orders ({allOrders.length})</h2>
            <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.08)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Order ID", "Customer", "Amount", "Status", "Date"].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                <tbody>
                  {allOrders.map(o => (
                    <tr key={o._id}>
                      <Td><code style={{ background: "#f5f5f5", padding: "2px 6px", borderRadius: 3, fontSize: 12 }}>{o.orderNumber}</code></Td>
                      <Td>{o.user?.name || "—"}</Td>
                      <Td><strong>{fmt(o.total)}</strong></Td>
                      <Td><span style={{ background: "#e8f5e9", color: "#388e3c", borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 700 }}>{o.status}</span></Td>
                      <Td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</Td>
                    </tr>
                  ))}
                  {allOrders.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#878787", fontSize: 14 }}>No orders placed yet</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
        {section === "users" && (
          <>
            <h2 style={{ marginBottom: 20, fontSize: 22 }}>Registered Users ({allUsers.length})</h2>
            <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,.08)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr>{["Avatar", "Name", "Email", "Role", "Status"].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u._id}>
                      <Td><span style={{ fontSize: 28 }}>{u.avatar}</span></Td>
                      <Td><strong>{u.name}</strong></Td>
                      <Td>{u.email}</Td>
                      <Td><span style={{ background: u.role === "ADMIN" ? "#fff3e0" : "#e8f0fe", color: u.role === "ADMIN" ? "#f57c00" : "#2874f0", borderRadius: 4, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{u.role}</span></Td>
                      <Td><span style={{ background: u.isActive ? "#e8f5e9" : "#ffebee", color: u.isActive ? "#388e3c" : "#d32f2f", borderRadius: 4, padding: "3px 8px", fontSize: 12, fontWeight: 700 }}>{u.isActive ? "Active" : "Deactivated"}</span></Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {section === "analytics" && (
          <>
            <h2 style={{ marginBottom: 20, fontSize: 22 }}>Analytics & Reports</h2>
            <div style={{ background: "#fff", borderRadius: 8, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,.08)" }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Top Selling Products</div>
              {[...adminProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 6).map((p, i) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ fontWeight: 800, color: "#878787", width: 22, fontSize: 13 }}>#{i + 1}</div>
                  <div style={{ width: 32, minWidth: 32 }}><ProductImage product={p} height={32} emojiSize={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#878787", marginTop: 2 }}>{p.reviews.toLocaleString("en-IN")} reviews</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{fmt(p.price)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
