/* ===== Matches Page ===== */
import { useState } from 'react';

const MATCHES = [
  { id: 1, resource: 'MacBook Pro 2021', donor: 'TechCorp Inc.', donorInitial: 'T', category: '💻', value: '$1,200', status: 'pending', matchScore: 97, date: '2 hrs ago', desc: 'A perfect match for your tech resource request. The donor has confirmed availability.' },
  { id: 2, resource: '50 Medical Kits', donor: 'HealthFirst NGO', donorInitial: 'H', category: '💊', value: '$800', status: 'accepted', matchScore: 91, date: '1 day ago', desc: 'Your medical supplies request has been accepted. Awaiting delivery coordination.' },
  { id: 3, resource: 'Online Courses', donor: 'EduGrant Org', donorInitial: 'E', category: '📚', value: '$400', status: 'pending', matchScore: 85, date: '3 days ago', desc: 'Education grant match. 20 online course seats available for your beneficiaries.' },
  { id: 4, resource: 'Food Packages', donor: 'FoodBank India', donorInitial: 'F', category: '🍱', value: '$600', status: 'completed', matchScore: 99, date: '1 week ago', desc: 'Completed successfully. 100 food packages were delivered to the beneficiaries.' },
];

const statusStyle = {
  pending:   { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', label: '⏳ Pending' },
  accepted:  { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: '✅ Accepted' },
  completed: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', label: '🎉 Completed' },
  declined:  { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', label: '❌ Declined' },
};

export default function MatchesPage({ navigate }) {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const items = filter === 'all' ? MATCHES : MATCHES.filter(m => m.status === filter);

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '4px' }}>My Matches 🤝</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Track your matched resource requests and donations</p>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Matches', val: MATCHES.length, icon: '🤝', color: '#6366f1' },
          { label: 'Pending Review', val: MATCHES.filter(m => m.status === 'pending').length, icon: '⏳', color: '#f59e0b' },
          { label: 'Accepted', val: MATCHES.filter(m => m.status === 'accepted').length, icon: '✅', color: '#818cf8' },
          { label: 'Completed', val: MATCHES.filter(m => m.status === 'completed').length, icon: '🎉', color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{s.val}</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'accepted', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '8px 16px', border: `1px solid ${filter === f ? '#6366f1' : 'rgba(99,102,241,0.2)'}`, borderRadius: '9999px', background: filter === f ? 'rgba(99,102,241,0.2)' : 'transparent', color: filter === f ? '#818cf8' : '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'Inter,sans-serif', textTransform: 'capitalize', transition: 'all 0.2s' }}>
            {f === 'all' ? '🌐 All' : f === 'pending' ? '⏳ Pending' : f === 'accepted' ? '✅ Accepted' : '🎉 Completed'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map(match => {
          const st = statusStyle[match.status];
          const isOpen = selected === match.id;
          return (
            <div key={match.id} className="card" style={{ padding: '20px', cursor: 'pointer', border: isOpen ? '1px solid rgba(99,102,241,0.4)' : undefined }}
              onClick={() => setSelected(isOpen ? null : match.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Score ring */}
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `conic-gradient(#6366f1 ${match.matchScore * 3.6}deg, rgba(99,102,241,0.1) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#13152b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#818cf8', fontFamily: 'Outfit,sans-serif' }}>
                    {match.matchScore}%
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'Outfit,sans-serif', margin: 0 }}>{match.resource}</h3>
                    <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    {match.category} · By <span style={{ color: '#94a3b8' }}>{match.donor}</span> · {match.date}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>{match.value}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Match score</div>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(99,102,241,0.15)', animation: 'fadeIn 0.2s ease' }}>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px', lineHeight: '1.6' }}>{match.desc}</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {match.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={e => { e.stopPropagation(); alert('Match accepted!'); }}>✅ Accept Match</button>
                        <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); alert('Match declined.'); }}>❌ Decline</button>
                      </>
                    )}
                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate('messages'); }}>💬 Message Donor</button>
                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate('browse'); }}>📋 View Full Details</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', color: '#94a3b8', marginBottom: '8px' }}>No matches yet</h3>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Post a request to start getting matched with donors</p>
          <button className="btn btn-primary" onClick={() => navigate('post-request')}>➕ Post a Request</button>
        </div>
      )}
    </div>
  );
}
