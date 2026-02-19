import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else { res.status(404); throw new Error('Produk tidak ditemukan'); }
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } = req.body;
  
  const product = new Product({
    name,
    price,
    user: req.user._id,
    image: req.file ? `/uploads/${req.file.filename}` : '/uploads/sample.jpg',
    brand,
    category,
    countInStock,
    description,
    rating: 0,
    numReviews: 0
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404); throw new Error('Produk tidak ditemukan');
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Produk dihapus' });
  } else {
    res.status(404); throw new Error('Produk tidak ditemukan');
  }
});