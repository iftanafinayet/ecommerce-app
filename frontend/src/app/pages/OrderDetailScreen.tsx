import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  CreditCard, 
  MapPin, 
  Package, 
  ExternalLink,
  ShieldCheck,
  ReceiptText,
  Truck // Tambahkan Truck icon
} from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../context/AuthContext";
import { OrderProgress } from "./OrderProgres";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export function OrderDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGIKA FETCH DATA ---
  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      if (id && user?.token) {
        const data = await api.orders.getOrderDetails(id, user.token);
        setOrder(data);
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal memuat detail pesanan',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, user?.token]);

  // --- LOGIKA ADMIN UPDATE STATUS ---
  const deliverHandler = async () => {
    try {
      if (!user?.token) return;
      
      const result = await Swal.fire({
        title: 'Konfirmasi Pengiriman',
        text: "Apakah Anda yakin ingin menandai pesanan ini sudah terkirim?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0f172a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Sudah Terkirim'
      });

      if (result.isConfirmed) {
        await api.orders.updateToDelivered(order._id, user.token);
        await fetchOrder(); // Refresh data setelah update
        Swal.fire('Berhasil!', 'Status pesanan diperbarui menjadi Terkirim.', 'success');
      }
    } catch (err: any) {
      Swal.fire('Error', 'Gagal memperbarui status pengiriman', 'error');
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Link to="/my-orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold transition-all group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Pesanan Saya
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <OrderProgress orderId={order._id} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-slate-100 rounded-2xl text-slate-900">
                  <Package size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rincian Produk</h3>
              </div>

              <div className="space-y-6">
                {order.orderItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-slate-900 text-lg mb-1">{item.name}</h4>
                      <p className="text-slate-500 font-medium text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-900 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <ReceiptText size={20} /> Ringkasan
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${(order.totalPrice - order.shippingPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ongkos Kirim</span>
                  <span className="text-white">${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/10 my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 font-bold">Total</span>
                  <span className="text-3xl font-black">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Pembayaran */}
              <div className={`w-full py-4 rounded-2xl text-center font-black text-sm uppercase tracking-widest ${
                order.isPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500 text-white'
              }`}>
                {order.isPaid ? '✓ Lunas' : 'Menunggu Bayar'}
              </div>

              {/* TOMBOL ADMIN: Tampil hanya jika user adalah admin, sudah bayar, tapi belum dikirim */}
              {user?.isAdmin && order.isPaid && !order.isDelivered && (
                <button
                  onClick={deliverHandler}
                  className="w-full mt-4 bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Truck size={18} />
                  Mark as Delivered
                </button>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 flex-shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">Alamat</h4>
                    <p className="text-sm text-slate-500">
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-600 mb-4 font-bold text-sm">
                    <ShieldCheck size={18} /> Transaksi Aman
                  </div>
                  <button className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase hover:bg-slate-100 flex items-center justify-center gap-2">
                    Invoice <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}