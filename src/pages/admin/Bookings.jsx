import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/bookings/${id}`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  if (loading) return <div className="p-10 text-center">Loading bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-display font-bold text-ink mb-8">Manage Bookings</h1>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-8">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition ${
              statusFilter === status
                ? 'bg-ink text-white border-ink'
                : 'border-line text-ink-70 hover:bg-ink hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-line rounded-xl">
          <thead className="bg-bg">
            <tr className="text-xs uppercase tracking-widest text-ink-70">
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Services</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(booking => (
              <tr key={booking._id} className="border-t border-line hover:bg-bg/50">
                <td className="p-4">{booking.customer?.name || 'N/A'}</td>
                <td className="p-4">{booking.services?.map(s => s.name).join(', ') || '—'}</td>
                <td className="p-4">{booking.location?.name || '—'}</td>
                <td className="p-4">{new Date(booking.date).toLocaleString()}</td>
                <td className="p-4">₦{booking.totalPrice?.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-300' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300' :
                    'bg-yellow-100 text-yellow-700 border-yellow-300'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                    className="border border-line rounded px-2 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}