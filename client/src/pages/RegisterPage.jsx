import { useState } from 'react';
import { register } from '../services/api';

export default function RegisterPage({ navigate, onLogin }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'client', category: '', bio: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.email.includes('@')) e.email = 'Valid email required';
      if (form.password.length < 6) e.password = 'Min 6 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    if (step === 2) { if (!form.category) e.category = 'Please select a category'; }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validate()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        category: form.category,
        bio: form.bio,
        location: form.location
      });
      if (data.status === 'success') {
        onLogin(data.data.user);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { val: 'medical', label: '💊 Medical', desc: 'Medicine, equipment' },
    { val: 'tech', label: '💻 Technology', desc: 'Devices, software' },
    { val: 'education', label: '📚 Education', desc: 'Books, courses' },
    { val: 'food', label: '🍱 Food Aid', desc: 'Food, groceries' },
    { val: 'shelter', label: '🏠 Shelter', desc: 'Housing assistance' },
    { val: 'financial', label: '💰 Financial', desc: 'Grants, funding' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a0b1a 0%, #1a0535 50%, #0a1628 100%)', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '520px', background: 'rgba(13,15,34,0.95)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '40px', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🌐</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '4px' }}>Create your account</h2>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Step {step} of 3 — {step === 1 ? 'Account Details' : step === 2 ? 'Focus Area' : 'Profile Setup'}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '9999px', background: s <= step ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.15)', transition: 'all 0.3s ease' }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[{ val: 'client', emoji: '🙋', title: 'Client', desc: 'Need resources' }, { val: 'donor', emoji: '💰', title: 'Donor', desc: 'Give resources' }].map(r => (
                <button key={r.val} type="button" onClick={() => setForm(p => ({ ...p, role: r.val }))}
                  style={{ padding: '14px', border: `2px solid ${form.role === r.val ? '#6366f1' : 'rgba(99,102,241,0.2)'}`, borderRadius: '12px', background: form.role === r.val ? 'rgba(99,102,241,0.15)' : 'rgba(19,21,43,0.5)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{r.emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>{r.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{r.desc}</div>
                </button>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              {errors.name && <span style={{ color: '#f87171', fontSize: '12px' }}>⚠ {errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              {errors.email && <span style={{ color: '#f87171', fontSize: '12px' }}>⚠ {errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              {errors.password && <span style={{ color: '#f87171', fontSize: '12px' }}>⚠ {errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
              {errors.confirmPassword && <span style={{ color: '#f87171', fontSize: '12px' }}>⚠ {errors.confirmPassword}</span>}
            </div>
            <button type="button" className="btn btn-primary btn-full btn-lg" onClick={nextStep}>Continue →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
              {form.role === 'client' ? 'What resources do you need?' : 'What area do you want to support?'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {categories.map(cat => (
                <button key={cat.val} type="button" onClick={() => setForm(p => ({ ...p, category: cat.val }))}
                  style={{ padding: '12px', border: `2px solid ${form.category === cat.val ? '#6366f1' : 'rgba(99,102,241,0.2)'}`, borderRadius: '10px', background: form.category === cat.val ? 'rgba(99,102,241,0.15)' : 'rgba(19,21,43,0.5)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{cat.label}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{cat.desc}</div>
                </button>
              ))}
            </div>
            {errors.category && <div style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>⚠ {errors.category}</div>}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={nextStep}>Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Short Bio</label>
              <textarea className="form-input" placeholder="Tell us about yourself..." style={{ minHeight: '90px' }} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" placeholder="City, Country" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={prevStep}>← Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? '⏳ Creating...' : '🚀 Create Account'}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#64748b' }}>
          Already have an account?{' '}
          <span style={{ color: '#818cf8', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('login')}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
