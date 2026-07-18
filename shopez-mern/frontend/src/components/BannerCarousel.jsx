import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { BANNERS } from "../data/banners";

export default function BannerCarousel() {
  const { navigate, setFilterCat, setSearchQ, setPromoFilter } = useApp();
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 3500);
    return () => clearInterval(t);
  }, []);
  const b = BANNERS[idx];
  const openPromo = (promo) => {
    setPromoFilter(promo);
    setFilterCat(promo.categories[0] || null);
    setSearchQ("");
    navigate("search");
  };
  return (
    <div style={{
      position: "relative", overflow: "hidden", borderRadius: 10, margin: "12px 16px",
      height: 210, display: "flex", alignItems: "center", padding: "0 52px", cursor: "pointer",
      background: b.bg, transition: "background .5s"
    }}>
      <div style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", fontSize: 110, opacity: .15 }}>{b.emoji}</div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 52, marginBottom: 6 }}>{b.emoji}</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.3)", lineHeight: 1.1 }}>{b.title}</div>
        <div style={{ fontSize: 15, color: "rgba(255,255,255,.85)", marginTop: 8 }}>{b.subtitle}</div>
        <button onClick={e => { e.stopPropagation(); openPromo(b.promo); }} style={{
          marginTop: 18, background: b.accent, color: "#212121", border: "none",
          borderRadius: 4, padding: "10px 26px", fontSize: 14, fontWeight: 800, cursor: "pointer"
        }}>
          Shop Now →
        </button>
      </div>
      <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 7 }}>
        {BANNERS.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)}
            style={{
              width: 8, height: 8, borderRadius: "50%", cursor: "pointer",
              background: i === idx ? "#fff" : "rgba(255,255,255,.4)", border: "2px solid rgba(255,255,255,.6)"
            }} />
        ))}
      </div>
    </div>
  );
}
