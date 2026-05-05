/* ===== Top Navbar Component ===== */
export default function Navbar({ currentPage, navigate, user }) {
  const pageLabels = {
    dashboard:      'Dashboard',
    browse:         'Browse Listings',
    'post-request': 'Post a Request',
    matches:        'My Matches',
    donations:      'Donations',
    messages:       'Messages',
    profile:        'My Profile',
    settings:       'Settings',
  };

  return (
    <header style={{
      height: '64px',
      background: 'rgba(10, 11, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(99,102,241,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Page title */}
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '700',
          fontFamily: 'Outfit, sans-serif',
          color: '#f1f5f9',
          margin: 0,
        }}>
          {pageLabels[currentPage] || 'ResourceMatch'}
        </h2>
        <p style={{
          fontSize: '11px', color: '#64748b', margin: 0, fontWeight: '500',
        }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '14px', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search resources..."
            style={{
              background: 'rgba(30, 34, 64, 0.8)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '8px',
              padding: '8px 12px 8px 36px',
              color: '#f1f5f9',
              fontSize: '13px',
              outline: 'none',
              width: '220px',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </div>

        {/* Notifications */}
        <button style={{
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '10px',
          width: '38px', height: '38px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '16px', position: 'relative',
          color: '#818cf8',
        }}>
          🔔
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px',
            background: '#ef4444', color: 'white', borderRadius: '50%',
            width: '16px', height: '16px', fontSize: '9px', fontWeight: '700',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>3</span>
        </button>

        {/* User avatar */}
        <button
          onClick={() => navigate('profile')}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #10b981)',
            border: '2px solid rgba(99,102,241,0.4)',
            borderRadius: '50%',
            width: '38px', height: '38px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: 'white',
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </button>
      </div>
    </header>
  );
}
