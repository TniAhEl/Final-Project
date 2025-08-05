import { api } from "./axios.js";

// Upload image for a product
export const uploadProductImage = async (file, productId) => {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("productId", productId);

  try {
    const res = await api.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    // Log lỗi chi tiết để debug
    if (err.response) {
      console.error("Upload error response:", err.response);
      throw new Error(err.response.data?.message || "Upload failed");
    }
    throw err;
  }
};

// Get images by productId (GET /api/v1/images/{productId})
export const getProductImages = async (productId) => {
  try {
    const res = await api.get(`/images/product/${productId}`);
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error("Get image error response:", err.response);
      throw new Error(err.response.data?.message || "Get image failed");
    }
    throw err;
  }
};

// Delete images by productId (DELETE /api/v1/images/{productId})
export const deleteProductImages = async (productId) => {
  const res = await api.delete(`/images/${productId}`);
  return res.data;
};

// Update image by imageId (PUT /api/v1/images/{imageId}/update?file)
export const updateProductImage = async (productId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.put(`/images/${productId}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

