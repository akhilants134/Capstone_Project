import { useState, useEffect } from 'react';

export default function ResetPasswordPage({ navigate, token, onLogin }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('No reset token provided. Please request a new password reset link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/users/reset-password/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccess(true);
        // Auto-login the user after successful password reset
        if (data.token && data.data?.user) {
          onLogin({ ...data.data.user, token: data.token });
        }
      } else {
        setError(data.message || 'Failed to reset password');
        if (data.message?.includes('invalid') || data.message?.includes('expired')) {
          setTokenValid(false);
        }
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Cannot connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(16,185,129,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', padding: '60px',
        }}>
          <div style={{ maxWidth: '440px', animation: 'fadeInUp 0.5s ease', textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', margin: '0 auto 24px',
            }}>⚠️</div>
            
            <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Invalid or Expired Link
            </h1>
            
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '32px' }}>
              This password reset link is no longer valid. It may have expired (links are valid for 10 minutes) or already been used.
            </p>

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => navigate('forgot-password')}
              style={{ marginBottom: '16px' }}
            >
              Request New Reset Link
            </button>

            <button
              className="btn btn-full"
              onClick={() => navigate('login')}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
              }}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Create New{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Password
            </span>
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '40px' }}>
            Enter your new password below. Make sure it's strong and secure to protect your account.
          </p>

          {/* Password requirements */}
          <div style={{
            background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>📋</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Password Requirements</span>
            </div>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '32px', margin: 0 }}>
              <li>At least 8 characters long</li>
              <li>Contains letters and numbers</li>
              <li>Not similar to your previous passwords</li>
              <li>Not a common password</li>
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
              {success ? 'Password Reset!' : 'New Password'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {success ? 'Your password has been successfully updated' : 'Enter and confirm your new password'}
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
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
                    Resetting...
                  </span>
                ) : 'Reset Password →'}
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
                borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#10b981',
              }}>
                ✅ Your password has been successfully reset. You can now log in with your new password.
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full btn-lg"
                onClick={() => navigate('dashboard')}
              >
                Go to Dashboard →
              </button>

              <button
                type="button"
                className="btn btn-full"
                onClick={() => navigate('login')}
                style={{
                  marginTop: '12px',
                  background: 'transparent',
                  border: '1px solid var(--border)',
                }}
              >
                ← Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
