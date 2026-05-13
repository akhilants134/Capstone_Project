import { useState } from 'react';
import { login } from '../services/api';

export default function LoginPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '', role: 'client' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    
    try {
      const response = await login(form);
      onLogin({ ...response.user, role: form.role });
    } catch (err) {
      console.error('Login failed:', err);
      // Fallback for demo if backend is not running
      if (err.message.includes('Failed to fetch')) {
        setTimeout(() => {
          setLoading(false);
          onLogin({ name: form.email.split('@')[0], email: form.email, role: form.role, id: Date.now() });
        }, 1000);
      } else {
        setError(err.message || 'Login failed. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0a0b1a 0%, #1a0535 50%, #0a1628 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(16,185,129,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '60px', position: 'relative',
      }} className="hide-mobile">
        <div style={{ maxWidth: '460px', animation: 'fadeInUp 0.7s ease' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
            }}>🌐</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9' }}>ResourceMatch</div>
              <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</div>
            </div>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', lineHeight: '1.15', marginBottom: '16px', color: '#f1f5f9' }}>
            Connect. Donate.{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Transform.
            </span>
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.8', marginBottom: '40px' }}>
            A platform where clients connect with donors and developers to match resources, fund projects, and build meaningful solutions together.
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { num: '2,400+', label: 'Resources Listed' },
              { num: '850+',   label: 'Active Donors' },
              { num: '94%',    label: 'Match Rate' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '12px', padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.num}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Floating cards */}
          <div style={{ marginTop: '40px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { emoji: '💊', text: 'Medical Supplies' },
              { emoji: '💻', text: 'Tech Devices' },
              { emoji: '📚', text: 'Educational' },
              { emoji: '🍱', text: 'Food Aid' },
            ].map(tag => (
              <div key={tag.text} style={{
                background: 'rgba(19,21,43,0.8)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '500',
                color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span>{tag.emoji}</span> {tag.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div style={{
        width: '440px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px',
        borderLeft: '1px solid rgba(99,102,241,0.12)',
        background: 'rgba(10,11,26,0.8)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ width: '100%', maxWidth: '380px', animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '8px' }}>
              Welcome back 👋
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Sign in to your ResourceMatch account</p>
          </div>

          {/* Role toggle */}
          <div style={{
            background: 'rgba(19,21,43,0.8)', borderRadius: '12px',
            padding: '4px', display: 'flex', marginBottom: '24px',
            border: '1px solid rgba(99,102,241,0.15)',
          }}>
            {[{ val: 'client', label: '🙋 Client', desc: 'Need Resources' }, { val: 'donor', label: '💰 Donor', desc: 'Give Resources' }].map(r => (
              <button
                key={r.val}
                onClick={() => setForm(p => ({ ...p, role: r.val }))}
                style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif', transition: 'all 0.2s ease',
                  background: form.role === r.val ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                  color: form.role === r.val ? 'white' : '#64748b',
                  fontSize: '13px', fontWeight: '600',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <span style={{ fontSize: '12px', color: '#6366f1', cursor: 'pointer', fontWeight: '500' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                >{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#f87171' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit" className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginBottom: '16px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(99,102,241,0.15)' }} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(99,102,241,0.15)' }} />
            </div>

            {/* Demo login */}
            <button
              type="button"
              onClick={() => onLogin({ name: 'Alex Johnson', email: 'alex@demo.com', role: form.role, id: 1 })}
              className="btn btn-secondary btn-full"
              style={{ marginBottom: '24px' }}
            >
              🚀 Continue with Demo Account
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
              Don't have an account?{' '}
              <span style={{ color: '#818cf8', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('register')}>
                Sign up free
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
