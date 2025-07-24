import { useState, useEffect } from "react";
import { createProductOption } from "../../../api/productService";

const ProductOptionForm = ({ onSubmit, onCancel, productId, productInfo }) => {
  const [optionData, setOptionData] = useState({
    color_name: "",
    price: "",
    ram: "",
    rom: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get existing options from productInfo
  const existingOptions = productInfo?.option || [];

  const handleInputChange = (field, value) => {
    setOptionData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Transform data for API
  const transformDataForAPI = (data) => {
    return {
      productId: parseInt(productId),
      price: parseFloat(data.price) || 0,
      colorName: data.color_name,
      ram: parseInt(data.ram) || 0,
      rom: parseInt(data.rom) || 0,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!productId) {
      newErrors.general = "Product ID not found. Please try again.";
    }
    if (!optionData.color_name.trim()) {
      newErrors.color_name = "Color is required";
    }
    if (!optionData.price || parseFloat(optionData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!optionData.ram || parseInt(optionData.ram) <= 0) {
      newErrors.ram = "RAM must be greater than 0";
    }
    if (!optionData.rom || parseInt(optionData.rom) <= 0) {
      newErrors.rom = "ROM must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setSuccess("");
    setErrors({});

    try {
      const apiData = transformDataForAPI(optionData);
      const response = await createProductOption(apiData);

      setSuccess("Option added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);

      // Call onSubmit callback if provided
      if (onSubmit) {
        onSubmit(response);
      }

      // Reset form
      setOptionData({
        color_name: "",
        price: "",
        ram: "",
        rom: "",
      });
    } catch (error) {
      console.error("Error creating product option:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          "An error occurred while adding option. Please try again.",
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrors((prev) => ({ ...prev, general: "" }));
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Format price to Vietnamese currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get stock status color
  const getStockStatusColor = (remainingQuantity) => {
    if (remainingQuantity > 10) return "text-green-600";
    if (remainingQuantity > 0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="w-[500px] max-w-full rounded-[5px] border border-violet-500 p-3 bg-white">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-800">
          Manage Product Options
        </h3>
        <div className="text-xs text-gray-600 space-y-0.5">
          <p>Product ID: {productId || "N/A"}</p>
          {productInfo?.name && (
            <p>
              Product name:{" "}
              <span className="font-medium">{productInfo.name}</span>
            </p>
          )}
          {!productId && (
            <p className="text-red-500">⚠️ Product ID not found</p>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}

      {/* Existing Options Section */}
      {existingOptions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Existing Options:
          </h4>
          <div className="max-h-48 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {existingOptions.map((option, index) => (
                <div
                  key={option.id || index}
                  className="bg-gray-50 border border-gray-200 rounded-md p-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                        ID: {option.id}
                      </span>
                      <span className="px-2 py-0.5 bg-violet-100 text-violet-800 rounded-full text-xs font-medium">
                        {option.colorName}
                      </span>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        option.remainingQuantity > 10
                          ? "bg-green-100 text-green-800"
                          : option.remainingQuantity > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      Stock: {option.remainingQuantity}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <div className="font-semibold text-blue-600">
                        {formatPrice(option.price)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">RAM:</span>
                      <div className="font-medium text-gray-700">
                        {option.ram} GB
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">ROM:</span>
                      <div className="font-medium text-gray-700">
                        {option.rom} GB
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add New Option Section */}
      <div className="border-t border-gray-200 pt-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Add New Option:
        </h4>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* color_name */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm font-normal font-['IBM_Plex_Sans']">
              Color <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={optionData.color_name}
              onChange={(e) => handleInputChange("color_name", e.target.value)}
              placeholder="e.g. Black, White, Blue..."
              className={`p-2 bg-slate-50 rounded-sm text-gray-700 text-sm font-normal font-['IBM_Plex_Sans'] outline-none ${
                errors.color_name ? "border border-red-500" : ""
              }`}
            />
            {errors.color_name && (
              <p className="text-red-500 text-xs">{errors.color_name}</p>
            )}
          </div>

          {/* price */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm font-normal font-['IBM_Plex_Sans']">
              Price (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={optionData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="e.g. 15000000"
              className={`p-2 bg-slate-50 rounded-sm text-gray-700 text-sm font-normal font-['IBM_Plex_Sans'] outline-none ${
                errors.price ? "border border-red-500" : ""
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs">{errors.price}</p>
            )}
          </div>

          {/* ram */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm font-normal font-['IBM_Plex_Sans']">
              RAM (GB) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={optionData.ram}
              onChange={(e) => handleInputChange("ram", e.target.value)}
              placeholder="e.g. 8"
              className={`p-2 bg-slate-50 rounded-sm text-gray-700 text-sm font-normal font-['IBM_Plex_Sans'] outline-none ${
                errors.ram ? "border border-red-500" : ""
              }`}
            />
            {errors.ram && <p className="text-red-500 text-xs">{errors.ram}</p>}
          </div>

          {/* rom */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-500 text-sm font-normal font-['IBM_Plex_Sans']">
              ROM (GB) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={optionData.rom}
              onChange={(e) => handleInputChange("rom", e.target.value)}
              placeholder="e.g. 128"
              className={`p-2 bg-slate-50 rounded-sm text-gray-700 text-sm font-normal font-['IBM_Plex_Sans'] outline-none ${
                errors.rom ? "border border-red-500" : ""
              }`}
            />
            {errors.rom && <p className="text-red-500 text-xs">{errors.rom}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-sm font-['IBM_Plex_Sans'] text-sm font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-2 px-4 rounded-sm font-['IBM_Plex_Sans'] text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-violet-500 text-white hover:bg-violet-600"
              }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>{isLoading ? "Saving..." : "Save Option"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductOptionForm;
