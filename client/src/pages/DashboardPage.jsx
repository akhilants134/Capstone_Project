

/* ===== Dashboard Page ===== */
import { useState, useEffect } from 'react';
import { getStats } from '../services/api';

const defaultStats = [
  { label: 'Items Shared',      value: '42',   icon: '🎁', color: '#f97316', bg: 'rgba(249,115,22,0.1)',  change: '+5 this week' },
  { label: 'Items Delivered',   value: '38',   icon: '🚚', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  change: '+2 today' },
  { label: 'People Helped',     value: '156',  icon: '👥', color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  change: '+12 this month' },
  { label: 'Total Quantity',    value: '1.2k', icon: '📊', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  change: '↑ 15% growth' },
];

const badges = [
  { id: 1, icon: '⭐', name: 'First Share', color: '#f59e0b', desc: 'Listed your first item' },
  { id: 2, icon: '🌟', name: 'Community Star', color: '#10b981', desc: 'Helped 50+ people' },
  { id: 3, icon: '🤝', name: 'Super Matcher', color: '#6366f1', desc: '10+ successful matches' },
  { id: 4, icon: '💎', name: 'Top Donor', color: '#ec4899', desc: 'Donated high-value items' },
];

const impactStories = [
  { id: 1, name: 'Sarah Johnson', text: 'The winter clothes I received helped my family stay warm during the cold wave.', avatar: 'SJ' },
  { id: 2, name: 'John Martinez', text: 'The laptop donation enabled me to complete my online certification course.', avatar: 'JM' },
];

export default function DashboardPage({ navigate, user }) {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  });

  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getStats();
        if (data.stats) {
          setStats([
            { ...defaultStats[0], value: data.stats.totalItems || '42' },
            { ...defaultStats[1], value: data.stats.deliveredItems || '38' },
            { ...defaultStats[2], value: data.stats.peopleHelped || '156' },
            { ...defaultStats[3], value: data.stats.totalQuantity || '1.2k' },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease' }}>
      {/* Welcome banner with Orange-to-Red gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
        borderRadius: '24px',
        padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(249,115,22,0.3)',
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {greeting} 👋
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'white', marginBottom: '12px' }}>
              Welcome to Community Hub, {user?.name?.split(' ')[0] || 'Member'}!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', maxWidth: '500px', lineHeight: '1.6' }}>
              Your contributions are making a real difference. You've helped {stats[2].value} community members this month!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn" style={{ background: 'white', color: '#f97316', fontWeight: '700', padding: '12px 24px', borderRadius: '14px', border: 'none', cursor: 'pointer' }} onClick={() => navigate('share-something')}>
              🎁 Share Something
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', padding: '12px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} onClick={() => navigate('browse')}>
              🔍 Browse
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
            <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', lineHeight: 1, marginBottom: '6px' }}>
              {loading ? '...' : s.value}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        {/* Left column */}
        <div>
          {/* Badges Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9' }}>
                🏅 Your Badges
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('profile')}>View Profile →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
              {badges.map(badge => (
                <div key={badge.id} className="card" style={{ padding: '20px', textAlign: 'center', background: 'rgba(19,21,43,0.4)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>{badge.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>{badge.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Stories */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '20px' }}>
              ✨ Community Impact
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {impactStories.map(story => (
                <div key={story.id} className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', flexShrink: 0 }}>
                      {story.avatar}
                    </div>
                    <div>
                      <p style={{ color: '#f1f5f9', fontSize: '15px', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.6' }}>"{story.text}"</p>
                      <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: '700', margin: 0 }}>— {story.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="card" style={{ padding: '24px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '12px' }}>Your Impact Score</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '5px' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1' }}>850</span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>You're in the top 5% of community donors this month! Keep it up. 🚀</p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '16px' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '🎁 Share Something', page: 'share-something', color: '#f97316' },
                { label: '🔍 Browse Requests', page: 'browse', color: '#6366f1' },
                { label: '🤝 My Matches', page: 'matches', color: '#10b981' },
                { label: '💬 Messages', page: 'messages', color: '#8b5cf6' },
              ].map(a => (
                <button key={a.page} onClick={() => navigate(a.page)}
                  style={{ width: '100%', padding: '12px 16px', border: `1px solid ${a.color}33`, borderRadius: '12px', background: `${a.color}0d`, color: '#f1f5f9', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
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


