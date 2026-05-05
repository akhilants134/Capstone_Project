/* ===== Profile Page ===== */
import { useState } from 'react';

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

  const handleSave = () => {
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const stats = [
    { label: 'Requests Posted', val: '12', icon: '📋', color: '#6366f1' },
    { label: 'Matches Made',    val: '8',  icon: '🤝', color: '#10b981' },
    { label: 'Resources Got',   val: '24', icon: '📦', color: '#f59e0b' },
    { label: 'Impact Score',    val: '94', icon: '⭐', color: '#8b5cf6' },
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
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '900px' }}>
      {saved && (
        <div className="toast toast-success" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Profile header */}
      <div className="card" style={{ padding: '32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))', borderBottom: '1px solid rgba(99,102,241,0.15)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '700', color: 'white', fontFamily: 'Outfit,sans-serif', border: '4px solid rgba(99,102,241,0.4)', boxShadow: '0 8px 30px rgba(99,102,241,0.3)', marginTop: '40px' }}>
              {form.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', margin: 0 }}>{form.name}</h1>
                <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: user?.role === 'donor' ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', color: user?.role === 'donor' ? '#34d399' : '#818cf8', border: `1px solid ${user?.role === 'donor' ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}` }}>
                  {user?.role === 'donor' ? '💰 Donor' : '🙋 Client'}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>✓ Verified</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>📍 {form.location} · 🗓 Joined May 2025</p>
            </div>
            <button className={`btn ${editing ? 'btn-success' : 'btn-secondary'} btn-sm`} onClick={editing ? handleSave : () => setEditing(true)}>
              {editing ? '💾 Save Changes' : '✏️ Edit Profile'}
            </button>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {badges.map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', background: 'rgba(19,21,43,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', color: b.color }}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* About */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontFamily: 'Outfit,sans-serif' }}>👤 About</h3>
            {editing ? (
              <textarea className="form-input" style={{ minHeight: '100px' }} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            ) : (
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.7', margin: 0 }}>{form.bio}</p>
            )}
          </div>

          {/* Contact info */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontFamily: 'Outfit,sans-serif' }}>📬 Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { icon: '📧', label: 'Email', field: 'email', type: 'email' },
                { icon: '📱', label: 'Phone', field: 'phone', type: 'tel' },
                { icon: '📍', label: 'Location', field: 'location', type: 'text' },
                { icon: '🌐', label: 'Website', field: 'website', type: 'url' },
              ].map(f => (
                <div key={f.field} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', width: '28px', textAlign: 'center' }}>{f.icon}</span>
                  {editing ? (
                    <input type={f.type} className="form-input" style={{ flex: 1, padding: '8px 12px' }} value={form[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))} />
                  ) : (
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</div>
                      <div style={{ fontSize: '13px', color: '#f1f5f9' }}>{form[f.field] || '—'}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent requests */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'Outfit,sans-serif', margin: 0 }}>📋 Recent Requests</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('browse')}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentRequests.map(r => (
                <div key={r.title} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(19,21,43,0.5)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <span style={{ fontSize: '20px' }}>{r.cat}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{r.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{r.date}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: r.status === 'completed' ? 'rgba(16,185,129,0.15)' : r.status === 'matched' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)', color: r.status === 'completed' ? '#34d399' : r.status === 'matched' ? '#818cf8' : '#fbbf24' }}>
                    {r.status === 'completed' ? '✅' : r.status === 'matched' ? '🤝' : '⏳'} {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontFamily: 'Outfit,sans-serif' }}>📊 Your Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {stats.map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${s.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{s.label}</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: s.color, lineHeight: 1 }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', marginBottom: '12px', fontFamily: 'Outfit,sans-serif' }}>⚡ Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '➕ Post Request', page: 'post-request' },
                { label: '🔍 Browse Listings', page: 'browse' },
                { label: '🤝 View Matches', page: 'matches' },
                { label: '💬 Messages', page: 'messages' },
              ].map(a => (
                <button key={a.page} onClick={() => navigate(a.page)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', background: 'transparent', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: '500', fontFamily: 'Inter,sans-serif', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#f1f5f9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
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
