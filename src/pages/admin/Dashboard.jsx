import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-display font-bold text-ink mb-2">Admin Dashboard</h1>
      <p className="text-ink-70 mb-12">Manage your salon from one place.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/admin/services" className="bg-white border border-line rounded-2xl p-8 hover:shadow-md transition">
          <div className="text-3xl mb-4">💇</div>
          <h3 className="text-xl font-display text-ink">Services</h3>
          <p className="text-ink-70 text-sm">Add, edit, or remove services.</p>
        </Link>
        <Link to="/admin/products" className="bg-white border border-line rounded-2xl p-8 hover:shadow-md transition">
          <div className="text-3xl mb-4">🛍️</div>
          <h3 className="text-xl font-display text-ink">Products</h3>
          <p className="text-ink-70 text-sm">Manage shop inventory.</p>
        </Link>
        <Link to="/admin/bookings" className="bg-white border border-line rounded-2xl p-8 hover:shadow-md transition">
          <div className="text-3xl mb-4">📅</div>
          <h3 className="text-xl font-display text-ink">Bookings</h3>
          <p className="text-ink-70 text-sm">View and update appointments.</p>
        </Link>
        <Link to="/admin/locations" className="bg-white border border-line rounded-2xl p-8 hover:shadow-md transition">
          <div className="text-3xl mb-4">📍</div>
          <h3 className="text-xl font-display text-ink">Locations</h3>
          <p className="text-ink-70 text-sm">Edit pricing & areas.</p>
        </Link>
      </div>
    </div>
  );
}