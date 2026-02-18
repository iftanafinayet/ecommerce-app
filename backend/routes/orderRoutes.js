import express from 'express';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get order summary for dashboard
// @route   GET /api/orders/summary
router.get('/summary', protect, admin, async (req, res) => {
  try {
    // 1. Ambil Statistik Utama
    const ordersStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);

    // 2. Ambil Data Penjualan 7 Hari Terakhir untuk Grafik
    const dailySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    const numUsers = await User.countDocuments();
    const numProducts = await Product.countDocuments();

    res.json({
      users: numUsers,
      orders: ordersStats.length === 0 ? 0 : ordersStats[0].numOrders,
      totalSales: ordersStats.length === 0 ? 0 : ordersStats[0].totalSales,
      products: numProducts,
      dailySales: dailySales.map(item => ({ name: item._id, sales: item.sales }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Ambil semua pesanan (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID (Taruh di bawah /summary)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;