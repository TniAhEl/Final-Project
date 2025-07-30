import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getLocalCartItemCount, isAuthenticated } from "../../services/localCartService";
import { useState, useEffect, useRef } from "react";
import SidebarCart from "../Sidebar/Cart";

const Header = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const navigate = useNavigate();
  const cartRef = useRef();

  // Update cart item count when component mounts and when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      if (!isAuthenticated()) {
        setCartItemCount(getLocalCartItemCount());
      } else {
        // For authenticated users, we'll keep it at 0 for now
        // You can implement server cart count later if needed
        setCartItemCount(0);
      }
    };

    updateCartCount();

    // Listen for storage changes (when cart is updated in other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === 'localCart') {
        updateCartCount();
      }
    };

    // Listen for custom events (when cart is updated in same tab)
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleGoToCart = () => {
    setOpenCart(false);
    navigate("/order/checkout");
  };

  // Khi click vào icon cart
  const handleCartClick = () => {
    setOpenCart(true);
    cartRef.current?.refreshCart();
  };

  return (
    <>
      <header className="bg-gray-900 border-b border-zinc-200">
      <div className="max-w-screen-xl mx-auto px-8 py-4 flex items-center gap-8">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-2xl font-bold font-roboto mr-8 cursor-pointer"
        >
          E-Shop
        </Link>

        {/* Menu */}
        <nav className="flex items-center gap-6 text-white text-base font-medium font-inter">
          <Link to="/products" className="hover:text-brand-yellow transition">
            Category
          </Link>
          <Link to="/promotion" className="hover:text-brand-yellow transition">
            Promotion
          </Link>
          <Link to="/support" className="hover:text-brand-yellow transition">
            Support
          </Link>
        </nav>

        {/* Search box */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-lg bg-slate-100 rounded-md px-4 py-2 flex items-center gap-3">
            <svg
              className="w-5 h-5 text-zinc-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none flex-1 text-zinc-800 placeholder:text-zinc-500"
            />
          </div>
                  </div>

          {/* Cart Icon */}
          <div className="relative ml-6 group">
            <div
              onClick={handleCartClick}
              className="flex items-center justify-center w-10 h-10 text-white hover:text-brand-yellow transition-colors cursor-pointer"
            >
              <FaShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </div>
            {!isAuthenticated() && cartItemCount > 0 && (
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Giỏ hàng tạm thời
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 ml-4">
          <Link
            to="/signup"
            className="px-4 py-2 rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition"
          >
            Register
          </Link>
          <Link
            to="/signin"
            className="px-4 py-2 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>

    {/* Overlay mờ khi mở sidebar */}
    {openCart && (
      <div
        className="fixed inset-0 z-40"
        onClick={() => setOpenCart(false)}
      />
    )}

    {/* Sidebar Cart */}
    <div
      className={`fixed right-0 top-16 h-[calc(100vh-64px)] z-[100] transition-transform duration-300 ${
        openCart ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: 350, maxWidth: "100vw" }}
    >
      <SidebarCart onGoToCheckOut={handleGoToCart} ref={cartRef} />
    </div>
  </>
  );
};

export default Header;
