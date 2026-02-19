import React, { useEffect, useState } from 'react';
import { Trash2, Edit, Plus, Loader2, Package } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { ProductModal } from './ProductModal';
import { api, getImageUrl } from '../../lib/api'; 
import { useAuth } from '../context/AuthContext';

export function ProductListScreen() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Mengambil data produk dari backend port 5000
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Gagal mengambil produk", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler Simpan: Mendukung Upload File & Category
  const saveHandler = async (formDataWithFile: any) => {
    try {
      if (!user?.token) return Swal.fire('Error', 'Sesi login habis', 'error');

      // Menggunakan FormData agar bisa mengirim file gambar dari komputer
      const data = new FormData();
      data.append('name', formDataWithFile.name);
      data.append('price', formDataWithFile.price.toString());
      data.append('category', formDataWithFile.category); // Field Kategori
      data.append('brand', formDataWithFile.brand);
      data.append('countInStock', formDataWithFile.countInStock.toString());
      data.append('description', formDataWithFile.description || 'No description');
      
      if (formDataWithFile.imageFile) {
        data.append('image', formDataWithFile.imageFile); // File gambar
      }

      if (editingProduct) {
        await api.products.update(editingProduct._id, data, user.token);
      } else {
        await api.products.create(data, user.token);
      }

      setModalOpen(false);
      fetchProducts();
      Swal.fire({ icon: 'success', title: 'Berhasil!', timer: 1500, showConfirmButton: false });
    } catch (err: any) {
      Swal.fire('Gagal!', err.response?.data?.message || "Terjadi kesalahan server", 'error');
    }
  };

  const deleteHandler = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Produk?',
      text: "Data akan dihapus permanen dari server.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed && user?.token) {
      try {
        await api.products.delete(id, user.token);
        setProducts(products.filter((p: any) => p._id !== id));
        Swal.fire({ title: 'Terhapus!', icon: 'success', timer: 1500, showConfirmButton: false });
      } catch (err: any) {
        Swal.fire('Gagal!', 'Gagal menghapus produk', 'error');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-slate-900" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-slate-900 p-2 rounded-lg text-white">
                <Package size={20} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Product Catalog</h1>
            </div>
            <p className="text-slate-500 font-medium">Kelola stok, kategori, dan foto produk Anda.</p>
          </div>
          
          <button 
            onClick={() => { setEditingProduct(null); setModalOpen(true); }}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex gap-3 items-center hover:bg-emerald-600 transition-all shadow-lg"
          >
            <Plus size={20} /> Create New Product
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-200">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Image";
                        }}
                      />
                      <span className="text-slate-900 text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{product.category || 'N/A'}</span>
                  </td>
                  <td className="p-6 text-slate-900">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${product.countInStock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setEditingProduct(product); setModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit size={18} /></button>
                      <button onClick={() => deleteHandler(product._id)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
      
      <ProductModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={saveHandler} 
        initialData={editingProduct} 
      />
    </div>
  );
}