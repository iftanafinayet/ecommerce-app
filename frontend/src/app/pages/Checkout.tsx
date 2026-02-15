import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CreditCard, MapPin, Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";

export function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // --- FIX: LOGIKA NAVIGASI OTOMATIS (Mencegah Error Bad SetState) ---
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    } else if (!user) {
      navigate("/login?redirect=checkout");
    }
  }, [cartItems, user, navigate]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 0;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    if (!address) newErrors.address = true;
    if (!city) newErrors.city = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id,
      })),
      shippingAddress: { address, city },
      paymentMethod,
      totalPrice: total,
    };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
      };

      // Mengirim data ke backend (Port 5000)
      await axios.post('http://localhost:5000/api/orders', orderData, config);
      
      clearCart();
      navigate("/orders");
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat pesanan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render null jika sedang dialihkan untuk menghindari kedipan UI
  if (cartItems.length === 0 || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-slate-900 mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <MapPin className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Shipping Address
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                    Street Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors({ ...errors, address: false });
                    }}
                    className={`w-full px-4 py-3.5 bg-slate-50 border ${
                      errors.address ? "border-rose-500" : "border-slate-200"
                    } rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent focus:bg-white transition-all`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm mt-2">
                      Address is required
                    </motion.p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setErrors({ ...errors, city: false });
                    }}
                    className={`w-full px-4 py-3.5 bg-slate-50 border ${
                      errors.city ? "border-rose-500" : "border-slate-200"
                    } rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent focus:bg-white transition-all`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm mt-2">
                      City is required
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center">
                  <CreditCard className="text-white" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-3">
                {["card", "paypal"].map((method) => (
                  <motion.label
                    key={method}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center justify-between p-5 border-2 ${
                      paymentMethod === method ? "border-slate-900 bg-slate-50" : "border-slate-200"
                    } rounded-2xl cursor-pointer transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-slate-900 accent-slate-900"
                      />
                      <span className="font-semibold text-slate-900 capitalize">{method === "card" ? "Credit/Debit Card" : "PayPal"}</span>
                    </div>
                    {paymentMethod === method && (
                      <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-6 sticky top-24 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm py-2">
                    <span className="text-slate-600 flex-1 truncate mr-2">
                      {item.name} <span className="text-slate-400">× {item.quantity}</span>
                    </span>
                    <span className="text-slate-900 font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-6 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {error && <p className="text-rose-500 text-sm mb-4 text-center">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-2xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-xl shadow-slate-900/20 flex justify-center items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Place Order"}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}