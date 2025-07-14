import React, { useState, useEffect } from 'react';
import { createSerial, updateSerial, getSerials, getAllStores } from '../../../api/productService';

const ViewAllOptions = ({ product, onClose, onAddSerial }) => {
  const [showSerialForm, setShowSerialForm] = useState(false);
  const [selectedOptionForSerial, setSelectedOptionForSerial] = useState(null);
  const [showUpdateSerialForm, setShowUpdateSerialForm] = useState(false);
  const [selectedSerialForUpdate, setSelectedSerialForUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [serialsData, setSerialsData] = useState({}); // Store serials for each option
  const [loadingSerials, setLoadingSerials] = useState({}); // Loading state for each option
  const [stores, setStores] = useState([]);

  const handleAddSerial = (option) => {
    console.log('Adding serial for option:', option);
    setSelectedOptionForSerial(option);
    setShowSerialForm(true);
    setError('');
    setSuccess('');
  };

  const handleCloseSerialForm = () => {
    setShowSerialForm(false);
    setSelectedOptionForSerial(null);
    setError('');
    setSuccess('');
  };

  const handleSubmitSerial = async (serialData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare data for API
      const apiData = {
        serialNumber: serialData.serialNumber,
        productOptionId: selectedOptionForSerial.id.toString()
      };

      console.log('Sending serial data to API:', apiData);
      
      // Call API to add serial
      const response = await createSerial(apiData);
      console.log('API response:', response);
      
      setSuccess('Serial added successfully!');
      
      // Close form after a short delay
      setTimeout(() => {
        handleCloseSerialForm();
        // Call parent callback to refresh data if needed
        if (onAddSerial) {
          onAddSerial(selectedOptionForSerial, serialData);
        }
      }, 1500);
      
    } catch (err) {
      console.error('Error adding serial:', err);
      setError(err.response?.data?.message || 'Failed to add serial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSerial = (serial) => {
    console.log('Updating serial:', serial);
    setSelectedSerialForUpdate(serial);
    setShowUpdateSerialForm(true);
    setError('');
    setSuccess('');
  };

  const handleCloseUpdateSerialForm = () => {
    setShowUpdateSerialForm(false);
    setSelectedSerialForUpdate(null);
    setError('');
    setSuccess('');
  };

  const handleSubmitUpdateSerial = async (updateData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Prepare data for API
      const apiData = {
        status: updateData.status,
        serialNumber: updateData.serialNumber,
        storeId: updateData.storeId
      };

      console.log('Sending update serial data to API:', apiData);
      
      // Call API to update serial
      const response = await updateSerial(selectedSerialForUpdate.id, apiData);
      console.log('API response:', response);
      
      setSuccess('Serial updated successfully!');
      
      // Close form after a short delay
      setTimeout(() => {
        handleCloseUpdateSerialForm();
        // Refresh serials data after update
        if (selectedSerialForUpdate.optionId) {
          fetchSerialsForOption(selectedSerialForUpdate.optionId);
        }
        // Call parent callback to refresh data if needed
        if (onAddSerial) {
          onAddSerial(null, updateData);
        }
      }, 1500);
      
    } catch (err) {
      console.error('Error updating serial:', err);
      setError(err.response?.data?.message || 'Failed to update serial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch serials for a specific option
  const fetchSerialsForOption = async (optionId) => {
    try {
      setLoadingSerials(prev => ({ ...prev, [optionId]: true }));
      
      console.log('Fetching serials for option:', optionId);
      const response = await getSerials(optionId);
      console.log('Serials response:', response);
      
      if (response.data) {
        setSerialsData(prev => ({
          ...prev,
          [optionId]: response.data
        }));
      }
    } catch (err) {
      console.error('Error fetching serials:', err);
      setSerialsData(prev => ({
        ...prev,
        [optionId]: []
      }));
    } finally {
      setLoadingSerials(prev => ({ ...prev, [optionId]: false }));
    }
  };

  // Auto-fetch serials for all options when component mounts
  useEffect(() => {
    if (product.option && product.option.length > 0) {
      product.option.forEach(option => {
        if (option.id) {
          fetchSerialsForOption(option.id);
        }
      });
    }
  }, [product.option]);

  // Lấy danh sách store khi mở form update serial
  useEffect(() => {
    if (showUpdateSerialForm) {
      getAllStores().then(data => {
        // Nếu API trả về object có thuộc tính data là mảng
        if (data && Array.isArray(data.data)) {
          setStores(data.data);
        } else if (Array.isArray(data)) {
          setStores(data);
        } else {
          setStores([]);
        }
      }).catch(() => setStores([]));
    }
  }, [showUpdateSerialForm]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Tất cả Options - {product.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Brand:</span>
              <div className="font-medium">{product.brand}</div>
            </div>
            <div>
              <span className="text-gray-500">Category:</span>
              <div className="font-medium">{product.category?.name}</div>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <div className="font-medium">{product.productStatus}</div>
            </div>
            <div>
              <span className="text-gray-500">Release Year:</span>
              <div className="font-medium">{product.releaseYear}</div>
            </div>
          </div>
        </div>

        {/* Options List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {product.option && product.option.length > 0 ? (
            <div className="space-y-4">
              {product.option.map((option, index) => (
                <OptionCard 
                  key={option.id || index} 
                  option={option} 
                  onAddSerial={handleAddSerial}
                  onUpdateSerial={handleUpdateSerial}
                  serials={serialsData[option.id] || []}
                  loadingSerials={loadingSerials[option.id] || false}
                  onFetchSerials={() => fetchSerialsForOption(option.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có options</h3>
              <p className="text-gray-500">Sản phẩm này chưa có options nào.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Serial Form */}
      {showSerialForm && selectedOptionForSerial && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Thêm Serial mới
              </h2>
              <button
                onClick={handleCloseSerialForm}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <SerialForm 
                onSubmit={handleSubmitSerial}
                onCancel={handleCloseSerialForm}
                optionInfo={selectedOptionForSerial}
                loading={loading}
                error={error}
                success={success}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Serial Form */}
      {showUpdateSerialForm && selectedSerialForUpdate && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Cập nhật Serial
              </h2>
              <button
                onClick={handleCloseUpdateSerialForm}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <UpdateSerialForm
                onSubmit={handleSubmitUpdateSerial}
                onCancel={handleCloseUpdateSerialForm}
                serialInfo={selectedSerialForUpdate}
                loading={loading}
                error={error}
                success={success}
                stores={Array.isArray(stores) ? stores : []}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component OptionCard
const OptionCard = ({ option, onAddSerial, onUpdateSerial, serials, loadingSerials, onFetchSerials }) => {
  const [showSerials, setShowSerials] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStockStatusColor = (remainingQuantity) => {
    if (remainingQuantity > 10) return 'text-green-600';
    if (remainingQuantity > 0) return 'text-yellow-600';
    return 'text-red-600';
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          option.remainingQuantity > 10 
            ? 'bg-green-100 text-green-800' 
            : option.remainingQuantity > 0 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          Tồn: {option.remainingQuantity}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Giá:</span>
          <span className="font-semibold text-blue-600">{formatPrice(option.price)}</span>
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
        <div className="flex gap-2">
          <button
            onClick={() => setShowSerials(!showSerials)}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            {showSerials ? 'Ẩn Serials' : 'View Serials'}
          </button>
          <button
            onClick={() => onAddSerial(option)}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Add Serial
          </button>
        </div>
      </div>

      {/* Serials List */}
      {showSerials && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-base font-medium text-gray-800">Danh sách Serial:</h4>
            <button
              onClick={onFetchSerials}
              disabled={loadingSerials}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 font-medium"
            >
              {loadingSerials ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {loadingSerials ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <div className="text-sm text-gray-500 mt-2">Loading serials...</div>
            </div>
          ) : serials && serials.length > 0 ? (
            <div className="space-y-2">
              {serials.map((serial, idx) => (
                <div key={serial.id || idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-900">{serial.serialNumber}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          serial.productListConfigStatus === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                          serial.productListConfigStatus === 'SOLD' ? 'bg-red-100 text-red-800' :
                          serial.productListConfigStatus === 'BROKEN' ? 'bg-orange-100 text-orange-800' :
                          serial.productListConfigStatus === 'RETURN' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {serial.productListConfigStatus}
                        </span>
                      </div>
                      {serial.store && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <div><span className="font-medium">Store:</span> {serial.store.name}</div>
                          <div><span className="font-medium">Location:</span> {serial.store.location}</div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onUpdateSerial({ ...serial, optionId: option.id })}
                      className="ml-3 px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-400 text-2xl mb-2">📋</div>
              <div className="text-sm text-gray-500">Không có serial nào</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Component SerialForm
const SerialForm = ({ onSubmit, onCancel, optionInfo, loading, error, success }) => {
  const [formData, setFormData] = useState({
    serialNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.serialNumber.trim()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Option Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Option Information:</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Color: {optionInfo.colorName}</div>
          <div>RAM: {optionInfo.ram}GB | ROM: {optionInfo.rom}GB</div>
          <div>Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(optionInfo.price)}</div>
        </div>
      </div>

      {/* Serial Number */}
      <div>
        <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Serial Number *
        </label>
        <input
          type="text"
          id="serialNumber"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter serial number"
          required
          disabled={loading}
        />
      </div>

      {/* Success Message */}
      {success && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : (
            'Add Serial'
          )}
        </button>
      </div>
    </form>
  );
};

// Component UpdateSerialForm
const UpdateSerialForm = ({ onSubmit, onCancel, serialInfo, loading, error, success, stores = [] }) => {
  // Debug giá trị stores
  console.log('stores in UpdateSerialForm', stores);
  const [formData, setFormData] = useState({
    status: serialInfo.productListConfigStatus || 'AVAILABLE',
    serialNumber: serialInfo.serialNumber || '',
    storeId: serialInfo.store?.id?.toString() || (Array.isArray(stores) && stores[0]?.id?.toString() || '')
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      storeId: serialInfo.store?.id?.toString() || (Array.isArray(stores) && stores[0]?.id?.toString() || '')
    }));
    // eslint-disable-next-line
  }, [stores, serialInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serialNumber.trim()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Serial Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Serial Information:</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div>ID: {serialInfo.id}</div>
          <div>Current Status: {serialInfo.productListConfigStatus}</div>
          <div>Serial Number: {serialInfo.serialNumber}</div>
          {serialInfo.store && (
            <div>Current Store: <span className="font-semibold">{serialInfo.store.name}</span></div>
          )}
        </div>
      </div>
      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading}
        >
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="SOLD">SOLD</option>
          <option value="RETURN">RETURN</option>
          <option value="BROKEN">BROKEN</option>
          <option value="REVERSED">REVERSED</option>
        </select>
      </div>
      {/* Serial Number */}
      <div>
        <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Serial Number *
        </label>
        <input
          type="text"
          id="serialNumber"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter serial number"
          required
          disabled={loading}
        />
      </div>
      {/* Store chọn từ danh sách */}
      <div>
        <label htmlFor="storeId" className="block text-sm font-medium text-gray-700 mb-1">
          Store *
        </label>
        <select
          id="storeId"
          name="storeId"
          value={formData.storeId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading || !Array.isArray(stores) || stores.length === 0}
        >
          {Array.isArray(stores) && stores.map(store => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
      </div>
      {/* Success Message */}
      {success && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
          {success}
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </div>
          ) : (
            'Update Serial'
          )}
        </button>
      </div>
    </form>
  );
};

export default ViewAllOptions; 