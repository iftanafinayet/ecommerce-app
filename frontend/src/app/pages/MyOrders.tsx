import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  MapPin, 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import Swal from "sweetalert2";

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress: {
    address: string;
    city: string;
  };
  paymentMethod: string;
  orderItems: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
    product: string;
  }>;
}

export function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        // Memanggil api.orders.getMyOrders dari lib/api.ts
        const data = await api.orders.getMyOrders(user.token);
        
        // Normalisasi data: Beberapa backend mengirimkan { orders: [] } 
        // sementara yang lain langsung mengirimkan []
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Gagal memuat pesanan';
        setError(message);
        
        if (err.response?.status === 401) {
          Swal.fire({ 
            icon: 'error', 
            title: 'Sesi Berakhir', 
            text: 'Silakan login kembali untuk melihat pesanan.',
            confirmButtonColor: '#0f172a'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <ShoppingBag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900" size={20} />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Menghubungkan ke server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-slate-900 tracking-tight"
            >
              My Orders
            </motion.h1>
            <p className="text-slate-500 mt-2">Daftar riwayat belanja Anda di Merchify</p>
          </div>
          <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm self-start flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-slate-900">{orders.length} Transaksi</span>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-5 rounded-[1.5rem] mb-8 flex items-center gap-4 text-rose-600 shadow-sm">
            <AlertCircle size={24} />
            <p className="text-sm font-bold tracking-tight">{error}</p>
          </div>
        )}

        {orders.length === 0 && !error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 rounded-[3rem] p-20 text-center shadow-2xl shadow-slate-200/50"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
              <Package size={48} className="text-slate-200" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Belum ada belanjaan</h2>
            <p className="text-slate-500 mb-10 max-w-xs mx-auto leading-relaxed">
              Keranjangmu masih kosong. Yuk, cari merchandise keren sekarang!
            </p>
            <button 
              onClick={() => navigate("/")}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/30 active:scale-95"
            >
              Mulai Belanja
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-8">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-slate-400 transition-all hover:shadow-2xl hover:shadow-slate-200/80"
              >
                {/* Order Top Bar */}
                <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg shadow-slate-900/20">
                        <Package size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Transaction ID</p>
                        <p className="text-sm font-mono font-black text-slate-900">{order._id}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-tighter">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex gap-2">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            order.isPaid 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                              : 'bg-rose-50 border-rose-100 text-rose-600'
                         }`}>
                           {order.isPaid ? '• Lunas' : '• Pending'}
                         </span>
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            order.isDelivered 
                              ? 'bg-blue-50 border-blue-100 text-blue-600' 
                              : 'bg-amber-50 border-amber-100 text-amber-600'
                         }`}>
                           {order.isDelivered ? '• Sampai' : '• Proses'}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left md:text-right flex flex-col justify-between items-start md:items-end">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Belanja</p>
                      <p className="tracking-wide text-4xl font-black text-slate-900 tracking-tighter">
                        Rp {order.totalPrice.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="mt-6 flex items-center gap-2 text-sm font-black text-slate-900 group/btn"
                    >
                      DETAIL PESANAN
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-100 bg-slate-50/50">
                  <div className="p-8 flex items-start gap-4 border-b md:border-b-0 md:border-r border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 text-slate-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Pengiriman</p>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                      </p>
                    </div>
                  </div>
                  <div className="p-8 flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200 text-slate-400">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Metode Pembayaran</p>
                      <p className="text-sm text-slate-700 font-black uppercase tracking-tight">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Summary Overlay */}
                <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center justify-between">
                   <div className="flex flex-wrap gap-3">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-3">
                           <span className="text-xs font-black text-slate-900">{item.quantity}x</span>
                           <span className="text-[11px] text-slate-500 font-bold uppercase tracking-tight truncate max-w-[120px]">
                            {item.name}
                           </span>
                        </div>
                      ))}
                   </div>
                   <div className="hidden md:block">
                      <Package size={20} className="text-slate-100" />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}