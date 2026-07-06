/* ===== Two-Factor Authentication Challenge Page ===== */
import { useState, useRef, useEffect } from 'react';
import { verify2FA } from '../services/api';

export default function TwoFAChallengePage({ preAuthToken, partialUser, onSuccess, onBack }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [useBackup, setUseBackup] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef([]);

  // TOTP timer — counts down to next code refresh
  useEffect(() => {
    const tick = () => {
      const secs = 30 - (Math.floor(Date.now() / 1000) % 30);
      setTimeLeft(secs);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newDigits.every(d => d !== '') && index === 5) {
      setTimeout(() => submitCode(newDigits.join('')), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter') {
      const code = digits.join('');
      if (code.length === 6) submitCode(code);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      setTimeout(() => submitCode(pasted), 100);
    }
  };

  const submitCode = async (code) => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await verify2FA(preAuthToken, code);
      if (res.status === 'success') {
        if (res.usedBackupCode) {
          alert(`✅ Backup code used. You have ${res.remainingBackupCodes} remaining.`);
        }
        onSuccess(res.data.user, res.token);
      }
    } catch (err) {
      setError(err.message || 'Invalid code. Please try again.');
      triggerShake();
      setDigits(['', '', '', '', '', '']);
      setBackupCode('');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleBackupSubmit = () => {
    if (!backupCode.trim()) return;
    submitCode(backupCode.trim());
  };

  const timerPct = (timeLeft / 30) * 100;
  const timerColor = timeLeft <= 5 ? '#f87171' : timeLeft <= 10 ? '#fbbf24' : '#10b981';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-hero)',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(16,185,129,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border)',
        borderRadius: '28px',
        padding: '44px 40px',
        backdropFilter: 'blur(20px)',
        animation: 'fadeInUp 0.4s ease',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', margin: '0 auto 20px',
            boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
          }}>🔐</div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Two-Factor Authentication
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            Enter the 6-digit code from your authenticator app
            {partialUser?.email && (
              <><br /><strong style={{ color: 'var(--text-accent)' }}>{partialUser.email}</strong></>
            )}
          </p>
        </div>

        {!useBackup ? (
          <>
            {/* TOTP timer ring */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle
                    cx="24" cy="24" r="20" fill="none"
                    stroke={timerColor} strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: '800', color: timerColor,
                  fontFamily: 'Outfit,sans-serif',
                }}>{timeLeft}</div>
              </div>
            </div>

            {/* 6-digit code input */}
            <div
              style={{
                display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px',
                animation: shake ? 'shake 0.5s ease' : 'none',
              }}
              onPaste={handlePaste}
            >
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                  style={{
                    width: '48px', height: '60px',
                    textAlign: 'center',
                    fontSize: '22px', fontWeight: '800',
                    fontFamily: 'Outfit,sans-serif',
                    border: `2px solid ${error ? '#f87171' : digit ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '14px',
                    background: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: digit ? '0 0 0 3px rgba(99,102,241,0.15)' : 'none',
                    caretColor: 'transparent',
                  }}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
                fontSize: '13px', color: '#f87171', textAlign: 'center',
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => submitCode(digits.join(''))}
              disabled={loading || digits.some(d => !d)}
              style={{ marginBottom: '16px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Verifying...
                </span>
              ) : 'Verify Code →'}
            </button>

            <button
              type="button"
              onClick={() => { setUseBackup(true); setError(''); setDigits(['','','','','','']); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-accent)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', width: '100%', textAlign: 'center', padding: '8px' }}
            >
              Use a backup code instead
            </button>
          </>
        ) : (
          <>
            {/* Backup code entry */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center' }}>
                Enter one of your 8-character backup codes. Each code can only be used once.
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. A1B2C3D4"
                value={backupCode}
                onChange={e => { setBackupCode(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleBackupSubmit()}
                autoFocus
                style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '18px', fontWeight: '700' }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
                fontSize: '13px', color: '#f87171', textAlign: 'center',
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={handleBackupSubmit}
              disabled={loading || !backupCode.trim()}
              style={{ marginBottom: '12px' }}
            >
              {loading ? 'Verifying...' : 'Use Backup Code →'}
            </button>

            <button
              type="button"
              onClick={() => { setUseBackup(false); setError(''); setBackupCode(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-accent)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', width: '100%', textAlign: 'center', padding: '8px' }}
            >
              ← Use authenticator code instead
            </button>
          </>
        )}

        {/* Back to login */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
          >
            ← Back to Login
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
