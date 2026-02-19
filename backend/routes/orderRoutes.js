import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';


const router = express.Router();

// 1. Ambil SEMUA pesanan (Hanya untuk Admin)
// Endpoint: GET /api/orders
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  // .populate('user', 'id name') berfungsi mengambil info nama pembeli dari tabel User
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
}));

// 2. Ambil pesanan milik user yang sedang login
router.get('/myorders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
}));

// 3. Summary Dashboard (PENTING untuk grafik)
router.get('/summary', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  const users = await User.countDocuments();
  const products = await Product.countDocuments();
  
  const totalSales = orders.reduce((acc, item) => acc + item.totalPrice, 0);

  // Simulasi data harian untuk grafik (atau gunakan agregasi MongoDB)
  const dailySales = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  res.json({
    users,
    orders: orders.length,
    products,
    totalSales,
    dailySales
  });
}));

// 4. Create Order
router.post('/', protect, asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
}));

export default router;