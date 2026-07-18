export default function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "#388e3c" : t.type === "error" ? "#d32f2f" : "#333",
          color: "#fff", borderRadius: 8, padding: "13px 20px", fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,.3)", maxWidth: 320,
          animation: "slideIn .3s ease"
        }}>{t.msg}</div>
      ))}
    </div>
  );
}
