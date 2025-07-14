import { data } from "react-router-dom";
import { api } from "./axios.js";

// filter service
export const filterProducts = async (filter, page = 0, size = 12) => {
  const res = await api.post(`/products/filter?page=${page}&size=${size}`, filter);
  return res.data;
};

// get product by product id
export const getProductById = async (id) => {
  const res = await api.get(`/products/product/${id}`);
  return res.data;
};
// add new product
export const createProduct = async (data) => {
  const res = await api.post("/products/add", data);
  return res.data;
};
// update product
export const updateProduct = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};
// add product option
export const createProductOption = async (data) => {
  const res = await api.post("/products/option/add", data);
  return res.data;
};

// add serial for product option
export const createSerial = async (data) => {
  const res = await api.post("products/serial/add", data);
  return res.data;
};

// get serials by product option id
export const getSerials = async(optionId) => {
  const res = await api.get(`/products/serial/all?optionId=${optionId}`);
  return res.data;
};

// update serial
export const updateSerial = async (serialId, data) => {
  const res = await api.put(`/products/serial/update/${serialId}`, data);
  return res.data;
};

//update product option
export const updateProductOption = async (data) => {
  const res = await api.put("products/option/update", data);
  return res.data;
};


//Category
//  add new category
export const createCategory = async (data) => {
  const res = await api.post("/categories/add", data);
  return res.data;
};

//update category
export const updateCategory = async (id, data) => {
  const res = await api.put(`categories/${id}/update`, data);
  return res.data;
};

//Warranty
// add  new warranty
export const createWarranty = async (data) => {
  const res = await api.post("/warranties/add");
  return res.data;
};

//update warranty
export const updateWarranty = async (id, data) => {
  const res = await api.put(`warranties/${id}/update`);
  return res.data;
};

//Insurance
//add new insurance
export const createInsurance = async (data) => {
  const res = await api.post("/insurances/add", data);
  return res.data;
};

//update insurance
export const updateInsurance = async (id, data) => {
  const res = await api.put(`insurances/${id}/update`);
  return res.data;
};

//Store
// add new store
export const createStore = async (data) => {
  const res = await api.post("/stores/add", data);
  return res.data;
};

//update store
export const updateStore = async (data) => {
  const res = await api.put(`stores/${id}/update`);
  return res.data;
};

// add product into store
export const addProductIntoStore = async (data) => {
  const res = await api.post("/products/add/store", data);
  return res.data;
};

//Promotion
//add new promotion
export const createPromotion = async (data) => {
  const res = await api.post("/promotions/add", data);
  return res.data;
};

//update promotion
export const updatePromotion = async (id, data) => {
  const res = await api.put(`/promotions/${id}/update`, data);
  return res.data;
};

// Lấy danh sách tất cả store
export const getAllStores = async () => {
  const res = await api.get("/stores/all");
  return res.data;
};

// Lấy tất cả brand
export const getAllBrands = async () => {
  const res = await api.get('/products/brand/all');
  // Nếu trả về object có thuộc tính data là mảng
  if (res.data && Array.isArray(res.data.data)) {
    return res.data.data;
  } else if (Array.isArray(res.data)) {
    return res.data;
  } else {
    return [];
  }
};
