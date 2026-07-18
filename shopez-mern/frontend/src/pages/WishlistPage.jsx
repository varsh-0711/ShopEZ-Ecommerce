import { useApp } from "../context/AppContext";
import ProductImage from "../components/ProductImage";
import Rating from "../components/Rating";
import { fmt } from "../utils/format";

export default function WishlistPage() {
  const { wishlist, addToCart, removeFromWishlist, navigate, showToast } = useApp();
  if (wishlist.length === 0) return (
    <div style={{ textAlign: "center", padding: 80, background: "#fff", margin: 16, borderRadius: 8 }}>
      <div style={{ fontSize: 80 }}>♡</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 16 }}>Your wishlist is empty!</div>
      <div style={{ fontSize: 14, color: "#878787", marginTop: 8 }}>Save your favourite items here</div>
      <button style={{
        marginTop: 24, background: "#ff9f00", color: "#fff", border: "none", borderRadius: 4,
        padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer"
      }}
        onClick={() => navigate("home")}>Explore Products</button>
    </div>
  );
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>My Wishlist ({wishlist.length})</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>
        {wishlist.map(p => (
          <div key={p.id} style={{
            background: "#fff", borderRadius: 8, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,.08)",
            display: "flex", flexDirection: "column", gap: 6, position: "relative"
          }}>
            <button style={{
              position: "absolute", top: 8, right: 8, background: "none", border: "none",
              fontSize: 18, cursor: "pointer", color: "#ff6161", fontWeight: 700
            }}
              onClick={() => removeFromWishlist(p.id)}>✕</button>
            <ProductImage product={p} height={120} emojiSize={48} />
            <div style={{ fontSize: 11, color: "#878787", fontWeight: 600, textTransform: "uppercase" }}>{p.brand}</div>
            <div style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{p.name}</div>
            <Rating value={p.rating} count={p.reviews} />
            <div><span style={{ fontSize: 17, fontWeight: 700 }}>{fmt(p.price)}</span>{" "}<span style={{ fontSize: 12, color: "#878787", textDecoration: "line-through" }}>{fmt(p.originalPrice)}</span></div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{
                flex: 1, background: "#2874f0", color: "#fff", border: "none", borderRadius: 4,
                padding: "7px 0", fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}
                onClick={() => { addToCart(p); removeFromWishlist(p.id); showToast("Moved to cart 🛒", "success"); }}>
                Move to Cart
              </button>
              <button style={{
                background: "#fff", color: "#2874f0", border: "1px solid #2874f0", borderRadius: 4,
                padding: "7px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer"
              }}
                onClick={() => navigate("product", { productId: p.id })}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
