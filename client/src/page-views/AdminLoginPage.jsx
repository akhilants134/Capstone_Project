import { useState } from 'react';
import { adminLogin } from '../services/api';

export default function AdminLoginPage({ navigate, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(form);
      onLogin({ ...response.data.user, token: response.token });
    } catch (err) {
      console.error('Admin login failed:', err);
      setError(err.message || 'Invalid admin credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 24px',
    }}>
      <div style={{
        position: 'absolute', top: '-120px', right: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(245,158,11,0.08)', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-60px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'rgba(14,165,233,0.08)', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(15,23,42,0.85)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: '20px',
        padding: '40px 36px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        animation: 'fadeInUp 0.5s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', boxShadow: '0 8px 30px rgba(245,158,11,0.35)',
          }}>🛡️</div>
          <h1 style={{
            fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit,sans-serif',
            color: '#f8fafc', margin: '0 0 8px',
          }}>Admin Portal</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            Restricted access — administrator credentials only
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Admin Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@resourcematch.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter admin password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                style={{ paddingRight: '44px' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: '16px',
                }}
              >{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: '#fca5a5',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-full btn-lg"
            disabled={loading}
            style={{
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white', border: 'none', fontWeight: '700',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
                Authenticating...
              </span>
            ) : '🛡️ Sign In to Admin Panel'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
            Not an admin?{' '}
            <span
              style={{ color: '#818cf8', fontWeight: '600', cursor: 'pointer' }}
              onClick={() => navigate('login')}
            >
              Back to user login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
