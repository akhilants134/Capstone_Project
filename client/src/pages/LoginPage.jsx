import { useState } from 'react';
import { login } from '../services/api';

export default function LoginPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '', role: 'community' });
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
      onLogin({ ...response.data.user, token: response.token, role: form.role });
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
      background: 'var(--gradient-hero)',
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
              <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>ResourceMatch</div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</div>
            </div>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', lineHeight: '1.15', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Connect. Donate.{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Transform.
            </span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
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
                background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.num}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '4px' }}>{stat.label}</div>
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
                background: 'var(--bg-glass)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: '500',
                color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px',
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
        borderLeft: '1px solid var(--border)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ width: '100%', maxWidth: '380px', animation: 'fadeInUp 0.5s ease' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Welcome back 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign in to your ResourceMatch account</p>
          </div>

          {/* Role toggle */}
          <div style={{
            background: 'var(--bg-input)', borderRadius: '12px',
            padding: '4px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '24px',
            border: '1px solid var(--border)',
          }}>
            {[
              { val: 'community', label: '🌍 Community', desc: 'Browse & Request' },
              { val: 'donor', label: '💰 Donor', desc: 'Give Resources' },
              { val: 'recipient', label: '🤝 Recipient', desc: 'Receive Resources' },
              { val: 'admin', label: '⚙️ Admin', desc: 'Manage Platform' }
            ].map(r => (
              <button
                key={r.val}
                onClick={() => setForm(p => ({ ...p, role: r.val }))}
                style={{
                  padding: '12px 8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif', transition: 'all 0.2s ease',
                  background: form.role === r.val ? 'var(--gradient-btn)' : 'transparent',
                  color: form.role === r.val ? 'white' : 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: '600', textAlign: 'center',
                }}
              >
                <div>{r.label}</div>
                <div style={{ fontSize: '10px', fontWeight: '400', opacity: 0.8 }}>{r.desc}</div>
              </button>
            ))}
          </div>

          {/* Role description */}
          {form.role === 'admin' && (
            <div style={{
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '8px', padding: '12px', marginBottom: '20px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary)', marginBottom: '6px' }}>Admin Platform</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                • Manage all users<br />
                • View platform analytics<br />
                • System configuration
              </div>
            </div>
          )}

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
              ) : form.role === 'admin' ? 'Sign In as Admin →' : 'Sign In →'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Demo login */}
            <button
              type="button"
              onClick={() => {
                if (form.role === 'admin') {
                  onLogin({ name: 'Admin', email: 'admin@resourcematch.com', role: 'admin', id: 1 });
                } else {
                  onLogin({ name: 'Alex Johnson', email: 'alex@demo.com', role: form.role, id: 1 });
                }
              }}
              className="btn btn-secondary btn-full"
              style={{ marginBottom: '16px' }}
            >
              🚀 Continue with Demo Account
            </button>

            {form.role === 'admin' && (
              <div style={{
                background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '8px', padding: '10px', marginBottom: '16px', fontSize: '11px',
                color: 'var(--text-secondary)', textAlign: 'center',
              }}>
                Demo: user: <span style={{ fontFamily: 'monospace', background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: '4px' }}>admin</span> | pass: <span style={{ fontFamily: 'monospace', background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: '4px' }}>admin123</span>
              </div>
            )}

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <span style={{ color: 'var(--text-accent)', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('register')}>
                Sign up free
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
