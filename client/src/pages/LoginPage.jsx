import { useState } from 'react';
import { login, adminLogin } from '../services/api';

export default function LoginPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);

    try {
      // Try regular login first; if that fails (e.g. admin credentials), try admin endpoint.
      // The server always returns the correct role in the response.
      let response;
      try {
        response = await login(form);
      } catch {
        response = await adminLogin(form);
      }
      onLogin({ ...response.data.user, token: response.token });
    } catch (err) {
      console.error('Login failed:', err);
      if (err.message && err.message.includes('Failed to fetch')) {
        setTimeout(() => {
          setLoading(false);
          setError('Cannot connect to server. Please check your connection.');
        }, 800);
      } else {
        setError(err.message || 'Invalid email or password. Please try again.');
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

          {/* Floating tags */}
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
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Welcome back 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign in to your ResourceMatch account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <span
                  style={{ fontSize: '12px', color: '#6366f1', cursor: 'pointer', fontWeight: '500' }}
                  onClick={() => {/* future: navigate to forgot-password */}}
                >
                  Forgot password?
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{ paddingRight: '44px' }}
                  autoComplete="current-password"
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
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
              style={{ marginBottom: '20px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <span
                id="go-to-register"
                style={{ color: 'var(--text-accent)', fontWeight: '600', cursor: 'pointer' }}
                onClick={() => navigate('register')}
              >
                Sign up free
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
