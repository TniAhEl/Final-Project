import { useState, useEffect, useRef } from "react";
import ProductForm from "../../Form/Product/Product.jsx";
import ProductOptionForm from "../../Form/Product/Options.jsx";
import ViewAllOptions from "../../Form/Product/ViewAllOptions.jsx";
import { filterAdminProducts, getProductById, getSerials, createSerial } from "../../../api/productService";
import {
  uploadProductImage,
  getProductImages,
  deleteProductImages,
  updateProductImage,
} from "../../../api/imageService";
import axios from "axios";
import OptionCard from "./OptionCard";
import ViewAllOptionsPopup from "./ViewAllOptionsPopup";

// Utility function to check if user is authenticated
const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage");
    return false;
  }
  return true;
};

const ProductTable = ({
  onView = () => {},
  onDelete = () => {},
  onAddProduct = () => {},
  onModifyProduct = () => {},
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [optionProduct, setOptionProduct] = useState(null);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [selectedProductForOptions, setSelectedProductForOptions] = useState(null);
  const [showSerialForm, setShowSerialForm] = useState(false);
  const [selectedOptionForSerial, setSelectedOptionForSerial] = useState(null);
  const [serialsForOption, setSerialsForOption] = useState([]);
  const [loadingSerials, setLoadingSerials] = useState(false);
  const [showSerialsModal, setShowSerialsModal] = useState(false);
  const [optionForSerials, setOptionForSerials] = useState(null);
  const [serialsPage, setSerialsPage] = useState(0);
  const [serialsTotalPages, setSerialsTotalPages] = useState(0);
  const [serialsPageSize, setSerialsPageSize] = useState(20);

  // Thêm state quản lý ảnh sản phẩm
  const [selectedProductIdForImage, setSelectedProductIdForImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [selectedImagesToDelete, setSelectedImagesToDelete] = useState([]);
  const fileInputRef = useRef(null);
  const updateInputRef = useRef(null);
  const [imageToUpdate, setImageToUpdate] = useState(null);

  // Fetch products from API
  const fetchProducts = async (page = 0, customPageSize = pageSize) => {
    try {
      // Check authentication before making API call
      if (!checkAuth()) {
        setError("Authentication required. Please login again.");
        setProducts([]);
        return;
      }

      setLoading(true);
      setError(null);

      // Default filter - get all products
      const filter = {
        // Add any specific filters here if needed
      };

      const response = await filterAdminProducts(filter, page, customPageSize);
      setProducts(response.content || response.data || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching products:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load products. Please try again.");
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication and load products on component mount
  useEffect(() => {
    const tokenInfo = getTokenInfo();

    if (checkAuth()) {
      fetchProducts();
    } else {
      setError("Authentication required. Please login again.");
      setLoading(false);
    }
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchProducts(newPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    fetchProducts(0, newSize);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleModifyProduct = async (product) => {
    try {
      // Call API to get product detail
      const productInfo = await getProductById(product.id || product.productId);
      const productDetail = productInfo.data;
      // Convert product data to form format
      const formData = {
        productName: productDetail.name || "",
        description: productDetail.description || "",
        brand: productDetail.brand || "",
        status: productDetail.productStatus || "DRAFT",
        createAt: productDetail.createAt || "",
        updateAt: productDetail.updateAt || "",
        categoryId: productDetail.category?.id?.toString() || "",
        warrantyId: productDetail.warranty?.id?.toString() || "",
        os: productDetail.os || "",
        cpu: productDetail.cpu || "",
        cpuSpeed: productDetail.cpuSpeed !== undefined && productDetail.cpuSpeed !== null ? productDetail.cpuSpeed.toString() : "",
        gpu: productDetail.gpu || "",
        batteryCapacity: productDetail.batteryCapacity !== undefined && productDetail.batteryCapacity !== null ? productDetail.batteryCapacity.toString() : "",
        batteryType: productDetail.batteryType || "",
        chargeSupport: productDetail.chargeSupport || "",
        batteryTech: productDetail.batteryTech || "",
        screenDimension: productDetail.screenDimension || "",
        flash: productDetail.flash === true ? "true" : productDetail.flash === false ? "false" : "",
        frontCamera: productDetail.frontCamera || "",
        backCamera: productDetail.backCamera || "",
        screenTouch: productDetail.screenTouch || "",
        screenTech: productDetail.screenTech || "",
        screenResolution: productDetail.screenResolution || "",
        maxBrightness: productDetail.maxBrightness || "",
        backCameraTech: productDetail.backCameraTech || "",
        backCameraRecord: productDetail.backCameraRecord || "",
        mobileNetwork: productDetail.mobileNetwork || "",
        bluetooth: productDetail.bluetooth || "",
        sim: productDetail.sim || "Dual SIM",
        wifi: productDetail.wifi || "",
        gps: productDetail.gps || "",
        chargePort: productDetail.chargePort || "",
        earphonePort: productDetail.earphonePort || "",
        anotherPort: productDetail.anotherPort || "",
        design: productDetail.design || "",
        material: productDetail.material || "",
        dimension: productDetail.dimension || "",
        releaseYear: productDetail.releaseYear || "",
        musicUtil: productDetail.musicUtil || "",
        movieUtil: productDetail.movieUtil || "",
        recordUtil: productDetail.recordUtil || "",
        resistanceUtil: productDetail.resistanceUtil || "",
        specialUtil: productDetail.specialUtil || "",
        advancedUtil: productDetail.advancedUtil || "",
      };
      setEditingProduct({ ...productDetail, formData });
      setIsEditing(true);
      setShowForm(true);
    } catch (error) {
      alert("Failed to fetch product details!");
      console.error(error);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      // Refresh the product list after deletion
      fetchProducts(currentPage);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setIsEditing(false);
  };

  const handleFormSubmit = (formData) => {
    if (isEditing && editingProduct) {
      // Handle modify product
      onModifyProduct({ ...editingProduct, ...formData });
    } else {
      onAddProduct(formData);
    }
    setShowForm(false);
    setEditingProduct(null);
    setIsEditing(false);
    // Refresh the product list after adding/modifying
    fetchProducts(currentPage);
  };

  const handleAddOption = (product) => {
    setOptionProduct(product);
    setShowOptionForm(true);
  };

  const handleCloseOptionForm = () => {
    setShowOptionForm(false);
    setOptionProduct(null);
  };

  const handleSubmitOption = async (optionData) => {
    try {
      // Show loading notification
      const loadingNotification = document.createElement('div');
      loadingNotification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      loadingNotification.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span class="font-medium">Adding product option...</span>
        </div>
      `;
      document.body.appendChild(loadingNotification);
      
      // Animate in loading notification
      setTimeout(() => {
        loadingNotification.classList.remove('translate-x-full');
      }, 100);
      
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove loading notification
      loadingNotification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(loadingNotification);
      }, 300);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">Product option added successfully!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
      
      // Handle saving option for product optionProduct
      setShowOptionForm(false);
      setOptionProduct(null);
    } catch (error) {
      console.error("Error adding option:", error);
      
      // Remove loading notification if it exists
      const existingLoading = document.querySelector('.fixed.top-4.right-4.bg-blue-500');
      if (existingLoading) {
        existingLoading.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(existingLoading)) {
            document.body.removeChild(existingLoading);
          }
        }, 300);
      }
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span class="font-medium">Failed to add product option!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remove after 4 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 4000);
    }
  };

  // Handle updating product option
  const handleUpdateOption = async (optionData) => {
    try {
      // Show loading notification
      const loadingNotification = document.createElement('div');
      loadingNotification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      loadingNotification.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span class="font-medium">Updating product option...</span>
        </div>
      `;
      document.body.appendChild(loadingNotification);
      
      // Animate in loading notification
      setTimeout(() => {
        loadingNotification.classList.remove('translate-x-full');
      }, 100);
      
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove loading notification
      loadingNotification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(loadingNotification);
      }, 300);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">Product option updated successfully!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
      
      // Handle updating option
      console.log("Updated option data:", optionData);
    } catch (error) {
      console.error("Error updating option:", error);
      
      // Remove loading notification if it exists
      const existingLoading = document.querySelector('.fixed.top-4.right-4.bg-blue-500');
      if (existingLoading) {
        existingLoading.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(existingLoading)) {
            document.body.removeChild(existingLoading);
          }
        }, 300);
      }
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span class="font-medium">Failed to update product option!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remove after 4 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 4000);
    }
  };

  const handleViewAllOptions = (product) => {
    setSelectedProductForOptions(product);
    setShowAllOptions(true);
  };

  const handleCloseAllOptions = () => {
    setShowAllOptions(false);
    setSelectedProductForOptions(null);
  };

  const handleAddSerial = (option) => {
    setSelectedOptionForSerial(option);
    setShowSerialForm(true);
  };

  const handleCloseSerialForm = () => {
    setShowSerialForm(false);
    setSelectedOptionForSerial(null);
  };

  const handleSubmitSerial = async (serialData) => {
    try {
      // Show loading notification
      const loadingNotification = document.createElement('div');
      loadingNotification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      loadingNotification.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span class="font-medium">Adding serial number...</span>
        </div>
      `;
      document.body.appendChild(loadingNotification);
      
      // Animate in loading notification
      setTimeout(() => {
        loadingNotification.classList.remove('translate-x-full');
      }, 100);
      
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove loading notification
      loadingNotification.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(loadingNotification);
      }, 300);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="font-medium">Serial number added successfully!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
      
      // Refresh the product list after adding serial
      fetchProducts(currentPage);
    } catch (error) {
      console.error("Error adding serial:", error);
      
      // Remove loading notification if it exists
      const existingLoading = document.querySelector('.fixed.top-4.right-4.bg-blue-500');
      if (existingLoading) {
        existingLoading.classList.add('translate-x-full');
        setTimeout(() => {
          if (document.body.contains(existingLoading)) {
            document.body.removeChild(existingLoading);
          }
        }, 300);
      }
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span class="font-medium">Failed to add serial number!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      
      // Remove after 4 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 4000);
    }
  };

  // Handle view serials for a specific option with pagination
  const handleViewSerials = async (option, page = 0, size = serialsPageSize) => {
    setLoadingSerials(true);
    setOptionForSerials(option);
    setShowSerialsModal(true);
    try {
      const res = await getSerials(option.id, page, size);
      setSerialsForOption(res.data.content || res.data.data || []);
      setSerialsPage(res.data.number || 0);
      setSerialsTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setSerialsForOption([]);
      setSerialsPage(0);
      setSerialsTotalPages(1);
    } finally {
      setLoadingSerials(false);
    }
  };

  const handleSerialsPageChange = (newPage) => {
    if (
      selectedOption &&
      newPage >= 0 &&
      newPage < serialsTotalPages
    ) {
      setSerialsPage(newPage); // cập nhật page hiện tại
      handleViewSerials(selectedOption, newPage);
    }
  };

  const handleImageManageClick = async (productId) => {
    setSelectedProductIdForImage(productId);
    setImageLoading(true);
    setImageError("");
    setImages([]);
    setSelectedImagesToDelete([]);
    setImageToUpdate(null);

    try {
      const res = await getProductImages(productId);
      // res.data là mảng ảnh
      if (res && Array.isArray(res.data)) {
        setImages(res.data);
      } else {
        setImages([]);
      }
    } catch (err) {
      setImages([]);
      setImageError("Failed to fetch image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedProductIdForImage) return;
    setImageLoading(true);
    setImageError("");
    try {
      await uploadProductImage(file, selectedProductIdForImage);
      // Sau khi upload, reload lại ảnh
      const res = await getProductImages(selectedProductIdForImage);
      if (res && Array.isArray(res.data)) {
        setImages(res.data);
      } else {
        setImages([]);
      }
    } catch (err) {
      setImageError("Upload failed");
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteSelectedImages = async () => {
    if (!selectedProductIdForImage || images.length === 0) return;
    setImageLoading(true);
    setImageError("");
    try {
      // Xóa ảnh đầu tiên (vì chỉ có 1 ảnh cho mỗi sản phẩm)
      await deleteProductImages(images[0].id || images[0].imageId);
      // Sau khi xóa, reload lại ảnh
      const res = await getProductImages(selectedProductIdForImage);
      if (res && res.data) {
        setImages([res.data]);
      } else {
        setImages([]);
      }
      setSelectedImagesToDelete([]);
    } catch {
      setImageError("Delete failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleSelectImageToDelete = (imageId) => {
    setSelectedImagesToDelete((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    );
  };

  const handleSelectImageToUpdate = (imageId) => {
    setImageToUpdate((prev) => (prev === imageId ? null : imageId));
  };

  const handleUpdateImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !imageToUpdate) return;
    setImageLoading(true);
    setImageError("");
    try {
      await updateProductImage(imageToUpdate, file);
      // Sau khi update, reload lại ảnh
      const res = await getProductImages(selectedProductIdForImage);
      if (res && res.data) {
        setImages([res.data]);
      } else {
        setImages([]);
      }
      setImageToUpdate(null);
    } catch {
      setImageError("Update failed");
    } finally {
      setImageLoading(false);
      if (updateInputRef.current) updateInputRef.current.value = "";
    }
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  // Xóa đoạn return sớm khi error, chỉ hiển thị error ở phần bảng

  return (
    <div className="w-full relative">
      {/* Header with Add Button & Page Size Select */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Product Management
        </h2>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-700">Rows per page:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <button
            onClick={handleAddNewProduct}
            className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Product
          </button>
        </div>
      </div>
      {/* Main Content */}
      {showForm ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] py-8">
          <div className="bg-white rounded-lg max-w-6xl w-full shadow-lg border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? "Modify Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <ProductForm
                onSubmit={handleFormSubmit}
                onCancel={handleCloseForm}
                initialData={editingProduct?.formData}
                isEditing={isEditing}
                productId={editingProduct?.id || editingProduct?.productId}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Product Table or Error/Empty State */}
          <div className="rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto'] shadow-sm">
            <div className="divide-y divide-slate-300">
              {/* Header */}
              <div className="grid grid-cols-10 bg-neutral-50 text-xs">
                <div className="p-1 text-slate-800/90 font-semibold">ID</div>
                <div className="p-2 text-slate-800/90 font-semibold">Name</div>
                <div className="p-2 text-slate-800/90 font-semibold">Category</div>
                <div className="p-2 text-slate-800/90 font-semibold">Price</div>
                <div className="p-2 text-slate-800/90 font-semibold">Stock</div>
                <div className="p-2 text-slate-800/90 font-semibold">Status</div>
                <div className="p-2 text-slate-800/90 font-semibold">Brand</div>
                <div className="p-2 text-slate-800/90 font-semibold">Year</div>
                <div className="p-2 text-slate-800/90 font-semibold">Actions</div>
              </div>
              {/* Rows */}
              {error ? (
                <div className="col-span-10 text-center py-12">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading products
                  </h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={() => fetchProducts()}
                    className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 && !loading ? (
                <div className="col-span-10 text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Get started by adding your first product.
                  </p>
                  <button
                    onClick={handleAddNewProduct}
                    className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
                  >
                    Add Your First Product
                  </button>
                </div>
              ) : (
                products.map((product, idx) => (
                  <div
                    key={product.id || product.productId || idx}
                    className="grid grid-cols-10 bg-white hover:bg-blue-50/50 transition-colors text-xs min-h-[28px]"
                  >
                    {/* ID */}
                    <div className="p-1 text-zinc-800 font-normal border-r border-slate-300">
                      {product.id || product.productId || `P${String(idx + 1).padStart(3, "0")}`}
                    </div>
                    {/* Name */}
                    <div className="p-2 text-zinc-800 font-medium border-r border-slate-300">
                      {product.name || "N/A"}
                    </div>
                    {/* Category */}
                    <div className="p-2 border-r border-slate-300">
                      <div className="flex gap-1 flex-wrap">
                        {product.category?.name ? (
                          <span className="px-1.5 py-0.5 bg-emerald-100 rounded text-neutral-800 text-xs font-medium">
                            {product.category.name}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-gray-100 rounded text-neutral-800 text-xs font-medium">
                            N/A
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Option: Price & Stock */}
                    <div className="p-2 font-semibold text-blue-700 border-r border-slate-300">
                      {product.option && product.option.length > 0 ? (
                        <div className="text-xs">
                          <div className="font-medium">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.option[0].price || 0)}
                          </div>
                          <div className="text-gray-500">
                            Stock: {product.option[0].remainingQuantity ?? "N/A"}
                          </div>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    {/* Screen Dimension */}
                    <div className="p-2 border-r border-slate-300">
                      {product.screenDimension || "N/A"}
                    </div>
                    {/* Status */}
                    <div className="p-2 border-r border-slate-300">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        product.productStatus === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : product.productStatus === "INACTIVE"
                          ? "bg-gray-100 text-gray-800"
                          : product.productStatus === "DRAFT"
                          ? "bg-yellow-100 text-yellow-800"
                          : product.productStatus === "OUT_OF_STOCK"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {product.productStatus || "N/A"}
                      </span>
                    </div>
                    {/* Brand */}
                    <div className="p-2 border-r border-slate-300">
                      <div className="text-xs text-gray-600 font-medium">
                        {product.brand || "N/A"}
                      </div>
                    </div>
                    {/* Release Year */}
                    <div className="p-2 border-r border-slate-300">
                      <div className="text-xs text-gray-600 font-medium">
                        {product.releaseYear || "N/A"}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="p-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleModifyProduct(product)}
                          className="px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium transition-colors"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleAddOption(product)}
                          className="px-2 py-0.5 rounded bg-purple-500 text-white hover:bg-purple-600 text-xs font-medium transition-colors"
                        >
                          Add Option
                        </button>
                        <button
                          onClick={() => handleViewAllOptions(product)}
                          className="px-2 py-0.5 rounded bg-green-500 text-white hover:bg-green-600 text-xs font-medium transition-colors"
                        >
                          View All Options
                        </button>
                        <button
                          onClick={() => handleImageManageClick(product.id || product.productId)}
                          className="px-2 py-0.5 rounded bg-orange-500 text-white hover:bg-orange-600 text-xs font-medium transition-colors"
                        >
                          Manage Images
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Pagination */}
          {totalPages > 1 && !error && (
            <div className="flex items-center justify-between mt-6 px-4">
              <div className="text-sm text-gray-700">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} products
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Previous
                </button>
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${pageNum === currentPage ? "bg-violet-500 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === totalPages - 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {/* Modal: Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Product
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete{" "}
                  <strong>"{productToDelete?.name}"</strong>? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Display Option form */}
      {showOptionForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <ProductOptionForm
              onSubmit={handleSubmitOption}
              onCancel={handleCloseOptionForm}
              productId={optionProduct?.id || optionProduct?.productId}
              productInfo={optionProduct}
            />
          </div>
        </div>
      )}
      {/* Display all Options */}
      {showAllOptions && selectedProductForOptions && (
        <ViewAllOptionsPopup
          product={selectedProductForOptions}
          onClose={handleCloseAllOptions}
        />
      )}
      {/* Serial Modal */}
      {showSerialsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-900">
                Serials for Option ID: {optionForSerials?.id}
              </h3>
              <button
                onClick={() => setShowSerialsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            {loadingSerials ? (
              <div className="text-center py-8 text-gray-500">Loading serials...</div>
            ) : serialsForOption.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No serials found.</div>
            ) : (
              <>
                <div className="divide-y divide-blue-100 max-h-60 overflow-y-auto">
                  {serialsForOption.map((serial, idx) => (
                    <div
                      key={serial.id || idx}
                      className="flex flex-col gap-1 py-2 px-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-gray-800">
                          {serial.serialNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${
                            serial.status === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : serial.status === "SOLD"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {serial.status}
                        </span>
                      </div>
                      {serial.purchaseDate && (
                        <div className="text-gray-500 text-xs">
                          Purchased:{" "}
                          {new Date(serial.purchaseDate).toLocaleDateString(
                            "en-US"
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Pagination for serials */}
                {serialsTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => handleSerialsPageChange(serialsPage - 1)}
                      disabled={serialsPage === 0}
                      className={`px-3 py-1 rounded ${
                        serialsPage === 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {serialsPage + 1} of {serialsTotalPages}
                    </span>
                    <button
                      onClick={() => handleSerialsPageChange(serialsPage + 1)}
                      disabled={serialsPage === serialsTotalPages - 1}
                      className={`px-3 py-1 rounded ${
                        serialsPage === serialsTotalPages - 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
             {selectedProductIdForImage && (
         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
           <div className="bg-white rounded-lg p-8 shadow-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              
              <button
                onClick={() => {
                  setSelectedProductIdForImage(null);
                  setImages([]);
                  setImageError("");
                  setSelectedImagesToDelete([]);
                  setImageToUpdate(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="mb-2 flex gap-2 items-center">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAddImage}
              />
                             <button
                 className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium"
                 onClick={() => fileInputRef.current && fileInputRef.current.click()}
                 disabled={imageLoading}
               >
                 Upload Image
               </button>
               <button
                 className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium"
                 onClick={handleDeleteSelectedImages}
                 disabled={imageLoading || images.length === 0}
               >
                 Delete Image
               </button>
              
              {imageLoading && <span className="text-xs text-blue-500">Loading...</span>}
              {imageError && <span className="text-xs text-red-500">{imageError}</span>}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={updateInputRef}
              style={{ display: "none" }}
              onChange={handleUpdateImage}
            />
            <div className="flex gap-2 mt-2 flex-wrap justify-center">
              {images.length > 0 ? (
                images.map((img) => {
                  // Process image URL
                  const baseUrl = "http://localhost:8080";
                  const imageUrl = img.imageUrl 
                    ? (img.imageUrl.startsWith('http') ? img.imageUrl : `${baseUrl}${img.imageUrl}`)
                    : "https://placehold.co/120x120?text=No+Image";
                  
                  return (
                                                              <div key={img.id || img.imageId} className="relative group border rounded p-3">
                        <img
                          src={imageUrl}
                          alt={img.fileName || "Product"}
                          className="w-64 h-64 object-contain rounded border bg-gray-50"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/256x256?text=Error";
                          }}
                        />
                      <div className="absolute top-1 left-1">
                        <input
                          type="checkbox"
                          checked={selectedImagesToDelete.includes(img.id || img.imageId)}
                          onChange={() => handleSelectImageToDelete(img.id || img.imageId)}
                          title="Select to delete"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-gray-400">No image</span>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Serial Form Modal */}
      {showSerialForm && selectedOptionForSerial && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Serial for Option
              </h3>
              <button
                onClick={handleCloseSerialForm}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Option: {selectedOptionForSerial.productName} - {selectedOptionForSerial.colorName} - {selectedOptionForSerial.ram}GB/{selectedOptionForSerial.rom}GB
              </p>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const serialData = {
                serialNumber: formData.get('serialNumber'),
                status: formData.get('status') || 'AVAILABLE',
                storeId: formData.get('storeId') || null
              };
              handleSubmitSerial(serialData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number *
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter serial number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                    <option value="RESERVED">Reserved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store ID (Optional)
                  </label>
                  <input
                    type="number"
                    name="storeId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter store ID"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseSerialForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Serial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility function to get token info
const getTokenInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Decode JWT token (if it's a JWT)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      token,
      payload,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
    };
  } catch (error) {
    console.warn("Invalid token format");
    return { token };
  }
};

const statusColor = {
  Active: "text-green-500",
  Inactive: "text-neutral-600",
  OutOfStock: "text-red-500 font-bold",
};

export default ProductTable;
