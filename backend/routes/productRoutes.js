import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  getProducts, getProductById, createProduct, updateProduct, deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Gambar disimpan di folder uploads/
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct); // Support upload

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct) // Support update gambar
  .delete(protect, admin, deleteProduct);

export default router;