/* ===== Browse Listings Page ===== */
import { useState, useEffect } from 'react';
import { getListings } from '../services/api';

const CATS = [
  { val: 'all', label: 'All', icon: '🌐' },
  { val: 'tech', label: 'Tech', icon: '💻' },
  { val: 'medical', label: 'Medical', icon: '💊' },
  { val: 'education', label: 'Education', icon: '📚' },
  { val: 'food', label: 'Food', icon: '🍱' },
  { val: 'financial', label: 'Financial', icon: '💰' },
];

const uColor = { urgent: '#ef4444', high: '#f59e0b', low: '#10b981' };
const uBg = { urgent: 'rgba(239,68,68,0.15)', high: 'rgba(245,158,11,0.15)', low: 'rgba(16,185,129,0.15)' };

const statusColor = { active: '#6366f1', matched: '#f59e0b', completed: '#10b981' };

export default function BrowsePage({ navigate }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('recent');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a real API call.
        // For 60% demo, we use the service and it returns mock data if backend isn't ready.
        const data = await getListings({ category: cat !== 'all' ? cat : undefined });
        setListings(data.listings || []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        setError('Unable to load real-world data. Showing offline listings.');
        // Fallback to static data for demonstration
        setListings([
          { id: 1, title: 'MacBook Pro 2021 (M1)', category: 'tech', donor: 'TechCorp Inc.', value: '$1,200', urgency: 'high', desc: '16GB RAM, 512GB SSD, excellent condition. Perfect for developers or students.', tags: ['laptop', 'apple'], matches: 3, posted: '2 days ago', status: 'active' },
          { id: 2, title: '50 Basic Medical Kits', category: 'medical', donor: 'HealthFirst NGO', value: '$800', urgency: 'urgent', desc: 'Complete first-aid kits including bandages, antiseptics, medications.', tags: ['medical', 'first-aid'], matches: 7, posted: '1 day ago', status: 'matched' },
          { id: 4, title: 'Emergency Food Packages', category: 'food', donor: 'FoodBank India', value: '$600', urgency: 'urgent', desc: '100 nutritious meal packages for families in need.', tags: ['food', 'emergency'], matches: 12, posted: '3 hrs ago', status: 'completed' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cat]);

  const items = listings
    .filter(l => !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.donor.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'matches' ? b.matches - a.matches : 0);

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '4px' }}>Browse Listings 🔍</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Discover resources and donations available for matching</p>
      </div>

      {/* Filters */}
      <div style={{ background: 'linear-gradient(145deg, #13152b, #1a1d38)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
            <input type="text" className="form-input" placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '40px' }} />
          </div>
          <select className="form-input" value={sort} onChange={e => setSort(e.target.value)} style={{ width: '180px' }}>
            <option value="recent">Sort: Recent</option>
            <option value="matches">Sort: Most Matches</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('share-something')}>🎁 Share Something</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c.val} onClick={() => setCat(c.val)}
              style={{ padding: '7px 14px', border: `1px solid ${cat === c.val ? '#6366f1' : 'rgba(99,102,241,0.2)'}`, borderRadius: '9999px', background: cat === c.val ? 'rgba(99,102,241,0.2)' : 'transparent', color: cat === c.val ? '#818cf8' : '#64748b', cursor: 'pointer', fontSize: '12px', fontWeight: '600', fontFamily: 'Inter,sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '12px', borderRadius: '10px', marginBottom: '20px', fontSize: '13px' }}>⚠️ {error}</div>}

      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Showing <span style={{ color: '#818cf8', fontWeight: '700' }}>{items.length}</span> listings</p>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(99,102,241,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {items.map(listing => (
            <div key={listing.id} className="card" style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                  {CATS.find(c => c.val === listing.category)?.icon || '📦'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '10px', fontWeight: '800', background: uBg[listing.urgency], color: uColor[listing.urgency], textTransform: 'uppercase' }}>
                    {listing.urgency}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: statusColor[listing.status || 'active'], background: `${statusColor[listing.status || 'active']}1a`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    ● {listing.status || 'active'}
                  </span>
                </div>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#f1f5f9', marginBottom: '6px', fontFamily: 'Outfit,sans-serif' }}>{listing.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>Shared by <span style={{ color: '#818cf8' }}>{listing.donor}</span></p>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px', lineHeight: '1.6', height: '44px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.desc}</p>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {listing.tags?.map(tag => (
                  <span key={tag} style={{ padding: '3px 10px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '9999px', fontSize: '11px', color: '#818cf8', fontWeight: '600' }}>#{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>{listing.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{listing.posted}</div>
                </div>
                <button className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={() => navigate('matches')}>Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔍</div>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', fontSize: '20px', marginBottom: '12px' }}>No resources found</h3>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>Try adjusting your search or category filters to find what you need.</p>
        </div>
      )}
    </div>
  );
}

