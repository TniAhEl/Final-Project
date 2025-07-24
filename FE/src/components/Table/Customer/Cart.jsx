import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartByUserId,
  updateProductQuantity,
  deleteCartProduct,
  clearCart,
} from "../../../api/cartService";

const CartTable = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null); // Track updating productOptionId

  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Không tìm thấy userId");
      const res = await getCartByUserId(userId);
      const data = res.data;
      const items = (data.cartProducts || []).map((p) => ({
        id: p.productOption.id,
        name: p.productOption.productName,
        price: p.productOption.price,
        quantity: p.quantity,
        image: p.productOption.image, // nếu có
        productOption: p.productOption,
        productOptionId: p.productOption.id,
      }));
      setCartItems(items);
      setCartId(data.id);
      console.log(items); // kiểm tra dữ liệu
    } catch (err) {
      setError("Không thể tải giỏ hàng.");
      setCartItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleIncrease = async (item) => {
    try {
      const userId = localStorage.getItem("userId");
      setUpdatingId(item.productOptionId);
      await updateProductQuantity(userId, {
        productOptionId: item.productOptionId,
        quantity: item.quantity + 1,
      });
      fetchCart();
      setUpdatingId(null);
    } catch (err) {
      setUpdatingId(null);
      alert("Không thể tăng số lượng.");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    try {
      const userId = localStorage.getItem("userId");
      setUpdatingId(item.productOptionId);
      await updateProductQuantity(userId, {
        productOptionId: item.productOptionId,
        quantity: item.quantity - 1,
      });
      fetchCart();
      setUpdatingId(null);
    } catch (err) {
      setUpdatingId(null);
      alert("Không thể giảm số lượng.");
    }
  };

  const handleRemove = async (item) => {
    try {
      const userId = localStorage.getItem("userId");
      await deleteCartProduct(userId, item.productOptionId);
      fetchCart();
    } catch (err) {
      alert("Không thể xóa sản phẩm.");
    }
  };

  const handleClearCart = async () => {
    if (!cartId) return;
    if (!window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) return;
    try {
      await clearCart(cartId);
      fetchCart();
    } catch (err) {
      alert("Không thể xóa toàn bộ giỏ hàng.");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
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
        {loading ? (
          <div className="p-6 text-center text-gray-400 w-full">Đang tải...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500 w-full">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="p-6 text-center text-gray-400 w-full">Giỏ hàng trống.</div>
        ) : (
          cartItems.map((item, idx) => (
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
                  onClick={() => handleDecrease(item)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                  disabled={item.quantity <= 1 || updatingId === item.productOptionId}
                >
                  {updatingId === item.productOptionId && "-" === document.activeElement?.textContent ? (
                    <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "-"
                  )}
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                  disabled={updatingId === item.productOptionId}
                >
                  {updatingId === item.productOptionId && "+" === document.activeElement?.textContent ? (
                    <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "+"
                  )}
                </button>
              </div>
              <div className="w-32 p-4 text-zinc-800 text-sm font-semibold">
                {(item.price * item.quantity).toLocaleString()}₫
              </div>
              <div className="w-24 p-4 flex justify-center">
                <button
                  onClick={() => handleRemove(item)}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
        {/* Tổng tiền */}
        {cartItems.length > 0 && !loading && (
          <div className="flex bg-neutral-100 font-bold text-lg items-center">
            <div className="flex-1 p-4 text-right">Tổng cộng:</div>
            <div className="w-32 p-4 text-violet-600">
              {total.toLocaleString()}₫
            </div>
            <div className="w-56 flex items-center gap-2">
              <button
                onClick={() => navigate('/order/checkout')}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"
              >
                Go to Checkout
              </button>
              <button
                onClick={handleClearCart}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-xs font-semibold"
              >
                Xóa toàn bộ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;
