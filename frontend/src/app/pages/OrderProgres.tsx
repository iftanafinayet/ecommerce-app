import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../../lib/api';
import { CheckCircle2, Package, Truck, Home, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

interface OrderProgressProps {
  orderId: string;
}

export function OrderProgress({ orderId }: OrderProgressProps) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const steps = [
    { label: 'Pesanan Diterima', icon: Package, min: 0 },
    { label: 'Sedang Diproses', icon: Loader2, min: 30 },
    { label: 'Dalam Pengiriman', icon: Truck, min: 70 },
    { label: 'Sampai Tujuan', icon: Home, min: 100 },
  ];

  useEffect(() => {
    const fetchOrderProgress = async () => {
      if (!user?.token || !orderId) return;
      
      try {
        setIsLoading(true);
        const data = await api.orders.getOrderProgress(orderId, user.token);
        setProgress(data.progress);
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Gagal memuat progress';
        console.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderProgress();
  }, [orderId, user?.token]);

  if (isLoading) return (
    <div className="flex justify-center p-8">
      <Loader2 className="animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-black text-slate-900">Status Pengiriman</h3>
          <p className="text-sm text-slate-500">Pelacakan pesanan secara real-time</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">
          {progress}%
        </div>
      </div>

      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full"></div>
        
        {/* Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-0 h-1.5 bg-slate-900 -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(15,23,42,0.3)]"
        ></motion.div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = progress >= step.min;
            const Icon = step.icon;

            return (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted ? "#0f172a" : "#ffffff",
                    scale: isCompleted ? 1.1 : 1,
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-colors ${
                    isCompleted ? "border-slate-900 shadow-lg shadow-slate-900/20" : "border-slate-200"
                  }`}
                >
                  {isCompleted && progress > step.min ? (
                    <CheckCircle2 className="text-white" size={20} />
                  ) : (
                    <Icon className={isCompleted ? "text-white" : "text-slate-300"} size={20} />
                  )}
                </motion.div>
                <p className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center max-w-[80px] ${
                  isCompleted ? "text-slate-900" : "text-slate-300"
                }`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <p className="text-xs font-bold text-slate-600 italic">
            {progress === 100 
              ? "Pesanan Anda telah tiba di lokasi tujuan." 
              : "Kurir kami sedang memproses pesanan Anda."}
          </p>
        </div>
      </div>
    </div>
  );
}