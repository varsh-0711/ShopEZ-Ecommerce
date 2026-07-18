import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/categories";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";
import Rating from "../components/Rating";
import SizeSelectionModal from "../components/SizeSelectionModal";
import { fmt } from "../utils/format";

export default function ProductDetailPage({ productId }) {
  const { addToCart, wishlist, toggleWishlist, navigate, showToast, user, setShowLogin, products } = useApp();
  const product = products.find(p => p.id === productId);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product && product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [sizeAction, setSizeAction] = useState(null);

  if (!product) return <div style={{ textAlign: "center", padding: 80, color: "#878787" }}>Product not found.</div>;
  const isWished = wishlist.some(w => w.id === product.id);
  const similar = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const saving = product.originalPrice - product.price;
  const requiresSizeSelection = Array.isArray(product.sizes) && product.sizes.length > 0;
  const handleAddToCart = () => {
    if (requiresSizeSelection) { setSizeAction("cart"); setSizeModalOpen(true); return; }
    addToCart({ ...product, qty, selectedSize });
    showToast("Added to cart 🛒", "success");
  };
  const handleBuy = () => {
    if (!user) { setShowLogin(true); return; }
    if (requiresSizeSelection) { setSizeAction("buy"); setSizeModalOpen(true); return; }
    addToCart({ ...product, qty, selectedSize });
    navigate("cart");
  };
  const confirmSizeSelection = (chosenSize) => {
    const payload = { ...product, qty, selectedSize: chosenSize };
    if (sizeAction === "buy") {
      addToCart(payload);
      navigate("cart");
    } else {
      addToCart(payload);
      showToast("Added to cart 🛒", "success");
    }
    setSizeModalOpen(false);
    setSizeAction(null);
  };
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "10px 20px", fontSize: 13, color: "#878787" }}>
        <span style={{ cursor: "pointer", color: "#2874f0" }} onClick={() => navigate("home")}>Home</span>
        <span>›</span>
        <span style={{ cursor: "pointer", color: "#2874f0" }} onClick={() => navigate("search")}>{CATEGORIES.find(c => c.id === product.category)?.name}</span>
        <span>›</span>
        <span>{product.name}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, padding: "0 16px 16px", background: "#fff", margin: "0 0 12px" }}>
        {/* Left */}
        <div>
          <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", background: "#f7f7f7", height: 380 }}>
            <img src={product.images && product.images.length > 0 ? product.images[activeImg] : product.img}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <button style={{
              position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,.9)", border: "none",
              borderRadius: "50%", width: 44, height: 44, fontSize: 24, cursor: "pointer", color: isWished ? "#ff6161" : "#999",
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,.2)"
            }}
              onClick={() => toggleWishlist(product)}>
              {isWished ? "♥" : "♡"}
            </button>
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
              {product.images.map((imgUrl, idx) => (
                <img key={idx} src={imgUrl} alt="" onClick={() => setActiveImg(idx)}
                  style={{
                    width: 64, height: 64, objectFit: "cover", borderRadius: 6, cursor: "pointer",
                    border: activeImg === idx ? "2px solid #2874f0" : "1px solid #e0e0e0"
                  }} />
              ))}
            </div>
          )}
        </div>
        {/* Right */}
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 11, color: "#878787", fontWeight: 600, textTransform: "uppercase" }}>{product.brand}</div>
          <div style={{ fontSize: 24, fontWeight: 800, margin: "6px 0 10px" }}>{product.name}</div>
          <Rating value={product.rating} count={product.reviews} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "14px 0" }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 32, fontWeight: 900 }}>{fmt(product.price)}</span>
            <span style={{ fontSize: 14, color: "#878787", textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>
            <span style={{ fontSize: 16, color: "#388e3c", fontWeight: 700 }}>{product.discount}% off</span>
          </div>
          <div style={{ fontSize: 13, color: "#388e3c", fontWeight: 600, marginTop: 4 }}>You save {fmt(saving)}!</div>
          <div style={{ height: 1, background: "#f0f0f0", margin: "14px 0" }} />
          {/* Sizes Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "#555", textTransform: "uppercase", letterSpacing: .5 }}>
                {product.category === "electronics" ? "Select Storage / Config" :
                  product.category === "books" ? "Select Format" : "Select Size"}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {product.sizes.map(sz => (
                  <button key={sz} onClick={() => setSelectedSize(sz)}
                    style={{
                      padding: "8px 16px", borderRadius: 6,
                      border: selectedSize === sz ? "2px solid #2874f0" : "1px solid #d0d0d0",
                      background: selectedSize === sz ? "#e8f0fe" : "#fff",
                      color: selectedSize === sz ? "#2874f0" : "#212121",
                      fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all .15s"
                    }}>
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Qty */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#555" }}>Quantity</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button style={{
                width: 32, height: 32, borderRadius: "50%", border: "1px solid #c2c2c2",
                background: "#fff", cursor: "pointer", fontSize: 18, fontWeight: 700, display: "flex",
                alignItems: "center", justifyContent: "center"
              }}
                onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ width: 32, textAlign: "center", fontWeight: 700, fontSize: 16 }}>{qty}</span>
              <button style={{
                width: 32, height: 32, borderRadius: "50%", border: "1px solid #c2c2c2",
                background: "#fff", cursor: "pointer", fontSize: 18, fontWeight: 700, display: "flex",
                alignItems: "center", justifyContent: "center"
              }}
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              <span style={{ fontSize: 12, color: product.stock < 10 ? "#ff6161" : "#388e3c", fontWeight: 600 }}>
                {product.stock < 10 ? `Only ${product.stock} left!` : "In Stock ✓"}
              </span>
            </div>
          </div>
          {/* Buy buttons */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button onClick={handleAddToCart} style={{
              flex: 1, background: "#ff9f00", color: "#fff", border: "none", borderRadius: 4,
              padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer"
            }}>🛒 Add to Cart</button>
            <button onClick={handleBuy} style={{
              flex: 1, background: "#fb641b", color: "#fff", border: "none", borderRadius: 4,
              padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer"
            }}>⚡ Buy Now</button>
          </div>
          {/* Delivery Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {[
              ["🚚", "Free Delivery", `By ${new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}`],
              ["🔄", "10-Day Easy Returns", "Change of mind accepted"],
              ["🛡️", "1 Year Warranty", "Manufacturer warranty included"],
            ].map(([i, h, s]) => (
              <div key={h} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18 }}>{i}</span>
                <div><div style={{ fontWeight: 600, fontSize: 13 }}>{h}</div><div style={{ fontSize: 12, color: "#878787" }}>{s}</div></div>
              </div>
            ))}
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #f0f0f0", marginBottom: 14 }}>
            {[["desc", "Description"], ["spec", "Specifications"], ["reviews", "Reviews"]].map(([v, l]) => (
              <button key={v} onClick={() => setTab(v)}
                style={{
                  padding: "9px 18px", border: "none", background: "none", fontWeight: 600, fontSize: 13,
                  cursor: "pointer", color: tab === v ? "#2874f0" : "#666",
                  borderBottom: tab === v ? "2px solid #2874f0" : "2px solid transparent"
                }}>
                {l}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>
            {tab === "desc" && <p>{product.description}. Premium quality from {product.brand}, designed for the modern lifestyle. Engineered for durability and everyday excellence.</p>}
            {tab === "spec" && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[["Brand", product.brand], ["Model", product.name.substring(0, 30)],
                  ["Category", CATEGORIES.find(c => c.id === product.category)?.name],
                  ["In Stock", product.stock + " units"], ["Rating", `${product.rating} / 5.0`],
                  ["Discount", `${product.discount}%`]].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "8px 12px", color: "#878787", width: "40%", fontSize: 13 }}>{k}</td>
                      <td style={{ padding: "8px 12px", fontWeight: 600, fontSize: 13 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === "reviews" && (
              <div>
                {[{ u: "Rahul S.", r: 5, c: "Absolutely love this product! Worth every rupee. Fast delivery and great packaging." },
                { u: "Priya M.", r: 4, c: "Good quality, matches description perfectly. Will definitely buy again." },
                { u: "Amit K.", r: 5, c: "Best purchase this year! Highly recommend to everyone. 10/10!" }].map((rv, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #f5f5f5", paddingBottom: 12, marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ background: "#388e3c", color: "#fff", borderRadius: 3, padding: "2px 7px", fontSize: 11, fontWeight: 700 }}>{rv.r} ★</span>
                      <strong style={{ fontSize: 13 }}>{rv.u}</strong>
                      <span style={{ fontSize: 11, color: "#878787" }}>✅ Verified Purchase</span>
                    </div>
                    <div>{rv.c}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Similar */}
      {similar.length > 0 && (
        <div style={{ padding: "0 16px 20px" }}>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Similar Products</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>
            {similar.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
      <SizeSelectionModal open={sizeModalOpen} product={product} onClose={() => { setSizeModalOpen(false); setSizeAction(null); }} onConfirm={confirmSizeSelection} />
    </div>
  );
}
