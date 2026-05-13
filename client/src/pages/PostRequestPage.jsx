/* ===== Post Request Page ===== */
import { useState } from 'react';
import { createListing } from '../services/api';

const CATEGORIES = [
  { val: 'tech', label: '💻 Technology', desc: 'Devices, software, hardware' },
  { val: 'medical', label: '💊 Medical', desc: 'Medicine, equipment, supplies' },
  { val: 'education', label: '📚 Education', desc: 'Books, courses, scholarships' },
  { val: 'food', label: '🍱 Food Aid', desc: 'Food packages, nutrition' },
  { val: 'shelter', label: '🏠 Shelter', desc: 'Housing, rent assistance' },
  { val: 'financial', label: '💰 Financial', desc: 'Grants, emergency funds' },
];

const URGENCY = [
  { val: 'low', label: '🟢 Low', desc: 'Can wait a few weeks' },
  { val: 'high', label: '🟡 High', desc: 'Needed within a week' },
  { val: 'urgent', label: '🔴 Urgent', desc: 'Needed immediately' },
];

export default function PostRequestPage({ navigate }) {
  const [form, setForm] = useState({ title: '', category: '', urgency: '', quantity: '1', estimatedValue: '', description: '', location: '', deadline: '', contactPreference: 'platform', tags: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.category) e.category = 'Select a category';
    if (!form.urgency) e.urgency = 'Select urgency level';
    if (!form.description.trim() || form.description.length < 30) e.description = 'Description must be at least 30 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await createListing({
        ...form,
        type: 'request', // Clients "request" resources
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to post request:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', animation: 'fadeInUp 0.5s ease' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '72px', marginBottom: '24px', animation: 'float 2s ease-in-out infinite' }}>🎉</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '12px' }}>Request Posted!</h2>
        <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '32px', lineHeight: '1.7' }}>
          Your request <strong style={{ color: '#818cf8' }}>"{form.title}"</strong> has been successfully submitted. Our matching algorithm is now scanning for suitable donors and resources.
        </p>
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>✅</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#34d399' }}>Matching in progress</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>You'll be notified when a donor is found</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('matches')}>View My Matches</button>
          <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ title: '', category: '', urgency: '', quantity: '1', estimatedValue: '', description: '', location: '', deadline: '', contactPreference: 'platform', tags: '' }); }}>Post Another</button>
          <button className="btn btn-secondary" onClick={() => navigate('dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '720px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '4px' }}>Post a Request ➕</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Describe what you need and let our system match you with the right donors</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic info */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '20px', fontFamily: 'Outfit,sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📋 Basic Information
          </h3>
          <div className="form-group">
            <label className="form-label">Request Title *</label>
            <input type="text" className="form-input" placeholder="e.g. Need 5 laptops for rural school students"
              value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            {errors.title && <span style={{ color: '#f87171', fontSize: '12px' }}>⚠ {errors.title}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Quantity Needed</label>
              <input type="number" className="form-input" min="1" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Value (USD)</label>
              <input type="text" className="form-input" placeholder="e.g. 500" value={form.estimatedValue} onChange={e => setForm(p => ({ ...p, estimatedValue: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description * <span style={{ color: '#475569', fontWeight: '400', textTransform: 'none' }}>(min 30 chars)</span></label>
            <textarea className="form-input" placeholder="Explain in detail what you need, who it's for, and how it will be used..."
              style={{ minHeight: '120px' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            <span style={{ fontSize: '12px', color: form.description.length >= 30 ? '#10b981' : '#64748b' }}>{form.description.length}/30 characters minimum</span>
            {errors.description && <span style={{ color: '#f87171', fontSize: '12px' }}>⚠ {errors.description}</span>}
          </div>
        </div>

        {/* Category */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontFamily: 'Outfit,sans-serif' }}>🏷️ Category *</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {CATEGORIES.map(c => (
              <button key={c.val} type="button" onClick={() => setForm(p => ({ ...p, category: c.val }))}
                style={{ padding: '12px', border: `2px solid ${form.category === c.val ? '#6366f1' : 'rgba(99,102,241,0.2)'}`, borderRadius: '10px', background: form.category === c.val ? 'rgba(99,102,241,0.15)' : 'rgba(19,21,43,0.5)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{c.label}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{c.desc}</div>
              </button>
            ))}
          </div>
          {errors.category && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '8px', display: 'block' }}>⚠ {errors.category}</span>}
        </div>

        {/* Urgency */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontFamily: 'Outfit,sans-serif' }}>⚡ Urgency Level *</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {URGENCY.map(u => (
              <button key={u.val} type="button" onClick={() => setForm(p => ({ ...p, urgency: u.val }))}
                style={{ padding: '14px', border: `2px solid ${form.urgency === u.val ? '#6366f1' : 'rgba(99,102,241,0.2)'}`, borderRadius: '10px', background: form.urgency === u.val ? 'rgba(99,102,241,0.15)' : 'rgba(19,21,43,0.5)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9' }}>{u.label}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{u.desc}</div>
              </button>
            ))}
          </div>
          {errors.urgency && <span style={{ color: '#f87171', fontSize: '12px', marginTop: '8px', display: 'block' }}>⚠ {errors.urgency}</span>}
        </div>

        {/* Details */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '20px', fontFamily: 'Outfit,sans-serif' }}>📍 Additional Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" placeholder="City, State" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input type="date" className="form-input" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tags <span style={{ color: '#475569', fontWeight: '400', textTransform: 'none' }}>(comma-separated)</span></label>
            <input type="text" className="form-input" placeholder="e.g. rural, students, underprivileged" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Preferred Contact</label>
            <select className="form-input" value={form.contactPreference} onChange={e => setForm(p => ({ ...p, contactPreference: e.target.value }))}>
              <option value="platform">Platform Messages</option>
              <option value="email">Email</option>
              <option value="phone">Phone Call</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('dashboard')}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Submitting...
              </span>
            ) : '🚀 Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
