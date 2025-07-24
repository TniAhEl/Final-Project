import React from "react";

const CartTable = ({
  cartItems = [],
  onIncrease = () => {},
  onDecrease = () => {},
  onRemove = () => {},
}) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
          <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">
            Ảnh
          </div>
          <div className="flex-1 p-4 text-slate-800/90 text-sm font-medium">
            Sản phẩm
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Giá
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Số lượng
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Thành tiền
          </div>
          <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">
            Thao tác
          </div>
        </div>
        {/* Rows */}
        {cartItems.length === 0 && (
          <div className="p-6 text-center text-gray-400 w-full">
            Giỏ hàng trống.
          </div>
        )}
        {cartItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300"
          >
            <div className="w-24 p-4 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain rounded"
              />
            </div>
            <div className="flex-1 p-4 text-zinc-800 text-sm">{item.name}</div>
            <div className="w-32 p-4 text-zinc-800 text-sm">
              {item.price.toLocaleString()}₫
            </div>
            <div className="w-32 p-4 flex items-center gap-2">
              <button
                onClick={() => onDecrease(item)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button
                onClick={() => onIncrease(item)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <div className="w-32 p-4 text-zinc-800 text-sm font-semibold">
              {(item.price * item.quantity).toLocaleString()}₫
            </div>
            <div className="w-24 p-4 flex justify-center">
              <button
                onClick={() => onRemove(item)}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
        {/* Tổng tiền */}
        {cartItems.length > 0 && (
          <div className="flex bg-neutral-100 font-bold text-lg">
            <div className="flex-1 p-4 text-right">Tổng cộng:</div>
            <div className="w-32 p-4 text-violet-600">
              {total.toLocaleString()}₫
            </div>
            <div className="w-56" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;
