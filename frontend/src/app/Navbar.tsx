import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  User, 
  LogOut, 
  Package, 
  Menu, 
  X, 
  LayoutDashboard // Tambahkan ini
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./components/Logo";

export function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo />
            <span className="ml-2 text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Cart Icon */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cart")}
              className="relative p-2.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingCart size={22} className="text-slate-900" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Auth Condition */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="text-slate-900 font-medium">{user.name}</span>
                </motion.button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 py-2 overflow-hidden"
                    >
                      {/* --- MENU ADMIN (Hanya tampil jika isAdmin) --- */}
                      {user && user.isAdmin && (
                        <Link
                          to="/admin/productsList"
                          className="flex items-center gap-3 px-4 py-3 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors border-b border-slate-100"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <LayoutDashboard size={18} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                          navigate("/");
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-slate-900 hover:bg-slate-100 rounded-full transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full transition-all font-medium shadow-lg shadow-slate-900/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}