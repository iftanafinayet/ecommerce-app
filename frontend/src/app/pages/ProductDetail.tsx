import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Package, Shield, Truck } from "lucide-react";
import { api } from "../../lib/api";
import { useCart } from "../context/CartContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types/product";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await api.products.getById(id);
          setProduct(data);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={20}
            className={index < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.countInStock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="sticky top-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl overflow-hidden aspect-square border border-slate-200 shadow-2xl shadow-slate-900/10">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 uppercase tracking-widest mb-4 w-fit font-semibold">
              {product.brand}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {renderStars(product.rating)}
                <span className="text-slate-900 font-semibold">{product.rating}</span>
              </div>
              <span className="text-slate-500">•</span>
              <span className="text-slate-600">
                {product.numReviews} reviews
              </span>
            </div>

            <div className="mb-8">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Truck className="text-emerald-600 mb-2" size={24} />
                <span className="text-xs text-slate-600 text-center font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Shield className="text-emerald-600 mb-2" size={24} />
                <span className="text-xs text-slate-600 text-center font-medium">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Package className="text-emerald-600 mb-2" size={24} />
                <span className="text-xs text-slate-600 text-center font-medium">Easy Returns</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-700 font-semibold text-lg">Availability</span>
                {product.countInStock > 0 ? (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30"
                  >
                    {product.countInStock} In Stock
                  </motion.span>
                ) : (
                  <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-full shadow-lg shadow-rose-500/30">
                    Out of Stock
                  </span>
                )}
              </div>

              {product.countInStock > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-slate-700 font-semibold">Quantity</span>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                      <motion.button
                        whileHover={{ backgroundColor: "rgb(241, 245, 249)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={20} className="text-slate-700" />
                      </motion.button>
                      <span className="px-8 py-3 font-bold text-slate-900 text-lg">
                        {quantity}
                      </span>
                      <motion.button
                        whileHover={{ backgroundColor: "rgb(241, 245, 249)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.countInStock}
                        className="p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={20} className="text-slate-700" />
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 text-lg"
                  >
                    <ShoppingCart size={22} />
                    <AnimatePresence mode="wait">
                      {addedToCart ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          Added to Cart!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          Add to Cart
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
