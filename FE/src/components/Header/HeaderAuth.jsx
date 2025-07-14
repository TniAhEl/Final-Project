import { useState, useEffect } from 'react';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import SidebarCart from '../Sidebar/Cart';
import { Link, useNavigate } from 'react-router-dom';
import { getCartByUserId } from '../../api/cartService';

// Hàm decode JWT để lấy userId từ token
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded.userId || decoded.id || decoded.sub || null;
  } catch {
    return null;
  }
}

const HeaderAuth = () => {
  const [openCart, setOpenCart] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/signin');
  };

  const handleGoToCart = () => {
    setOpenCart(false);
    navigate('/customer/cart');
  };

  // Fetch cart khi mở cart
  useEffect(() => {
    if (!openCart) return;
    // Lấy userId từ token mỗi lần mở cart
    const userId = getUserIdFromToken();
    if (!userId) {
      setCartProducts([]);
      setCartTotal(0);
      return;
    }
    setCartLoading(true);
    getCartByUserId(userId)
      .then((data) => {
        // data dạng { message, data: { id, totalMoney, updateAt, cartProducts: [...] } }
        if (data && data.data && Array.isArray(data.data.cartProducts)) {
          setCartProducts(data.data.cartProducts);
          setCartTotal(data.data.totalMoney || 0);
        } else {
          setCartProducts([]);
          setCartTotal(0);
        }
      })
      .catch(() => {
        setCartProducts([]);
        setCartTotal(0);
      })
      .finally(() => setCartLoading(false));
  }, [openCart]);

  return (
    <>
      <header className="bg-gray-900 border-b border-zinc-200">
        <div className="max-w-screen-xl mx-auto px-8 py-4 flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold font-roboto mr-8 cursor-pointer">
            E-Shop
          </Link>

          {/* Menu */}
          <nav className="flex items-center gap-6 text-white text-base font-medium font-inter">
            <Link to="/products" className="hover:text-brand-yellow transition">Category</Link>
            <Link to="/promotion" className="hover:text-brand-yellow transition">Promotion</Link>
            <Link to="/support" className="hover:text-brand-yellow transition">Support</Link>
          </nav>

          {/* Search box */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg bg-slate-100 rounded-md px-4 py-2 flex items-center gap-3">
              <svg className="w-5 h-5 text-zinc-800" fill="none" stroke="currentColor" strokeWidth="2"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none flex-1 text-zinc-800 placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Cart icon */}
          <div className="ml-6 relative cursor-pointer" onClick={() => setOpenCart(true)}>
            <FaShoppingCart className="text-white" size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {cartProducts.length}
            </span>
          </div>

          {/* User avatar & dropdown */}
          <div className="ml-4 relative">
            <button
              className="cursor-pointer focus:outline-none"
              onClick={() => setOpenUser((prev) => !prev)}
            >
              <FaUserCircle className="text-white" size={28} />
            </button>
            {openUser && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10">
                <button
                  onClick={() => { setOpenUser(false); navigate('/customer'); }}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => { setOpenUser(false); handleLogout(); }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
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
        <SidebarCart
          products={cartProducts}
          total={cartTotal}
          onGoToCart={handleGoToCart}
          loading={cartLoading}
        />
      </div>
    </>
  );
};

export default HeaderAuth;