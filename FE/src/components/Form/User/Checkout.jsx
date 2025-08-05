import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = ({ 
  user = null, 
  cart = [], 
  discounts = [], 
  insurances = [],
  onPlaceOrder = () => {},
  loading = false 
}) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  // Calculate totals
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const discountValue = selectedDiscount
    ? Number(selectedDiscount.value?.replace(/[^\d-]/g, "") || 0)
    : 0;
  const insuranceValue = selectedInsurance ? (selectedInsurance.price || 0) : 0;
  const finalTotal = total + insuranceValue + discountValue;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-violet-700">Checkout</h2>
      {/* User Information */}
      {user && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">User Information</h3>
          <div className="grid grid-cols-3 gap-4">
            <input
              value={user.name || ""}
              disabled
              className="bg-gray-100 rounded px-4 py-2"
              placeholder="Full Name"
            />
            <input
              value={user.phone || ""}
              disabled
              className="bg-gray-100 rounded px-4 py-2"
              placeholder="Phone Number"
            />
            <input
              value={user.email || ""}
              disabled
              className="bg-gray-100 rounded px-4 py-2"
              placeholder="Email"
            />
          </div>
        </div>
      )}
      {/* Products in cart */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Products</h3>
        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No products in cart</p>
          </div>
        ) : (
          <div className="divide-y">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3">
                <img
                  src={item.image || "https://placehold.co/64x64?text=No+Image"}
                  alt={item.name || "Product"}
                  className="w-16 h-16 object-contain rounded"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/64x64?text=Error";
                  }}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.name || "Unknown Product"}</div>
                  <div className="text-gray-500 text-sm">x{item.quantity || 1}</div>
                </div>
                <div className="font-semibold text-violet-700">
                  {((item.price || 0) * (item.quantity || 1)).toLocaleString()}₫
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Delivery address */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Delivery Address</h3>
        <input
          type="text"
          className="w-full bg-gray-100 rounded px-4 py-2"
          placeholder="Enter delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {/* Discount Code */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Discount Code</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 bg-gray-100 rounded px-4 py-2"
            placeholder="Enter discount code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
            onClick={() => {
              const found = mockDiscounts.find((d) => d.code === discountCode);
              setSelectedDiscount(found || null);
            }}
          >
            Apply
          </button>
        </div>
        <div className="flex gap-2">
          {discounts.map((d) => (
            <button
              key={d.code}
              className={`px-3 py-1 rounded border ${
                selectedDiscount?.code === d.code
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedDiscount(d)}
            >
              {d.code} ({d.value})
            </button>
          ))}
        </div>
        {selectedDiscount && (
          <div className="mt-2 text-green-600">
            Applied code: <b>{selectedDiscount.code}</b> (
            {selectedDiscount.value})
          </div>
        )}
      </div>
      {/* Insurance Package */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Select Insurance Package</h3>
        <div className="flex gap-2">
          {insurances.map((ins) => (
            <button
              key={ins.id}
              className={`px-3 py-1 rounded border ${
                selectedInsurance?.id === ins.id
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedInsurance(ins)}
            >
              {ins.name} (+{(ins.price || 0).toLocaleString()}₫)
            </button>
          ))}
        </div>
        {selectedInsurance && (
          <div className="mt-2 text-blue-600">
            Đã chọn: <b>{selectedInsurance.name}</b> (+
            {selectedInsurance.price.toLocaleString()}₫)
          </div>
        )}
      </div>
      {/* Total */}
      <div className="flex justify-end items-center gap-4 mt-8">
        <div className="text-xl font-bold">Total:</div>
        <div className="text-2xl font-extrabold text-violet-700">
          {finalTotal.toLocaleString()}₫
        </div>
      </div>
                           <div className="flex justify-center mt-8">
                <button 
                  className="relative w-full max-w-md px-8 py-6 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-2xl font-bold text-xl hover:from-violet-700 hover:to-purple-800 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group border-4 border-violet-500 hover:border-violet-600"
                  disabled={!address.trim() || loading || cart.length === 0}
                  onClick={() => {
                    if (address.trim() && cart.length > 0) {
                      onPlaceOrder({
                        address,
                        discountCode: selectedDiscount?.code || discountCode,
                        selectedInsurance,
                        total: finalTotal
                      });
                    }
                  }}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative flex items-center justify-center gap-4">
                    <div className="relative p-2 border-2 border-violet-400 rounded-full group-hover:border-violet-300 transition-all duration-300">
                      <svg className="w-8 h-8 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {/* Animated dots */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-pulse border border-violet-400"></div>
                    </div>
                    <span className="text-2xl font-extrabold tracking-wide px-4 py-2 border-2 border-violet-300 rounded-lg group-hover:border-violet-200 transition-all duration-300">
                      {loading ? "PLACING ORDER..." : "PLACE ORDER"}
                    </span>
                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300 p-1 border border-violet-300 rounded-full group-hover:border-violet-200 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse transition-all duration-700"></div>
                </button>
              </div>
    </div>
  );
};

export default Checkout;
