import Order from '../models/orderModel.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';

// backend/controllers/orderController.js
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Menggunakan deleteOne() karena remove() sudah deprecated di versi Mongoose terbaru
      await Order.deleteOne({ _id: req.params.id });
      res.json({ message: 'Order berhasil dihapus' });
    } else {
      res.status(404).json({ message: 'Order tidak ditemukan' });
    }
  } catch (error) {
    // Ini yang menyebabkan Error 500 jika tidak ditangani dengan try-catch
    res.status(500).json({ message: error.message });
  }
};

export { updateOrderToDelivered, deleteOrder };