/* ===== Matches Page ===== */
import { useState, useEffect } from 'react';
import { getMyMatches, updateMatchStatus } from '../services/api';

const defaultMatches = [
  { id: 1, resource: 'MacBook Pro 2021', donor: 'TechCorp Inc.', donorInitial: 'T', category: '💻', value: '$1,200', status: 'pending', matchScore: 97, date: '2 hrs ago', desc: 'A perfect match for your tech resource request. The donor has confirmed availability.' },
  { id: 2, resource: '50 Medical Kits', donor: 'HealthFirst NGO', donorInitial: 'H', category: '💊', value: '$800', status: 'accepted', matchScore: 91, date: '1 day ago', desc: 'Your medical supplies request has been accepted. Awaiting delivery coordination.' },
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
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState('');

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await getMyMatches();
      setMatches(data.matches?.length > 0 ? data.matches : defaultMatches);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setMatches(defaultMatches);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleUpdateStatus = async (e, matchId, newStatus) => {
    e.stopPropagation();
    try {
      setUpdating(matchId);
      await updateMatchStatus({ matchId, status: newStatus });
      setMessage(`Match ${newStatus} successfully!`);
      setTimeout(() => setMessage(''), 3000);
      fetchMatches(); // Refresh list
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const items = filter === 'all' ? matches : matches.filter(m => m.status === filter);

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {message && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: '#10b981', color: 'white', padding: '12px 24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(16,185,129,0.3)', zIndex: 1000, fontWeight: '700', animation: 'fadeInUp 0.3s ease' }}>
          ✅ {message}
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '4px' }}>My Matches 🤝</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Track your matched resource requests and donations</p>
      </div>

      {/* Stats row */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {[
          { label: 'Total Matches', val: matches.length, icon: '🤝', color: '#6366f1' },
          { label: 'Pending Review', val: matches.filter(m => m.status === 'pending' || !m.status).length, icon: '⏳', color: '#f59e0b' },
          { label: 'Accepted', val: matches.filter(m => m.status === 'accepted').length, icon: '✅', color: '#818cf8' },
          { label: 'Completed', val: matches.filter(m => m.status === 'completed').length, icon: '🎉', color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: s.color, lineHeight: 1, marginBottom: '4px' }}>{loading ? '...' : s.val}</div>
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

      {loading && matches.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid rgba(99,102,241,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {items.map(match => {
            const currentStatus = match.status || 'pending';
            const st = statusStyle[currentStatus];
            const isOpen = selected === match.id;
            const isUpdating = updating === match.id;

            return (
              <div key={match.id} className="card" style={{ padding: '20px', cursor: 'pointer', border: isOpen ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.05)', opacity: isUpdating ? 0.7 : 1 }}
                onClick={() => setSelected(isOpen ? null : match.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Score ring */}
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `conic-gradient(#6366f1 ${(match.matchScore || 90) * 3.6}deg, rgba(99,102,241,0.1) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#13152b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: '#818cf8', fontFamily: 'Outfit,sans-serif' }}>
                      {match.matchScore || 90}%
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', fontFamily: 'Outfit,sans-serif', margin: 0 }}>{match.resource}</h3>
                      <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      {match.category} · By <span style={{ color: '#818cf8' }}>{match.donor || 'Community Member'}</span> · {match.date || 'Recently'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>{match.value || 'Resource'}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Match score</div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', animation: 'fadeIn 0.2s ease' }}>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', lineHeight: '1.6' }}>{match.desc || 'A suitable match found for your resource requirements. The donor is ready to proceed with the handover process.'}</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {currentStatus === 'pending' && (
                        <>
                          <button className="btn btn-primary btn-sm" disabled={isUpdating} onClick={e => handleUpdateStatus(e, match.id, 'accepted')}>
                            {isUpdating ? '...' : '✅ Accept Match'}
                          </button>
                          <button className="btn btn-secondary btn-sm" disabled={isUpdating} onClick={e => handleUpdateStatus(e, match.id, 'declined')}>
                            {isUpdating ? '...' : '❌ Decline'}
                          </button>
                        </>
                      )}
                      {currentStatus === 'accepted' && (
                        <button className="btn btn-success btn-sm" disabled={isUpdating} onClick={e => handleUpdateStatus(e, match.id, 'completed')}>
                          {isUpdating ? '...' : '🎉 Mark Completed'}
                        </button>
                      )}
                      <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate('messages'); }}>💬 Message Donor</button>
                      <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate('browse'); }}>📋 View Details</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤝</div>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', fontSize: '20px', marginBottom: '12px' }}>No matches yet</h3>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Start by browsing resources or posting a request to find a match.</p>
          <button className="btn btn-primary" onClick={() => navigate('browse')}>Explore Resources</button>
        </div>
      )}
    </div>
  );
}


