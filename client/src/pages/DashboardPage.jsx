

/* ===== Dashboard Page ===== */
import { useState } from 'react';

const stats = [
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

const recentActivity = [
  { id: 1, type: 'match',    title: 'New match: Winter Clothes',       time: '2 min ago',  icon: '🤝', color: '#10b981' },
  { id: 2, type: 'request',  title: 'Item delivered: Medical Kits',    time: '1 hr ago',   icon: '✅', color: '#6366f1' },
  { id: 3, type: 'message',  title: 'Message from Hope Shelter',       time: '3 hrs ago',  icon: '💬', color: '#f59e0b' },
  { id: 4, type: 'donation', title: 'New share: Canned Food x20',      time: 'Yesterday',  icon: '🍱', color: '#ef4444' },
];

export default function DashboardPage({ navigate, user }) {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  });

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
              Your contributions are making a real difference. You've helped 156 community members this month!
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
          <div key={s.label} className="card" style={{ animationDelay: `${i * 0.1}s`, padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {s.icon}
              </div>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: '9999px' }}>
                {s.change}
              </span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
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
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '16px' }}>
              ⚡ Recent Activity
            </h3>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              {recentActivity.map((item, i) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px',
                  borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(99,102,241,0.08)' : 'none',
                  transition: 'background 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                    background: `${item.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px',
                  }}>{item.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: '600', margin: '0 0 2px 0' }}>{item.title}</p>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '24px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '12px' }}>Your Impact Score</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '5px' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1' }}>850</span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px' }}>You're in the top 5% of community donors this month! Keep it up. 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
}

