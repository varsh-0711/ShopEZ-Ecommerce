import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import ProductImage from "../components/ProductImage";
import { fmt } from "../utils/format";

export default function OrdersPage() {
  const { orders, navigate, refreshOrders, trackOrder, cancelOrder } = useApp();
  const statuses = ["confirmed", "processing", "shipped", "delivered"];

  useEffect(() => { refreshOrders(); }, [refreshOrders]);

  if (orders.length === 0) return (
    <div style={{ textAlign: "center", padding: 80, background: "#fff", margin: 16, borderRadius: 8 }}>
      <div style={{ fontSize: 80 }}>📦</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 16 }}>No orders yet!</div>
      <button style={{
        marginTop: 24, background: "#ff9f00", color: "#fff", border: "none", borderRadius: 4,
        padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer"
      }}
        onClick={() => navigate("home")}>Start Shopping</button>
    </div>
  );
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>My Orders ({orders.length})</div>
      {orders.map(order => {
        const si = order.status === "cancelled" ? -1 : statuses.indexOf(order.status);
        return (
          <div key={order._id} style={{ background: "#fff", borderRadius: 8, padding: 20, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Order #{order.id}</div>
                <div style={{ fontSize: 12, color: "#878787", marginTop: 3 }}>Placed on {order.date}</div>
                {order.address && (
                  <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
                    <strong>Delivery Address:</strong> {order.address}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{fmt(order.total)}</div>
                <div style={{ fontSize: 12, color: "#2874f0", fontWeight: 700, marginTop: 4, background: "#e8f0fe", padding: "2px 8px", borderRadius: 4, display: "inline-block" }}>{order.payment}</div>
              </div>
            </div>
            {order.items.map(item => (
              <div key={item.cartId} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: "1px solid #f5f5f5", alignItems: "center" }}>
                <div style={{ width: 48, minWidth: 48 }}><ProductImage product={item} height={48} emojiSize={26} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                  {item.selectedSize && (
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                      Option: <span style={{ fontWeight: 600, color: "#2874f0" }}>{item.selectedSize}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "#878787", marginTop: 3 }}>Qty: {item.qty} × {fmt(item.price)}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{fmt(item.price * item.qty)}</div>
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: 13, color: order.status === "cancelled" ? "#d32f2f" : "#388e3c", fontWeight: 700 }}>
              {order.status === "cancelled" ? "Order cancelled" : order.trackingMessage || "Tracking is being updated"}
            </div>
            {order.status !== "cancelled" && (
              <div style={{ marginTop: 18, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {statuses.map((s, i) => (
                    <div key={s} style={{ display: "contents" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 80 }}>
                        <div style={{
                          width: i === si ? 20 : 14, height: i === si ? 20 : 14, borderRadius: "50%",
                          background: i <= si ? "#2874f0" : "#e0e0e0",
                          border: i === si ? "3px solid #90caf9" : "none",
                          transition: "all .3s"
                        }} />
                        <div style={{
                          fontSize: 10, color: i <= si ? "#2874f0" : "#878787",
                          fontWeight: i === si ? 700 : 400, textTransform: "capitalize", textAlign: "center"
                        }}>
                          {s}
                        </div>
                      </div>
                      {i < statuses.length - 1 && (
                        <div style={{
                          flex: 1, height: 3, background: i < si ? "#2874f0" : "#e0e0e0",
                          marginTop: 5, transition: "background .3s", borderRadius: 2
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <button onClick={() => trackOrder(order._id)} style={{
                background: "#fff", color: "#2874f0", border: "1px solid #2874f0",
                borderRadius: 4, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer"
              }}>Track Order</button>
              <button style={{
                background: "#fff", color: "#2874f0", border: "1px solid #2874f0",
                borderRadius: 4, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer"
              }}>Download Invoice</button>
              {order.status !== "delivered" && order.status !== "cancelled" &&
                <button onClick={() => cancelOrder(order._id)} style={{
                  background: "#fff", color: "#ff6161", border: "1px solid #ff6161",
                  borderRadius: 4, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer"
                }}>Cancel Order</button>}
              {order.status === "delivered" &&
                <button style={{
                  background: "#2874f0", color: "#fff", border: "none",
                  borderRadius: 4, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer"
                }}>Write Review</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
