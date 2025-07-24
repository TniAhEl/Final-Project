import { api } from "./axios.js";

// Lấy danh sách đơn hàng với filter, page, size
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

// Lấy danh sách đơn hàng của customer
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

// Get all promotions
export const getAllPromotion = async (data) => {
  const res = await api.get("/promotions/all", data);
  return res.data;
};

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

// export const addReview = async({})

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

export const replyProductReview = async ({ reviewId, adminId, reply }) => {
  const params = [];
  if (reviewId) params.push(`reviewId=${encodeURIComponent(reviewId)}`);
  if (adminId) params.push(`adminId=${encodeURIComponent(adminId)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return await api.post(`/orders/order/product/review/reply${query}`, {
    reply,
  });
};

export const getProductReviews = async (productId) => {
  const res = await api.get(`/products/${productId}/review/all`);
  return res.data;
};

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

// Lấy danh sách bảo hành của customer
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
