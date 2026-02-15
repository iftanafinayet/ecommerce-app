import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';

// IMPORT ROUTES (Pastikan hanya SATU kali per variabel)
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

// Koneksi ke Database
connectDB();

const app = express();

// Middleware CORS untuk mengizinkan permintaan dari frontend
app.use(cors({
  origin: 'http://localhost:5173', // Ganti dengan URL frontend Anda
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware agar bisa baca JSON di body request
app.use(express.json());

// REGISTER ROUTES
// Pastikan tidak ada deklarasi ulang variabel 'productRoutes' di sini
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Membuat folder 'uploads' menjadi static agar gambar bisa diakses browser
const __filename = path.resolve();
app.use('/uploads', express.static(path.join(__filename, '/uploads')));

// Root API
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Port Configuration
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);