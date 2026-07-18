export default function Footer() {
  return (
    <footer style={{ background: "#172337", color: "#fff", marginTop: 24, padding: "32px 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, marginBottom: 24 }}>
        {[
          ["ABOUT US", ["About ShopEZ", "Careers", "Press", "Blog", "Investors"]],
          ["HELP & SUPPORT", ["FAQ", "Shipping Info", "Returns", "Track Order", "Contact Us"]],
          ["POLICIES", ["Privacy Policy", "Terms of Use", "Security", "Cookie Policy", "Sitemap"]],
          ["CONNECT", ["📘 Facebook", "🐦 Twitter", "📸 Instagram", "▶️ YouTube", "📌 Pinterest"]],
        ].map(([h, links]) => (
          <div key={h}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#878787", marginBottom: 14, letterSpacing: 1 }}>{h}</div>
            {links.map(l => (
              <div key={l} style={{ fontSize: 13, color: "#ccc", marginBottom: 8, cursor: "pointer", transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "#ccc"}>{l}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        borderTop: "1px solid #2d3748", paddingTop: 20, display: "flex",
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🛍️</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>ShopEZ</div>
            <div style={{ fontSize: 11, color: "#878787" }}>© 2025 ShopEZ Pvt. Ltd. All rights reserved.</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#878787", textAlign: "center" }}>
          Made with ❤️ in India 🇮🇳
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
          <div style={{ fontSize: 11, color: "#878787" }}>We accept</div>
          <div style={{ fontSize: 22, display: "flex", gap: 6 }}>💳 🏦 📱 💰 🔒</div>
        </div>
      </div>
    </footer>
  );
}
