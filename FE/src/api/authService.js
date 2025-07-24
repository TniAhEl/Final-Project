import { api } from "./axios.js";

export const registerCustomer = async (data) => {
  const res = await api.post("/auth/register/user", data);
  return res.data;
};

export const registerAdmin = async (data) => {
  const res = await api.post("/auth/register/admin", data);
  return res.data;
};

export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
};

// /auth/information?userId=1
export const getInformation = async (userId) => {
  const res = await api.get(`/auth/information?userId=${userId}`);
  return res.data;
};

// /auth/update/information?userId=1
export const updateInformation = async (userId, data) => {
  const res = await api.put(`/auth/update/information?userId=${userId}`, data);
  return res.data;
};
