import { useState, useEffect } from "react";

export default function SizeSelectionModal({ open, product, onClose, onConfirm }) {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  useEffect(() => {
    if (product?.sizes?.length) setSelectedSize(product.sizes[0]);
  }, [product?.id, open]);

  if (!open || !product) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 2600, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 10, width: "100%", maxWidth: 440, padding: 22, boxShadow: "0 10px 35px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{product.name}</div>
        <div style={{ fontSize: 13, color: "#878787", marginBottom: 12 }}>Please choose a {product.category === "electronics" ? "storage/configuration" : product.category === "books" ? "format" : "size"} before adding it to your cart.</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          {product.sizes.map(sz => (
            <button key={sz} onClick={() => setSelectedSize(sz)} style={{ padding: "8px 14px", borderRadius: 6, border: selectedSize === sz ? "2px solid #2874f0" : "1px solid #d0d0d0", background: selectedSize === sz ? "#e8f0fe" : "#fff", color: selectedSize === sz ? "#2874f0" : "#212121", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {sz}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ background: "#fff", color: "#555", border: "1px solid #d0d0d0", borderRadius: 4, padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          <button disabled={!selectedSize} onClick={() => onConfirm(selectedSize)} style={{ background: selectedSize ? "#2874f0" : "#c2d9ff", color: "#fff", border: "none", borderRadius: 4, padding: "9px 16px", fontWeight: 700, cursor: selectedSize ? "pointer" : "not-allowed" }}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
