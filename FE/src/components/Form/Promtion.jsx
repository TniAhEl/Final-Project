import { useState } from "react";

const PromotionForm = ({ onSubmit, onCancel, initialData = null, isEditing = false }) => {
  const [promotionData, setPromotionData] = useState(
    initialData || {
      name: "",
      description: "",
      code: "",
      type: "",
      value: "",
      startDate: "",
      endDate: "",
      status: "",
      quantity: ""
    }
  );

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setPromotionData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate
    const newErrors = {};
    if (!promotionData.name.trim()) newErrors.name = "Promotion name is required";
    if (!promotionData.code.trim()) newErrors.code = "Promotion code is required";
    if (!promotionData.type) newErrors.type = "Promotion type is required";
    if (!promotionData.value) newErrors.value = "Promotion value is required";
    if (!promotionData.startDate) newErrors.startDate = "Start date is required";
    if (!promotionData.endDate) newErrors.endDate = "End date is required";
    if (!promotionData.status) newErrors.status = "Status is required";
    if (!promotionData.quantity) newErrors.quantity = "Quantity is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(promotionData);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Promotion Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Promotion Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={promotionData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="e.g., Summer Sale, Flash Sale..."
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            {/* Promotion Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={promotionData.code}
                onChange={e => handleInputChange('code', e.target.value)}
                placeholder="e.g., SUMMER2024, FLASH50..."
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>
            {/* Promotion Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Type <span className="text-red-500">*</span>
              </label>
              <select
                value={promotionData.type}
                onChange={e => handleInputChange('type', e.target.value)}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select promotion type</option>
                <option value="percentage">Discount by percentage (%)</option>
                <option value="fixed">Discount by fixed amount</option>
                <option value="free_shipping">Free shipping</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
            {/* Promotion Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={promotionData.value}
                onChange={e => handleInputChange('value', e.target.value)}
                placeholder="e.g., 20 (for %) or 50000 (for VND)"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.value ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
            </div>
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={promotionData.quantity}
                onChange={e => handleInputChange('quantity', e.target.value)}
                placeholder="e.g., 100 (number of promotion codes)"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={promotionData.status}
                onChange={e => handleInputChange('status', e.target.value)}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>
          </div>
          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={promotionData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="e.g., Special summer promotion..."
              rows={3}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent border-gray-300"
            />
          </div>
        </div>
        {/* Apply Time */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Apply Time</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={promotionData.startDate}
                onChange={e => handleInputChange('startDate', e.target.value)}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={promotionData.endDate}
                onChange={e => handleInputChange('endDate', e.target.value)}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
          >
            {isEditing ? "Update Promotion" : "Save Promotion"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm;
