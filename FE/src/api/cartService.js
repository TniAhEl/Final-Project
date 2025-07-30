import { api } from "./axios.js";

// Cart Service
// add product to cart
export const addProductToCart = async (
  userId,
  { productOptionId, quantity }
) => {
  const res = await api.post(
    `/cart/add?userId=${userId}&productOptionId=${productOptionId}&quantity=${quantity}`
  );
  return res.data;
};

// update product quantity
export const updateProductQuantity = async (
  userId,
  { productOptionId, quantity }
) => {
  const res = await api.put(
    `/cart/update?userId=${userId}&productOptionId=${productOptionId}&quantity=${quantity}`
  );
  return res.data;
};

//clear cart
export const clearCart = async (id) => {
  const res = await api.post(`/carts/${id}/clear`);
  return res.data;
};
// delete cart with user id
export const deleteCartProduct = async (userId, productOptionId) => {
  const res = await api.delete(
    `/cart/delete?userId=${userId}&productOptionId=${productOptionId}`
  );
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
