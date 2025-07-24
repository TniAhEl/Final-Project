import { useState, useEffect } from "react";

const InsuranceForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    releaseAt: "",
    insured: "",
    terms: "",
    coverageMoney: "",
    provider: "",
    fee: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData(initialData);
    }
  }, [initialData, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.insured) newErrors.insured = "Insured is required";
    if (!formData.terms) newErrors.terms = "Terms are required";
    if (!formData.coverageMoney)
      newErrors.coverageMoney = "Coverage money is required";
    if (!formData.fee) newErrors.fee = "Fee is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 border rounded-md shadow-sm"
      >
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Insurance Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="E.g: Mobile Insurance Package"
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Release At */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Release Date
          </label>
          <input
            type="date"
            value={formData.releaseAt}
            onChange={(e) => handleInputChange("releaseAt", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Insured */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Insured Target <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.insured}
            onChange={(e) => handleInputChange("insured", e.target.value)}
            placeholder="E.g: iPhone 15 Pro, Samsung S24..."
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 ${
              errors.insured ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.insured && (
            <p className="text-red-500 text-sm mt-1">{errors.insured}</p>
          )}
        </div>

        {/* Terms */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Insurance Terms <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.terms}
            onChange={(e) => handleInputChange("terms", e.target.value)}
            placeholder="E.g: Covers accidental damage, water damage..."
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 ${
              errors.terms ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
          )}
        </div>

        {/* Coverage Money */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Coverage Amount (VND) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.coverageMoney}
            onChange={(e) => handleInputChange("coverageMoney", e.target.value)}
            placeholder="E.g: 15000000"
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 ${
              errors.coverageMoney ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.coverageMoney && (
            <p className="text-red-500 text-sm mt-1">{errors.coverageMoney}</p>
          )}
        </div>

        {/* Fee */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Insurance Fee (VND) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.fee}
            onChange={(e) => handleInputChange("fee", e.target.value)}
            placeholder="E.g: 500000"
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 ${
              errors.fee ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fee && (
            <p className="text-red-500 text-sm mt-1">{errors.fee}</p>
          )}
        </div>

        {/* Provider */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Insurance Provider
          </label>
          <input
            type="text"
            value={formData.provider}
            onChange={(e) => handleInputChange("provider", e.target.value)}
            placeholder="E.g: Bao Viet, AIA..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600"
          >
            {isEditing ? "Update Insurance" : "Save Insurance"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceForm;
