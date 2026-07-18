import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function LoginModal() {
  const { setShowLogin, showToast, login, register } = useApp();
  const [isReg, setIsReg] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr("");
    if (isReg) {
      if (!form.name || !form.email || !form.password) { setErr("All fields are required"); return; }
      if (form.password.length < 6) { setErr("Password must be at least 6 characters"); return; }
      try {
        setLoading(true);
        const u = await register(form.name, form.email, form.password);
        setShowLogin(false);
        showToast(`Welcome to ShopEZ, ${u.name}! 🎉`, "success");
      } catch (e) {
        setErr(e?.response?.data?.message || "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!form.email || !form.password) { setErr("Email and password are required"); return; }
      try {
        setLoading(true);
        const u = await login(form.email, form.password);
        setShowLogin(false);
        showToast(`Welcome back, ${u.name}! 👋`, "success");
      } catch (e) {
        setErr(e?.response?.data?.message || "Invalid email or password. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}
      onClick={() => setShowLogin(false)}>
      <div style={{
        background: "#fff", borderRadius: 10, padding: 32, maxWidth: 420, width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,.2)"
      }}
        onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36 }}>🛍️</div>
          <div style={{ fontWeight: 800, fontSize: 20, color: "#2874f0" }}>ShopEZ</div>
        </div>
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "2px solid #f0f0f0" }}>
          {["Login", "Register"].map((l, i) => (
            <button key={l} onClick={() => { setIsReg(!!i); setErr(""); }}
              style={{
                flex: 1, padding: "10px 0", border: "none", background: "none",
                fontWeight: 700, fontSize: 15, color: isReg === !!i ? "#2874f0" : "#878787",
                borderBottom: `2px solid ${isReg === !!i ? "#2874f0" : "transparent"}`,
                cursor: "pointer", marginBottom: -2
              }}>
              {l}
            </button>
          ))}
        </div>
        {isReg && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 5, display: "block" }}>Full Name</label>
            <input style={{
              width: "100%", border: "1px solid #e0e0e0", borderRadius: 6,
              padding: "10px 14px", fontSize: 14, outline: "none"
            }}
              placeholder="Your full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
        )}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 5, display: "block" }}>Email Address</label>
          <input style={{
            width: "100%", border: "1px solid #e0e0e0", borderRadius: 6,
            padding: "10px 14px", fontSize: 14, outline: "none"
          }}
            type="email" placeholder="you@email.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 5, display: "block" }}>Password</label>
          <input style={{
            width: "100%", border: "1px solid #e0e0e0", borderRadius: 6,
            padding: "10px 14px", fontSize: 14, outline: "none"
          }}
            type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        {err && <div style={{ color: "#d32f2f", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "#ffebee", borderRadius: 4 }}>⚠️ {err}</div>}
        <button disabled={loading} style={{
          width: "100%", background: "#2874f0", color: "#fff", border: "none", borderRadius: 6,
          padding: 14, fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer", marginBottom: 14,
          opacity: loading ? .7 : 1
        }}
          onClick={handle}>{loading ? "Please wait..." : isReg ? "Create Account" : "Login to ShopEZ"}</button>
        {!isReg && (
          <div style={{ background: "#f0f7ff", borderRadius: 6, padding: 14, fontSize: 12, lineHeight: 1.7 }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: "#2874f0" }}>🔑 Demo Credentials</div>
            <div>👤 <strong>User:</strong> demo@shopez.com / demo123</div>
            <div style={{ marginTop: 4 }}>👑 <strong>Admin:</strong> admin@shopez.com / admin123</div>
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button style={{ background: "none", border: "none", color: "#878787", fontSize: 12, cursor: "pointer" }}
            onClick={() => setShowLogin(false)}>✕ Close</button>
        </div>
      </div>
    </div>
  );
}
