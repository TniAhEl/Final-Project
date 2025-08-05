import React, { useState } from "react";
import { getSerials, createSerial } from "../../../api/productService";

const ViewAllOptionsPopup = ({ product, onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [serials, setSerials] = useState([]);
  const [loadingSerials, setLoadingSerials] = useState(false);
  const [serialsPage, setSerialsPage] = useState(0);
  const [serialsTotalPages, setSerialsTotalPages] = useState(0);
  const [serialsPageSize] = useState(20);

  // Add Serial Form State
  const [showAddSerialForm, setShowAddSerialForm] = useState(false);
  const [newSerialNumber, setNewSerialNumber] = useState("");
  const [addSerialLoading, setAddSerialLoading] = useState(false);
  const [addSerialError, setAddSerialError] = useState("");
  const [addSerialSuccess, setAddSerialSuccess] = useState("");

  const handleViewSerials = async (option, page = 0) => {
    setSelectedOption(option);
    setLoadingSerials(true);
    try {
      const res = await getSerials(option.id, page, serialsPageSize);
      setSerials(res.data.content || res.data || []);
      setSerialsPage(res.number || 0);
      setSerialsTotalPages(res.data.totalPages || 1);
    } catch {
      setSerials([]);
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
      setSerialsPage(newPage);
      handleViewSerials(selectedOption, newPage);
    }
  };

  const handleAddSerialClick = () => {
    setShowAddSerialForm(true);
    setAddSerialError("");
    setAddSerialSuccess("");
    setNewSerialNumber("");
  };

  const handleAddSerialSubmit = async (e) => {
    e.preventDefault();
    if (!newSerialNumber.trim()) {
      setAddSerialError("Serial number is required.");
      return;
    }
    setAddSerialLoading(true);
    setAddSerialError("");
    setAddSerialSuccess("");
    try {
      await createSerial({
        productOptionId: selectedOption.id,
        serialNumber: newSerialNumber.trim(),
      });
      setAddSerialSuccess("Serial added successfully!");
      setShowAddSerialForm(false);
      setNewSerialNumber("");
      handleViewSerials(selectedOption, serialsPage);
    } catch (err) {
      setAddSerialError("Failed to add serial.");
    } finally {
      setAddSerialLoading(false);
      setTimeout(() => setAddSerialSuccess(""), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-700 font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4 text-blue-900">
          Options for: <span className="font-normal">{product.name}</span>
        </h2>
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 mb-4">
          {product.option && product.option.length > 0 ? (
            product.option.map((option) => (
              <div
                key={option.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-2"
              >
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    ID: {option.id}
                  </span>
                  <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-medium">
                    {option.colorName}
                  </span>
                  <span className="text-xs text-gray-700">
                    RAM: <b>{option.ram}GB</b> / ROM: <b>{option.rom}GB</b>
                  </span>
                  <span className="text-xs text-blue-700 font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(option.price)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      option.remainingQuantity > 10
                        ? "bg-green-100 text-green-800"
                        : option.remainingQuantity > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Remaining: {option.remainingQuantity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-medium"
                    onClick={() => handleViewSerials(option, 0)}
                  >
                    View Serials
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                    onClick={() => {
                      setSelectedOption(option);
                      handleAddSerialClick();
                    }}
                  >
                    Add Serial
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-8">No options found.</div>
          )}
        </div>
        {selectedOption && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg shadow-sm p-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-blue-700 uppercase tracking-wide">
                Serials for Option RAM:{selectedOption.ram } GB - ROM: {selectedOption.rom} GB - Color: {selectedOption.colorName}
              </h4>
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setSelectedOption(null);
                  setSerials([]);
                  setSerialsPage(0);
                  setSerialsTotalPages(0);
                  setShowAddSerialForm(false);
                  setAddSerialError("");
                  setAddSerialSuccess("");
                }}
              >
                Close
              </button>
            </div>
            {/* Add Serial Form */}
            {showAddSerialForm && (
              <form
                className="flex items-center gap-2 mb-3"
                onSubmit={handleAddSerialSubmit}
              >
                <input
                  type="text"
                  className="border rounded px-2 py-1 text-xs"
                  placeholder="Serial number"
                  value={newSerialNumber}
                  onChange={(e) => setNewSerialNumber(e.target.value)}
                  disabled={addSerialLoading}
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium"
                  disabled={addSerialLoading}
                >
                  {addSerialLoading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => setShowAddSerialForm(false)}
                  disabled={addSerialLoading}
                >
                  Cancel
                </button>
                {addSerialError && (
                  <span className="text-xs text-red-500 ml-2">{addSerialError}</span>
                )}
                {addSerialSuccess && (
                  <span className="text-xs text-green-500 ml-2">{addSerialSuccess}</span>
                )}
              </form>
            )}
            {!showAddSerialForm && (
              <button
                className="mb-3 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                onClick={handleAddSerialClick}
              >
                Add Serial
              </button>
            )}
            {loadingSerials ? (
              <div className="text-center py-6 text-gray-500">Loading serials...</div>
            ) : serials.length === 0 ? (
              <div className="text-center py-6 text-gray-500">No serials found.</div>
            ) : (
              <>
                <div className="divide-y divide-blue-100 max-h-40 overflow-y-auto mb-2">
                  {serials.map((serial, idx) => (
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
                            serial.productListConfigStatus === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : serial.productListConfigStatus === "SOLD"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {serial.productListConfigStatus}
                        </span>
                      </div>
                      {serial.store?.updateAt && (
                        <div className="text-gray-500 text-xs">
                          Update:{" "}
                          {new Date(serial.store.updateAt).toLocaleDateString("en-US")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Pagination for serials */}
                {serialsTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-2">
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
        )}
      </div>
    </div>
  );
};

export default ViewAllOptionsPopup;