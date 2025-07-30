import { api } from "./axios.js";

// Filter the orders for admin
export const fetchOrders = async (filter = {}, page = 0, size = 20) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    `/orders/filter?page=${page}&size=${size}`,
    filter,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Filter the order for user
export const fetchCustomerOrders = async (userId, page = 0, size = 20) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    `/orders/customer?userId=${userId}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get user order by id
export const getOrderById = async (orderId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/orders/customer/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get all promotions
export const getAllPromotion = async (data) => {
  const res = await api.get("/promotions/all", data);
  return res.data;
};

// user place order
export const placeOrder = async ({ userId, promotionCode, orderInfo, insuranceContracts }) => {
  const params = [];
  if (userId) params.push(`userId=${encodeURIComponent(userId)}`);
  if (promotionCode) params.push(`promotionCode=${encodeURIComponent(promotionCode)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  const res = await api.post(`/orders/order${query}`, {
    orderInfo,
    insuranceContracts
  });
  return res;
};

// Place order for guest users
export const placeGuestOrder = async ({ promotionCode, orderInfo, insuranceContracts, productList }) => {
  const params = [];
  if (promotionCode) params.push(`promotionCode=${encodeURIComponent(promotionCode)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  const res = await api.post(`/orders/guest/order${query}`, {
    orderInfo,
    insuranceContracts,
    productList
  });
  return res;
};

// export const addReview = async({})
// user create review for product
export const submitProductReview = async ({
  orderProductId,
  userId,
  rating,
  review,
}) => {
  const params = [];
  if (orderProductId)
    params.push(`orderProductId=${encodeURIComponent(orderProductId)}`);
  if (userId) params.push(`userId=${encodeURIComponent(userId)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return await api.post(`/orders/order/product/review${query}`, {
    rating,
    review,
  });
};
// admin reply user review
export const replyProductReview = async ({ reviewId, adminId, reply }) => {
  const params = [];
  if (reviewId) params.push(`reviewId=${encodeURIComponent(reviewId)}`);
  if (adminId) params.push(`adminId=${encodeURIComponent(adminId)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return await api.post(`/orders/order/product/review/reply${query}`, {
    reply,
  });
};
// get all product review include admin reply
export const getProductReviews = async (productId) => {
  const res = await api.get(`/products/${productId}/review/all`);
  return res.data;
};

// admin get all product reviews
export const getAllProductReviews = async ({
  page = 0,
  size = 10,
  rating,
  status,
}) => {
  const params = [];
  params.push(`page=${page}`);
  params.push(`size=${size}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  const body = {};
  if (rating !== undefined) body.rating = rating;
  if (status !== undefined) body.status = status;
  const res = await api.post(`/products/all/review${query}`, body);
  return res.data;
};


// admin confirm the orders
export const confirmOrder = async ({ orderId, status }) => {
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("userId");
  if (!adminId || isNaN(Number(adminId))) {
    throw new Error("adminId không hợp lệ!");
  }
  const adminIdLong = Number(adminId);
  const res = await api.put(
    `/orders/confirm?adminId=${adminIdLong}&orderId=${orderId}&status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// User update user order status
export const updateCustomerOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("token");
  const response = await api.put(
    `/orders/customer/update?orderId=${orderId}&status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// admin update user orders
export const updateAdminOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("userId");
  const response = await api.put(
    `/orders/admin/update?adminId=${adminId}&orderId=${orderId}&status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// user get all warranties 
export const fetchCustomerWarranties = async (
  userId,
  page = 0,
  size = 10,
  filter = {}
) => {
  const token = localStorage.getItem("token");
  const body = { userId, ...filter };
  const res = await api.post(
    `/warranties/customer/filter?page=${page}&size=${size}`,
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
