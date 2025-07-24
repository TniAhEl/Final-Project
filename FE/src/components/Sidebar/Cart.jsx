import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import CartCard from "../Card/Cart";
import {
  getCartByUserId,
  updateProductQuantity,
  deleteCartProduct,
} from "../../api/cartService";

const SidebarCart = forwardRef(({ onGoToCheckOut }, ref) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null); // Track updating product
  const [updateError, setUpdateError] = useState(null); // Track update error
  const [removingId, setRemovingId] = useState(null); // Track removing product

  // Fetch cart data
  const fetchCart = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }
    setLoading(true);
    getCartByUserId(userId)
      .then((res) => {
        const cart = res.data;
        setProducts(cart.cartProducts || []);
        setTotal(cart.totalMoney || 0);
        setLoading(false);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load cart");
        setLoading(false);
      });
  };

  // Expose fetchCart to parent component
  useImperativeHandle(ref, () => ({
    refreshCart: fetchCart,
  }));

  useEffect(() => {
    fetchCart();
  }, []);

  // Auto hide update error after 3 seconds
  useEffect(() => {
    if (updateError) {
      const timer = setTimeout(() => setUpdateError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateError]);

  // Handle quantity change (optimistic update)
  const handleQuantityChange = (productOptionId, newQuantity) => {
    const userId = localStorage.getItem("userId");
    // Lưu lại state cũ để revert nếu lỗi
    const prevProducts = [...products];
    // Cập nhật tĩnh số lượng trên UI
    setProducts(
      products.map((p) =>
        p.productOption.id === productOptionId
          ? { ...p, quantity: newQuantity }
          : p
      )
    );
    setUpdatingId(productOptionId);
    updateProductQuantity(userId, { productOptionId, quantity: newQuantity })
      .then(() => {
        fetchCart();
        setUpdatingId(null);
      })
      .catch(() => {
        setUpdateError("Failed to update quantity");
        setProducts(prevProducts); // Revert lại nếu lỗi
        setUpdatingId(null);
      });
  };

  // Handle remove product from cart
  const handleRemoveProduct = (productOptionId) => {
    const userId = localStorage.getItem("userId");
    setRemovingId(productOptionId);
    deleteCartProduct(userId, productOptionId)
      .then(() => {
        fetchCart();
        setRemovingId(null);
      })
      .catch(() => {
        setUpdateError("Failed to remove product");
        setRemovingId(null);
      });
  };

  return (
    <aside className="w-[312px] px-4 py-6 bg-neutral-900 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col gap-6 font-['Inter'] text-neutral-100">
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></span>
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-neutral-400 text-sm">Your cart is empty.</div>
        ) : (
          <div>
            {products.map((p, idx) => (
              <CartCard
                key={p.id || idx}
                name={p.productOption.productName}
                price={p.productOption.price}
                quantity={p.quantity}
                // image={p.productOption.image} // Uncomment if image exists
                onQuantityChange={(newQty) =>
                  handleQuantityChange(p.productOption.id, newQty)
                }
                onRemove={() => handleRemoveProduct(p.productOption.id)}
                updating={updatingId === p.productOption.id}
                removing={removingId === p.productOption.id}
              />
            ))}
          </div>
        )}
      </div>
      {updateError && (
        <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-500/30">
          {updateError}
        </div>
      )}
      <div className="mt-auto">
        <div className="font-semibold text-base mb-2">
          Total:{" "}
          <span className="text-blue-400">{total.toLocaleString("vi-VN")}</span>
        </div>
        <button
          onClick={
            onGoToCheckOut ? onGoToCheckOut : () => navigate("/order/checkout")
          }
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
        >
          Go to Checkout
        </button>
      </div>
    </aside>
  );
});

export default SidebarCart;
