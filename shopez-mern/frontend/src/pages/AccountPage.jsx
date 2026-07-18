import { useApp } from "../context/AppContext";

export default function AccountPage() {
  const { user, navigate, orders, cart, wishlist } = useApp();
  if (!user) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 12, padding: 12 }}>
      <div style={{ background: "#fff", borderRadius: 8, padding: 20, alignSelf: "start", boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: 60, marginBottom: 8 }}>{user.avatar}</div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{user.name}</div>
          <div style={{ fontSize: 13, color: "#878787", marginTop: 4 }}>{user.email}</div>
          <div style={{ marginTop: 8 }}>
            <span style={{
              background: user.role === "ADMIN" ? "#fff3e0" : "#e8f0fe",
              color: user.role === "ADMIN" ? "#f57c00" : "#2874f0", borderRadius: 20,
              padding: "3px 12px", fontSize: 12, fontWeight: 700
            }}>{user.role}</span>
          </div>
        </div>
        {[["📦 My Orders", "orders"], ["♥ My Wishlist", "wishlist"], ["🛒 My Cart", "cart"], ["📍 My Addresses", "account"], ["💳 Saved Cards", "account"], ["🎁 Coupons", "account"]].map(([l, p]) => (
          <button key={l} className="side-link" onClick={() => navigate(p)}
            style={{
              width: "100%", background: "none", border: "none", padding: "10px 8px",
              textAlign: "left", fontSize: 14, cursor: "pointer", borderRadius: 4, color: "#212121",
              display: "flex", alignItems: "center", gap: 8, transition: "background .15s"
            }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[["📦", "Total Orders", orders.length, "orders"], ["♥", "Wishlist", wishlist.length, "wishlist"], ["🛒", "Cart Items", cart.length, "cart"]].map(([ic, l, v, p]) => (
            <div key={l} style={{ background: "#fff", borderRadius: 8, padding: 20, textAlign: "center", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}
              className="card-hover" onClick={() => navigate(p)}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{ic}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#2874f0" }}>{v}</div>
              <div style={{ fontSize: 13, color: "#878787", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Profile Information</div>
          {[["Full Name", user.name], ["Email Address", user.email], ["Account Type", user.role], ["Member Since", "June 2025"], ["Phone Number", "Not added"], ["Default Address", "Not added"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 16, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f5f5f5" }}>
              <div style={{ width: 140, fontSize: 13, color: "#878787", flexShrink: 0 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
          <button style={{
            background: "#ff9f00", color: "#fff", border: "none", borderRadius: 4,
            padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer"
          }}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
