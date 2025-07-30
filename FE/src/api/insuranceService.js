import { api } from "./axios.js";

// get customer insurance by user id
export async function fetchCustomerInsurances(userId, page = 0, size = 10, filter = {}) {
  const params = { ...filter, page, size };
  const response = await api.post(`/insurances/customer/filter?page=${page}&size=${size}`, filter);
  return response.data;
}

// get all insurances
export const getAllInsurances = async () => {
  const res = await api.get("/insurances/all");
  return res.data; 
};