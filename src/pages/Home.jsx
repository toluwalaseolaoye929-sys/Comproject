import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import hero from '../assets/suszan-hero.jpg';
import beforeImage from "../assets/before.png";
import afterImage from "../assets/after.png";
import knotlessImage from "../assets/knotless.jpg";
import bohoImage from "../assets/boho.jpg";
import pixieImage from "../assets/pixie.jpg";
import frontalImage from "../assets/frontal.jpg";
import silkImage from "../assets/silk-press.jpg";
import maryImage from "../assets/mary.jpg";
import graceImage from "../assets/grace.jpg";
import emekaImage from "../assets/emeka.jpg";
import softImage from "../assets/soft.jpg";

/* ---------- Scroll reveal hook ---------- */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ---------- Animated counter ---------- */
function AnimatedStat({ target, suffix = '', decimals = 0 }) {
  const [value, setValue] = useState(0);
  const [ref, inView] = useReveal(0.4);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      setValue(decimals ? val.toFixed(decimals) : Math.floor(val));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target, decimals]);

  return (
    <div ref={ref} className="stat-num font-display text-4xl md:text-6xl text-gold">
      {value}
      {suffix}
    </div>
  );
}

/* ---------- Static data (trending, stylists, reviews, FAQ, blog) ---------- */
const trendingStyles = [
  {
    name: "Knotless Braids",
    image: knotlessImage,
  },
  {
    name: "Boho Braids",
    image: bohoImage,
  },
  {
    name: "Pixie Cut",
    image: pixieImage,
  },
  {
    name: "Frontal Installation",
    image: frontalImage,
  },
  {
    name: "Silk Press",
    image: silkImage,
  },
];

const stylists = [
  {
    name: "Mary",
    role: "Senior Hairstylist",
    exp: "12 years experience",
    stars: 5,
    image: maryImage,
  },
  {
    name: "Grace",
    role: "Braiding Specialist",
    exp: "9 years experience",
    stars: 5,
    image: graceImage,
  },
  {
    name: "Emeka",
    role: "Master Barber",
    exp: "7 years experience",
    stars: 5,
    image: emekaImage,
  },
  {
    name: "Soft",
    role: "Makeup & Bridal Artist",
    exp: "6 years experience",
    stars: 4,
    image: softImage,
  },
];

const reviews = [
  { q: "I've never felt this beautiful walking out of a salon.", name: 'Cynthia', sub: 'Braids & Makeup' },
  { q: 'Professional, clean, and my fade is always sharp.', name: 'David', sub: 'Barbing' },
  { q: 'The bridal team made my big day completely stress-free.', name: 'Amaka', sub: 'Bridal Package' },
  { q: "Best hair colour work I've had anywhere in Lagos.", name: 'Ifeoma', sub: 'Hair Colouring' },
];

const faqs = [
  {
    q: 'How long does braiding take?',
    a: 'Most braid styles take 3–6 hours depending on length and density. We recommend booking a morning slot for larger styles.',
  },
  {
    q: 'Can I book online?',
    a: 'Yes — use the booking section above to request your service, stylist, date and time. We confirm by WhatsApp or phone.',
  },
  {
    q: 'Do you accept walk-ins?',
    a: 'Walk-ins are welcome, but clients with confirmed bookings are prioritised, especially on weekends.',
  },
  {
    q: 'Do you do bridal makeup and hair?',
    a: 'Yes — our bridal package covers trial session, hair, makeup and touch-ups on the day. Book early as weekend slots fill fast.',
  },
];

const blogPosts = [
  { tag: 'Trends', title: 'Top Hairstyles Trending in Lagos This Season', excerpt: 'From silk presses to bold braid patterns — what clients are asking for right now.' },
  { tag: 'Care', title: 'The Best Hair Treatments for Damaged Ends', excerpt: 'A simple guide to rebuilding moisture and strength after colour or heat damage.' },
  { tag: 'Guide', title: 'Hair Care Tips Between Salon Visits', excerpt: 'Small daily habits that keep your style looking fresh for longer.' },
  { tag: 'Bridal', title: 'Bridal Hair Inspiration for Every Dress Style', excerpt: 'Matching your hairstyle to your gown neckline and venue.' },
];

/* ---------- Main component ---------- */
export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeServiceFilter, setActiveServiceFilter] = useState('all');
  const [bookingForm, setBookingForm] = useState({ service: '', stylist: '', date: '', time: '', phone: '' });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Fetch services from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredServices = activeServiceFilter === 'all'
    ? services
    : services.filter(s => s.category === activeServiceFilter);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const [heroRef, heroInView] = useReveal(0.2);
  const [statsRef] = useReveal(0.4);

  // Before/After slider logic
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);
  const dragging = useRef(false);

  const updateSlider = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    setSliderPos(pct);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging.current) updateSlider(e.clientX);
    };
    const handleTouchMove = (e) => {
      if (dragging.current) updateSlider(e.touches[0].clientX);
    };
    const stopDrag = () => { dragging.current = false; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };
  }, [updateSlider]);

  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="overflow-x-hidden">
      {/* ========== HERO (Video + fallback) ========== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center text-center pt-24 pb-16 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={hero}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://cdn.coverr.co/videos/coverr-a-beauty-salon-interior-8420/1080p.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />

        <div className={`transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} max-w-3xl px-4 relative z-10`}>
          <span className="eyebrow text-gold-soft block mb-5 text-xs tracking-[.28em] uppercase font-bold">
            Amuwo Odofin, Lagos
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-display font-bold mb-2">
            Beauty. Luxury.
            <br />
            <em className="text-gold italic">Confidence.</em>
          </h1>
          <p className="text-sm uppercase tracking-[.35em] text-white/75 mb-10 font-body">
            SUZAN UNISEX SALON
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/book" className="btn-gold bg-gold text-ink px-8 py-4 rounded font-bold uppercase tracking-widest text-sm hover:shadow-xl transition">
              Book Appointment
            </Link>
            <a href="#services" className="btn-outline border border-white/55 text-white px-8 py-4 rounded font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition">
              Explore Services
            </a>
          </div>
        </div>

        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 z-10">
          <span className="text-xs uppercase tracking-widest font-body">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div> */}
      </section>

      {/* ========== STATS ========== */}
      <section className="bg-ink py-16">
        <div ref={statsRef} className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><AnimatedStat target={1000} suffix="+" /><p className="text-xs uppercase tracking-widest text-white/60 mt-2 font-body">Happy Clients</p></div>
          <div><AnimatedStat target={8} suffix="+" /><p className="text-xs uppercase tracking-widest text-white/60 mt-2 font-body">Years Experience</p></div>
          <div><AnimatedStat target={15} suffix="+" /><p className="text-xs uppercase tracking-widest text-white/60 mt-2 font-body">Pro Stylists</p></div>
          <div><AnimatedStat target={4.9} suffix="★" decimals={1} /><p className="text-xs uppercase tracking-widest text-white/60 mt-2 font-body">Average Rating</p></div>
        </div>
      </section>

      {/* ========== WHY US ========== */}
      <section id="why" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">The Suzan Standard</span>
            <h2 className="text-3xl md:text-5xl font-display">Why clients choose us</h2>
            <p className="text-ink-70 mt-4 text-sm">Every detail — from the products on our shelves to the hands behind the chair — is chosen to give Amuwo Odofin a salon experience that feels like a destination, not a routine.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '✨', title: 'Premium Equipment', desc: 'Salon‑grade tools and stations, maintained to professional standard for every service.' },
              { icon: '🎓', title: 'Certified Stylists', desc: 'A trained team with real specialisations — cut, colour, braids, barbing and bridal.' },
              { icon: '🧴', title: 'Trusted Products', desc: 'We use only reputable, hair‑safe brands — never diluted or off‑brand alternatives.' },
              { icon: '📍', title: 'Easy to Find', desc: 'Conveniently located in Amuwo Odofin, with parking and a calm, private setting.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-line p-8 rounded hover:-translate-y-2 hover:shadow-xl transition duration-300">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-display mb-2">{item.title}</h3>
                <p className="text-sm text-ink-70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SERVICES (dynamic) ========== */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-display">Services, built around you</h2>
            <p className="text-ink-70 mt-4 text-sm">Hair, braiding, barbing, nails, skin and bridal — a full menu for every look you're chasing.</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {['all', 'haircut', 'braids', 'wig', 'makeup', 'color', 'treatment'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveServiceFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest border transition ${
                  activeServiceFilter === cat ? 'bg-ink text-white border-ink' : 'border-line text-ink-70 hover:bg-ink hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-10">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <div key={service._id} className="relative h-80 rounded-lg overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 p-6 text-white z-20">
                    <h3 className="text-2xl font-display">{service.name}</h3>
                    <p className="text-gold text-sm mt-1">from ₦{service.basePrice?.toLocaleString()}</p>
                    <Link to="/book" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest mt-3 border-b border-gold pb-1 hover:text-gold transition">Book This →</Link>
                  </div>
                  <div className="w-full h-full bg-ink/20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80')", backgroundSize: 'cover' }} />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/book" className="btn-ink bg-ink text-white px-8 py-3 rounded font-bold uppercase tracking-widest text-sm hover:shadow-lg transition">View Full Menu &amp; Book</Link>
          </div>
        </div>
      </section>

      
{/* ========== BEFORE / AFTER ========== */}
<section className="bg-ink py-24">
  <div className="max-w-4xl mx-auto px-6 text-white">

    {/* Heading */}
    <div className="text-center mb-16">
      <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">
        The Transformation
      </span>

      <h2 className="text-3xl md:text-5xl font-display">
        See the difference
      </h2>

      <p className="text-white/60 mt-4 text-sm">
        Drag the slider — this is the moment new clients decide to book.
      </p>
    </div>

    {/* Comparison Slider */}
    <div
      className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border border-white/10 select-none cursor-ew-resize touch-pan-y"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);

        const rect = e.currentTarget.getBoundingClientRect();
        const position =
          ((e.clientX - rect.left) / rect.width) * 100;

        setSliderPos(Math.max(0, Math.min(100, position)));
      }}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const position =
          ((e.clientX - rect.left) / rect.width) * 100;

        setSliderPos(Math.max(0, Math.min(100, position)));
      }}
    >

      {/* Before Image */}
      <img
        src={beforeImage}
        alt="Before salon transformation"
        draggable="false"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* After Image */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 0 0 ${sliderPos}%)`
        }}
      >
        <img
          src={afterImage}
          alt="After salon transformation"
          draggable="false"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Before Label */}
      <span className="absolute top-4 left-4 z-20 bg-black/50 text-white text-xs px-3 py-1 rounded-full border border-white/30 uppercase tracking-widest">
        Before
      </span>

      {/* After Label */}
      <span className="absolute top-4 right-4 z-20 bg-black/50 text-white text-xs px-3 py-1 rounded-full border border-white/30 uppercase tracking-widest">
        After
      </span>

      {/* Slider Divider */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="h-full w-0.5 bg-white shadow-lg" />

        {/* Slider Handle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
          <span className="text-ink text-lg font-bold">
            ↔
          </span>
        </div>
      </div>

    </div>

    <p className="text-center text-white/50 text-sm mt-6">
      Real transformations from real clients — full gallery available in-salon and on Instagram.
    </p>

  </div>
</section>




{/* ========== TRENDING STYLES ========== */}
<section className="py-24">
  <div className="max-w-6xl mx-auto px-6">

    <div className="mb-12">
      <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">
        Right Now
      </span>

      <h2 className="text-3xl md:text-5xl font-display">
        Trending styles
      </h2>

      <p className="text-ink-70 mt-4 text-sm">
        What's booking out fastest this month.
      </p>
    </div>

    <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">

      {trendingStyles.map((style, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-64 h-80 rounded-lg overflow-hidden relative snap-start group cursor-pointer"
        >

          {/* Hairstyle Image */}
          <img
            src={style.image}
            alt={style.name}
            draggable="false"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Hairstyle Name */}
          <div className="absolute bottom-4 left-4 right-4 text-white font-display text-xl z-10">
            {style.name}
          </div>

        </div>
      ))}

    </div>

  </div>
</section>



      
{/* ========== STYLISTS ========== */}
<section className="py-24 bg-white">
  <div className="max-w-6xl mx-auto px-6">

    {/* Section Heading */}
    <div className="text-center max-w-xl mx-auto mb-16">
      <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">
        The Team
      </span>

      <h2 className="text-3xl md:text-5xl font-display">
        Meet our stylists
      </h2>

      <p className="text-ink-70 mt-4 text-sm">
        Book with the hands you trust — or let us match you with the right specialist.
      </p>
    </div>

    {/* Stylist Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

      {stylists.map((stylist, i) => (
        <div key={i} className="text-center group">

          {/* Stylist Image */}
          <div className="w-full aspect-square rounded-full overflow-hidden bg-ink/10 mb-4">
            <img
              src={stylist.image}
              alt={`${stylist.name} - ${stylist.role}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          {/* Name */}
          <h3 className="text-xl font-display">
            {stylist.name}
          </h3>

          {/* Role */}
          <p className="text-gold text-xs uppercase tracking-widest mt-1">
            {stylist.role}
          </p>

          {/* Rating */}
          <div className="text-gold mt-1" aria-label={`${stylist.stars} out of 5 stars`}>
            {"★".repeat(stylist.stars)}
            {"☆".repeat(5 - stylist.stars)}
          </div>

          {/* Experience */}
          <p className="text-ink-70 text-xs mt-2">
            {stylist.exp}
          </p>

          {/* Booking Link */}
          <Link
            to="/book"
            className="inline-block mt-3 text-xs uppercase tracking-widest border-b border-ink pb-1 hover:text-gold transition"
          >
            Book with {stylist.name}
          </Link>

        </div>
      ))}

    </div>
  </div>
</section>


      {/* ========== REVIEWS ========== */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">Client Stories</span>
            <h2 className="text-3xl md:text-5xl font-display">Loved across Amuwo Odofin</h2>
          </div>
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {reviews.map((review, i) => (
              <div key={i} className="flex-shrink-0 w-80 p-6 bg-bg border border-line rounded-lg snap-start">
                <div className="text-gold mb-4">★★★★★</div>
                <p className="italic text-sm leading-relaxed mb-4">"{review.q}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink/10" />
                  <div>
                    <p className="font-bold text-sm">{review.name}</p>
                    <p className="text-ink-45 text-xs">{review.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== INTERIOR GALLERY ========== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">The Space</span>
            <h2 className="text-3xl md:text-5xl font-display">Inside Suzan Salon</h2>
            <p className="text-ink-70 mt-4 text-sm">A calm, private, professionally designed environment — every corner considered.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px]">
            {[
              { span: 'col-span-2 row-span-2', label: 'Reception' },
              { label: 'Hair Section' },
              { label: 'Nail Room' },
              { span: 'col-span-2', label: 'Waiting Lounge' },
              { label: 'VIP Section' },
              { label: 'Coffee Corner' },
            ].map((item, i) => (
              <div key={i} className={`relative rounded-lg overflow-hidden ${item.span || ''}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs uppercase tracking-widest z-10">{item.label}</span>
                <div className="w-full h-full bg-ink/20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80')", backgroundSize: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">Investment</span>
            <h2 className="text-3xl md:text-5xl font-display">Simple, honest pricing</h2>
            <p className="text-ink-70 mt-4 text-sm">Final pricing may vary with hair length/density — confirmed at consultation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {services.slice(0, 3).map((service, i) => (
              <div key={service._id} className={`p-8 rounded-lg border text-center transition hover:-translate-y-2 hover:shadow-xl ${i === 1 ? 'bg-ink text-white border-ink scale-105' : 'bg-white border-line'}`}>
                <p className="text-xs uppercase tracking-widest text-gold font-bold">{i === 0 ? 'Everyday' : i === 1 ? 'Most Popular' : 'Signature'}</p>
                <h3 className="text-2xl font-display mt-4">{service.name}</h3>
                <div className="text-4xl font-display mt-4 mb-6">₦{service.basePrice?.toLocaleString()}</div>
                <ul className="text-left text-sm space-y-3 mb-6">
                  <li className="pb-2 border-b border-line">Consultation &amp; wash</li>
                  <li className="pb-2 border-b border-line">Precision service</li>
                  <li>Style finish</li>
                </ul>
                <Link to="/book" className={`btn inline-block w-full py-3 rounded font-bold uppercase tracking-widest text-sm ${i === 1 ? 'bg-gold text-ink' : 'bg-ink text-white'}`}>Book</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BOOKING CTA ========== */}
<section id="book" className="py-24 bg-ink text-white">
  <div className="max-w-3xl mx-auto px-6 text-center">
    <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">Reserve Your Chair</span>
    <h2 className="text-3xl md:text-5xl font-display mt-2">Ready for your next look?</h2>
    <p className="text-white/65 text-sm mt-4 max-w-md mx-auto">
      Choose a service, pick your location, and we'll confirm instantly by WhatsApp or SMS.
    </p>
    <div className="mt-8 flex justify-center gap-4 flex-wrap">
      <Link to="/book" className="bg-gold text-ink px-8 py-4 rounded font-bold uppercase tracking-widest text-sm hover:shadow-xl transition">
        Book Online
      </Link>
      <a href="https://wa.me/2340000000000" className="border border-white/55 text-white px-8 py-4 rounded font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition">
        Chat on WhatsApp
      </a>
    </div>
  </div>
</section>

      {/* ========== MAP / CONTACT ========== */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">Find Us</span>
            <h2 className="text-3xl md:text-5xl font-display">Visit Suzan Salon</h2>
          </div>
          <div className="grid md:grid-cols-2 rounded-lg overflow-hidden shadow-2xl">
            <div className="h-80 md:h-auto">
              <iframe src="https://www.google.com/maps?q=Amuwo+Odofin,+Lagos&output=embed" className="w-full h-full border-0" title="Location" loading="lazy" />
            </div>
            <div className="bg-ink text-white p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-display mb-4">Suzan Unisex Salon</h3>
              <p className="text-white/65 text-sm mb-6">
                Amuwo Odofin, Lagos, Nigeria<br />
                Open daily · Walk‑ins welcome, bookings prioritised
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href="tel:+2340000000000" className="bg-gold text-ink px-5 py-2 rounded text-xs uppercase tracking-widest font-bold">Call</a>
                <a href="https://www.google.com/maps?q=Amuwo+Odofin,+Lagos" target="_blank" rel="noopener noreferrer" className="border border-white/55 text-white px-5 py-2 rounded text-xs uppercase tracking-widest">Directions</a>
                <a href="https://wa.me/2340000000000" target="_blank" rel="noopener noreferrer" className="border border-white/55 text-white px-5 py-2 rounded text-xs uppercase tracking-widest">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">Questions</span>
            <h2 className="text-3xl md:text-5xl font-display">Frequently asked</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-line">
                <button onClick={() => toggleFaq(i)} className="w-full flex justify-between items-center py-5 text-left font-display text-lg">
                  {faq.q}
                  <span className={`text-gold text-2xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                  <p className="text-ink-70 text-sm">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BLOG ========== */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="eyebrow text-gold block text-xs tracking-[.28em] uppercase font-bold mb-2">Beauty Journal</span>
            <h2 className="text-3xl md:text-5xl font-display">From the blog</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post, i) => (
              <div key={i} className="bg-white border border-line rounded-lg overflow-hidden hover:-translate-y-2 transition">
                <div className="h-40 bg-ink/10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80')", backgroundSize: 'cover' }} />
                <div className="p-5">
                  <span className="text-deep text-xs uppercase tracking-widest">{post.tag}</span>
                  <h3 className="text-lg font-display mt-2 mb-1">{post.title}</h3>
                  <p className="text-ink-70 text-sm">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}