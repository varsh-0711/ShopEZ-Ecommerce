import api from "./axiosClient";

// Backend order: { orderNumber, items, subtotal, shipping, savings, total,
//   address, paymentMethod, paymentDetails, status, trackingMessage, createdAt, _id }
// UI (ported from the original app) expects: { id, items, total, status,
//   trackingMessage, date, address, payment }
const normalizeOrder = (o) => ({
  ...o,
  id: o.orderNumber,
  date: new Date(o.createdAt).toLocaleDateString("en-IN"),
  payment: o.paymentDetails,
  items: o.items.map((it) => ({
    ...it,
    id: it.product,
    cartId: `${it.product}-${it.selectedSize || ""}`,
  })),
});

export const placeOrderApi = async (payload) => {
  const { data } = await api.post("/orders", payload);
  return normalizeOrder(data.order);
};

export const fetchMyOrders = async () => {
  const { data } = await api.get("/orders");
  return data.orders.map(normalizeOrder);
};

export const advanceTrackingApi = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/track`);
  return normalizeOrder(data.order);
};

export const cancelOrderApi = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/cancel`);
  return normalizeOrder(data.order);
};
