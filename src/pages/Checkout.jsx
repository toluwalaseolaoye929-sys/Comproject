import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' });

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-ink-70 px-6">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="text-gold underline mt-2">Go to shop</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const orderItems = cart.map(item => ({ product: item._id, quantity: item.quantity, price: item.price }));
      await api.post('/orders', { items: orderItems, shippingAddress: address });
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-display font-bold text-ink mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-ink mb-2">Shipping Address</h2>
          <input type="text" placeholder="Street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} required className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-45 outline-none focus:border-gold" />
          <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} required className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-45 outline-none focus:border-gold" />
          <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} required className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-45 outline-none focus:border-gold" />
          <input type="text" placeholder="ZIP Code" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} className="w-full bg-white border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-45 outline-none focus:border-gold" />
          {error && <p className="text-deep text-sm">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full py-4 bg-gold text-ink rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gold/90 transition disabled:opacity-60">
            {submitting ? 'Placing order...' : 'Place Order'}
          </button>
        </form>

        <div className="bg-white border border-line rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-semibold text-ink mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-ink">
                <span>{item.name} × {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line mt-4 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-gold">₦{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}