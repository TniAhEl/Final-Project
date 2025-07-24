import React, { useState, useEffect } from "react";
import ProductForm from "../../Form/Product/Product.jsx";
import ProductOptionForm from "../../Form/Product/Options.jsx";
import ViewAllOptions from "../../Form/Product/ViewAllOptions.jsx";
import { filterAdminProducts } from "../../../api/productService";

// Utility function to check if user is authenticated
const checkAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found in localStorage");
    return false;
  }
  return true;
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
  const [selectedProductForOptions, setSelectedProductForOptions] =
    useState(null);
  const [showSerialForm, setShowSerialForm] = useState(false);
  const [selectedOptionForSerial, setSelectedOptionForSerial] = useState(null);

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
    console.log("Token info:", tokenInfo);

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

  const handleModifyProduct = (product) => {
    // Convert product data to form format
    const formData = {
      productName: product.name,
      description: product.description || "",
      brand: product.brand || "",
      status: product.status?.toUpperCase() || "DRAFT",
      createAt: product.createAt || "",
      updateAt: product.updateAt || "",
      categoryId: product.category?.id?.toString() || "",
      warrantyId: product.warranty?.id?.toString() || "",
      os: product.os || "",
      cpu: product.cpu || "",
      cpuSpeed: product.cpuSpeed?.toString() || "",
      gpu: product.gpu || "",
      batteryCapacity: product.batteryCapacity?.toString() || "",
      batteryType: product.batteryType || "",
      chargeSupport: product.chargeSupport || "",
      batteryTech: product.batteryTech || "",
      screenDimension: product.screenDimension || "",
      flash: product.flash || false,
      frontCamera: product.frontCamera || "",
      backCamera: product.backCamera || "",
      screenTouch: product.screenTouch || "",
      screenTech: product.screenTech || "",
      screenResolution: product.screenResolution || "",
      maxBrightness: product.maxBrightness || "",
      backCameraTech: product.backCameraTech || "",
      backCameraRecord: product.backCameraRecord || "",
      mobileNetwork: product.mobileNetwork || "",
      bluetooth: product.bluetooth || "",
      sim: product.sim || "Dual SIM",
      wifi: product.wifi || "",
      gps: product.gps || "",
      chargePort: product.chargePort || "",
      earphonePort: product.earphonePort || "",
      anotherPort: product.anotherPort || "",
      design: product.design || "",
      material: product.material || "",
      dimension: product.dimension || "",
      releaseYear: product.releaseYear?.toString() || "",
      musicUtil: product.musicUtil || "",
      movieUtil: product.movieUtil || "",
      recordUtil: product.recordUtil || "",
      resistanceUtil: product.resistanceUtil || "",
      specialUtil: product.specialUtil || "",
      advancedUtil: product.advancedUtil || "",
    };

    setEditingProduct({ ...product, formData });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      console.log("Deleting product:", productToDelete);
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
      console.log("Modified product data:", formData);
      onModifyProduct({ ...editingProduct, ...formData });
    } else {
      // Handle add new product
      console.log("New product data:", formData);
      onAddProduct(formData);
    }
    setShowForm(false);
    setEditingProduct(null);
    setIsEditing(false);
    // Refresh the product list after adding/modifying
    fetchProducts(currentPage);
  };

  const handleAddOption = (product) => {
    console.log("Adding option for product:", product);
    setOptionProduct(product);
    setShowOptionForm(true);
  };

  const handleCloseOptionForm = () => {
    setShowOptionForm(false);
    setOptionProduct(null);
  };

  const handleSubmitOption = (optionData) => {
    // Handle saving option for product optionProduct
    console.log("Option for product:", optionProduct, optionData);
    setShowOptionForm(false);
    setOptionProduct(null);
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
    console.log("Adding serial for option:", option);
    setSelectedOptionForSerial(option);
    setShowSerialForm(true);
  };

  const handleCloseSerialForm = () => {
    setShowSerialForm(false);
    setSelectedOptionForSerial(null);
  };

  const handleSubmitSerial = (serialData) => {
    // This function is now handled in ViewAllOptions component
    console.log("Serial added successfully:", serialData);
    // Refresh the product list after adding serial
    fetchProducts(currentPage);
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
  if (error && products.length === 0) {
    const isAuthError =
      error.includes("Authentication") || error.includes("Session expired");

    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading products
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          {isAuthError ? (
            <button
              onClick={() => (window.location.href = "/signin")}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Go to Login
            </button>
          ) : (
            <button
              onClick={() => fetchProducts()}
              className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* If showing form, only display form, hide table */}
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

          {/* Product Table */}
          <div className="rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto'] shadow-sm">
            <div className="divide-y divide-slate-300">
              {/* Header */}
              <div className="grid grid-cols-10 bg-neutral-50 text-xs">
                <div className="p-1 text-slate-800/90 font-semibold">ID</div>
                <div className="p-2 text-slate-800/90 font-semibold">Name</div>
                <div className="p-2 text-slate-800/90 font-semibold">
                  Category
                </div>
                <div className="p-2 text-slate-800/90 font-semibold">Price</div>
                <div className="p-2 text-slate-800/90 font-semibold">Stock</div>
                <div className="p-2 text-slate-800/90 font-semibold">
                  Status
                </div>
                <div className="p-2 text-slate-800/90 font-semibold">Brand</div>
                <div className="p-2 text-slate-800/90 font-semibold">Year</div>
                <div className="p-2 text-slate-800/90 font-semibold">
                  Actions
                </div>
              </div>
              {/* Rows */}
              {products.map((product, idx) => (
                <div
                  key={product.id || product.productId || idx}
                  className="grid grid-cols-10 bg-white hover:bg-blue-50/50 transition-colors text-xs min-h-[28px]"
                >
                  <div className="p-1 text-zinc-800 font-normal border-r border-slate-300">
                    {product.id ||
                      product.productId ||
                      `P${String(idx + 1).padStart(3, "0")}`}
                  </div>
                  <div className="p-2 text-zinc-800 font-medium border-r border-slate-300">
                    {product.name}
                  </div>
                  <div className="p-2 border-r border-slate-300">
                    <div className="flex gap-1 flex-wrap">
                      {product.category?.name ? (
                        <span className="px-1.5 py-0.5 bg-emerald-100 rounded text-neutral-800 text-xs font-medium">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-neutral-800 text-xs font-medium">
                          No Category
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-2 font-semibold text-blue-700 border-r border-slate-300">
                    {product.option && product.option.length > 0 ? (
                      <div className="text-xs">
                        <div className="font-medium">
                          From{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            Math.min(...product.option.map((opt) => opt.price))
                          )}
                        </div>
                        <div className="text-gray-500">
                          ({product.option.length} options)
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="p-2 border-r border-slate-300">
                    {product.option && product.option.length > 0 ? (
                      <div className="text-xs">
                        {(() => {
                          const validOptions = product.option.filter(
                            (opt) => opt.remainingQuantity > 0
                          );
                          const totalStock = validOptions.reduce(
                            (sum, opt) => sum + opt.remainingQuantity,
                            0
                          );
                          const stockColor =
                            totalStock > 10
                              ? "bg-green-100 text-green-800"
                              : totalStock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800";
                          return (
                            <div
                              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${stockColor}`}
                            >
                              {totalStock}
                            </div>
                          );
                        })()}
                        <div className="text-gray-500 mt-0.5">
                          (
                          {(() => {
                            const validOptions = product.option.filter(
                              (opt) => opt.remainingQuantity > 0
                            );
                            const validOptionsCount = validOptions.length;
                            const totalOptions = product.option.length;
                            if (validOptionsCount === totalOptions) {
                              return `${totalOptions} options`;
                            } else {
                              return `${validOptionsCount}/${totalOptions} options`;
                            }
                          })()}
                          )
                        </div>
                      </div>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        0
                      </span>
                    )}
                  </div>
                  <div className="p-2 border-r border-slate-300">
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        product.productStatus === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : product.productStatus === "INACTIVE"
                          ? "bg-gray-100 text-gray-800"
                          : product.productStatus === "DRAFT"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.productStatus || "Unknown"}
                    </span>
                  </div>
                  <div className="p-2 border-r border-slate-300">
                    <div className="text-xs text-gray-600 font-medium">
                      {product.brand || "N/A"}
                    </div>
                  </div>
                  <div className="p-2 border-r border-slate-300">
                    <div className="text-xs text-gray-600 font-medium">
                      {product.releaseYear || "N/A"}
                    </div>
                  </div>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {products.length === 0 && !loading && (
            <div className="text-center py-12">
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4">
              <div className="text-sm text-gray-700">
                Showing {currentPage * pageSize + 1} to{" "}
                {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
                {totalElements} products
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        pageNum === currentPage
                          ? "bg-violet-500 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
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
        <ViewAllOptions
          product={selectedProductForOptions}
          onClose={handleCloseAllOptions}
          onAddSerial={handleAddSerial}
        />
      )}
    </div>
  );
};

// Component OptionCard
const OptionCard = ({ option }) => {
  const [showSerials, setShowSerials] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStockStatusColor = (remainingQuantity) => {
    if (remainingQuantity > 10) return "text-green-600";
    if (remainingQuantity > 0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
            ID: {option.id}
          </span>
          <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-medium">
            {option.colorName}
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            option.remainingQuantity > 10
              ? "bg-green-100 text-green-800"
              : option.remainingQuantity > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          Tồn: {option.remainingQuantity}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Giá:</span>
          <span className="font-semibold text-blue-600">
            {formatPrice(option.price)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">RAM:</span>
          <span className="font-medium">{option.ram} GB</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ROM:</span>
          <span className="font-medium">{option.rom} GB</span>
        </div>
      </div>

      {/* View Serials Button */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => setShowSerials(!showSerials)}
          className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {showSerials ? "Hide Serials" : "View Serials"}
        </button>
      </div>

      {/* Serials List */}
      {showSerials && (
        <div className="mt-3 pt-3">
          <div className="border border-blue-200 bg-blue-50 rounded-lg shadow-sm p-3">
            <h4 className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wide">
              Serial List
            </h4>
            {option.serials && option.serials.length > 0 ? (
              <div className="divide-y divide-blue-100 max-h-40 overflow-y-auto">
                {option.serials.map((serial, idx) => (
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
            ) : (
              <div className="text-xs text-gray-500 text-center py-2">
                No serials
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
