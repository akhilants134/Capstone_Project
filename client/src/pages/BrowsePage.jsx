/* ===== Browse Listings Page ===== */
import { useState } from 'react';

const LISTINGS = [
  { id: 1, title: 'MacBook Pro 2021 (M1)', category: 'tech', donor: 'TechCorp Inc.', value: '$1,200', urgency: 'high', desc: '16GB RAM, 512GB SSD, excellent condition. Perfect for developers or students.', tags: ['laptop', 'apple'], matches: 3, posted: '2 days ago' },
  { id: 2, title: '50 Basic Medical Kits', category: 'medical', donor: 'HealthFirst NGO', value: '$800', urgency: 'urgent', desc: 'Complete first-aid kits including bandages, antiseptics, medications.', tags: ['medical', 'first-aid'], matches: 7, posted: '1 day ago' },
  { id: 3, title: 'Online Courses (20 seats)', category: 'education', donor: 'EduGrant Org', value: '$400', urgency: 'low', desc: 'Access to 20 premium online learning seats across 100+ courses.', tags: ['online', 'learning'], matches: 2, posted: '5 days ago' },
  { id: 4, title: 'Emergency Food Packages', category: 'food', donor: 'FoodBank India', value: '$600', urgency: 'urgent', desc: '100 nutritious meal packages for families in need.', tags: ['food', 'emergency'], matches: 12, posted: '3 hrs ago' },
  { id: 5, title: 'Coding Bootcamp Scholarship', category: 'education', donor: 'DevFund', value: '$2,000', urgency: 'high', desc: 'Full scholarship for a 12-week intensive coding bootcamp.', tags: ['coding', 'scholarship'], matches: 15, posted: '4 days ago' },
  { id: 6, title: 'Financial Grant – Students', category: 'financial', donor: 'GrantHub', value: '$5,000', urgency: 'high', desc: 'Grant for undergraduate students pursuing STEM education.', tags: ['grant', 'stem'], matches: 28, posted: '6 hrs ago' },
];

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

export default function BrowsePage({ navigate }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('recent');

  const items = LISTINGS
    .filter(l => cat === 'all' || l.category === cat)
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
          <button className="btn btn-primary btn-sm" onClick={() => navigate('post-request')}>➕ Post Request</button>
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

      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Showing <span style={{ color: '#818cf8', fontWeight: '700' }}>{items.length}</span> listings</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {items.map(listing => (
          <div key={listing.id} className="card" style={{ padding: '20px', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                {CATS.find(c => c.val === listing.category)?.icon || '📦'}
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: '600', background: uBg[listing.urgency], color: uColor[listing.urgency] }}>
                {listing.urgency === 'urgent' ? '🔴' : listing.urgency === 'high' ? '🟡' : '🟢'} {listing.urgency}
              </span>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px', fontFamily: 'Outfit,sans-serif' }}>{listing.title}</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>By {listing.donor}</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{listing.desc}</p>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {listing.tags.map(tag => (
                <span key={tag} style={{ padding: '2px 8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '9999px', fontSize: '10px', color: '#818cf8', fontWeight: '500' }}>#{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981' }}>{listing.value}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{listing.matches} matched · {listing.posted}</div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('matches')}>Apply Now</button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', color: '#94a3b8', marginBottom: '8px' }}>No listings found</h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
