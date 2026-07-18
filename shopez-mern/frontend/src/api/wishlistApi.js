import api from "./axiosClient";
import { normalizeProduct } from "./productApi";

export const fetchWishlist = async () => {
  const { data } = await api.get("/wishlist");
  return data.wishlist.map(normalizeProduct);
};

// Toggles the product in/out of the wishlist, returns the updated list
export const toggleWishlistApi = async (productId) => {
  const { data } = await api.post(`/wishlist/${productId}`);
  return { wishlist: data.wishlist.map(normalizeProduct), added: data.added };
};

export const removeFromWishlistApi = async (productId) => {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data.wishlist.map(normalizeProduct);
};
