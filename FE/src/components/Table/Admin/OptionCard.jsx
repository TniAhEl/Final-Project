import React, { useState } from "react";

const OptionCard = ({ option }) => {
  const [showSerials, setShowSerials] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
          Remaining: {option.remainingQuantity}
        </span>
      </div>
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
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => setShowSerials(!showSerials)}
          className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {showSerials ? "Hide Serials" : "View Serials"}
        </button>
      </div>
      {showSerials && (
        <div className="mt-3 pt-3">
          <div className="border border-blue-200 bg-blue-50 rounded-lg shadow-sm p-3">
            <h4 className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wide">
              Serial List
            </h4>
            {option.serials && option.serials.length > 0 ? (
              <div className="divide-y divide-blue-100 max-h-40 overflow-y-auto">
                {option.serials.map((serial, idx) => (
                  <div key={serial.id || idx} className="flex flex-col gap-1 py-2 px-1">
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
                        Purchased: {new Date(serial.purchaseDate).toLocaleDateString("en-US")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center py-2">No serials</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionCard;