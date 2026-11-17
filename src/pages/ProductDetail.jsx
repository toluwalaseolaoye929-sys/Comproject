import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/50">
        <div className="animate-pulse">Loading product…</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white/60">
        <p>Product not found.</p>
        <Link to="/shop" className="mt-4 underline hover:text-white">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
      <Link
        to="/shop"
        className="text-gold text-sm hover:underline mb-8 inline-block"
      >
        ← Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-[3/4] bg-white/5 rounded-3xl overflow-hidden">
          <img
            src={
              product.images?.[0] ||
              'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=600&q=80'
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <span className="text-gold/70 text-xs uppercase tracking-[0.3em] font-medium">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">
            {product.name}
          </h1>
          <p className="text-white/60 leading-relaxed mb-6">
            {product.description || 'No description available.'}
          </p>

          <div className="text-3xl font-bold text-gold mb-8">
            ₦{product.price.toLocaleString()}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="w-full md:w-auto px-8 py-4 bg-gold text-black rounded-full font-semibold hover:bg-gold/90 transition"
          >
            Add to Cart – ₦{product.price.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}