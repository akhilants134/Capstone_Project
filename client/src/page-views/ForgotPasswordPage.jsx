import { useState } from 'react';

export default function ForgotPasswordPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccess(true);
        if (data.resetToken && data.resetURL) {
          setResetInfo({
            token: data.resetToken,
            url: data.resetURL,
          });
        }
      } else {
        setError(data.message || 'Failed to process request');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Cannot connect to server. Please check your connection.');
    } finally {
      setLoading(false);
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
            }}>🔐</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>ResourceMatch</div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Password Reset</div>
            </div>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', lineHeight: '1.15', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Forgot Your{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Password?
            </span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
            No worries! Enter your email address and we'll send you a secure link to reset your password. The link will expire in 10 minutes for your security.
          </p>

          {/* Security info */}
          <div style={{
            background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '20px', marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Secure Process</span>
            </div>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '32px', margin: 0 }}>
              <li>Cryptographically secure token generation</li>
              <li>Token expires after 10 minutes</li>
              <li>One-time use only</li>
              <li>Your original password cannot be retrieved</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
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
              {success ? 'Check Your Email' : 'Reset Password'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {success ? 'We\'ve sent you a secure link to reset your password' : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#f87171' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
                style={{ marginBottom: '20px' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Sending...
                  </span>
                ) : 'Send Reset Link →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
                Remember your password?{' '}
                <span
                  style={{ color: 'var(--text-accent)', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => navigate('login')}
                >
                  Sign in
                </span>
              </p>
            </form>
          ) : (
            <div>
              <div style={{
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '8px', padding: '16px', marginBottom: '20px', fontSize: '14px', color: '#10b981',
              }}>
                ✅ If an account exists with this email, a password reset link has been sent.
              </div>

              {resetInfo && (
                <div style={{
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: '8px', padding: '16px', marginBottom: '20px',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b', marginBottom: '8px' }}>
                    📧 Development Mode
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Reset Token (for testing):
                  </div>
                  <div style={{
                    background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px',
                    fontSize: '10px', wordBreak: 'break-all', fontFamily: 'monospace',
                    color: '#f59e0b', marginBottom: '8px',
                  }}>
                    {resetInfo.token}
                  </div>
                  <span
                    style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => navigate('reset-password', { token: resetInfo.token })}
                  >
                    Or click here to reset directly
                  </span>
                </div>
              )}

              <button
                type="button"
                className="btn btn-full"
                onClick={() => navigate('login')}
                style={{ marginBottom: '16px' }}
              >
                ← Back to Login
              </button>

              <button
                type="button"
                className="btn btn-full"
                onClick={() => {
                  setSuccess(false);
                  setResetInfo(null);
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                }}
              >
                Try Another Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
