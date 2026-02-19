import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductModal({ isOpen, onClose, onSave, initialData }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    countInStock: 0,
    brand: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Logic preview: jika ada path gambar lama, tampilkan dari backend
      setPreview(initialData.image?.startsWith('http') ? initialData.image : `http://localhost:5000${initialData.image}`);
    } else {
      setFormData({ name: '', price: 0, description: '', category: '', countInStock: 0, brand: '' });
      setPreview('');
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {initialData ? 'Edit Product' : 'Create Product'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <div className="p-10 max-h-[70vh] overflow-y-auto bg-[#F8FAFC]">
            <div className="grid grid-cols-2 gap-6">
              {/* Nama Produk */}
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Produk</label>
                <input type="text" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>

              {/* Upload Section */}
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Foto Produk</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-48 w-full bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-slate-900 transition-all overflow-hidden group bg-slate-50/30"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <Upload size={20} />
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Pilih Gambar</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kategori</label>
                <input type="text" placeholder="Elektronik, Pakaian, dll" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Brand</label>
                <input type="text" placeholder="Apple, Nike, dll" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                  value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
              </div>

              {/* Harga */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Harga (Rp)</label>
                <input type="number" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                  value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
              </div>

              {/* Stok */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Stok</label>
                <input type="number" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                  value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          <div className="p-10 bg-white border-t border-slate-100">
            <button 
              onClick={() => onSave({ ...formData, imageFile })}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <Save size={20} /> Simpan Produk
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}