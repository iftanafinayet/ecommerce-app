import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

export function Cart() {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center"
          >
            <ShoppingBag size={48} className="text-slate-400" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Your cart is empty
          </h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Start shopping to add items to your cart and enjoy our amazing products
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-xl shadow-slate-900/20"
          >
            Start Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-slate-900 mb-8"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 flex gap-5 hover:shadow-xl transition-all"
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                          Product
                        </div>
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {item.name}
                        </h3>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item._id)}
                        className="text-rose-500 hover:text-rose-600 p-2 h-fit"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                        <motion.button
                          whileHover={{ backgroundColor: "rgb(241, 245, 249)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-2.5"
                        >
                          <Minus size={16} className="text-slate-700" />
                        </motion.button>
                        <span className="px-5 py-2 font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileHover={{ backgroundColor: "rgb(241, 245, 249)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.countInStock}
                          className="p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} className="text-slate-700" />
                        </motion.button>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Rp {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-6 sticky top-24 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">Rp {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="border-t border-slate-300 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Rp {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all mb-3 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="w-full py-4 border-2 border-slate-200 text-slate-900 font-semibold rounded-2xl hover:bg-slate-50 transition-all"
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
