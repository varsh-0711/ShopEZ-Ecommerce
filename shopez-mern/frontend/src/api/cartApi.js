import api from "./axiosClient";
import { normalizeProduct } from "./productApi";

// Backend cart items look like: { product: {...}, selectedSize, qty }
// The UI (ported from the original app) expects each cart item to be a
// flat object: { ...productFields, id, qty, selectedSize, cartId }
const normalizeCartItem = (item) => {
  const product = normalizeProduct(item.product);
  const selectedSize = item.selectedSize || "";
  return {
    ...product,
    qty: item.qty,
    selectedSize,
    cartId: `${product.id}-${selectedSize}`,
  };
};

const normalizeCart = (cart) => cart.map(normalizeCartItem);

export const fetchCart = async () => {
  const { data } = await api.get("/cart");
  return normalizeCart(data.cart);
};

export const addToCartApi = async (productId, selectedSize = "", qty = 1) => {
  const { data } = await api.post("/cart", { productId, selectedSize, qty });
  return normalizeCart(data.cart);
};

export const updateCartItemApi = async (productId, selectedSize, qty) => {
  const { data } = await api.put(`/cart/${productId}`, { selectedSize, qty });
  return normalizeCart(data.cart);
};

export const removeFromCartApi = async (productId, selectedSize = "") => {
  const { data } = await api.delete(`/cart/${productId}`, { params: { selectedSize } });
  return normalizeCart(data.cart);
};

export const clearCartApi = async () => {
  const { data } = await api.delete("/cart");
  return normalizeCart(data.cart);
};
