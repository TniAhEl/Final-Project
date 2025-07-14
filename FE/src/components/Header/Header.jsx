import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
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

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <Link to="/signup" className="px-4 py-2 rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition">
              Register
            </Link>
            <Link to="/signin" className="px-4 py-2 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition">
              Login
            </Link>
          </div>
        </div>
      </header>
    );
  };
  
  export default Header;
  