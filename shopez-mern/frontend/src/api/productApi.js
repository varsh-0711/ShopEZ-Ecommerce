import api from "./axiosClient";

// Backend documents use Mongo's `_id`; the UI (ported from the original
// mock-data app) expects a plain `id` field, so we normalize on the way in.
export const normalizeProduct = (p) => (p ? { ...p, id: p._id || p.id } : p);

export const fetchProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return {
    ...data,
    products: data.products.map(normalizeProduct),
  };
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return normalizeProduct(data.product);
};

export const fetchCategories = async () => {
  const { data } = await api.get("/products/meta/categories");
  return data.categories;
};

// Admin only
export const createProduct = async (payload) => {
  const { data } = await api.post("/products", payload);
  return normalizeProduct(data.product);
};

export const updateProduct = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return normalizeProduct(data.product);
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};
