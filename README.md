# 🛍️ Merchify - Fullstack E-Commerce Solution

Merchify adalah platform e-commerce modern yang dibangun menggunakan **MERN Stack** (MongoDB, Express, React, Node.js). Project ini mengedepankan performa tinggi, keamanan tipe data dengan TypeScript, dan pengalaman Admin yang premium.

## 🌟 Fitur Utama

### 🖥️ Dashboard Admin (New Update!)
- **Elegant Navigation**: Sidebar modern dengan *Active State Indicator* menggunakan Framer Motion.
- **Order Management**: Kelola pesanan masuk, pantau status pembayaran, dan tandai pengiriman secara real-time.
- **Product Inventory**: CRUD Produk lengkap dengan sistem manajemen stok otomatis.
- **Smart Alerts**: Integrasi SweetAlert2 untuk konfirmasi penghapusan data yang aman.
- **Optimistic UI**: Penghapusan data terasa instan karena state diperbarui sebelum reload halaman.

### 👤 User Experience
- **Smooth Shopping**: Pencarian produk dan navigasi kategori yang cepat.
- **Secure Checkout**: Integrasi autentikasi berbasis JWT.
- **Order History**: Pelanggan dapat melihat riwayat pesanan mereka sendiri.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js dengan Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State & Auth**: React Context API
- **Networking**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB dengan Mongoose ODM
- **Security**: JWT & Bcrypt.js

---

## 📁 Struktur Folder

```text
merchify/
├── backend/            # Express Server & Logic
│   ├── controllers/    # Logika CRUD (Order, Product, User)
│   ├── models/         # Skema MongoDB
│   ├── routes/         # Endpoint API
│   └── middleware/     # Auth & Admin Protection
├── frontend/           # React Frontend (Vite)
│   ├── src/
│   │   ├── app/        # Halaman & Screens
│   │   ├── components/ # UI Reusable Components
│   │   ├── context/    # AuthContext & State
│   │   └── lib/        # API Axios Instance
└── .env                # Environment Variables