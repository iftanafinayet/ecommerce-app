import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ArrowLeft, ClipboardList, Users, ShoppingBag, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export function AdminRoot() {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Package, label: "Daftar Produk", path: "/admin/productsList" },
    { icon: ClipboardList, label: "Daftar Pesanan", path: "/admin/ordersList" },
    { icon: Users, label: "User Management", path: "/admin/userlist" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-full z-50">
        <div className="px-4 mb-12 flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg shadow-slate-900/20">
            <ShoppingBag size={20} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">
            Merchify <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md ml-1 text-slate-500 font-bold">ADM</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            // Cek aktif secara presisi
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="block">
                <div className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "text-slate-500 hover:bg-slate-50"
                }`}>
                  {isActive && (
                    <motion.div layoutId="pill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                  )}
                  <item.icon size={20} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 font-bold text-sm hover:text-slate-900">
            <ArrowLeft size={18} /> Kembali ke Toko
          </Link>
        </div>
      </aside>

      {/* Main Content: Pastikan ada ML-72 agar tidak tertutup sidebar */}
      <main className="flex-1 ml-72 p-10">
        <Outlet /> 
      </main>
    </div>
  );
}