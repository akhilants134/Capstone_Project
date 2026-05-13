/* ===== Sidebar Component ===== */

const navItems = [
  { id: 'dashboard',       icon: '⚡', label: 'Dashboard'       },
  { id: 'browse',          icon: '🔍', label: 'Browse Listings'  },
  { id: 'post-request',    icon: '➕', label: 'Post a Request'   },
  { id: 'share-something', icon: '🎁', label: 'Share Something'  },
  { id: 'matches',         icon: '🤝', label: 'My Matches'       },
  { id: 'donations',       icon: '💝', label: 'Donations'        },
  { id: 'messages',        icon: '💬', label: 'Messages'         },
  { id: 'profile',         icon: '👤', label: 'My Profile'       },
];

export default function Sidebar({ currentPage, navigate, user, onLogout }) {

  return (
    <aside
      className={`app-sidebar`}
      style={{
        background: 'linear-gradient(180deg, #0d0f22 0%, #0a0b1a 100%)',
        borderRight: '1px solid rgba(99,102,241,0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(99,102,241,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
          boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
          flexShrink: 0,
        }}>🌐</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9' }}>
            ResourceMatch
          </div>
          <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Connect · Donate · Grow
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(99,102,241,0.1)',
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #10b981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', fontWeight: '700', color: 'white',
          flexShrink: 0,
        }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Guest User'}
          </div>
          <div style={{
            fontSize: '11px',
            color: user?.role === 'donor' ? '#34d399' : '#818cf8',
            fontWeight: '600', textTransform: 'capitalize',
          }}>
            {user?.role === 'donor' ? '💰 Donor' : '🙋 Client'}
          </div>
        </div>
      </div>

      {/* Search box */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', opacity: 0.6 }}>🔍</span>
          <input type="text" placeholder="Global Search..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '8px 10px 8px 30px', fontSize: '12px', color: '#f1f5f9', outline: 'none' }} />
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '12px', padding: '11px 14px',
                borderRadius: '10px', border: 'none',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))'
                  : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                color: isActive ? '#818cf8' : '#64748b',
                cursor: 'pointer',
                marginBottom: '4px',
                transition: 'all 0.2s ease',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{ fontSize: '13px', fontWeight: isActive ? '600' : '500' }}>
                {item.label}
              </span>
              {item.id === 'matches' && (
                <span style={{
                  marginLeft: 'auto', background: '#6366f1',
                  color: 'white', borderRadius: '9999px', fontSize: '10px',
                  fontWeight: '700', padding: '1px 6px',
                }}>3</span>
              )}
              {item.id === 'messages' && (
                <span style={{
                  marginLeft: 'auto', background: '#10b981',
                  color: 'white', borderRadius: '9999px', fontSize: '10px',
                  fontWeight: '700', padding: '1px 6px',
                }}>5</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid rgba(99,102,241,0.1)',
      }}>
        <button
          onClick={() => navigate('settings')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: '12px', padding: '11px 14px', borderRadius: '10px',
            border: 'none', background: 'transparent', color: '#64748b',
            cursor: 'pointer', marginBottom: '4px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
        >
          <span style={{ fontSize: '16px' }}>⚙️</span>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Settings</span>
        </button>
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: '12px', padding: '11px 14px', borderRadius: '10px',
            border: 'none', background: 'transparent', color: '#ef4444',
            cursor: 'pointer', transition: 'all 0.2s ease',
            opacity: '0.7',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.7'; }}
        >
          <span style={{ fontSize: '16px' }}>🚪</span>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
