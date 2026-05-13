/* ===== Profile Page ===== */
import { useState, useEffect } from 'react';
import { getStats } from '../services/api';

export default function ProfilePage({ user, navigate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex@example.com',
    bio: 'Passionate about connecting communities with resources they need. Working to bridge the gap between donors and those in need.',
    location: 'Mumbai, India',
    phone: '+91 98765 43210',
    category: 'Technology',
    website: 'https://alexjohnson.dev',
  });
  const [saved, setSaved] = useState(false);
  const [profileStats, setProfileStats] = useState({
    requests: '12',
    matches: '8',
    delivered: '24',
    score: '94'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        if (data.stats) {
          setProfileStats({
            requests: data.stats.totalItems || '12',
            matches: data.stats.deliveredItems || '8',
            delivered: data.stats.peopleHelped || '24',
            score: '850'
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const stats = [
    { label: 'Total Posts', val: profileStats.requests, icon: '📋', color: '#6366f1' },
    { label: 'Matches', val: profileStats.matches, icon: '🤝', color: '#10b981' },
    { label: 'Impact Made', val: profileStats.delivered, icon: '📦', color: '#f59e0b' },
    { label: 'Impact Score', val: profileStats.score, icon: '⭐', color: '#8b5cf6' },
  ];

  const badges = [
    { icon: '🌟', label: 'Early Adopter',   color: '#f59e0b' },
    { icon: '🤝', label: 'Active Matcher',   color: '#10b981' },
    { icon: '💎', label: 'Verified Member',  color: '#6366f1' },
    { icon: '🚀', label: 'Power User',       color: '#8b5cf6' },
  ];

  const recentRequests = [
    { title: 'Laptops for Students', status: 'matched',   date: '2 days ago',  cat: '💻' },
    { title: 'Medical Supplies',     status: 'pending',   date: '5 days ago',  cat: '💊' },
    { title: 'Food Aid Packages',    status: 'completed', date: '2 weeks ago', cat: '🍱' },
  ];

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '1000px' }}>
      {saved && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(16,185,129,0.3)', zIndex: 1000, fontWeight: '700', animation: 'fadeInUp 0.3s ease' }}>
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Profile header */}
      <div className="card" style={{ padding: '0', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: '160px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', opacity: 0.8 }} />
        <div style={{ padding: '0 32px 32px 32px', marginTop: '-44px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '30px', background: 'white', padding: '4px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '26px', background: 'linear-gradient(135deg, #6366f1, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '800', color: 'white', fontFamily: 'Outfit,sans-serif' }}>
                {form.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div style={{ flex: 1, paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', margin: 0 }}>{form.name}</h1>
                <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: '700', background: user?.role === 'donor' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', color: user?.role === 'donor' ? '#34d399' : '#818cf8', border: '1px solid currentColor', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {user?.role === 'donor' ? '💰 Donor' : '🙋 Client'}
                </span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: '9999px' }}>✓ Verified Account</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: '500' }}>📍 {form.location} · 🗓 Joined Community Hub May 2025</p>
            </div>
            <button className={`btn ${editing ? 'btn-primary' : 'btn-secondary'}`} style={{ marginBottom: '8px' }} onClick={editing ? handleSave : () => setEditing(true)}>
              {editing ? '💾 Save Profile' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* About */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9', marginBottom: '20px', fontFamily: 'Outfit,sans-serif' }}>👤 Professional Bio</h3>
            {editing ? (
              <textarea className="form-input" style={{ minHeight: '120px', fontSize: '14px' }} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            ) : (
              <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.8', margin: 0 }}>{form.bio}</p>
            )}
          </div>

          {/* Contact Details */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9', marginBottom: '24px', fontFamily: 'Outfit,sans-serif' }}>📬 Contact Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { icon: '📧', label: 'Email Address', field: 'email', type: 'email' },
                { icon: '📱', label: 'Phone Number', field: 'phone', type: 'tel' },
                { icon: '📍', label: 'Current Location', field: 'location', type: 'text' },
                { icon: '🌐', label: 'Personal Website', field: 'website', type: 'url' },
              ].map(f => (
                <div key={f.field}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{f.icon}</span> {f.label}
                  </div>
                  {editing ? (
                    <input type={f.type} className="form-input" style={{ padding: '10px 14px' }} value={form[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))} />
                  ) : (
                    <div style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: '600' }}>{form[f.field] || '—'}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Badges Section */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9', marginBottom: '20px', fontFamily: 'Outfit,sans-serif' }}>🏅 Community Badges</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {badges.map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', fontSize: '13px', fontWeight: '700', color: b.color, transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '20px' }}>{b.icon}</span> {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Stats */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#f1f5f9', marginBottom: '24px', fontFamily: 'Outfit,sans-serif' }}>📊 Impact Analytics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {stats.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${s.color}15`, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.val}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#f1f5f9', marginBottom: '20px', fontFamily: 'Outfit,sans-serif' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: '🎁 Share Resource', page: 'share-something' },
                { label: '🔍 Browse Listings', page: 'browse' },
                { label: '🤝 My Matches', page: 'matches' },
                { label: '💬 Messages', page: 'messages' },
              ].map(a => (
                <button key={a.page} onClick={() => navigate(a.page)}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', background: 'rgba(99,102,241,0.05)', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.transform = 'none'; }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

