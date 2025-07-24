import React, { useState } from "react";

const mockUser = {
  name: "Nguyễn Văn A",
  phone: "0901234567",
  email: "nguyenvana@gmail.com",
};

const mockCart = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/303890/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
    price: 32990000,
    quantity: 1,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    image:
      "https://cdn.tgdd.vn/Products/Images/42/303890/samsung-galaxy-s24-ultra-thumb-600x600.jpg",
    price: 28990000,
    quantity: 2,
  },
];

const mockDiscounts = [
  { code: "SUMMER2024", value: "-2.000.000₫" },
  { code: "VIPMEMBER", value: "-1.000.000₫" },
];

const mockInsurances = [
  { id: 1, name: "Bảo hiểm rơi vỡ 1 năm", price: 500000 },
  { id: 2, name: "Bảo hiểm mất cắp 1 năm", price: 800000 },
];

const Checkout = () => {
  const [address, setAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState(null);

  const total = mockCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountValue = selectedDiscount
    ? Number(selectedDiscount.value.replace(/[^\d-]/g, ""))
    : 0;
  const insuranceValue = selectedInsurance ? selectedInsurance.price : 0;
  const finalTotal = total + insuranceValue + discountValue;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-violet-700">Thanh toán</h2>
      {/* Thông tin người dùng */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Thông tin khách hàng</h3>
        <div className="grid grid-cols-3 gap-4">
          <input
            value={mockUser.name}
            disabled
            className="bg-gray-100 rounded px-4 py-2"
          />
          <input
            value={mockUser.phone}
            disabled
            className="bg-gray-100 rounded px-4 py-2"
          />
          <input
            value={mockUser.email}
            disabled
            className="bg-gray-100 rounded px-4 py-2"
          />
        </div>
      </div>
      {/* Sản phẩm trong giỏ hàng */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Sản phẩm</h3>
        <div className="divide-y">
          {mockCart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-500 text-sm">x{item.quantity}</div>
              </div>
              <div className="font-semibold text-violet-700">
                {(item.price * item.quantity).toLocaleString()}₫
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Địa chỉ giao hàng */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Địa chỉ giao hàng</h3>
        <input
          type="text"
          className="w-full bg-gray-100 rounded px-4 py-2"
          placeholder="Nhập địa chỉ giao hàng"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {/* Mã giảm giá */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Mã giảm giá</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 bg-gray-100 rounded px-4 py-2"
            placeholder="Nhập mã giảm giá"
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
            Áp dụng
          </button>
        </div>
        <div className="flex gap-2">
          {mockDiscounts.map((d) => (
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
            Đã áp dụng mã: <b>{selectedDiscount.code}</b> (
            {selectedDiscount.value})
          </div>
        )}
      </div>
      {/* Gói bảo hiểm */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Chọn gói bảo hiểm</h3>
        <div className="flex gap-2">
          {mockInsurances.map((ins) => (
            <button
              key={ins.id}
              className={`px-3 py-1 rounded border ${
                selectedInsurance?.id === ins.id
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedInsurance(ins)}
            >
              {ins.name} (+{ins.price.toLocaleString()}₫)
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
      {/* Tổng cộng */}
      <div className="flex justify-end items-center gap-4 mt-8">
        <div className="text-xl font-bold">Tổng cộng:</div>
        <div className="text-2xl font-extrabold text-violet-700">
          {finalTotal.toLocaleString()}₫
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button className="px-8 py-3 bg-violet-600 text-white rounded font-semibold hover:bg-violet-700 transition">
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default Checkout;
