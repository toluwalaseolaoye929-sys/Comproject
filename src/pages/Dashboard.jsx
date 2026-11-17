import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/mine');
        setBookings(res.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center text-ink-70">Loading appointments…</div>;

  const upcoming = bookings.filter(b => new Date(b.date) >= new Date());
  const past = bookings.filter(b => new Date(b.date) < new Date());

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-display font-bold text-ink mb-2">Your Appointments</h1>
      <p className="text-ink-70 mb-12">Upcoming and past bookings.</p>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gold mb-6">Upcoming</h2>
        {upcoming.length === 0 ? <p className="text-ink-45">No upcoming appointments.</p> : (
          <div className="space-y-4">
            {upcoming.map(booking => (
              <div key={booking._id} className="border border-line rounded-2xl p-6 bg-white hover:border-gold/20 transition">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{booking.services?.map(s => s.name).join(', ') || '—'}</p>
                    <p className="text-ink-70 text-sm">{booking.location?.name} · {new Date(booking.date).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">₦{booking.totalPrice?.toLocaleString()}</p>
                    <span className="text-xs px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">{booking.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-ink-70 mb-6">Past</h2>
        {past.length === 0 ? <p className="text-ink-45">No past appointments.</p> : (
          <div className="space-y-4">
            {past.map(booking => (
              <div key={booking._id} className="border border-line rounded-2xl p-6 bg-white opacity-60">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{booking.services?.map(s => s.name).join(', ') || '—'}</p>
                    <p className="text-ink-70 text-sm">{booking.location?.name} · {new Date(booking.date).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink-70">₦{booking.totalPrice?.toLocaleString()}</p>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-ink-45 border border-line">{booking.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-12 text-center">
        <Link to="/book" className="inline-flex items-center gap-2 bg-gold text-ink px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gold/90 transition">
          Book New Appointment
        </Link>
      </div>
    </div>
  );
}