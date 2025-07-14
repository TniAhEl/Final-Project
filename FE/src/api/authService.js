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
