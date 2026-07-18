import { useState } from "react";
import { useApp } from "../context/AppContext";
import ProductImage from "./ProductImage";
import Rating from "./Rating";
import SizeSelectionModal from "./SizeSelectionModal";
import { fmt } from "../utils/format";

export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist, navigate, showToast } = useApp();
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const isWished = wishlist.some(w => w.id === product.id);
  const requiresSizeSelection = Array.isArray(product.sizes) && product.sizes.length > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (requiresSizeSelection) {
      setSizeModalOpen(true);
      return;
    }
    addToCart(product);
    showToast("Added to cart 🛒", "success");
  };

  return (
    <div className="card-hover" onClick={() => navigate("product", { productId: product.id })}
      style={{
        background: "#fff", borderRadius: 8, padding: 14, cursor: "pointer",
        transition: "box-shadow .2s,transform .2s", position: "relative",
        display: "flex", flexDirection: "column", gap: 6, height: "100%", boxShadow: "0 1px 4px rgba(0,0,0,.08)"
      }}>
      {product.discount > 0 &&
        <div style={{
          position: "absolute", top: 8, left: 8, background: "#ff6161", color: "#fff",
          borderRadius: 3, fontSize: 11, fontWeight: 700, padding: "2px 7px", zIndex: 1
        }}>
          {product.discount}% off
        </div>}
      <button style={{
        position: "absolute", top: 8, right: 8, background: "none", border: "none",
        fontSize: 22, cursor: "pointer", color: isWished ? "#ff6161" : "#ccc", zIndex: 1
      }}
        onClick={e => { e.stopPropagation(); toggleWishlist(product); }}>
        {isWished ? "♥" : "♡"}
      </button>
      <ProductImage product={product} height={140} emojiSize={56} />
      <div style={{ fontSize: 11, color: "#878787", fontWeight: 600, textTransform: "uppercase" }}>{product.brand}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#212121", lineHeight: 1.4, flex: 1 }}>{product.name}</div>
      <Rating value={product.rating} count={product.reviews} />
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {(product.tags || []).map(t => (
          <span key={t} style={{
            background: "#fff3e0", color: "#f57c00", fontSize: 10,
            fontWeight: 700, borderRadius: 3, padding: "2px 6px", textTransform: "uppercase"
          }}>{t}</span>
        ))}
      </div>
      <div>
        <span style={{ fontSize: 18, fontWeight: 700 }}>{fmt(product.price)}</span>{" "}
        <span style={{ fontSize: 12, color: "#878787", textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>{" "}
        <span style={{ fontSize: 12, color: "#388e3c", fontWeight: 700 }}>{product.discount}% off</span>
      </div>
      <button style={{
        background: "#2874f0", color: "#fff", border: "none", borderRadius: 4,
        padding: "7px 0", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 4
      }}
        onClick={handleAddToCart}>
        {requiresSizeSelection ? "Select Size & Add" : "Add to Cart"}
      </button>
      <SizeSelectionModal open={sizeModalOpen} product={product} onClose={() => setSizeModalOpen(false)} onConfirm={selectedSize => { addToCart({ ...product, selectedSize, qty: 1 }); showToast("Added to cart 🛒", "success"); setSizeModalOpen(false); }} />
    </div>
  );
}
