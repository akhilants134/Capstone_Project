/* ===== Donations Page ===== */
import { useState } from 'react';

const DONATIONS = [
  { id: 1, title: 'Laptop Donation — 5 Units',       recipient: 'Rural School, Bihar',    amount: '$1,200', date: 'May 3, 2026',  status: 'delivered',  cat: '💻', impact: '5 students empowered with tech access' },
  { id: 2, title: 'Medical Kit Contribution',          recipient: 'HealthFirst NGO',        amount: '$800',   date: 'Apr 28, 2026', status: 'in-transit', cat: '💊', impact: '50 families to receive medical aid' },
  { id: 3, title: 'Online Course Sponsorship',         recipient: 'EduGrant Org',           amount: '$400',   date: 'Apr 20, 2026', status: 'delivered',  cat: '📚', impact: '20 students accessed premium courses' },
  { id: 4, title: 'Emergency Food Package',            recipient: 'FoodBank India',         amount: '$600',   date: 'Apr 15, 2026', status: 'delivered',  cat: '🍱', impact: '100 families received nutritious meals' },
  { id: 5, title: 'STEM Scholarship Grant',            recipient: 'DevFund',                amount: '$2,000', date: 'Mar 30, 2026', status: 'processing', cat: '🎓', impact: '1 student full bootcamp scholarship' },
];

const statusStyle = {
  delivered:   { bg: 'rgba(16,185,129,0.15)', color: '#34d399',  label: '✅ Delivered'  },
  'in-transit': { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: '🚚 In Transit' },
  processing:  { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24',  label: '⏳ Processing'  },
};

export default function DonationsPage({ navigate }) {
  const [showModal, setShowModal] = useState(false);
  const [donateForm, setDonateForm] = useState({ title: '', amount: '', category: 'tech', description: '' });

  const totalDonated = DONATIONS.reduce((sum, d) => sum + parseInt(d.amount.replace(/\D/g, '')), 0);

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '4px' }}>Donations 💝</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Track your donations and the impact you've made</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>💝 Make a Donation</button>
      </div>

      {/* Impact summary */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Donated', val: `$${totalDonated.toLocaleString()}`, icon: '💰', color: '#10b981' },
          { label: 'Donations Made', val: DONATIONS.length, icon: '📦', color: '#6366f1' },
          { label: 'Lives Impacted', val: '176+', icon: '❤️', color: '#ef4444' },
          { label: 'Success Rate', val: '96%', icon: '⭐', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.val}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Donation list */}
      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'Outfit,sans-serif', marginBottom: '14px' }}>Donation History</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {DONATIONS.map(d => {
          const st = statusStyle[d.status];
          return (
            <div key={d.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{d.cat}</div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>{d.title}</h3>
                    <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px' }}>To: {d.recipient} · {d.date}</p>
                  <p style={{ fontSize: '12px', color: '#818cf8', margin: 0, fontStyle: 'italic' }}>💡 {d.impact}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>{d.amount}</div>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '6px' }} onClick={() => navigate('matches')}>View Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Make a donation modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: '#0d0f22', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '460px', animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', margin: 0 }}>💝 Make a Donation</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">Donation Title</label>
              <input type="text" className="form-input" placeholder="e.g. Laptop for students" value={donateForm.title} onChange={e => setDonateForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Amount (USD)</label>
              <input type="number" className="form-input" placeholder="e.g. 500" value={donateForm.amount} onChange={e => setDonateForm(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={donateForm.category} onChange={e => setDonateForm(p => ({ ...p, category: e.target.value }))}>
                <option value="tech">💻 Technology</option>
                <option value="medical">💊 Medical</option>
                <option value="education">📚 Education</option>
                <option value="food">🍱 Food Aid</option>
                <option value="financial">💰 Financial</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" placeholder="Describe what you're donating..." style={{ minHeight: '80px' }} value={donateForm.description} onChange={e => setDonateForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setShowModal(false); alert('Donation submitted! You will be matched with a recipient shortly.'); }}>
                🚀 Submit Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
