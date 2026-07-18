import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import NavBtn from "./NavBtn";

export default function Navbar() {
  const { navigate, cart, wishlist, user, logout, setShowLogin, searchQ, setSearchQ } = useApp();
  const [q, setQ] = useState(searchQ || "");
  useEffect(() => { setQ(searchQ || ""); }, [searchQ]);
  const doSearch = () => {
    const trimmed = (q || "").trim();
    setSearchQ(trimmed);
    navigate("search");
  };
  const total = cart.reduce((a, c) => a + c.qty, 0);
  return (
    <nav style={{
      background: "#2874f0", color: "#fff", padding: "0 16px", display: "flex",
      alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 1000,
      boxShadow: "0 2px 8px rgba(0,0,0,.25)", height: 58, flexWrap: "nowrap"
    }}>
      <div style={{
        fontWeight: 900, fontSize: 20, color: "#fff", cursor: "pointer",
        letterSpacing: -.5, display: "flex", alignItems: "center", gap: 6, minWidth: 90
      }}
        onClick={() => navigate("home")}>
        <span>🛍️</span>
        <div>
          <div style={{ lineHeight: 1 }}>ShopEZ</div>
          <div style={{ fontSize: 9, fontStyle: "italic", color: "rgba(255,255,255,.75)", fontWeight: 400, lineHeight: 1 }}>Smart Shopping</div>
        </div>
      </div>
      <div style={{ flex: 1, maxWidth: 540, display: "flex", borderRadius: 4, overflow: "hidden", background: "#fff" }}>
        <input style={{ flex: 1, border: "none", outline: "none", padding: "9px 14px", fontSize: 14, color: "#212121" }}
          placeholder="Search products, brands and more..."
          value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()} />
        <button style={{ background: "#f0c040", border: "none", padding: "9px 16px", cursor: "pointer", fontSize: 18 }}
          onClick={doSearch}>🔍</button>
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: "auto" }}>
        {user ? (
          <>
            <NavBtn icon={user.avatar} label={user.name.split(" ")[0]} onClick={() => navigate("account")} />
            {user.role === "ADMIN" && <NavBtn icon="⚙️" label="Admin" onClick={() => navigate("admin")} />}
            <NavBtn icon="🚪" label="Logout" onClick={logout} />
          </>
        ) : (
          <button style={{
            background: "#fff", color: "#2874f0", border: "none", borderRadius: 4,
            padding: "6px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer"
          }}
            onClick={() => setShowLogin(true)}>Login</button>
        )}
        <NavBtn icon="♥" label="Wishlist" badge={wishlist.length} onClick={() => navigate("wishlist")} />
        <NavBtn icon="🛒" label="Cart" badge={total} onClick={() => navigate("cart")} />
      </div>
    </nav>
  );
}
