import { api } from "./axios.js";

// Cart



// add product to cart
export const addProductToCart = async (userId, { productOptionId, quantity }) => {
  // Đúng endpoint và truyền tham số lên query string
  const res = await api.post(`/cart/add?userId=${userId}&productOptionId=${productOptionId}&quantity=${quantity}`);
  return res.data;
};

//clear cart
export const clearCart = async (id) => {
  const res = await api.post(`/carts/${id}/clear`);
  return res.data;
};

// get total price

export const getTotalPrice = async (id) => {
  const res = await api.get(`carts/${id}/get/total-price`);
  return res.data;
};

// get cart by userId
export const getCartByUserId = async (userId) => {
  const res = await api.get(`/cart/my-cart/${userId}`);
  return res.data;
};
