import express from 'express';
import Order from '../models/orderModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';


const router = express.Router();

// 1. Route Summary (Untuk halaman Overview yang ada angka-angkanya)
router.get('/summary', protect, admin, async (req, res) => {
  try {
    const ordersStats = await Order.aggregate([
      { $group: { _id: null, numOrders: { $sum: 1 }, totalSales: { $sum: '$totalPrice' } } }
    ]);
    const numUsers = await User.countDocuments();
    const numProducts = await Product.countDocuments();

    res.json({
      users: numUsers,
      orders: ordersStats.length === 0 ? 0 : ordersStats[0].numOrders,
      totalSales: ordersStats.length === 0 ? 0 : ordersStats[0].totalSales,
      products: numProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Route List Orders (Untuk tampilan "Manage Orders" di gambar kamu)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// RUTE UNTUK ADMIN (Harus di atas rute ID)
// ==========================================

// @desc    Ambil semua pesanan (Admin only)
// @route   GET /api/orders
router.get('/', protect, admin, async (req, res) => {
  try {
    // .populate('user', 'id name') berfungsi mengambil data nama user dari tabel User
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// RUTE UNTUK USER BIASA
// ==========================================

// @desc    Get my orders
// @route   GET /api/orders/myorders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Buat order baru
// @route   POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        shippingPrice, 
        totalPrice 
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
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

// ==========================================
// RUTE UPDATE STATUS (Admin Only)
// ==========================================

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order tidak ditemukan' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // GANTI: order.remove() menjadi Order.deleteOne()
      await Order.deleteOne({ _id: req.params.id });
      res.json({ message: 'Order dihapus' });
    } else {
      res.status(404).json({ message: 'Order tidak ditemukan' });
    }
  } catch (error) {
    // Sekarang error akan tertangkap di sini jika ada masalah lain
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order summary for dashboard
// @route   GET /api/orders/summary
router.get('/summary', protect, admin, async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);

    // Kita butuh hitung User dan Product juga
    // Import User dan Product di bagian atas file jika belum ada
    const numUsers = await User.countDocuments();
    const numProducts = await Product.countDocuments();

    res.json({
      users: numUsers,
      orders: orders.length === 0 ? 0 : orders[0].numOrders,
      totalSales: orders.length === 0 ? 0 : orders[0].totalSales,
      products: numProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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