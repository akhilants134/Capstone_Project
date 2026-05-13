/* ===== Share Something Page ===== */
import { useState } from 'react';
import { createListing } from '../services/api';

const CATEGORIES = [
  { val: 'food', label: '🍱 Food & Essentials', desc: 'Canned food, dry goods, toiletries' },
  { val: 'clothing', label: '👕 Clothing', desc: 'Winter wear, school uniforms, basics' },
  { val: 'education', label: '📚 Education', desc: 'Books, stationery, study kits' },
  { val: 'tech', label: '💻 Technology', desc: 'Laptops, tablets, peripherals' },
  { val: 'household', label: '🏠 Household', desc: 'Furniture, kitchenware, bedding' },
  { val: 'other', label: '✨ Other', desc: 'Anything else that might help' },
];

export default function ShareSomethingPage({ navigate }) {
  const [form, setForm] = useState({ title: '', category: '', quantity: '1', condition: 'new', neighborhood: '', description: '', image: null });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      alert('Please select a category and provide a title.');
      return;
    }

    setLoading(true);
    try {
      await createListing({
        ...form,
        type: 'donation', // Donors share resources
      });
      setMessage('Successfully listed your contribution!');
      setSubmitted(true);
      setTimeout(() => navigate('browse'), 3000);
    } catch (err) {
      console.error('Failed to create listing:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', animation: 'fadeInUp 0.5s ease' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>🌈</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '12px' }}>Thank You for Sharing!</h2>
        <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '32px', lineHeight: '1.7' }}>
          Your contribution <strong style={{ color: '#f97316' }}>"{form.title}"</strong> has been listed. We'll notify you as soon as a match is found in your neighborhood.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('dashboard')}>Back to Dashboard</button>
          <button className="btn btn-secondary" onClick={() => navigate('browse')}>View Listings</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '800px' }}>
      {message && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(16,185,129,0.3)', zIndex: 1000, fontWeight: '700', animation: 'fadeInUp 0.3s ease' }}>
          ✅ {message}
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '8px' }}>Share Something 🎁</h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>List an item you'd like to donate and help someone in your community.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <div className="form-group">
            <label className="form-label">What are you sharing? *</label>
            <input type="text" className="form-input" placeholder="e.g. 20 boxes of canned soup" required
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label">Category *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {CATEGORIES.map(c => (
                <button key={c.val} type="button" onClick={() => setForm(p => ({ ...p, category: c.val }))}
                  style={{
                    padding: '16px', textAlign: 'left', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                    background: form.category === c.val ? 'rgba(249,115,22,0.15)' : 'rgba(19,21,43,0.5)',
                    border: `2px solid ${form.category === c.val ? '#f97316' : 'rgba(249,115,22,0.1)'}`,
                  }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9' }}>{c.label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{c.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input type="text" className="form-input" placeholder="e.g. 5 kits or 10kg"
                value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Neighborhood / Area</label>
              <input type="text" className="form-input" placeholder="e.g. Downtown or Westside"
                value={form.neighborhood} onChange={e => setForm(p => ({ ...p, neighborhood: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Item Condition</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['New', 'Like New', 'Gently Used'].map(cond => (
                <button key={cond} type="button" onClick={() => setForm(p => ({ ...p, condition: cond.toLowerCase() }))}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                    background: form.condition === cond.toLowerCase() ? '#f97316' : 'rgba(255,255,255,0.05)',
                    color: form.condition === cond.toLowerCase() ? 'white' : '#94a3b8',
                    border: 'none', transition: 'all 0.2s'
                  }}>
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Additional Details</label>
            <textarea className="form-input" style={{ minHeight: '120px' }} placeholder="Mention expiration dates, sizes, or any specific pickup instructions..."
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('dashboard')}>Cancel</button>
          <button type="submit" className="btn" disabled={loading}
            style={{ flex: 2, background: '#f97316', color: 'white', fontWeight: '700', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : '🚀 List Item for Sharing'}
          </button>
        </div>
      </form>
    </div>
  );
}
