import { Link } from "react-router-dom";
import { Star, StarHalf } from "lucide-react";
import { Product } from "./types/product";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Logic untuk menentukan URL Gambar
  // Jika image dimulai dengan http, gunakan langsung. 
  // Jika tidak, sambungkan ke port backend (5000)
  const imageUrl = product.image.startsWith('http') 
    ? product.image 
    : `http://localhost:5000${product.image}`;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          size={14}
          className="fill-yellow-400 text-yellow-400"
        />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          size={14}
          className="fill-yellow-400 text-yellow-400"
        />
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          size={14}
          className="text-slate-300"
        />
      );
    }

    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <Link to={`/product/${product._id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-900/10 hover:border-slate-300 transition-all duration-300"
      >
        <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          <ImageWithFallback
            src={imageUrl} // Menggunakan variable imageUrl yang sudah diproses
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Stock Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3"
          >
            {product.countInStock > 0 ? (
              <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                In Stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-rose-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                Out of Stock
              </span>
            )}
          </motion.div>
        </div>
        
        <div className="p-5">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">
            {product.brand}
          </div>
          
          <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 h-12 leading-6">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-4">
            {renderStars(product.rating)}
            <span className="text-xs text-slate-500 font-medium">
              {product.rating}
            </span>
            <span className="text-xs text-slate-400">
              ({product.numReviews})
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Rp {product.price.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </motion.div>
    </Link>
  );
}