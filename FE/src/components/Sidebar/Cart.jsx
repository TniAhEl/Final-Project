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
import {
  getLocalCart,
  updateLocalCartQuantity,
  removeFromLocalCart,
  getLocalCartTotal,
  isAuthenticated,
} from "../../services/localCartService";

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
    if (isAuthenticated()) {
      // User is logged in - fetch from server
      const userId = localStorage.getItem("userId");
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
    } else {
      // User is not logged in - use local cart
      const localCart = getLocalCart();
      setProducts(localCart);
      setTotal(getLocalCartTotal());
      setLoading(false);
      setError(null);
    }
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
    if (isAuthenticated()) {
      // User is logged in - update server cart
      const userId = localStorage.getItem("userId");
      // Save previous products state
      const prevProducts = [...products];
      // Update quantity on UI
      setProducts(
        products.map((p) => {
          const isServerCart = p.productOption;
          const currentProductOptionId = isServerCart ? p.productOption.id : p.productOptionId;
          return currentProductOptionId === productOptionId
            ? { ...p, quantity: newQuantity }
            : p;
        })
      );
      setUpdatingId(productOptionId);
      updateProductQuantity(userId, { productOptionId, quantity: newQuantity })
        .then(() => {
          fetchCart();
          setUpdatingId(null);
        })
        .catch(() => {
          setUpdateError("Failed to update quantity");
          setProducts(prevProducts); // Revert to previous state if error
          setUpdatingId(null);
        });
    } else {
      // User is not logged in - update local cart
      const updatedCart = updateLocalCartQuantity(productOptionId, newQuantity);
      setProducts(updatedCart);
      setTotal(getLocalCartTotal());
    }
  };

  // Handle remove product from cart
  const handleRemoveProduct = (productOptionId) => {
    if (isAuthenticated()) {
      // User is logged in - remove from server cart
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
    } else {
      // User is not logged in - remove from local cart
      const updatedCart = removeFromLocalCart(productOptionId);
      setProducts(updatedCart);
      setTotal(getLocalCartTotal());
    }
  };

  return (
    <aside className="w-[312px] px-4 py-6 bg-neutral-900 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col gap-6 font-['Inter'] text-neutral-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Cart</h2>
        {!isAuthenticated() && (
          <span className="text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
            Local
          </span>
        )}
      </div>
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
          <>
            {!isAuthenticated() && (
              <div className="text-yellow-400 text-xs bg-yellow-900/20 p-2 rounded border border-yellow-500/30 mb-3">
                Temporary cart. Log in to save your cart.
              </div>
            )}
                      <div>
              {products.map((p, idx) => {
                // Handle both server cart and local cart data structures
                const isServerCart = p.productOption;
                const productOptionId = isServerCart ? p.productOption.id : p.productOptionId;
                const name = isServerCart ? p.productOption.productName : p.name;
                const price = isServerCart ? p.productOption.price : p.price;
                const quantity = p.quantity;
                const image = isServerCart ? p.productOption.image : p.image;
                
                return (
                  <CartCard
                    key={p.id || productOptionId || idx}
                    name={name}
                    price={price}
                    quantity={quantity}
                    image={image}
                    onQuantityChange={(newQty) =>
                      handleQuantityChange(productOptionId, newQty)
                    }
                    onRemove={() => handleRemoveProduct(productOptionId)}
                    updating={updatingId === productOptionId}
                    removing={removingId === productOptionId}
                  />
                );
              })}
            </div>
          </>
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
          onClick={() => {
            if (onGoToCheckOut) {
              onGoToCheckOut();
            } else {
              navigate("/order/checkout");
            }
          }}
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
        >
          Go to Checkout
        </button>
      </div>
    </aside>
  );
});

export default SidebarCart;
