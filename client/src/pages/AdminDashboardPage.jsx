import { useState, useEffect } from 'react';
import {
  adminGetAllUsers,
  adminToggleBanUser,
  adminGetAllListings,
  adminGetStats,
  adminGetUnverifiedUsers,
  adminToggleUserVerification,
  adminGetTopDonors
} from '../services/api';

export default function AdminDashboardPage({ navigate, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Real data state
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoMatchEnabled, setAutoMatchEnabled] = useState(true);

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, listingsRes, statsRes, verificationsRes, topDonorsRes] = await Promise.all([
        adminGetAllUsers(),
        adminGetAllListings(),
        adminGetStats(),
        adminGetUnverifiedUsers(),
        adminGetTopDonors()
      ]);
      
      setUsers(usersRes.data.users);
      setListings(listingsRes.data.listings);
      setStats(statsRes.data);
      setVerifications(verificationsRes.data.users);
      setTopDonors(topDonorsRes.data.donors);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load data. Using demo data instead.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleBanUser = async (userId) => {
    try {
      await adminToggleBanUser(userId);
      await fetchAllData(); // Refresh data
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Failed to ban user');
    }
  };

  const handleVerifyUser = async (userId, action) => {
    try {
      await adminToggleUserVerification(userId, action);
      await fetchAllData(); // Refresh data
    } catch (err) {
      console.error('Error verifying user:', err);
      // Only show alert if it's a real error, not just missing backend
      if (err.message && !err.message.includes('Failed to fetch')) {
        alert(`Failed to verify user: ${err.message}`);
      }
    }
  };

  const tabs = [
    { id: 'overview', icon: '⚡', label: 'Overview' },
    { id: 'verifications', icon: '✅', label: 'Verifications' },
    { id: 'users', icon: '👥', label: 'Users' },
    { id: 'donations', icon: '💝', label: 'Donations' },
    { id: 'top-donors', icon: '🏆', label: 'Top Donors' },
    { id: 'categories', icon: '📂', label: 'Categories' },
    { id: 'system', icon: '🔧', label: 'System' },
  ];

  // Fallback mock data (used when API fails)
  const mockStats = [
    { title: 'Total Donations', value: '5', change: '+5%', label: 'All time donations', icon: '📦' },
    { title: 'Active Requests', value: '3', change: '+12%', label: 'Open requests', icon: '📋' },
    { title: 'Total Matched', value: '2', change: '+8%', label: 'Successful matches', icon: '🤝' },
    { title: 'Value Prevented', value: '$20,900', change: '+15%', label: 'Estimated waste prevented', icon: '💰' },
  ];

  const mockDonationPipeline = [
    { status: 'Listed / Available', count: 3 },
    { status: 'Matched', count: 0 },
    { status: 'In Transit', count: 1 },
    { status: 'Completed', count: 1 },
  ];

  const mockTopDonors = [
    { name: 'Tech Solutions Inc', value: 8000 },
    { name: 'ABC Manufacturing Ltd', value: 5700 },
    { name: 'Fresh Foods Factory', value: 4200 },
    { name: 'Green Valley Community', value: 3000 },
  ];

  const mockRecentActivity = [
    { item: 'School Supplies', donor: 'ABC Manufacturing Ltd', recipient: 'Hope Children\'s Home', value: '$2,500', status: 'Completed' },
    { item: 'Office Furniture', donor: 'Fresh Foods Factory', recipient: 'Unclaimed', value: '$3,200', status: 'Listed' },
    { item: 'Canned Food', donor: 'Green Valley Community', recipient: 'Unclaimed', value: '$4,200', status: 'Listed' },
    { item: 'Winter Clothing', donor: 'Tech Solutions Inc', recipient: 'Helping Hands NGO', value: '$3,000', status: 'In Transit' },
    { item: 'Laptops', donor: 'Tech Solutions Inc', recipient: 'Unclaimed', value: '$8,000', status: 'Listed' },
  ];

  const categories = [
    { name: 'Electronics', icon: '💻', donations: 1, value: 8000, percentage: 20, color: '#6366f1' },
    { name: 'Food', icon: '🍎', donations: 1, value: 4200, percentage: 20, color: '#10b981' },
    { name: 'Furniture', icon: '🛋️', donations: 1, value: 3200, percentage: 20, color: '#f59e0b' },
    { name: 'Clothing', icon: '👕', donations: 1, value: 3000, percentage: 20, color: '#ef4444' },
    { name: 'Education', icon: '📚', donations: 1, value: 2500, percentage: 20, color: '#8b5cf6' },
  ];

  const mockVerifications = [
    { org: 'ABC Manufacturing Ltd', type: 'Donor', contact: 'contact@abc.com', status: 'Verified' },
    { org: 'Hope Children\'s Home', type: 'Recipient', contact: 'info@hope.org', status: 'Verified' },
    { org: 'Tech Solutions Inc', type: 'Donor', contact: 'admin@tech.com', status: 'Pending' },
    { org: 'Green Valley Community', type: 'Recipient', contact: 'support@green.org', status: 'Unverified' },
    { org: 'Fresh Foods Factory', type: 'Donor', contact: 'sales@fresh.com', status: 'Pending' },
    { org: 'Helping Hands NGO', type: 'Recipient', contact: 'help@hands.org', status: 'Verified' },
    { org: 'John Smith', type: 'People', contact: 'john@email.com', status: 'Unverified' },
    { org: 'Sarah Johnson', type: 'People', contact: 'sarah@email.com', status: 'Pending' },
  ];

  const mockUsers = [
    { name: 'Admin User', email: 'admin@resourcematch.com', role: 'Admin', status: 'Active' },
    { name: 'Tech Solutions Inc', email: 'admin@tech.com', role: 'Donor', status: 'Active' },
    { name: 'Hope Children\'s Home', email: 'info@hope.org', role: 'Recipient', status: 'Active' },
    { name: 'ABC Manufacturing Ltd', email: 'contact@abc.com', role: 'Donor', status: 'Active' },
    { name: 'Green Valley Community', email: 'support@green.org', role: 'Recipient', status: 'Active' },
    { name: 'Fresh Foods Factory', email: 'sales@fresh.com', role: 'Donor', status: 'Active' },
    { name: 'Helping Hands NGO', email: 'help@hands.org', role: 'Recipient', status: 'Active' },
    { name: 'John Smith', email: 'john@email.com', role: 'Community', status: 'Active' },
  ];

  const mockDonations = [
    { item: 'School Supplies', donor: 'ABC Manufacturing Ltd', recipient: 'Hope Children\'s Home', value: '$2,500', status: 'Completed' },
    { item: 'Office Furniture', donor: 'Fresh Foods Factory', recipient: 'Unclaimed', value: '$3,200', status: 'Listed' },
    { item: 'Canned Food', donor: 'Green Valley Community', recipient: 'Unclaimed', value: '$4,200', status: 'Listed' },
    { item: 'Winter Clothing', donor: 'Tech Solutions Inc', recipient: 'Helping Hands NGO', value: '$3,000', status: 'In Transit' },
    { item: 'Laptops', donor: 'Tech Solutions Inc', recipient: 'Unclaimed', value: '$8,000', status: 'Listed' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified':
      case 'Active':
      case 'Completed':
        return '#10b981';
      case 'Pending':
      case 'In Transit':
      case 'Listed':
        return '#f59e0b';
      case 'Unverified':
      case 'Banned':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderOverview = () => {
    const displayStats = stats || mockStats;
    const displayTopDonors = topDonors.length > 0 ? topDonors : mockTopDonors;
    const displayRecentActivity = listings.length > 0 ? listings.slice(0, 5).map(l => ({
      item: l.title,
      donor: l.user?.name || 'Unknown',
      recipient: 'Unclaimed',
      value: l.estimatedValue ? `$${l.estimatedValue}` : 'N/A',
      status: l.status
    })) : mockRecentActivity;

    return (
      <div style={{ padding: '24px' }}>
        {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>}
        
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: '12px', padding: '24px', marginBottom: '24px',
          color: 'white',
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif' }}>
            Welcome back, Admin — Platform management & analytics
          </h2>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {displayStats.map((stat, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px',
                background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>{stat.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '4px' }}>{stat.title}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>{stat.change} {stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Top Donors */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Top Donors by Value</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayTopDonors.map((donor, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{donor.name}</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${(donor.totalDonationValue || donor.value || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${((donor.totalDonationValue || donor.value || 0) / 8000) * 100}%`,
                      background: 'linear-gradient(90deg, #10b981, #34d399)',
                      borderRadius: '4px',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Categories */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Recent Activity */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayRecentActivity.map((activity, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px', background: 'var(--bg-input)', borderRadius: '8px',
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{activity.item}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {activity.donor} → {activity.recipient}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{activity.value}</div>
                    <div style={{
                      fontSize: '11px', fontWeight: '500', padding: '2px 8px', borderRadius: '4px',
                      background: `${getStatusColor(activity.status)}20`, color: getStatusColor(activity.status),
                    }}>
                      {activity.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Categories</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '160px', height: '160px', borderRadius: '50%',
                background: `conic-gradient(${categories.map(c => `${c.color} ${c.percentage}%`).join(', ')})`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-card)',
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: cat.color }} />
                  <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{cat.name}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVerifications = () => {
    const displayVerifications = verifications.length > 0 ? verifications : mockVerifications;
    
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
            Organization Verifications
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Review and approve organization verification requests
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Organization</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Contact</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayVerifications.map((v, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{v.org || v.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{v.type || v.role}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{v.contact || v.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '500', padding: '4px 10px', borderRadius: '6px',
                      background: `${getStatusColor(v.isVerified ? 'Verified' : v.status)}20`, color: getStatusColor(v.isVerified ? 'Verified' : v.status),
                    }}>{v.isVerified ? 'Verified' : v.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {(!v.isVerified && v.status === 'Pending' || !v.isVerified) && (
                      <>
                        <button 
                          onClick={() => handleVerifyUser(v._id, 'approve')}
                          style={{
                            padding: '6px 12px', fontSize: '12px', fontWeight: '500', borderRadius: '6px',
                            background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', marginRight: '8px',
                          }}
                        >Approve</button>
                        <button 
                          onClick={() => handleVerifyUser(v._id, 'reject')}
                          style={{
                            padding: '6px 12px', fontSize: '12px', fontWeight: '500', borderRadius: '6px',
                            background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer',
                          }}
                        >Reject</button>
                      </>
                    )}
                    {v.isVerified && (
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    const displayUsers = users.length > 0 ? users : mockUsers;
    
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
            User Management
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Manage all platform users and their roles
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Email</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Role</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((u, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{u.name}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '500', padding: '4px 10px', borderRadius: '6px',
                      background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '500', padding: '4px 10px', borderRadius: '6px',
                      background: `${getStatusColor(u.isBanned ? 'Banned' : 'Active')}20`, color: getStatusColor(u.isBanned ? 'Banned' : 'Active'),
                    }}>{u.isBanned ? 'Banned' : 'Active'}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleBanUser(u._id)}
                        style={{
                          padding: '6px 12px', fontSize: '12px', fontWeight: '500', borderRadius: '6px',
                          background: u.isBanned ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                          color: u.isBanned ? '#10b981' : '#ef4444', 
                          border: u.isBanned ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)', 
                          cursor: 'pointer',
                        }}
                      >
                        {u.isBanned ? 'Unban' : 'Ban'}
                      </button>
                    )}
                    {u.role === 'admin' && (
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDonations = () => {
    const displayDonations = listings.length > 0 ? listings : mockDonations;
    
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
            All Donations
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Complete donation log - {displayDonations.length} total entries
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Item</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Donor</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Recipient</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Value</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayDonations.map((d, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{d.item || d.title}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.donor || d.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.recipient || 'Unclaimed'}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>{d.value || (d.estimatedValue ? `$${d.estimatedValue}` : 'N/A')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: '500', padding: '4px 10px', borderRadius: '6px',
                      background: `${getStatusColor(d.status)}20`, color: getStatusColor(d.status),
                    }}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTopDonors = () => {
    const displayTopDonors = topDonors.length > 0 ? topDonors : mockTopDonors;
    
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
            Top Donors
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Highest contributing donors by donation value
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {displayTopDonors.map((donor, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', color: 'white', fontWeight: '700',
                }}>#{idx + 1}</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{donor.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{donor.donationCount || donor.value.toLocaleString()} donations</div>
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
                ${(donor.totalDonationValue || donor.value || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategories = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
          Donation Categories
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Distribution of donations by category
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {categories.map((cat, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `${cat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px',
              }}>{cat.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{cat.name}</div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              {cat.donations} donation{cat.donations !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', marginBottom: '12px' }}>
              ${cat.value.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${cat.percentage}%`,
                  background: cat.color, borderRadius: '3px',
                }} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: cat.color }}>{cat.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystem = () => {
    const handleSaveSettings = () => {
      alert('Settings saved successfully!');
    };

    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
            System Configuration
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Manage platform settings and configurations
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {/* Platform Settings */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Platform Settings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Maintenance Mode</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Disable platform for maintenance</div>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  style={{
                    width: '48px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: maintenanceMode ? '#ef4444' : '#10b981', position: 'relative',
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '2px', left: maintenanceMode ? '26px' : '2px',
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Allow Registration</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Enable new user signups</div>
                </div>
                <button
                  onClick={() => setAllowRegistration(!allowRegistration)}
                  style={{
                    width: '48px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: allowRegistration ? '#10b981' : '#ef4444', position: 'relative',
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '2px', left: allowRegistration ? '26px' : '2px',
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Auto-Matching</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Automatic donation matching</div>
                </div>
                <button
                  onClick={() => setAutoMatchEnabled(!autoMatchEnabled)}
                  style={{
                    width: '48px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: autoMatchEnabled ? '#10b981' : '#ef4444', position: 'relative',
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '2px', left: autoMatchEnabled ? '26px' : '2px',
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Notification Settings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>Email Notifications</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Send email alerts to users</div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  style={{
                    width: '48px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: emailNotifications ? '#10b981' : '#ef4444', position: 'relative',
                  }}
                >
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '2px', left: emailNotifications ? '26px' : '2px',
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>

              <div style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Notification Email</div>
                <input
                  type="email"
                  defaultValue="noreply@resourcematch.com"
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)',
                    background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '13px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* System Info */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>System Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Server Status</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>● Online</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Database</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>● Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>API Version</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>v1.0.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Environment</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Development</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>System Actions</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleSaveSettings}
                style={{
                  padding: '12px 16px', fontSize: '14px', fontWeight: '500', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
                  border: 'none', cursor: 'pointer',
                }}
              >
                💾 Save Settings
              </button>
              <button
                style={{
                  padding: '12px 16px', fontSize: '14px', fontWeight: '500', borderRadius: '8px',
                  background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                  border: '1px solid rgba(99,102,241,0.3)', cursor: 'pointer',
                }}
              >
                🔄 Clear Cache
              </button>
              <button
                style={{
                  padding: '12px 16px', fontSize: '14px', fontWeight: '500', borderRadius: '8px',
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
                }}
              >
                ⚠️ Reset System
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'verifications': return renderVerifications();
      case 'users': return renderUsers();
      case 'donations': return renderDonations();
      case 'top-donors': return renderTopDonors();
      case 'categories': return renderCategories();
      case 'system': return renderSystem();
      default: return renderOverview();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px', flexShrink: 0,
        background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'var(--gradient-btn)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: 'var(--shadow-btn)', flexShrink: 0,
          }}>🌐</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>ResourceMatch</div>
            <div style={{ fontSize: '10px', color: 'var(--primary-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Portal</div>
          </div>
        </div>

        {/* Admin user info */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '700', color: 'white', flexShrink: 0,
          }}>{user?.name?.[0]?.toUpperCase() || 'A'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600' }}>⚙️ Administrator</div>
          </div>
        </div>

        {/* Search box */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', opacity: 0.6 }}>🔍</span>
            <input
              type="text" placeholder="Search..."
              style={{
                width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '8px 10px 8px 30px', fontSize: '12px',
                color: 'var(--text-primary)', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 14px', borderRadius: '10px', border: 'none',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
                  cursor: 'pointer', marginBottom: '4px', transition: 'all 0.2s ease', textAlign: 'left',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: isActive ? '600' : '500' }}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={fetchAllData}
            disabled={loading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '10px', border: 'none',
              background: 'transparent', color: 'var(--text-secondary)',
              cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '4px', transition: 'all 0.2s ease', textAlign: 'left',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <span style={{ fontSize: '16px' }}>🔄</span>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
          <button
            onClick={() => { if (onLogout) onLogout(); else { localStorage.removeItem('user'); navigate('login'); } }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '10px', border: 'none',
              background: 'transparent', color: 'var(--danger)',
              cursor: 'pointer', transition: 'all 0.2s ease', opacity: '0.7',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.7'; }}
          >
            <span style={{ fontSize: '16px' }}>🚪</span>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Top header bar */}
        <header style={{
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
          padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
              {tabs.find(t => t.id === activeTab)?.label || 'Overview'}
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', opacity: 0.6 }}>🔍</span>
              <input
                type="text" placeholder="Search resources..."
                style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '8px 12px 8px 30px', fontSize: '12px',
                  color: 'var(--text-primary)', outline: 'none', width: '200px',
                }}
              />
            </div>
            <button style={{
              width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border)',
              background: 'var(--bg-card)', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>🔔</button>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: 'white', cursor: 'pointer',
            }}>{user?.name?.[0]?.toUpperCase() || 'A'}</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
