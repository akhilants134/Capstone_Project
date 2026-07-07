/* ===== Donor Dashboard ===== */
import { useState, useEffect } from 'react';
import { getStats, getMe, getMyMatches } from '../../services/api';

const defaultStats = [
  { label: 'Items Shared',    value: '0', icon: '🎁', color: '#f97316', bg: 'rgba(249,115,22,0.1)',  change: '+5 this week' },
  { label: 'Active Donations', value: '0', icon: '📦', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  change: '+2 today' },
  { label: 'People Helped',   value: '0', icon: '👥', color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  change: '+12 this month' },
  { label: 'Impact Points',   value: '0', icon: '💎', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  change: '15% growth' },
];

export default function DonorDashboard({ navigate, user: initialUser }) {
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

        if (statsRes.data) {
          setStats([
            { ...defaultStats[0], value: String(statsRes.data.totalListings || 0) },
            { ...defaultStats[1], value: String(statsRes.data.activeMatches || 0) },
            { ...defaultStats[2], value: String(statsRes.data.totalUsers || 0) },
            { ...defaultStats[3], value: String(userRes.data?.user?.points || 0) },
          ]);
        }
        if (userRes.data?.user) setUser(userRes.data.user);
        if (matchesRes.data?.matches) setRecentMatches(matchesRes.data.matches.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch donor dashboard data:', err);
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
        background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
        borderRadius: '24px', padding: '32px', marginBottom: '32px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(249,115,22,0.3)',
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {greeting} 👋
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'white', marginBottom: '12px' }}>
              Donor Dashboard, {user?.name?.split(' ')[0] || 'Donor'}!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', maxWidth: '500px', lineHeight: '1.6' }}>
              Your generosity is changing lives. You've earned {user?.points || 0} impact points!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: 'white', color: '#f97316', fontWeight: '700', padding: '12px 24px', borderRadius: '14px', border: 'none', cursor: 'pointer' }} onClick={() => navigate('share-something')}>
              🎁 Share Something
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', padding: '12px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} onClick={() => navigate('donations')}>
              💝 My Donations
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
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '9999px' }}>
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
          {/* Recent Donation Matches */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
                🤝 Recent Matches
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('matches')}>View All →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentMatches.length === 0 ? (
                <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No matches yet. Start by sharing something!
                </div>
              ) : (
                recentMatches.map((match, idx) => (
                  <div key={idx} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>📦</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{match.resource}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Score: {match.matchScore}% match</div>
                      </div>
                      <span style={{
                        padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600',
                        background: match.status === 'accepted' ? 'rgba(16,185,129,0.15)' : match.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: match.status === 'accepted' ? '#34d399' : match.status === 'pending' ? '#fbbf24' : '#f87171',
                      }}>
                        {match.status === 'accepted' ? 'Accepted' : match.status === 'pending' ? 'Pending' : 'Declined'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
                🏅 Donor Badges
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('profile')}>View Profile →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
              {(user?.badges || []).length === 0 ? (
                <div className="card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>No badges yet. Start donating to earn!</div>
              ) : (
                user.badges.map((badge, idx) => (
                  <div key={idx} className="card" style={{ padding: '20px', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>{badge.icon || '🏅'}</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{badge.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Earned {new Date(badge.earnedAt).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Donation Impact */}
          <div className="card" style={{ padding: '24px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Donor Impact Score</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((user?.points || 0) / 10, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #f97316, #ef4444)', borderRadius: '5px' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#f97316' }}>{user?.points || 0}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>Keep donating to climb the leaderboard!</p>
          </div>

          {/* Donation Tips */}
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '16px' }}>💡 Donation Tips</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { text: 'Items in good condition get matched 3x faster', icon: '⭐' },
                { text: 'Add clear photos to increase match success', icon: '📸' },
                { text: 'Include pickup details for quicker handoffs', icon: '📍' },
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{tip.icon}</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '16px' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '🎁 Share Something', page: 'share-something', color: '#f97316' },
                { label: '💝 My Donations', page: 'donations', color: '#ef4444' },
                { label: '🤝 My Matches', page: 'matches', color: '#10b981' },
                { label: '💬 Messages', page: 'messages', color: '#8b5cf6' },
                { label: '🔍 Browse Requests', page: 'browse', color: '#6366f1' },
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
