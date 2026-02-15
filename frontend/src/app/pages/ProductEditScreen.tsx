import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, Loader2, UploadCloud, Package } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export function ProductEditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setBrand(data.brand || "");
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat produk", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // FUNGSI PINTAR: Mencari token di localStorage secara otomatis
  const getValidToken = () => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || "");
          if (item && item.token) return item.token;
        } catch (e) {
          continue;
        }
      }
    }
    return null;
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = getValidToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Sesi Tidak Ditemukan',
        text: 'Sesi admin tidak ditemukan. Silakan login ulang.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
      Swal.fire({
        icon: 'success',
        title: 'Sukses',
        text: 'Gambar berhasil diupload!',
        confirmButtonColor: '#2563eb'
      });
    } catch (error: any) {
      setUploading(false);
      const message = error.response?.data?.message || "Gagal mengupload gambar";
      Swal.fire({
        icon: 'error',
        title: 'Gagal Upload',
        text: message,
        confirmButtonColor: '#2563eb'
      });
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = getValidToken();
      
      if (!token) {
        setIsSaving(false);
        Swal.fire({
          icon: 'error',
          title: 'Sesi Tidak Ditemukan',
          text: 'Sesi admin tidak ditemukan. Silakan login ulang.',
          confirmButtonColor: '#2563eb'
        });
        return;
      }

      const config = {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }
      };
      
      const updatedProduct = { 
        name, price, image, category, brand, countInStock, description 
      };
      
      await axios.put(`/api/products/${id}`, updatedProduct, config);
      
      setIsSaving(false);
        Swal.fire({
          icon: 'success',
          title: 'Sukses',
          text: 'Produk berhasil diperbarui!',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          navigate("/admin/productsList");
        });
      navigate("/admin/productsList");
    } catch (err: any) {
      setIsSaving(false);
      const message = err.response?.data?.message || "Terjadi kesalahan";
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: message,
        confirmButtonColor: '#2563eb'
      });
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-slate-900" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <Link to="/admin/productsList" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors font-medium">
          <ArrowLeft size={18} /> Kembali ke Daftar Produk
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Package size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Edit Produk</h2>
                <p className="text-slate-500 text-sm">Update detail informasi produk Anda</p>
              </div>
            </div>
          </div>

          <form onSubmit={submitHandler} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nama Produk</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Harga ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kategori</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Stok</label>
                <input type="number" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Deskripsi</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Foto Produk</label>
              <div className="border-2 border-dashed border-slate-200 p-6 rounded-[2rem] text-center bg-slate-50/50">
                <div className="flex flex-col items-center">
                  <UploadCloud size={32} className="text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 mb-4 truncate w-full px-4">{image || "Pilih gambar (JPG/PNG)"}</p>
                  <input type="file" onChange={uploadFileHandler} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload" className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                    Pilih File
                  </label>
                  {uploading && <Loader2 className="animate-spin text-slate-900 mt-4" />}
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSaving || uploading} className="w-full bg-slate-900 text-white py-4 rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              Simpan Perubahan
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}