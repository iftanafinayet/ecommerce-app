// backend/controllers/orderController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const getSummary = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await User.countDocuments();
  const products = await Product.countDocuments();
  
  // Ambil data penjualan harian (opsional untuk chart nanti)
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.send({
    users,
    orders: orders.length === 0 ? 0 : orders[0].numOrders,
    dailyOrders,
    totalSales: orders.length === 0 ? 0 : orders[0].totalSales,
    products,
  });
});