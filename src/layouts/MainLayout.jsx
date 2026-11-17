import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false); // dropdown for secondary links
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
    scrolled || !isHome ? 'bg-ink/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
  }`;

  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Header */}
      <header className={navClass}>
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
          {/* Logo */}
          <Link to="/" className="text-2xl font-display font-bold tracking-wide text-white">
            Suzan <span className="text-gold italic">Unisex Salon</span>
          </Link>

          {/* Desktop links – clean & minimal */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#services" className="text-xs uppercase tracking-widest text-white/80 hover:text-gold transition">Services</Link>
            <Link to="/shop" className="text-xs uppercase tracking-widest text-white/80 hover:text-gold transition">Shop</Link>

            {/* "More" dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="text-xs uppercase tracking-widest text-white/80 hover:text-gold transition"
              >
                More ▾
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white text-ink rounded-lg shadow-xl border border-line py-2 w-40 z-50">
                  <Link to="/#gallery" onClick={() => setMoreOpen(false)} className="block px-4 py-2 text-sm hover:bg-bg">Gallery</Link>
                  <Link to="/#stylists" onClick={() => setMoreOpen(false)} className="block px-4 py-2 text-sm hover:bg-bg">Stylists</Link>
                  <Link to="/#pricing" onClick={() => setMoreOpen(false)} className="block px-4 py-2 text-sm hover:bg-bg">Pricing</Link>
                  <Link to="/#contact" onClick={() => setMoreOpen(false)} className="block px-4 py-2 text-sm hover:bg-bg">Contact</Link>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative text-white/80 hover:text-gold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-ink text-[10px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-white/60">Hi, {user.name}</span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs text-gold hover:text-white">Admin</Link>
                )}
                <button onClick={logout} className="text-xs text-white/60 hover:text-white">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block text-xs text-white/80 hover:text-gold">Sign In</Link>
            )}

            {/* Book Now CTA */}
            <Link to="/book" className="hidden md:inline-flex bg-gold text-ink px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold hover:shadow-lg hover:scale-105 transition-transform">
              Book Now
            </Link>

            {/* Mobile burger */}
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile panel (simplified) */}
      {/* Mobile panel */}
{mobileOpen && (
  <div className="fixed inset-0 z-50 flex justify-end">
    <div className="w-4/5 max-w-sm bg-ink p-8 flex flex-col gap-6">
      <button onClick={() => setMobileOpen(false)} className="self-end text-3xl text-white">&times;</button>
      <Link to="/" onClick={() => setMobileOpen(false)} className="text-white">Home</Link>
      <Link to="/#services" onClick={() => setMobileOpen(false)} className="text-white">Services</Link>
      <Link to="/shop" onClick={() => setMobileOpen(false)} className="text-white">Shop</Link>
      <Link to="/#gallery" onClick={() => setMobileOpen(false)} className="text-white">Gallery</Link>
      <Link to="/#stylists" onClick={() => setMobileOpen(false)} className="text-white">Stylists</Link>
      <Link to="/#pricing" onClick={() => setMobileOpen(false)} className="text-white">Pricing</Link>
      <Link to="/#contact" onClick={() => setMobileOpen(false)} className="text-white">Contact</Link>

      {/* ✅ Mobile admin link */}
      {user?.role === 'admin' && (
        <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-gold font-bold">Admin Panel</Link>
      )}

      <Link to="/book" onClick={() => setMobileOpen(false)} className="bg-gold text-ink py-3 rounded text-center font-bold">Book Now</Link>
    </div>
  </div>
)}

      <main className={isHome ? '' : 'pt-24'}>
        <Outlet />
      </main>

      {/* Footer (simplified – we'll expand later) */}
      <footer className="bg-[#0b0b0b] text-white/70 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-display text-white mb-3">Suzan <span className="text-gold italic">Unisex Salon</span></div>
            <p className="text-sm">Premium hair, beauty and grooming in Amuwo Odofin, Lagos.</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services">Services</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#stylists">Stylists</a></li>
              <li><Link to="/shop">Shop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>+234 000 000 0000</li>
              <li>hello@suzansalon.com</li>
              <li>Amuwo Odofin, Lagos</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white mb-4">Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Mon – Sat: 8am – 8pm</li>
              <li>Sunday: 10am – 6pm</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Suzan Unisex Salon. All rights reserved.
        </div>
      </footer>
    </div>
  );
}