import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6 text-gold">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mb-4">Order Placed!</h1>
        <p className="text-ink-70 mb-8 max-w-md mx-auto">Thank you for shopping with us. You'll receive a confirmation email soon.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/shop" className="px-8 py-3 bg-ink text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-ink/90 transition">Continue Shopping</Link>
          <Link to="/dashboard" className="px-8 py-3 border border-gold text-gold rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-white transition">View Dashboard</Link>
        </div>
      </div>
    </div>
  );
}