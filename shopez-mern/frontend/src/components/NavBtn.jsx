export default function NavBtn({ icon, label, badge, onClick }) {
  return (
    <button className="nav-btn" onClick={onClick}
      style={{
        background: "transparent", border: "none", color: "#fff", cursor: "pointer",
        padding: "5px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, position: "relative"
      }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>
        {icon}
        {badge > 0 && <span style={{
          position: "absolute", top: -2, right: 2, background: "#f5a623", color: "#fff",
          borderRadius: 10, fontSize: 9, padding: "1px 4px", fontWeight: 700, minWidth: 15, textAlign: "center"
        }}>{badge}</span>}
      </span>
      <span style={{ fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>
    </button>
  );
}
