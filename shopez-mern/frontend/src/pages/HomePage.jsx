import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/categories";
import CategoryBar from "../components/CategoryBar";
import BannerCarousel from "../components/BannerCarousel";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const { navigate, setFilterCat, setSearchQ, products, productsLoading } = useApp();

  if (productsLoading) {
    return <div style={{ textAlign: "center", padding: 80, color: "#878787" }}>Loading products…</div>;
  }

  const deals = products.filter(p => p.discount >= 30).slice(0, 6);
  const trending = products.filter(p => (p.tags || []).includes("trending")).slice(0, 6);
  const best = products.filter(p => (p.tags || []).includes("bestseller")).slice(0, 6);

  const Section = ({ title, sub, products: items }) => (
    <div style={{ padding: "16px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: "#878787", marginTop: 2 }}>{sub}</div>}
        </div>
        <button style={{ color: "#2874f0", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "none", border: "none" }}>See All →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );

  return (
    <div>
      <CategoryBar />
      <BannerCarousel />
      <Section title="🔥 Deal of the Day" sub="Limited time offers — grab before gone!" products={deals} />
      <div style={{ background: "#fff", margin: "0 0 0" }}>
        <Section title="📈 Trending Now" products={trending} />
      </div>
      {/* Category Grid */}
      <div style={{ padding: "16px 16px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>🛍️ Shop by Category</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12 }}>
          {CATEGORIES.map(c => (
            <div key={c.id} style={{
              background: "#fff", borderRadius: 8, padding: 20, textAlign: "center",
              cursor: "pointer", transition: "transform .15s,box-shadow .15s", boxShadow: "0 1px 4px rgba(0,0,0,.08)"
            }}
              className="card-hover"
              onClick={() => { setFilterCat(c.id); setSearchQ(""); navigate("search"); }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "#2874f0", marginTop: 4 }}>{products.filter(p => p.category === c.id).length} products</div>
            </div>
          ))}
        </div>
      </div>
      <Section title="⭐ Bestsellers" sub="Products loved by millions of shoppers" products={best} />
      {/* Offers Banner */}
      <div style={{ margin: "0 16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { bg: "linear-gradient(135deg,#ff9f00,#fb641b)", icon: "🚚", h: "Free Delivery", s: "On orders above ₹500" },
          { bg: "linear-gradient(135deg,#2874f0,#0056d2)", icon: "🔒", h: "Secure Payments", s: "100% safe & encrypted" },
          { bg: "linear-gradient(135deg,#388e3c,#1b5e20)", icon: "🔄", h: "Easy Returns", s: "10-day return policy" },
        ].map(o => (
          <div key={o.h} style={{ background: o.bg, borderRadius: 8, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", color: "#fff" }}>
            <span style={{ fontSize: 32 }}>{o.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{o.h}</div>
              <div style={{ fontSize: 12, opacity: .85, marginTop: 2 }}>{o.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
