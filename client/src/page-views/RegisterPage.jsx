import { useState } from 'react';
import { register } from '../services/api';

export default function RegisterPage({ navigate, onLogin }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'community', category: '', bio: '', location: '', recipientType: 'individual', verificationDetails: '' });
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
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        category: form.category,
        bio: form.bio,
        location: form.location,
        verificationDetails: form.role === 'recipient' && form.recipientType === 'organization' ? form.verificationDetails : ''
      });
      if (data.status === 'success') {
        onLogin({ ...data.data.user, token: data.token });
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err.message || 'Registration failed. Email might already exist.');
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '24px', padding: '40px', animation: 'fadeInUp 0.5s ease' }}>
        <button
          type="button"
          onClick={() => navigate('')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '20px',
            padding: '0', transition: 'color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          ← Back to Home
        </button>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🌐</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '4px' }}>Create your account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Step {step} of 3 — {step === 1 ? 'Account Details' : step === 2 ? 'Focus Area' : 'Profile Setup'}</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '9999px', background: s <= step ? 'var(--gradient-btn)' : 'var(--border)', transition: 'all 0.3s ease' }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { val: 'donor', emoji: '💰', title: 'Donor', desc: 'Give & share resources' },
                { val: 'recipient', emoji: '🙋', title: 'Recipient', desc: 'Request resources' },
                { val: 'community', emoji: '🌐', title: 'Community', desc: 'Connect & engage' },
              ].map(r => (
                <button key={r.val} type="button" onClick={() => setForm(p => ({ ...p, role: r.val }))}
                  style={{ padding: '14px', border: `2px solid ${form.role === r.val ? '#6366f1' : 'var(--border)'}`, borderRadius: '12px', background: form.role === r.val ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{r.emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{r.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{r.desc}</div>
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
              {form.role === 'recipient' ? 'What resources do you need?' : form.role === 'donor' ? 'What area do you want to support?' : 'What area interests you most?'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {categories.map(cat => (
                <button key={cat.val} type="button" onClick={() => setForm(p => ({ ...p, category: cat.val }))}
                  style={{ padding: '12px', border: `2px solid ${form.category === cat.val ? '#6366f1' : 'var(--border)'}`, borderRadius: '10px', background: form.category === cat.val ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{cat.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{cat.desc}</div>
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
            {form.role === 'recipient' && (
              <div style={{ marginBottom: '20px', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
                <label className="form-label" style={{ marginBottom: '10px', display: 'block', fontWeight: '600' }}>Who are you requesting assistance for?</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <button type="button" onClick={() => setForm(p => ({ ...p, recipientType: 'individual' }))}
                    style={{ flex: 1, padding: '10px', border: `2px solid ${form.recipientType === 'individual' ? '#6366f1' : 'var(--border)'}`, borderRadius: '8px', background: form.recipientType === 'individual' ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    🙋 Individual
                  </button>
                  <button type="button" onClick={() => setForm(p => ({ ...p, recipientType: 'organization' }))}
                    style={{ flex: 1, padding: '10px', border: `2px solid ${form.recipientType === 'organization' ? '#6366f1' : 'var(--border)'}`, borderRadius: '8px', background: form.recipientType === 'organization' ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    🏢 Org / Shelter
                  </button>
                </div>

                {form.recipientType === 'organization' && (
                  <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                    <label className="form-label">Verification Credentials / Tax Registration ID / Website</label>
                    <textarea className="form-input" placeholder="e.g. 501(c)(3) ID, NGO Registration link, or organization portal URL..." style={{ minHeight: '80px', marginBottom: '10px' }} value={form.verificationDetails} onChange={e => setForm(p => ({ ...p, verificationDetails: e.target.value }))} />
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', fontStyle: 'italic' }}>
                      💡 Local platform administrators review documentation and credentials submitted during recipient registration. Verified badges are awarded to legitimate nonprofits, shelters, and centers to protect donor transparency.
                    </p>
                  </div>
                )}
              </div>
            )}
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

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <span style={{ color: 'var(--text-accent)', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('login')}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
