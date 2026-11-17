import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const steps = ['Services', 'Location', 'Date & Time', 'Confirm'];

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [servicesList, setServicesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch services & locations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, lRes] = await Promise.all([
          api.get('/services'),
          api.get('/locations'),
        ]);
        setServicesList(sRes.data);
        setLocationsList(lRes.data);
      } catch {
        setError('Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total whenever selections change
  useEffect(() => {
    if (selectedServices.length === 0 || !selectedLocation) {
      setTotalPrice(0);
      return;
    }
    const calc = async () => {
      try {
        const res = await api.post('/bookings/calculate', {
          services: selectedServices,
          location: selectedLocation,
        });
        setTotalPrice(res.data.total);
      } catch {
        setTotalPrice(0);
      }
    };
    calc();
  }, [selectedServices, selectedLocation]);

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
  setSubmitting(true);
  try {
    await api.post('/bookings', {
      services: selectedServices,
      location: selectedLocation,
      date: `${bookingDate}T${bookingTime}`,
      notes,
    });
    navigate('/booking-success');
  } catch (err) {
    setError(err.response?.data?.message || 'Booking failed');
    setSubmitting(false);
  }
};

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error && !submitting) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Step indicators */}
      <div className="flex justify-between mb-12">
        {steps.map((step, idx) => (
          <div key={step} className="flex-1 text-center">
            <div className={`h-1 mb-2 rounded-full transition-colors ${idx <= currentStep ? 'bg-white' : 'bg-white/20'}`} />
            <span className={`text-xs font-medium ${idx <= currentStep ? 'text-white' : 'text-white/40'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Select Services */}
      {currentStep === 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Choose Services</h2>
          <div className="grid gap-4">
            {servicesList.map((service) => (
              <button
                key={service._id}
                onClick={() => toggleService(service._id)}
                className={`flex justify-between items-center p-4 border rounded-xl text-left transition ${
                  selectedServices.includes(service._id)
                    ? 'border-white bg-white/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-white/60">{service.durationMinutes} mins</p>
                </div>
                <span className="font-semibold">₦{service.basePrice.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Location */}
      {currentStep === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Location</h2>
          <div className="grid gap-4">
            {locationsList.map((loc) => (
              <button
                key={loc._id}
                onClick={() => setSelectedLocation(loc._id)}
                className={`p-4 border rounded-xl text-left transition ${
                  selectedLocation === loc._id
                    ? 'border-white bg-white/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <p className="font-medium">{loc.name}</p>
                <p className="text-sm text-white/60">Area: {loc.area} (x{loc.pricingMultiplier})</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {currentStep === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/60 block mb-1">Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/60"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="text-sm text-white/60 block mb-1">Time</label>
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/60"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm text-white/60 block mb-1">Special Requests (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/60 min-h-[100px]"
            />
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {currentStep === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Confirm Booking</h2>
          <div className="border border-white/10 rounded-xl p-6 space-y-4 bg-white/5">
            <div>
              <p className="text-white/60 text-sm">Services</p>
              <ul className="list-disc list-inside">
                {selectedServices.map((id) => {
                  const service = servicesList.find((s) => s._id === id);
                  return <li key={id} className="font-medium">{service?.name}</li>;
                })}
              </ul>
            </div>
            <div>
              <p className="text-white/60 text-sm">Location</p>
              <p>{locationsList.find((l) => l._id === selectedLocation)?.name}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Date & Time</p>
              <p>{bookingDate} at {bookingTime}</p>
            </div>
            <div className="text-xl font-bold pt-4 border-t border-white/10">
              Total: ₦{totalPrice.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {currentStep > 0 && (
          <button onClick={prevStep} className="border border-white/20 px-6 py-2 rounded-full text-sm hover:bg-white/5">
            Back
          </button>
        )}
        <div className="ml-auto">
          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 0 && selectedServices.length === 0) ||
                (currentStep === 1 && !selectedLocation) ||
                (currentStep === 2 && (!bookingDate || !bookingTime))
              }
              className="bg-white text-black font-semibold px-8 py-2 rounded-full disabled:opacity-40"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-white text-black font-semibold px-8 py-2 rounded-full hover:bg-gray-100 disabled:opacity-60"
            >
              {submitting ? 'Booking...' : 'Confirm & Book'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}