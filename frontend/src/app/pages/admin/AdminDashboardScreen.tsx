import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Package, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboardScreen() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (user?.token) {
          const data = await api.admin.getSummary(user.token);
          setSummary(data);
        }
      } catch (err) {
        console.error("Gagal memuat summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [user]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-slate-900" size={40} />
    </div>
  );

  const stats = [
    { title: 'Total Revenue', value: `Rp ${summary?.totalSales?.toLocaleString('id-ID')}`, icon: <DollarSign />, color: 'bg-emerald-500', trend: '+12.5%' },
    { title: 'Total Orders', value: summary?.orders, icon: <ShoppingBag />, color: 'bg-blue-600', trend: '+5.2%' },
    { title: 'Products', value: summary?.products, icon: <Package />, color: 'bg-amber-500', trend: '0%' },
    { title: 'Total Users', value: summary?.users, icon: <Users />, color: 'bg-rose-500', trend: '+2.1%' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black text-slate-900 tracking-tight"
        >
          DASHBOARD OVERVIEW
        </motion.h1>
        <p className="text-slate-500 font-medium">Selamat datang kembali, {user?.name}. Inilah statistik tokomu.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-300/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`${item.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
                </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} /> {item.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.title}</p>
              <p className="text-2xl font-black text-slate-900">{item.value || 0}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Peningkatan Penjualan!</h2>
            <p className="text-slate-400 max-w-md mb-6 text-sm">Strategi marketing bulan ini berhasil meningkatkan konversi sebesar 15%. Terus pantau stok produk unggulanmu.</p>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors">
              Lihat Laporan Detail
            </button>
          </div>
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <ShoppingBag size={200} />
          </div>
        </div>
        
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
           <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Quick Actions</h3>
           <div className="space-y-3">
              <button className="w-full py-4 px-6 bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs text-left hover:bg-slate-100 transition-all border border-slate-100">Add New Product</button>
              <button className="w-full py-4 px-6 bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs text-left hover:bg-slate-100 transition-all border border-slate-100">Review Pending Orders</button>
              <button className="w-full py-4 px-6 bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs text-left hover:bg-slate-100 transition-all border border-slate-100">Broadcast Promo</button>
           </div>
        </div>
      </div>
    </div>
  );
}