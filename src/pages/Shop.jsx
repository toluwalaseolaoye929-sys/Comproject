import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Wigs', 'Cosmetics', 'Hair Tools', 'Hair Care', 'Accessories', 'Skincare'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    setFiltered(result);
  }, [activeCategory, search, sort, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-70">
        <div className="animate-pulse">Loading products…</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-2">Shop Essentials</h1>
      <p className="text-ink-70 mb-10 text-sm">Wigs, cosmetics, tools – find your look.</p>

      {/* Search & sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-white border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-45 outline-none focus:border-gold transition"
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bg-white border border-line rounded-xl px-4 py-3 text-ink outline-none focus:border-gold transition"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest border transition ${
              activeCategory === cat
                ? 'bg-ink text-white border-ink'
                : 'bg-white text-ink-70 border-line hover:bg-ink hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <p className="text-ink-45 text-center py-20">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <div key={product._id} className="group">
              <Link to={`/shop/${product._id}`}>
                <div className="aspect-[3/4] bg-white border border-line rounded-2xl overflow-hidden mb-4 relative">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=300&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="font-medium text-sm text-ink">{product.name}</p>
                <p className="text-ink-45 text-sm">₦{product.price.toLocaleString()}</p>
              </Link>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 w-full py-2 border border-gold text-gold text-xs uppercase tracking-widest rounded-full hover:bg-gold hover:text-white transition font-bold"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}