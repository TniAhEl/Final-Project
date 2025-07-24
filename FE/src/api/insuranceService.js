import { api } from "./axios.js";

// Lấy danh sách hợp đồng bảo hiểm của khách hàng
export async function fetchCustomerInsurances(userId, page = 0, size = 10, filter = {}) {
  const params = { ...filter, page, size };
  // Nếu cần truyền userId, thêm vào params hoặc headers tuỳ backend
  const response = await api.post(`/insurances/customer/filter?page=${page}&size=${size}`, filter);
  return response.data;
}

// Lấy tất cả các gói bảo hiểm (trả về object { message, data })
export const getAllInsurances = async () => {
  const res = await api.get("/insurances/all");
  return res.data; // trả về { message, data }
};