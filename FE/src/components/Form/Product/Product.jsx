import { useState, useEffect } from 'react';
import { updateProduct, createProduct } from '../../../api/productService';

const ProductForm = ({ onSubmit, onCancel, initialData = null, isEditing = false, productId = null }) => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    brand: '',
    status: '',
    createAt: '',
    updateAt: '',
    categoryId: '',
    warrantyId: '',
    os: '',
    cpu: '',
    cpuSpeed: '',
    gpu: '',
    batteryCapacity: '',
    batteryType: '',
    chargeSupport: '',
    batteryTech: '',
    screenDimension: '',
    flash: '',
    frontCamera: '',
    backCamera: '',
    screenTouch: '',
    screenTech: '',
    screenResolution: '',
    maxBrightness: '',
    backCameraTech: '',
    backCameraRecord: '',
    mobileNetwork: '',
    bluetooth: '',
    sim: 'Dual SIM',
    wifi: '',
    gps: '',
    chargePort: '',
    earphonePort: '',
    anotherPort: '',
    design: '',
    material: '',
    dimension: '',
    releaseYear: '',
    musicUtil: '',
    movieUtil: '',
    recordUtil: '',
    resistanceUtil: '',
    specialUtil: '',
    advancedUtil: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      setFormData(initialData);
    }
  }, [initialData, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors and success when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (success[field]) {
      setSuccess(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Transform form data to API format
  const transformDataForAPI = (data) => {
    return {
      name: data.productName,
      description: data.description,
      brand: data.brand,
      categoryId: parseInt(data.categoryId) || 1,
      warrantyId: parseInt(data.warrantyId) || 1,
      os: data.os,
      cpu: data.cpu,
      cpuSpeed: parseFloat(data.cpuSpeed) || 0,
      gpu: data.gpu,
      batteryCapacity: parseInt(data.batteryCapacity) || 0,
      batteryType: data.batteryType,
      chargeSupport: data.chargeSupport,
      batteryTech: data.batteryTech,
      screenDimension: data.screenDimension,
      flash: data.flash === 'true' || data.flash === true,
      frontCamera: data.frontCamera,
      backCamera: data.backCamera,
      screenTouch: data.screenTouch,
      screenTech: data.screenTech,
      screenResolution: data.screenResolution,
      maxBrightness: data.maxBrightness,
      backCameraTech: data.backCameraTech,
      backCameraRecord: data.backCameraRecord,
      mobileNetwork: data.mobileNetwork,
      bluetooth: data.bluetooth,
      sim: data.sim || "Dual SIM",
      wifi: data.wifi,
      gps: data.gps,
      chargePort: data.chargePort,
      earphonePort: data.earphonePort,
      anotherPort: data.anotherPort,
      design: data.design,
      material: data.material,
      dimension: data.dimension,
      releaseYear: parseInt(data.releaseYear) || 2024,
      musicUtil: data.musicUtil,
      movieUtil: data.movieUtil,
      recordUtil: data.recordUtil,
      resistanceUtil: data.resistanceUtil,
      specialUtil: data.specialUtil,
      advancedUtil: data.advancedUtil
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    if (!formData.categoryId.trim()) {
      newErrors.categoryId = 'Category is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const apiData = transformDataForAPI(formData);
      
      if (isEditing && productId) {
        // Update existing product
        const response = await updateProduct(productId, apiData);
        setSuccess({ general: 'Product updated successfully!' });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess({});
        }, 3000);
        
        // Call onSubmit callback if provided
        if (onSubmit) {
          onSubmit(response);
        }
      } else {
        // Create new product
        const response = await createProduct(apiData);
        setSuccess({ general: 'Product created successfully!' });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess({});
        }, 3000);
        
        // Call onSubmit callback if provided
        if (onSubmit) {
          onSubmit(response);
        }
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      setErrors({ general: error.response?.data?.message || 'An error occurred while saving the product' });
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrors(prev => ({ ...prev, general: '' }));
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* General Error/Success Message */}
      {errors.general && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}
      {success.general && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {success.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="Enter product name"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.productName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="Enter brand name"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                placeholder="Select category"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Technical Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating System
              </label>
              <input
                type="text"
                value={formData.os}
                onChange={(e) => handleInputChange('os', e.target.value)}
                placeholder="e.g., Android 13, iOS 16"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* CPU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPU
              </label>
              <input
                type="text"
                value={formData.cpu}
                onChange={(e) => handleInputChange('cpu', e.target.value)}
                placeholder="e.g., Snapdragon 8 Gen 2"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* CPU Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPU Speed
              </label>
              <input
                type="text"
                value={formData.cpuSpeed}
                onChange={(e) => handleInputChange('cpuSpeed', e.target.value)}
                placeholder="e.g., 3.2 GHz"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* GPU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPU
              </label>
              <input
                type="text"
                value={formData.gpu}
                onChange={(e) => handleInputChange('gpu', e.target.value)}
                placeholder="e.g., Adreno 740"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Battery Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Battery & Charging</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Battery Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Battery Capacity
              </label>
              <input
                type="text"
                value={formData.batteryCapacity}
                onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
                placeholder="e.g., 5000 mAh"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Battery Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Battery Type
              </label>
              <input
                type="text"
                value={formData.batteryType}
                onChange={(e) => handleInputChange('batteryType', e.target.value)}
                placeholder="e.g., Li-Po"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Charge Support */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charging Support
              </label>
              <input
                type="text"
                value={formData.chargeSupport}
                onChange={(e) => handleInputChange('chargeSupport', e.target.value)}
                placeholder="e.g., 67W"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Battery Technology */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Battery Technology
              </label>
              <input
                type="text"
                value={formData.batteryTech}
                onChange={(e) => handleInputChange('batteryTech', e.target.value)}
                placeholder="e.g., Fast charging"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Camera Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Camera</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Front Camera */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Front Camera
              </label>
              <input
                type="text"
                value={formData.frontCamera}
                onChange={(e) => handleInputChange('frontCamera', e.target.value)}
                placeholder="e.g., 32 MP"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Back Camera */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Back Camera
              </label>
              <input
                type="text"
                value={formData.backCamera}
                onChange={(e) => handleInputChange('backCamera', e.target.value)}
                placeholder="e.g., 108 MP + 8 MP + 2 MP"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Flash */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flash
              </label>
              <div className="flex items-center space-x-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="flash"
                    value="true"
                    checked={formData.flash === true || formData.flash === 'true'}
                    onChange={(e) => handleInputChange('flash', e.target.value === 'true')}
                    className="mr-2"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="flash"
                    value="false"
                    checked={formData.flash === false || formData.flash === 'false'}
                    onChange={(e) => handleInputChange('flash', e.target.value === 'true')}
                    className="mr-2"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            {/* Back Camera Technology */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Back Camera Technology
              </label>
              <input
                type="text"
                value={formData.backCameraTech}
                onChange={(e) => handleInputChange('backCameraTech', e.target.value)}
                placeholder="e.g., OIS, EIS"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Screen Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Display</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Screen Dimension */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Screen Size
              </label>
              <input
                type="text"
                value={formData.screenDimension}
                onChange={(e) => handleInputChange('screenDimension', e.target.value)}
                placeholder="e.g., 6.7 inch"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Screen Resolution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution
              </label>
              <input
                type="text"
                value={formData.screenResolution}
                onChange={(e) => handleInputChange('screenResolution', e.target.value)}
                placeholder="e.g., 2400 x 1080"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Screen Technology */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Technology
              </label>
              <input
                type="text"
                value={formData.screenTech}
                onChange={(e) => handleInputChange('screenTech', e.target.value)}
                placeholder="e.g., AMOLED"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Max Brightness */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Brightness
              </label>
              <input
                type="text"
                value={formData.maxBrightness}
                onChange={(e) => handleInputChange('maxBrightness', e.target.value)}
                placeholder="e.g., 1200 nits"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Screen Touch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Screen Touch
              </label>
              <input
                type="text"
                value={formData.screenTouch}
                onChange={(e) => handleInputChange('screenTouch', e.target.value)}
                placeholder="e.g., Multi-touch"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Connectivity Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Connectivity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobile Network */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Network
              </label>
              <input
                type="text"
                value={formData.mobileNetwork}
                onChange={(e) => handleInputChange('mobileNetwork', e.target.value)}
                placeholder="e.g., 5G, 4G"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Bluetooth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bluetooth
              </label>
              <input
                type="text"
                value={formData.bluetooth}
                onChange={(e) => handleInputChange('bluetooth', e.target.value)}
                placeholder="e.g., 5.2"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* WiFi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WiFi
              </label>
              <input
                type="text"
                value={formData.wifi}
                onChange={(e) => handleInputChange('wifi', e.target.value)}
                placeholder="e.g., 802.11 a/b/g/n/ac/ax"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* GPS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPS
              </label>
              <input
                type="text"
                value={formData.gps}
                onChange={(e) => handleInputChange('gps', e.target.value)}
                placeholder="e.g., GPS, GLONASS"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* SIM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SIM
              </label>
              <input
                type="text"
                value={formData.sim}
                onChange={(e) => handleInputChange('sim', e.target.value)}
                placeholder="e.g., Dual SIM"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Ports Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Ports</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Charge Port */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charge Port
              </label>
              <input
                type="text"
                value={formData.chargePort}
                onChange={(e) => handleInputChange('chargePort', e.target.value)}
                placeholder="e.g., USB-C"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Earphone Port */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Earphone Port
              </label>
              <input
                type="text"
                value={formData.earphonePort}
                onChange={(e) => handleInputChange('earphonePort', e.target.value)}
                placeholder="e.g., 3.5mm"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Another Port */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Another Port
              </label>
              <input
                type="text"
                value={formData.anotherPort}
                onChange={(e) => handleInputChange('anotherPort', e.target.value)}
                placeholder="e.g., None"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Design Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Design</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Design */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Design
              </label>
              <input
                type="text"
                value={formData.design}
                onChange={(e) => handleInputChange('design', e.target.value)}
                placeholder="e.g., Touch"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => handleInputChange('material', e.target.value)}
                placeholder="e.g., Glass, Aluminum"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Dimension */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.dimension}
                onChange={(e) => handleInputChange('dimension', e.target.value)}
                placeholder="e.g., 163.1 x 75.9 x 8.1 mm"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Release Year
              </label>
              <input
                type="number"
                value={formData.releaseYear}
                onChange={(e) => handleInputChange('releaseYear', e.target.value)}
                placeholder="e.g., 2023"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Utilities Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Utilities</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Music Utility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Music Utility
              </label>
              <input
                type="text"
                value={formData.musicUtil}
                onChange={(e) => handleInputChange('musicUtil', e.target.value)}
                placeholder="e.g., MP3, WAV"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Movie Utility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Movie Utility
              </label>
              <input
                type="text"
                value={formData.movieUtil}
                onChange={(e) => handleInputChange('movieUtil', e.target.value)}
                placeholder="e.g., MP4, MKV"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Record Utility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Record Utility
              </label>
              <input
                type="text"
                value={formData.recordUtil}
                onChange={(e) => handleInputChange('recordUtil', e.target.value)}
                placeholder="e.g., Yes"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Resistance Utility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resistance Utility
              </label>
              <input
                type="text"
                value={formData.resistanceUtil}
                onChange={(e) => handleInputChange('resistanceUtil', e.target.value)}
                placeholder="e.g., IP67"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Special Utility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Utility
              </label>
              <input
                type="text"
                value={formData.specialUtil}
                onChange={(e) => handleInputChange('specialUtil', e.target.value)}
                placeholder="e.g., Samsung Knox"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Advanced Utility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advanced Utility
              </label>
              <input
                type="text"
                value={formData.advancedUtil}
                onChange={(e) => handleInputChange('advancedUtil', e.target.value)}
                placeholder="e.g., AI Camera"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
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
            className={`px-6 py-3 rounded-md transition-colors flex items-center space-x-2 ${
              isLoading 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-violet-500 text-white hover:bg-violet-600'
            }`}
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isLoading ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
