import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function BookingSuccess() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/bookings/mine');
        const bookings = res.data;
        if (bookings.length > 0) setBooking(bookings[bookings.length - 1]);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchLatest();
  }, []);

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center text-ink-70">Loading confirmation…</div>;
  if (!booking) return <div className="min-h-[80vh] flex flex-col items-center justify-center text-ink-70"><p>No booking found.</p><Link to="/book" className="text-gold underline mt-4">Book Now</Link></div>;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white border border-line rounded-3xl p-8 md:p-12 text-center shadow-sm">
        <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6 text-gold">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-ink mb-4">Appointment Confirmed!</h1>
        <div className="border border-line rounded-2xl p-6 text-left space-y-4 mb-8 bg-bg">
          <div className="flex justify-between border-b border-line pb-3"><span className="text-ink-70">Services</span><span className="font-medium text-ink">{booking.services?.map(s => s.name).join(', ') || '—'}</span></div>
          <div className="flex justify-between border-b border-line pb-3"><span className="text-ink-70">Location</span><span className="font-medium text-ink">{booking.location?.name || '—'}</span></div>
          <div className="flex justify-between border-b border-line pb-3"><span className="text-ink-70">Date & Time</span><span className="font-medium text-ink">{new Date(booking.date).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-ink-70">Total</span><span className="font-bold text-gold text-lg">₦{booking.totalPrice?.toLocaleString()}</span></div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/dashboard" className="px-8 py-3 bg-ink text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-ink/90 transition">View Dashboard</Link>
          <Link to="/book" className="px-8 py-3 border border-gold text-gold rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gold hover:text-white transition">Book Again</Link>
        </div>
      </div>
    </div>
  );
}