import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  PackagePlus, 
  Image as ImageIcon, 
  DollarSign, 
  Loader2, 
  ArrowLeft,
  LayoutGrid,
  Tag
} from "lucide-react";
import Swal from "sweetalert2";

export function ProductCreateScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  // FUNGSI PENGAMBILAN TOKEN OTOMATIS (MENCARI DI SEMUA KEY)
  const getAuthToken = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || "");
          if (item && item.token) return item.token;
        } catch (e) { continue; }
      }
    }
    return null;
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    const token = getAuthToken();

    try {
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
      
      Swal.fire({ 
        icon: 'success', 
        title: 'Gambar Terupload', 
        toast: true, 
        position: 'top-end', 
        showConfirmButton: false, 
        timer: 1500 
      });
    } catch (error) {
      setUploading(false);
      Swal.fire({ icon: 'error', title: 'Upload Gagal', text: 'Gunakan format JPG/PNG' });
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = getAuthToken();

    if (!token) {
      setIsSaving(false);
      Swal.fire({ icon: 'error', title: 'Akses Ditolak', text: 'Sesi habis, silakan login kembali.' });
      return;
    }

    try {
      const config = {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      };

      // Memastikan route sesuai dengan backend (tanpa slash akhir atau dengan slash)
      await axios.post("/api/products", {
        name, price, image, brand, category, countInStock, description
      }, config);
      
      setIsSaving(false);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Produk Jaket Himpunan telah ditambahkan.',
        confirmButtonColor: '#0f172a'
      }).then(() => {
        navigate("/admin/productlist");
      });

    } catch (err: any) {
      setIsSaving(false);
      console.error(err);
      Swal.fire({ 
        icon: 'error', 
        title: 'Gagal Simpan', 
        text: err.response?.data?.message || 'Error 404: Route tidak ditemukan' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <Link to="/admin/productlist" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors">
          <ArrowLeft size={18} /> Kembali ke Daftar
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Form Header */}
          <div className="p-8 border-b border-slate-50 bg-white">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl shadow-lg shadow-slate-900/20">
                <PackagePlus className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Product</h2>
                <p className="text-slate-500">Lengkapi detail produk Merchify Anda</p>
              </div>
            </div>
          </div>

          <form onSubmit={submitHandler} className="p-8 space-y-8">
            {/* Upload Section */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ImageIcon size={16} /> Foto Produk
              </label>
              <div className="border-2 border-dashed border-slate-200 p-8 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center transition-all hover:bg-slate-50">
                <input type="file" id="file-upload" onChange={uploadFileHandler} className="hidden" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  {uploading ? (
                    <Loader2 className="animate-spin text-slate-900" size={32} />
                  ) : image ? (
                    <div className="text-center">
                        <p className="text-emerald-600 font-semibold text-sm">✓ Gambar Terpilih</p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{image}</p>
                    </div>
                  ) : (
                    <>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <ImageIcon className="text-slate-400" size={24} />
                        </div>
                        <span className="text-sm font-medium text-slate-600">Klik untuk upload gambar</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama */}
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Product Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all bg-slate-50/50"
                  placeholder="Contoh: Jaket Himpunan CSS FTUI"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Harga */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="number" 
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50/50"
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Stok */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Stock Count</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50/50"
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                />
              </div>

              {/* Brand */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Brand</label>
                <div className="relative">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                    required
                    type="text" 
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50/50"
                    placeholder="Contoh: Merchify"
                    onChange={(e) => setBrand(e.target.value)}
                    />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">Category</label>
                <div className="relative">
                   <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                    required
                    type="text" 
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50/50"
                    placeholder="Contoh: Apparel"
                    onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-slate-700 mb-2 block">Description</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Jelaskan bahan, ukuran, dan keunggulan produk..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none bg-slate-50/50"
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              disabled={uploading || isSaving}
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <PackagePlus size={20} />}
              Create Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}