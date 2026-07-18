import api from "./axiosClient";
import { normalizeProduct } from "./productApi";

export const fetchAdminOverview = async () => {
  const { data } = await api.get("/admin/overview");
  return data;
};

export const fetchAdminOrders = async () => {
  const { data } = await api.get("/admin/orders");
  return data.orders;
};

export const updateOrderStatusApi = async (orderId, status) => {
  const { data } = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return data.order;
};

export const fetchAdminUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data.users;
};

export const fetchAdminAnalytics = async () => {
  const { data } = await api.get("/admin/analytics");
  return data;
};

export const adminCreateProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return normalizeProduct(data.product);
};

export const adminDeleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};
