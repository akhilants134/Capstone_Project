/* ===== Dashboard Page ===== */
import { useState } from 'react';

const stats = [
  { label: 'Active Requests',  value: '12',   icon: '📋', color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  change: '+2 this week' },
  { label: 'Matches Found',    value: '8',    icon: '🤝', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  change: '+3 new today' },
  { label: 'Resources Received', value: '24', icon: '📦', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', change: '+1 yesterday' },
  { label: 'Impact Score',     value: '94',   icon: '⭐', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  change: '↑ 12 pts' },
];

const recentActivity = [
  { id: 1, type: 'match',    title: 'New match: Laptop Donation',      time: '2 min ago',  icon: '🤝', color: '#10b981' },
  { id: 2, type: 'request',  title: 'Request approved: Medical Kits',  time: '1 hr ago',   icon: '✅', color: '#6366f1' },
  { id: 3, type: 'message',  title: 'Message from Sarah K.',           time: '3 hrs ago',  icon: '💬', color: '#f59e0b' },
  { id: 4, type: 'donation', title: 'Donation received: $250',         time: 'Yesterday',  icon: '💝', color: '#ef4444' },
  { id: 5, type: 'match',    title: 'New match: School Supplies',      time: '2 days ago', icon: '🤝', color: '#10b981' },
];

const featuredListings = [
  { id: 1, title: 'MacBook Pro 2021',    category: 'Technology',  donor: 'TechCorp Inc.',  value: '$1,200', urgency: 'high',   image: '💻', matches: 3 },
  { id: 2, title: '50 Medical Kits',     category: 'Medical',     donor: 'HealthFirst',    value: '$800',   urgency: 'urgent', image: '💊', matches: 7 },
  { id: 3, title: 'Online Courses x20', category: 'Education',   donor: 'EduGrant Org',   value: '$400',   urgency: 'low',    image: '📚', matches: 2 },
];

export default function DashboardPage({ navigate, user }) {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  });

  return (
    <div style={{ animation: 'fadeInUp 0.5s ease' }}>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 50%, rgba(6,182,212,0.1) 100%)',
        border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px',
        padding: '28px 32px', marginBottom: '28px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(40px)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '13px', color: '#818cf8', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {greeting} 👋
            </p>
            <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '8px' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              {user?.role === 'donor'
                ? 'Your generosity is making a real difference. Here\'s your impact today.'
                : 'You have 3 new matches waiting for review. Check your latest updates below.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => navigate('post-request')}>
              ➕ Post Request
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('browse')}>
              🔍 Browse
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {stats.map((s, i) => (
          <div key={s.label} className="card" style={{ animationDelay: `${i * 0.05}s`, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {s.icon}
              </div>
              <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '600', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '9999px' }}>
                {s.change}
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Featured listings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9' }}>
              🔥 Featured Listings
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('browse')}>View All →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {featuredListings.map(listing => (
              <div key={listing.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))',
                    border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                  }}>
                    {listing.image}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9' }}>{listing.title}</h4>
                      <span className={`badge badge-${listing.urgency === 'urgent' ? 'danger' : listing.urgency === 'high' ? 'warning' : 'success'}`}>
                        {listing.urgency === 'urgent' ? '🔴' : listing.urgency === 'high' ? '🟡' : '🟢'} {listing.urgency}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>By {listing.donor} · {listing.category}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>{listing.value}</div>
                    <div style={{ fontSize: '11px', color: '#6366f1' }}>{listing.matches} matches</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('matches')}>Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9' }}>
              ⚡ Recent Activity
            </h3>
          </div>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {recentActivity.map((item, i) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px',
                borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(99,102,241,0.08)' : 'none',
                transition: 'background 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: `${item.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}>{item.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <span style={{ fontSize: '11px', color: '#475569' }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '12px' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '➕ Post a new request', page: 'post-request', color: '#6366f1' },
                { label: '🔍 Browse donations', page: 'browse', color: '#10b981' },
                { label: '💬 View messages', page: 'messages', color: '#f59e0b' },
              ].map(action => (
                <button key={action.page} onClick={() => navigate(action.page)}
                  style={{
                    width: '100%', padding: '11px 14px', border: `1px solid ${action.color}33`,
                    borderRadius: '10px', background: `${action.color}0d`, color: '#94a3b8',
                    cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: '500',
                    transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${action.color}1a`; e.currentTarget.style.color = '#f1f5f9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${action.color}0d`; e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
