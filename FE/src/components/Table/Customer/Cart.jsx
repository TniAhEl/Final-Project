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

  // Helper function to process product images
  const processProductImage = (imageData) => {
    if (!imageData) return "https://placehold.co/80x80";
    
    const baseUrl = "http://localhost:8080";
    
    // If imageData is a string, it might be a full URL or a path
    if (typeof imageData === 'string') {
      if (imageData.startsWith('http')) {
        return imageData;
      } else if (imageData.startsWith('/')) {
        return `${baseUrl}${imageData}`;
      } else {
        return `${baseUrl}/${imageData}`;
      }
    }
    
    // If imageData is an object
    if (typeof imageData === 'object') {
      if (imageData.url) {
        return imageData.url.startsWith('http') ? imageData.url : `${baseUrl}${imageData.url}`;
      }
      if (imageData.imageUrl) {
        return `${baseUrl}${imageData.imageUrl}`;
      }
      if (imageData.image_url) {
        return `${baseUrl}${imageData.image_url}`;
      }
    }
    
    return "https://placehold.co/80x80";
  };

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("Missing userId");
      const res = await getCartByUserId(userId);
      const data = res.data;
      const items = (data.cartProducts || []).map((p) => ({
        id: p.productOption.id,
        name: p.productOption.productName,
        price: p.productOption.price,
        quantity: p.quantity,
        image: processProductImage(p.productOption.image || p.productOption.productImageResponse?.[0]),
        productOption: p.productOption,
        productOptionId: p.productOption.id,
      }));
      setCartItems(items);
      setCartId(data.id);
    } catch (err) {
      setError("Cannot load cart.");
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
      showNotification("Không thể tăng số lượng!", "error");
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
      showNotification("Không thể giảm số lượng!", "error");
    }
  };

  const handleRemove = async (item) => {
    try {
      const userId = localStorage.getItem("userId");
      await deleteCartProduct(userId, item.productOptionId);
      fetchCart();
      showNotification("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (err) {
      showNotification("Không thể xóa sản phẩm!", "error");
    }
  };

  // Function to show notification
  const showNotification = (message, type = "success") => {
    localStorage.setItem("showNotification", "true");
    localStorage.setItem("notificationMessage", message);
    window.dispatchEvent(new CustomEvent("showNotification", { detail: { message, type } }));
  };

  const handleClearCart = async () => {
    if (!cartId) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) return;
    try {
      await clearCart(cartId);
      fetchCart();
      showNotification("Đã xóa toàn bộ giỏ hàng!");
    } catch (err) {
      showNotification("Không thể xóa giỏ hàng!", "error");
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
            Product
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Price
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Quantity
          </div>
          <div className="w-32 p-4 text-slate-800/90 text-sm font-medium">
            Total
          </div>
          <div className="w-24 p-4 text-slate-800/90 text-sm font-medium">
            Actions
          </div>
        </div>
        {/* Rows */}
        {loading ? (
          <div className="p-6 text-center text-gray-400 w-full">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500 w-full">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="p-6 text-center text-gray-400 w-full">Cart is empty.</div>
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
                  onError={(e) => {
                    e.target.src = "https://placehold.co/80x80";
                  }}
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
        {/* Total */}
        {cartItems.length > 0 && !loading && (
          <div className="flex bg-neutral-100 font-bold text-lg items-center">
            <div className="flex-1 p-4 text-right">Total:</div>
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
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;
