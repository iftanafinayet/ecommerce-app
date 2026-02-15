import express from "express";
import { 
  createProduct, 
  deleteProduct, 
  getProductById, 
  getProducts, 
  updateProduct 
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET & POST /api/products
 * @desc    Get all products or Create a new product (Admin Only)
 */
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

/**
 * @route   GET, PUT, & DELETE /api/products/:id
 * @desc    Get single product, Update, or Delete product (Admin Only)
 */
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;