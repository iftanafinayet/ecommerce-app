import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardList, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Search,
  Trash2
} from "lucide-react";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export function OrderListScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 1. Proteksi: Hanya admin yang boleh masuk
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      // Tambahkan pengecekan token untuk TypeScript
      if (!user?.token) return;

      try {
        setIsLoading(true);
        const data = await api.orders.getAllOrders(user.token);
        setOrders(data);
      } catch (err) {
        console.error("Gagal mengambil data pesanan", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const deleteHandler = async (id: string) => {
    // 2. Guard Clause untuk menghindari error 'user is possibly null'
    if (!user || !user.token) return;

    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // Rose 600
      cancelButtonColor: "#64748b", // Slate 500
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        await api.orders.deleteOrder(id, user.token);
        setOrders(orders.filter(order => order._id !== id));
        Swal.fire("Terhapus!", "Pesanan berhasil dihapus.", "success");
      } catch (err) {
        Swal.fire("Gagal!", "Gagal menghapus pesanan.", "error");
      }
    }
  };

  // Filter pencarian berdasarkan ID atau Nama User
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );

  // 3. Tambahan: Proteksi Render Utama
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-slate-900 p-2 rounded-lg text-white">
                <ClipboardList size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Manage Orders
              </h1>
            </div>
            <p className="text-slate-500 font-medium">Pantau dan kelola seluruh transaksi pelanggan.</p>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Cari ID atau Nama..."
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paid</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Delivered</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6">
                        <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                          #{order._id.substring(0, 12)}
                        </span>
                      </td>
                      <td className="p-6 text-sm font-black text-slate-900">
                        {order.user ? order.user.name : "Guest User"}
                      </td>
                      <td className="p-6 text-sm text-slate-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-6 text-sm font-black text-slate-900">
                        Rp {order.totalPrice?.toLocaleString('id-ID') || '0'}
                      </td>
                      <td className="p-6">
                        {order.isPaid ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-black uppercase">Paid</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-rose-500 bg-rose-50 px-3 py-1 rounded-full w-fit border border-rose-100">
                            <XCircle size={14} />
                            <span className="text-[10px] font-black uppercase">Unpaid</span>
                          </div>
                        )}
                      </td>
                      <td className="p-6">
                        {order.isDelivered ? (
                          <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit border border-blue-100">
                            <CheckCircle2 size={14} />
                            <span className="text-[10px] font-black uppercase">Delivered</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit border border-amber-100">
                            <XCircle size={14} />
                            <span className="text-[10px] font-black uppercase">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => navigate(`/admin/order/${order._id}`)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => deleteHandler(order._id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-20 text-center text-slate-400 font-medium">
                      Tidak ada pesanan yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}