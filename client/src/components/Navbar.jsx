import { useState, useEffect } from 'react';
import { getNotifications, markNotificationsRead } from '../services/api';

/* ===== Top Navbar Component ===== */
export default function Navbar({ currentPage, navigate, user }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.data.notifications || []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    if (user) fetchNotifs();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotifClick = async () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      try {
        await markNotificationsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
  };

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
      zIndex: 100,
    }}>
      {/* Page title */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', color: '#f1f5f9', margin: 0 }}>
          {pageLabels[currentPage] || 'ResourceMatch'}
        </h2>
        <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: '500' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', pointerEvents: 'none' }}>🔍</span>
          <input type="text" placeholder="Search resources..." style={{ background: 'rgba(30, 34, 64, 0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '8px 12px 8px 36px', color: '#f1f5f9', fontSize: '13px', outline: 'none', width: '220px', fontFamily: 'Inter, sans-serif' }} />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={handleNotifClick}
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', color: '#818cf8' }}>
            🔔
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
            )}
          </button>

          {showNotifs && (
            <div style={{ position: 'absolute', top: '48px', right: 0, width: '320px', background: '#13152b', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 1000, animation: 'fadeInUp 0.2s ease' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: '#f1f5f9', fontSize: '14px' }}>Notifications</span>
                <span style={{ fontSize: '11px', color: '#6366f1', cursor: 'pointer' }} onClick={() => setShowNotifs(false)}>Close</span>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No notifications yet.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)', background: n.isRead ? 'transparent' : 'rgba(99,102,241,0.05)', cursor: 'pointer' }} onClick={() => { if (n.link) navigate(n.link); setShowNotifs(false); }}>
                      <div style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '13px', marginBottom: '4px' }}>{n.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.4' }}>{n.text}</div>
                      <div style={{ color: '#475569', fontSize: '10px', marginTop: '8px' }}>{new Date(n.createdAt).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <button
          onClick={() => navigate('profile')}
          style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', border: '2px solid rgba(99,102,241,0.4)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: '700', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </button>
      </div>
    </header>
  );
}
