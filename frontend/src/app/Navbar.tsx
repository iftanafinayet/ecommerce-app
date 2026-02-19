import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  User, 
  LogOut, 
  Package, 
  Menu, 
  X, 
  LayoutDashboard,
  ShieldCheck // Tambahan icon untuk kesan Admin yang kuat
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Pastikan framer-motion terinstall
import { Logo } from "./components/Logo";

export function Navbar() {
  // Ambil isAdmin dari context agar lebih bersih
  const { user, isAdmin, logout } = useAuth(); 
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
      setShowMobileMenu(false);
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
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/cart")}
              className="relative p-2.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ShoppingCart size={22} className="text-slate-900" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-emerald-600' : 'bg-slate-900'}`}>
                    <User size={18} className="text-white" />
                  </div>
                  <span className="text-slate-900 font-bold">{user.name}</span>
                </motion.button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 overflow-hidden"
                    >
                      {/* Admin Section */}
                      {isAdmin && (
                        <div className="px-4 py-2 mb-2 bg-emerald-50/50">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Admin Panel</p>
                          <Link
                            to="/admin/productsList"
                            className="flex items-center gap-3 p-2 text-slate-900 hover:bg-white rounded-xl transition-all font-bold text-sm"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <LayoutDashboard size={18} className="text-emerald-600" />
                            Dashboard Produk
                          </Link>
                        </div>
                      )}

                      <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Account</p>
                      <Link to="/profile" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 font-bold text-sm" onClick={() => setShowUserDropdown(false)}>
                        <User size={18} /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 font-bold text-sm" onClick={() => setShowUserDropdown(false)}>
                        <Package size={18} /> My Orders
                      </Link>
                      
                      <hr className="my-2 border-slate-100" />
                      
                      <button
                        onClick={() => { logout(); setShowUserDropdown(false); }}
                        className="flex items-center gap-3 w-full px-6 py-3 text-rose-600 hover:bg-rose-50 font-bold text-sm transition-colors"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-4">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">Login</Link>
                <Link to="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => navigate("/cart")} className="relative p-2">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{cartItemCount}</span>}
            </button>
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 text-slate-900">
              {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-5 py-3 bg-slate-100 rounded-2xl font-bold outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              
              {user ? (
                <div className="space-y-2">
                  {isAdmin && (
                    <Link to="/admin/productsList" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold">
                      <ShieldCheck size={20} /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setShowMobileMenu(false)} className="block p-4 font-bold text-slate-700">Profile</Link>
                  <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="block p-4 font-bold text-slate-700">My Orders</Link>
                  <button onClick={logout} className="w-full text-left p-4 font-bold text-rose-600">Logout</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 p-2">
                  <Link to="/login" onClick={() => setShowMobileMenu(false)} className="text-center py-4 font-bold border border-slate-200 rounded-2xl">Login</Link>
                  <Link to="/register" onClick={() => setShowMobileMenu(false)} className="text-center py-4 font-bold bg-slate-900 text-white rounded-2xl">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}