/* ===== Recipient Dashboard ===== */
import { useState, useEffect } from 'react';
import { getStats, getMe, getMyMatches } from '../../services/api';

const defaultStats = [
  { label: 'Requests Posted',  value: '0', icon: '📋', color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  change: 'Active' },
  { label: 'Items Received',   value: '0', icon: '📦', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  change: 'Fulfilled' },
  { label: 'Pending Matches',  value: '0', icon: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  change: 'Awaiting' },
  { label: 'Impact Points',    value: '0', icon: '💎', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  change: 'Earned' },
];

export default function RecipientDashboard({ navigate, user: initialUser }) {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  });

  const [user, setUser] = useState(initialUser);
  const [stats, setStats] = useState(defaultStats);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, userRes, matchesRes] = await Promise.all([
          getStats(),
          getMe(),
          getMyMatches().catch(() => ({ data: { matches: [] } })),
        ]);

        const matches = matchesRes.data?.matches || [];
        const pendingCount = matches.filter(m => m.status === 'pending').length;
        const acceptedCount = matches.filter(m => m.status === 'accepted').length;

        if (statsRes.data) {
          setStats([
            { ...defaultStats[0], value: String(statsRes.data.totalListings || 0) },
            { ...defaultStats[1], value: String(acceptedCount) },
            { ...defaultStats[2], value: String(pendingCount) },
            { ...defaultStats[3], value: String(userRes.data?.user?.points || 0) },
          ]);
        }
        if (userRes.data?.user) setUser(userRes.data.user);
        setRecentMatches(matches.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch recipient dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease' }}>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '24px', padding: '32px', marginBottom: '32px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(99,102,241,0.3)',
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {greeting} 👋
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'white', marginBottom: '12px' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Friend'}!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', maxWidth: '500px', lineHeight: '1.6' }}>
              Post what you need and let our community help. Browse available donations to find resources.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: 'white', color: '#6366f1', fontWeight: '700', padding: '12px 24px', borderRadius: '14px', border: 'none', cursor: 'pointer' }} onClick={() => navigate('post-request')}>
              ➕ Post a Request
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', padding: '12px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} onClick={() => navigate('browse')}>
              🔍 Browse Donations
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={s.label} className="card" style={{ animationDelay: `${i * 0.1}s`, padding: '24px', position: 'relative', opacity: loading ? 0.7 : 1, transition: 'opacity 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {s.icon}
              </div>
              <span style={{ fontSize: '12px', color: s.color, fontWeight: '700', background: s.bg, padding: '4px 10px', borderRadius: '9999px' }}>
                {s.change}
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '6px' }}>
              {loading ? '...' : s.value}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        <div>
          {/* My Request Matches */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
                📋 My Request Status
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('matches')}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentMatches.length === 0 ? (
                <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
                  <p style={{ marginBottom: '16px' }}>No requests yet. Post what you need!</p>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('post-request')}>Post a Request</button>
                </div>
              ) : (
                recentMatches.map((match, idx) => {
                  const statusColors = {
                    accepted: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', label: 'Matched' },
                    pending: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', label: 'Searching' },
                    declined: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', label: 'Declined' },
                  };
                  const st = statusColors[match.status] || statusColors.pending;
                  return (
                    <div key={idx} className="card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>📋</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{match.resource}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>From: {match.donor}</div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '20px' }}>
              💡 How It Works
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { step: '1', icon: '📝', title: 'Post Request', desc: 'Describe what you need with details' },
                { step: '2', icon: '🔄', title: 'Get Matched', desc: 'Our system finds suitable donors' },
                { step: '3', icon: '📦', title: 'Receive', desc: 'Connect with donor and receive items' },
              ].map(s => (
                <div key={s.step} className="card" style={{ padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{s.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>{s.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Request Progress */}
          <div className="card" style={{ padding: '24px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Request Fulfillment</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  width: `${recentMatches.length > 0 ? Math.round(recentMatches.filter(m => m.status === 'accepted').length / recentMatches.length * 100) : 0}%`,
                  height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '5px',
                }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#6366f1' }}>
                {recentMatches.length > 0 ? Math.round(recentMatches.filter(m => m.status === 'accepted').length / recentMatches.length * 100) : 0}%
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
              {recentMatches.filter(m => m.status === 'accepted').length} of {recentMatches.length} requests fulfilled
            </p>
          </div>

          {/* Badges */}
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '16px' }}>🏅 My Badges</h3>
            {(user?.badges || []).length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0' }}>Engage with the community to earn badges!</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.badges.map((badge, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '9999px', background: 'var(--primary-glow)', border: '1px solid var(--border)', fontSize: '12px' }}>
                    <span>{badge.icon || '🏅'}</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{badge.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '16px' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '➕ Post a Request', page: 'post-request', color: '#6366f1' },
                { label: '🔍 Browse Donations', page: 'browse', color: '#10b981' },
                { label: '🤝 My Matches', page: 'matches', color: '#f97316' },
                { label: '💬 Messages', page: 'messages', color: '#8b5cf6' },
                { label: '👤 My Profile', page: 'profile', color: '#ef4444' },
              ].map(a => (
                <button key={a.page} onClick={() => navigate(a.page)}
                  style={{ width: '100%', padding: '12px 16px', border: `1px solid ${a.color}33`, borderRadius: '12px', background: `${a.color}0d`, color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${a.color}1a`; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${a.color}0d`; e.currentTarget.style.transform = 'none'; }}>
                  <span style={{ fontSize: '18px' }}>{a.label.split(' ')[0]}</span> {a.label.split(' ').slice(1).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
