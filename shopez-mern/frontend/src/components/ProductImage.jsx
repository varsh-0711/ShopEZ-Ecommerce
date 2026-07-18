import { useState } from "react";

export default function ProductImage({ product, height = 140, emojiSize = 56 }) {
  const [failed, setFailed] = useState(false);
  if (!product.img || failed) {
    return (
      <div style={{
        fontSize: emojiSize, textAlign: "center", padding: `${(height - emojiSize) / 2}px 0`,
        background: "#f7f7f7", borderRadius: 6, height
      }}>
        {product.image}
      </div>
    );
  }
  return (
    <div style={{ height, borderRadius: 6, overflow: "hidden", background: "#f7f7f7" }}>
      <img src={product.img} alt={product.name} loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}
