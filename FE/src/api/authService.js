import { api } from "./axios.js";


// user register
export const registerCustomer = async (data) => {
  const res = await api.post("/auth/register/user", data);
  return res.data;
};

// admin register
export const registerAdmin = async (data) => {
  const res = await api.post("/auth/register/admin", data);
  return res.data;
};

// user and admin login
export const login = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
};

// user get the profile information
export const getInformation = async (userId) => {
  const res = await api.get(`/auth/information?userId=${userId}`);
  return res.data;
};

// user update the profile information
export const updateInformation = async (userId, data) => {
  const res = await api.put(`/auth/update/information?userId=${userId}`, data);
  return res.data;
};

// admin get all user information
export const getAllUsersAdmin = async (page = 0, size = 10, status) => {
  const body = status ? { UserFilter: { status } } : { UserFilter: {} };
  const res = await api.post(`/auth/admin/get/user?page=${page}&size=${size}`, body);
  return res.data;
};

// user get report summary
export const getCustomerReport = async (userId) => {
  const res = await api.post(`/auth/customer/reports/summary?userId=${userId}`);
  return res.data;
};

// user get year summary
export const getCustomerReportByYear = async (userId, year, page = 0, size = 12) => {
  const res = await api.post(`/auth/customer/reports/filter?userId=${userId}&page=${page}&size=${size}`, { year });
  return res.data;
};

// admin get year report
export const getAdminReportByYear = async (userId, year, page = 0, size = 12) => {
  const res = await api.post(`/auth/admin/reports/filter?userId=${userId}&page=${page}&size=${size}`, { year });
  return res.data;
};

export const getAdminReportSummary = async () => {
  const res = await api.post("/auth/admin/reports/summary");
  return res.data;
};

// Get receiver information for customer
export const getCustomerReceivers = async (userId) => {
  const res = await api.get(`/auth/customer/${userId}/receiver`);
  return res.data;
};
// Add new receiver information for customer
export const addCustomerReceiver = async (userId, receiverData) => {
  const res = await api.post(`/auth/customer/add/receiver?userId=${userId}`, receiverData);
  return res.data;
};

// Update receiver information for customer
export const updateCustomerReceiver = async (receiverId, receiverData) => {
  const res = await api.post(`/auth/customer/update/receiver?receiverId=${receiverId}`, receiverData);
  return res.data;
};
