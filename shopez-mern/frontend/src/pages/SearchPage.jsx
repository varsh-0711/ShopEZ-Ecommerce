import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/categories";
import ProductCard from "../components/ProductCard";

export default function SearchPage() {
  const { searchQ, filterCat, setFilterCat, promoFilter, setPromoFilter, products } = useApp();
  const [sort, setSort] = useState("relevance");
  const [minDiscount, setMinDiscount] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const normalizedSearch = (searchQ || "").trim().toLowerCase();
  let list = products;
  if (promoFilter) {
    if (promoFilter.categories?.length) list = list.filter(p => promoFilter.categories.includes(p.category));
    if (promoFilter.minDiscount) list = list.filter(p => p.discount >= promoFilter.minDiscount);
    if (promoFilter.tags?.length) list = list.filter(p => promoFilter.tags.some(tag => (p.tags || []).includes(tag)));
  }
  if (filterCat) list = list.filter(p => p.category === filterCat);
  if (normalizedSearch) {
    list = list.filter(p => {
      const haystack = [
        p.name,
        p.brand,
        p.description,
        ...(p.tags || []),
        CATEGORIES.find(c => c.id === p.category)?.name || ""
      ].join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }
  if (minDiscount) list = list.filter(p => p.discount >= minDiscount);
  if (minRating) list = list.filter(p => p.rating >= minRating);
  if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
  else if (sort === "discount") list = [...list].sort((a, b) => b.discount - a.discount);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 12, padding: 12 }}>
      {/* Sidebar */}
      <div style={{ background: "#fff", borderRadius: 8, padding: 16, alignSelf: "start", boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>
          Filters
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 8, color: "#555", letterSpacing: .5, textTransform: "uppercase" }}>Category</div>
          {CATEGORIES.map(c => (
            <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, cursor: "pointer", fontSize: 13 }}>
              <input type="radio" name="cat" checked={filterCat === c.id} onChange={() => { setFilterCat(c.id); setPromoFilter(null); }} style={{ accentColor: "#2874f0" }} />
              {c.icon} {c.name}
            </label>
          ))}
          {filterCat && <button style={{
            marginTop: 6, background: "none", border: "1px solid #2874f0", color: "#2874f0",
            borderRadius: 4, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600
          }}
            onClick={() => { setFilterCat(null); setPromoFilter(null); }}>Clear ✕</button>}
        </div>
        <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 8, color: "#555", letterSpacing: .5, textTransform: "uppercase" }}>Customer Rating</div>
          {[[4, "4★ & above"], [3, "3★ & above"], [0, "All Ratings"]].map(([r, l]) => (
            <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, cursor: "pointer", fontSize: 13 }}>
              <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} style={{ accentColor: "#2874f0" }} />
              {l}
            </label>
          ))}
        </div>
        <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 8, color: "#555", letterSpacing: .5, textTransform: "uppercase" }}>Discount</div>
          {[[0, "All"], [10, "10% or more"], [25, "25% or more"], [40, "40% or more"], [50, "50% or more"]].map(([d, l]) => (
            <label key={d} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, cursor: "pointer", fontSize: 13 }}>
              <input type="radio" name="disc" checked={minDiscount === d} onChange={() => setMinDiscount(d)} style={{ accentColor: "#2874f0" }} />
              {l}
            </label>
          ))}
        </div>
      </div>
      {/* Results */}
      <div>
        <div style={{
          background: "#fff", borderRadius: 8, padding: "10px 16px", marginBottom: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,.08)", flexWrap: "wrap", gap: 8
        }}>
          <div style={{ fontSize: 14, color: "#555" }}>
            Showing <strong>{list.length}</strong> results
            {searchQ && <> for "<strong>{searchQ}</strong>"</>}
            {promoFilter && <><span style={{ marginLeft: 8, color: "#2874f0", fontWeight: 700 }}>• {promoFilter.title}</span></>}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[["relevance", "Relevance"], ["price_asc", "Price ↑"], ["price_desc", "Price ↓"], ["rating", "Rating"], ["discount", "Discount"]].map(([v, l]) => (
              <button key={v} onClick={() => setSort(v)}
                style={{
                  padding: "5px 12px", borderRadius: 20, border: `1px solid ${sort === v ? "#2874f0" : "#e0e0e0"}`,
                  background: sort === v ? "#e8f0fe" : "#fff", color: sort === v ? "#2874f0" : "#555",
                  fontSize: 12, cursor: "pointer", fontWeight: sort === v ? 600 : 400
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>
        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, background: "#fff", borderRadius: 8, color: "#878787" }}>
            <div style={{ fontSize: 64 }}>🔍</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 16, color: "#212121" }}>No products found</div>
            <div style={{ marginTop: 8 }}>Try different keywords or remove filters</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>
            {list.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
