import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit, Plus, Loader2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

export function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      // Gunakan endpoint yang konsisten
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Gagal mengambil produk", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Produk?',
      text: 'Data produk yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48', // warna rose-600
      cancelButtonColor: '#64748b', // warna slate-500
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: '#ffffff',
      borderRadius: '20px'
    });

    if (result.isConfirmed) {
      try {
        // Ambil token dari localStorage
        let token = null;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            try {
              const item = JSON.parse(localStorage.getItem(key) || "");
              if (item && item.token) {
                token = item.token;
                break;
              }
            } catch (e) { continue; }
          }
        }

        if (!token) {
          Swal.fire('Error', 'Sesi login tidak ditemukan', 'error');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Ganti URL ke localhost:5000 jika proxy belum jalan
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        
        // Update state lokal supaya tidak perlu reload halaman
        setProducts(products.filter((p: any) => p._id !== id));
        
        Swal.fire({
          title: 'Terhapus!',
          text: 'Produk berhasil dihapus dari katalog.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
      } catch (err: any) {
        const message = err.response?.data?.message || "Gagal menghapus produk";
        Swal.fire('Gagal!', message, 'error');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-slate-900" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-slate-900 p-2 rounded-lg text-white">
                <Package size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Product Catalog
              </h1>
            </div>
            <p className="text-slate-500 font-medium">Kelola stok, harga, dan informasi produk Merchify.</p>
          </div>

          <button 
            onClick={() => navigate('/admin/product/create')}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 font-bold text-sm"
          >
            <Plus size={20} /> Create New Product
          </button>
        </div>

        {/* Table Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Name</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length > 0 ? (
                  products.map((product: any) => (
                    <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 font-black text-slate-900 text-sm">{product.name}</td>
                      <td className="p-6">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-700">
                        Rp {product.price.toLocaleString('id-ID')}
                      </td>
                      <td className="p-6 text-sm">
                        <span className={`font-bold ${product.countInStock <= 5 ? 'text-rose-500' : 'text-slate-600'}`}>
                          {product.countInStock}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteHandler(product._id)}
                            className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-slate-400 font-medium">
                      Belum ada produk. Silakan tambahkan produk baru.
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