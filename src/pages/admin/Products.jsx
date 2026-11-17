import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: 'Wigs',
    price: 0,
    description: '',
    stock: 0,
    isFeatured: false,
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/products/${editId}`, form);
    } else {
      await api.post('/products', form);
    }
    setEditId(null);
    setForm({ name: '', category: 'Wigs', price: 0, description: '', stock: 0, isFeatured: false });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description || '',
      stock: product.stock,
      isFeatured: product.isFeatured || false,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-display font-bold text-ink mb-8">Manage Products</h1>

      {/* Add / Edit form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <input
          type="text" placeholder="Product name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required className="border border-line rounded px-3 py-2"
        />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
          className="border border-line rounded px-3 py-2">
          <option>Wigs</option>
          <option>Cosmetics</option>
          <option>Hair Tools</option>
          <option>Hair Care</option>
          <option>Accessories</option>
          <option>Skincare</option>
        </select>
        <input
          type="number" placeholder="Price (₦)" value={form.price}
          onChange={e => setForm({ ...form, price: +e.target.value })}
          required className="border border-line rounded px-3 py-2"
        />
        <input
          type="number" placeholder="Stock" value={form.stock}
          onChange={e => setForm({ ...form, stock: +e.target.value })}
          required className="border border-line rounded px-3 py-2"
        />
        <textarea
          placeholder="Description" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="col-span-2 border border-line rounded px-3 py-2"
          rows="2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox" checked={form.isFeatured}
            onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
          /> Featured
        </label>
        <button type="submit" className="col-span-full bg-gold text-ink py-2 rounded font-bold uppercase">
          {editId ? 'Update' : 'Add'} Product
        </button>
      </form>

      {/* Product list */}
      <div className="space-y-4">
        {products.map(product => (
          <div key={product._id} className="flex justify-between items-center border border-line p-4 rounded-xl bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-ink-70 text-sm">
                  ₦{product.price?.toLocaleString()} · {product.category} · Stock: {product.stock}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(product)} className="text-gold underline text-sm">Edit</button>
              <button onClick={() => handleDelete(product._id)} className="text-deep underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}