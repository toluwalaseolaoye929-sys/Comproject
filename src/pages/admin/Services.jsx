import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', category: 'haircut', basePrice: 0, durationMinutes: 30, unisex: true, active: true });

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/services/${editId}`, form);
    } else {
      await api.post('/services', form);
    }
    setEditId(null);
    setForm({ name: '', category: 'haircut', basePrice: 0, durationMinutes: 30, unisex: true, active: true });
    fetchServices();
  };

  const handleEdit = (service) => {
    setEditId(service._id);
    setForm({ name: service.name, category: service.category, basePrice: service.basePrice, durationMinutes: service.durationMinutes, unisex: service.unisex, active: service.active });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      await api.delete(`/services/${id}`);
      fetchServices();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-display font-bold text-ink mb-8">Manage Services</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="border border-line rounded px-3 py-2" />
        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="border border-line rounded px-3 py-2">
          <option value="haircut">Haircut</option>
          <option value="braids">Braids</option>
          <option value="wig">Wig</option>
          <option value="makeup">Makeup</option>
          <option value="color">Color</option>
          <option value="treatment">Treatment</option>
        </select>
        <input type="number" placeholder="Price" value={form.basePrice} onChange={e => setForm({...form, basePrice: +e.target.value})} required className="border border-line rounded px-3 py-2" />
        <input type="number" placeholder="Duration (min)" value={form.durationMinutes} onChange={e => setForm({...form, durationMinutes: +e.target.value})} required className="border border-line rounded px-3 py-2" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.unisex} onChange={e => setForm({...form, unisex: e.target.checked})} /> Unisex</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} /> Active</label>
        <button type="submit" className="col-span-full bg-gold text-ink py-2 rounded font-bold uppercase">{editId ? 'Update' : 'Add'} Service</button>
      </form>

      <div className="space-y-4">
        {services.map(service => (
          <div key={service._id} className="flex justify-between items-center border border-line p-4 rounded-xl bg-white">
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-ink-70 text-sm">₦{service.basePrice?.toLocaleString()} · {service.durationMinutes} min · {service.category}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(service)} className="text-gold underline text-sm">Edit</button>
              <button onClick={() => handleDelete(service._id)} className="text-deep underline text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}