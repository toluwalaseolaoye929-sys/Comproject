import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-ink-70 px-6">
        <h2 className="text-3xl font-display font-bold text-ink mb-4">Your cart is empty</h2>
        <p className="mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="px-6 py-3 bg-gold text-ink rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gold/90 transition">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-display font-bold text-ink mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cart.map(item => (
          <div key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-line rounded-2xl p-4 bg-white">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-bg flex-shrink-0">
              <img src={item.images?.[0] || 'https://via.placeholder.com/80'} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-ink-45 text-sm">₦{item.price?.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-line flex items-center justify-center hover:border-gold transition">−</button>
              <span className="w-8 text-center text-ink">{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-line flex items-center justify-center hover:border-gold transition">+</button>
            </div>
            <div className="text-right min-w-[80px]">
              <p className="font-bold text-ink">₦{((item.price || 0) * item.quantity).toLocaleString()}</p>
              <button onClick={() => removeFromCart(item._id)} className="text-xs text-deep hover:text-red-700 mt-1 transition">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-line mt-10 pt-8 flex flex-col sm:flex-row justify-between items-end gap-6">
        <div>
          <p className="text-ink-70 text-sm">Subtotal</p>
          <p className="text-3xl font-bold text-gold">₦{totalPrice.toLocaleString()}</p>
        </div>
        <Link to="/checkout" className="px-8 py-4 bg-gold text-ink rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gold/90 transition text-center">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}