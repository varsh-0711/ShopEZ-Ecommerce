import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/categories";

export default function CategoryBar() {
  const { navigate, setFilterCat, setSearchQ } = useApp();
  return (
    <div style={{
      background: "#fff", padding: "6px 16px", display: "flex", gap: 0,
      overflowX: "auto", borderBottom: "1px solid #e8e8e8", boxShadow: "0 1px 3px rgba(0,0,0,.06)"
    }}>
      {CATEGORIES.map(c => (
        <div key={c.id} onClick={() => { setFilterCat(c.id); setSearchQ(""); navigate("search"); }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "6px 22px", cursor: "pointer", borderRadius: 4, minWidth: 85,
            transition: "background .15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f0f0f0" }}
          onMouseLeave={e => { e.currentTarget.style.background = "none" }}>
          <span style={{ fontSize: 26 }}>{c.icon}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#212121", whiteSpace: "nowrap" }}>{c.name}</span>
        </div>
      ))}
    </div>
  );
}
