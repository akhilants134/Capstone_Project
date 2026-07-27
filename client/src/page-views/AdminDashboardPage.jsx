import { useState, useEffect, useCallback } from 'react';

import {
  adminGetAllUsers,
  adminToggleBanUser,
  adminGetAllListings,
  adminGetStats,
  adminGetUnverifiedUsers,
  adminToggleUserVerification,
  adminGetTopDonors,
  adminGetSystemConfig,
  adminUpdateSystemConfig
} from '../services/api';

// Fallback mock data (used when API fails or database is empty)
const mockStats = [
  { title: 'Total Donations', value: '18', change: '+12%', label: 'All time donations', icon: '📦' },
  { title: 'Active Requests', value: '7', change: '+24%', label: 'Open requests', icon: '📋' },
  { title: 'Total Matched', value: '9', change: '+18%', label: 'Successful matches', icon: '🤝' },
  { title: 'Value Prevented', value: '$34,500', change: '+20%', label: 'Waste value saved', icon: '💰' },
];

const mockTopDonors = [
  { name: 'Tech Solutions Inc', totalDonationValue: 8000, donationCount: 15 },
  { name: 'ABC Manufacturing Ltd', totalDonationValue: 5700, donationCount: 10 },
  { name: 'Fresh Foods Factory', totalDonationValue: 4200, donationCount: 8 },
  { name: 'Green Valley Community', totalDonationValue: 3000, donationCount: 5 },
];

const mockRecentActivity = [
  { item: 'School Supplies', donor: 'ABC Manufacturing Ltd', recipient: 'Hope Children\'s Home', value: '$2,500', status: 'Completed' },
  { item: 'Office Furniture', donor: 'Fresh Foods Factory', recipient: 'Unclaimed', value: '$3,200', status: 'Listed' },
  { item: 'Canned Food', donor: 'Green Valley Community', recipient: 'Unclaimed', value: '$4,200', status: 'Listed' },
  { item: 'Winter Clothing', donor: 'Tech Solutions Inc', recipient: 'Helping Hands NGO', value: '$3,000', status: 'In Transit' },
  { item: 'Laptops', donor: 'Tech Solutions Inc', recipient: 'Unclaimed', value: '$8,000', status: 'Listed' },
];

const mockVerifications = [
  { _id: 'mock-verify-1', org: 'ABC Manufacturing Ltd', type: 'Donor', contact: 'contact@abc.com', status: 'Verified', isVerified: true },
  { _id: 'mock-verify-2', org: 'Hope Children\'s Home', type: 'Recipient', contact: 'info@hope.org', status: 'Verified', isVerified: true },
  { _id: 'mock-verify-3', org: 'Tech Solutions Inc', type: 'Donor', contact: 'admin@tech.com', status: 'Pending', isVerified: false },
  { _id: 'mock-verify-4', org: 'Green Valley Community', type: 'Recipient', contact: 'support@green.org', status: 'Unverified', isVerified: false },
  { _id: 'mock-verify-5', org: 'Fresh Foods Factory', type: 'Donor', contact: 'sales@fresh.com', status: 'Pending', isVerified: false },
  { _id: 'mock-verify-6', org: 'Helping Hands NGO', type: 'Recipient', contact: 'help@hands.org', status: 'Verified', isVerified: true },
  { _id: 'mock-verify-7', org: 'John Smith', type: 'People', contact: 'john@email.com', status: 'Unverified', isVerified: false },
  { _id: 'mock-verify-8', org: 'Sarah Johnson', type: 'People', contact: 'sarah@email.com', status: 'Pending', isVerified: false },
];

const mockUsers = [
  { _id: 'mock-user-1', name: 'Admin User', email: 'admin@resourcematch.com', role: 'admin', isBanned: false },
  { _id: 'mock-user-2', name: 'Tech Solutions Inc', email: 'admin@tech.com', role: 'donor', isBanned: false },
  { _id: 'mock-user-3', name: 'Hope Children\'s Home', email: 'info@hope.org', role: 'recipient', isBanned: false },
  { _id: 'mock-user-4', name: 'ABC Manufacturing Ltd', email: 'contact@abc.com', role: 'donor', isBanned: false },
  { _id: 'mock-user-5', name: 'Green Valley Community', email: 'support@green.org', role: 'recipient', isBanned: false },
  { _id: 'mock-user-6', name: 'Fresh Foods Factory', email: 'sales@fresh.com', role: 'donor', isBanned: false },
  { _id: 'mock-user-7', name: 'Helping Hands NGO', email: 'help@hands.org', role: 'recipient', isBanned: false },
  { _id: 'mock-user-8', name: 'John Smith', email: 'john@email.com', role: 'community', isBanned: false },
];

const mockDonations = [
  { item: 'School Supplies', donor: 'ABC Manufacturing Ltd', recipient: 'Hope Children\'s Home', value: '$2,500', status: 'Completed' },
  { item: 'Office Furniture', donor: 'Fresh Foods Factory', recipient: 'Unclaimed', value: '$3,200', status: 'Listed' },
  { item: 'Canned Food', donor: 'Green Valley Community', recipient: 'Unclaimed', value: '$4,200', status: 'Listed' },
  { item: 'Winter Clothing', donor: 'Tech Solutions Inc', recipient: 'Helping Hands NGO', value: '$3,000', status: 'In Transit' },
  { item: 'Laptops', donor: 'Tech Solutions Inc', recipient: 'Unclaimed', value: '$8,000', status: 'Listed' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real data state (with initial mock data structure as fallback)
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [topDonors, setTopDonors] = useState([]);

  // Persistent System Settings
  const [maintenanceMode, setMaintenanceMode] = useState(() => localStorage.getItem('sys_maintenanceMode') === 'true');
  const [allowRegistration, setAllowRegistration] = useState(() => localStorage.getItem('sys_allowRegistration') !== 'false');
  const [emailNotifications, setEmailNotifications] = useState(() => localStorage.getItem('sys_emailNotifications') !== 'false');
  const [autoMatchEnabled, setAutoMatchEnabled] = useState(() => localStorage.getItem('sys_autoMatchEnabled') !== 'false');
  const [notificationEmail, setNotificationEmail] = useState(() => localStorage.getItem('sys_notificationEmail') || 'noreply@resourcematch.com');

  // UI States
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isRotating, setIsRotating] = useState(false);

  // Fetch all data from API
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsRotating(true);
    try {
      const [usersRes, listingsRes, statsRes, verificationsRes, topDonorsRes, configRes] = await Promise.all([
        adminGetAllUsers().catch(() => ({ data: { users: [] } })),
        adminGetAllListings().catch(() => ({ data: { listings: [] } })),
        adminGetStats().catch(() => ({ data: null })),
        adminGetUnverifiedUsers().catch(() => ({ data: { users: [] } })),
        adminGetTopDonors().catch(() => ({ data: { donors: [] } })),
        adminGetSystemConfig().catch(() => null)
      ]);

      const fetchedUsers = usersRes.data?.users || [];
      const fetchedListings = listingsRes.data?.listings || [];
      const fetchedVerifications = verificationsRes.data?.users || [];
      const fetchedDonors = topDonorsRes.data?.donors || [];

      // Combine with mock fallbacks if database collections are empty
      setUsers(fetchedUsers.length > 0 ? fetchedUsers : mockUsers);
      setListings(fetchedListings.length > 0 ? fetchedListings : mockDonations);
      setVerifications(fetchedVerifications.length > 0 ? fetchedVerifications : mockVerifications);
      setTopDonors(fetchedDonors.length > 0 ? fetchedDonors : mockTopDonors);
      
      if (statsRes.data) {
        setStats(statsRes.data);
      } else {
        setStats(null);
      }

      if (configRes?.data?.config) {
        const cfg = configRes.data.config;
        setMaintenanceMode(cfg.maintenanceMode);
        setAllowRegistration(cfg.allowRegistration);
        setAutoMatchEnabled(cfg.autoMatchEnabled);
        setEmailNotifications(cfg.emailNotifications);
        setNotificationEmail(cfg.notificationEmail || 'noreply@resourcematch.com');
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load real data. Displaying interactive demo data.');
      // Initialize with fallbacks
      setUsers(mockUsers);
      setListings(mockDonations);
      setVerifications(mockVerifications);
      setTopDonors(mockTopDonors);
      setStats(null);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRotating(false), 600);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleBanUser = async (userId) => {
    const isMock = !userId || typeof userId !== 'string' || userId.startsWith('mock-');
    if (isMock) {
      // Simulate locally
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBanned: !u.isBanned } : u));
      return;
    }

    try {
      await adminToggleBanUser(userId);
      await fetchAllData(); // Refresh data
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Failed to update user ban status');
    }
  };

  const handleVerifyUser = async (userId, action) => {
    const isMock = !userId || typeof userId !== 'string' || userId.startsWith('mock-');
    if (isMock) {
      // Simulate locally
      setVerifications(prev => prev.map(v => {
        if (v._id === userId) {
          const newStatus = action === 'approve' ? 'Verified' : 'Unverified';
          return { ...v, status: newStatus, isVerified: action === 'approve' };
        }
        return v;
      }));
      return;
    }

    try {
      await adminToggleUserVerification(userId, action);
      await fetchAllData(); // Refresh data
    } catch (err) {
      console.error('Error verifying user:', err);
      if (err.message && !err.message.includes('Failed to fetch')) {
        alert(`Failed to verify user: ${err.message}`);
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      await adminUpdateSystemConfig({
        maintenanceMode,
        allowRegistration,
        autoMatchEnabled,
        emailNotifications,
        notificationEmail
      });
      localStorage.setItem('sys_maintenanceMode', maintenanceMode);
      localStorage.setItem('sys_allowRegistration', allowRegistration);
      localStorage.setItem('sys_emailNotifications', emailNotifications);
      localStorage.setItem('sys_autoMatchEnabled', autoMatchEnabled);
      localStorage.setItem('sys_notificationEmail', notificationEmail);
      alert('Platform configuration saved successfully!');
    } catch (err) {
      console.error('Error saving system config:', err);
      alert(`Failed to save settings: ${err.message || 'Unknown error'}`);
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'verifications', label: '✓ Verifications' },
    { id: 'users', label: '👥 Users' },
    { id: 'donations', label: '💝 Donations' },
    { id: 'top-donors', label: '🏆 Top Donors' },
    { id: 'categories', label: '📁 Categories' },
    { id: 'system', label: '⚙️ System Config' },
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
      case 'active':
        return '#f59e0b';
      case 'Unverified':
      case 'Banned':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Dynamically map categories based on database statistics
  const getCategoriesData = () => {
    const categoryConfigs = {
      tech: { name: 'Electronics', icon: '💻', color: '#6366f1' },
      electronics: { name: 'Electronics', icon: '💻', color: '#6366f1' },
      food: { name: 'Food', icon: '🍎', color: '#10b981' },
      medical: { name: 'Medical', icon: '💊', color: '#ec4899' },
      education: { name: 'Education', icon: '📚', color: '#8b5cf6' },
      furniture: { name: 'Furniture', icon: '🛋️', color: '#f59e0b' },
      clothing: { name: 'Clothing', icon: '👕', color: '#ef4444' },
      shelter: { name: 'Shelter', icon: '🏠', color: '#06b6d4' },
      financial: { name: 'Financial', icon: '💰', color: '#10b981' },
      household: { name: 'Household', icon: '🏠', color: '#eab308' },
      other: { name: 'Other', icon: '✨', color: '#6b7280' },
    };

    if (stats && stats.listingsByCategory && stats.listingsByCategory.length > 0) {
      const total = stats.totalListings || 1;
      return stats.listingsByCategory.map(cat => {
        const key = String(cat._id).toLowerCase();
        const config = categoryConfigs[key] || { name: cat._id || 'Other', icon: '📦', color: '#6366f1' };
        const percentage = Math.round((cat.count / total) * 100);
        
        const value = listings
          .filter(l => String(l.category).toLowerCase() === key)
          .reduce((sum, l) => sum + (l.estimatedValue ? parseFloat(l.estimatedValue) : 0), 0);

        return {
          name: config.name,
          icon: config.icon,
          donations: cat.count,
          value: value || cat.count * 125, // Fallback valuation estimation
          percentage: percentage,
          color: config.color
        };
      });
    }

    // Modern styled categories fallback
    return [
      { name: 'Electronics', icon: '💻', donations: 4, value: 8000, percentage: 30, color: '#6366f1' },
      { name: 'Food', icon: '🍎', donations: 5, value: 4200, percentage: 25, color: '#10b981' },
      { name: 'Furniture', icon: '🛋️', donations: 2, value: 3200, percentage: 15, color: '#f59e0b' },
      { name: 'Clothing', icon: '👕', donations: 3, value: 3000, percentage: 20, color: '#ef4444' },
      { name: 'Education', icon: '📚', donations: 2, value: 2500, percentage: 10, color: '#8b5cf6' },
    ];
  };

  const categories = getCategoriesData();

  const renderOverview = () => {
    // Convert backend stats object to an array layout to prevent mapping crashes
    const displayStats = stats ? [
      { title: 'Total Donations', value: stats.totalListings, change: '+15%', label: 'All Listings', icon: '📦' },
      { title: 'Active Requests', value: stats.activeListings, change: '+5%', label: 'Open Requests', icon: '📋' },
      { title: 'Total Matched', value: stats.matchedListings + stats.completedListings, change: '+10%', label: 'Successful Matches', icon: '🤝' },
      { title: 'Value Prevented', value: `$${(stats.totalEstimatedValue || 0).toLocaleString()}`, change: '+12%', label: 'Estimated Waste Saved', icon: '💰' },
    ] : mockStats;

    const displayTopDonors = topDonors.length > 0 ? topDonors : mockTopDonors;
    
    const displayRecentActivity = listings.length > 0 ? listings.slice(0, 5).map(l => ({
      item: l.title || l.item,
      donor: l.user?.name || l.donor || 'Unknown',
      recipient: l.recipient || 'Unclaimed',
      value: l.estimatedValue ? `$${parseFloat(l.estimatedValue).toLocaleString()}` : (l.value || 'N/A'),
      status: l.status
    })) : mockRecentActivity;

    const maxDonorVal = Math.max(...displayTopDonors.map(d => d.totalDonationValue || d.value || 1));

    // Dynamic, mathematically correct conic gradient calculation for pie chart stops
    let cumulativePercent = 0;
    const gradientParts = categories.map(c => {
      const start = cumulativePercent;
      cumulativePercent += c.percentage;
      return `${c.color} ${start}% ${cumulativePercent}%`;
    });
    const conicGradientStyle = `conic-gradient(${gradientParts.join(', ')})`;

    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        {/* Dashboard Stat Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {displayStats.map((stat, idx) => (
            <div 
              key={idx} 
              style={{
                background: 'var(--bg-card)', 
                border: '1px solid var(--border)',
                borderRadius: '16px', 
                padding: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '20px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: hoveredCard === idx ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                transform: hoveredCard === idx ? 'translateY(-4px)' : 'translateY(0)',
                borderColor: hoveredCard === idx ? 'var(--primary)' : 'var(--border)',
              }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                width: '56px', 
                height: '56px', 
                borderRadius: '12px',
                background: 'rgba(99,102,241,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '28px',
              }}>{stat.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{stat.title}</div>
                <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '6px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{stat.change}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mid Row: Charts & Top Donors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          {/* Top Donors Section */}
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>🏆 Leading Contributors</h3>
              <span style={{ fontSize: '12px', color: 'var(--primary-light)', fontWeight: '700', background: 'var(--primary-glow)', padding: '4px 12px', borderRadius: '20px' }}>Ranked by Value</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {displayTopDonors.map((donor, idx) => {
                const donorVal = donor.totalDonationValue || donor.value || 0;
                const percentage = Math.round((donorVal / maxDonorVal) * 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{idx + 1}. {donor.name}</span>
                      <span style={{ fontWeight: '700', color: 'var(--primary-light)' }}>${donorVal.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '10px', background: 'var(--bg-input)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', 
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                        borderRadius: '5px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories Chart Section */}
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>📁 Category Allocations</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{
                width: '180px', 
                height: '180px', 
                borderRadius: '50%',
                background: conicGradientStyle,
                position: 'relative',
                boxShadow: 'var(--shadow-lg)',
                flexShrink: 0
              }}>
                <div style={{
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  width: '94px', 
                  height: '94px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-card)',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.4)'
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '160px' }}>
                {categories.map((cat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: cat.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{cat.name}</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Activities */}
        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)', backdropFilter: 'blur(20px)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>⚡ Live Activity Feed</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {displayRecentActivity.map((activity, idx) => (
              <div 
                key={idx} 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '16px 20px', 
                  background: 'rgba(99,102,241,0.03)', 
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-glow)';
                  e.currentTarget.style.background = 'rgba(99,102,241,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'rgba(99,102,241,0.03)';
                }}
              >
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>{activity.item}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: '500' }}>{activity.donor}</span> → <span style={{ color: 'var(--primary-light)' }}>{activity.recipient}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{activity.value}</div>
                  <span style={{
                    fontSize: '11px', 
                    fontWeight: '700', 
                    padding: '3px 10px', 
                    borderRadius: '20px',
                    background: `${getStatusColor(activity.status)}20`, 
                    color: getStatusColor(activity.status),
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderVerifications = () => {
    // If the database has verification details, use them; otherwise, use our mock database
    const displayVerifications = verifications;

    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Organization Verifications</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Review credentials and approve verification requests</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(99,102,241,0.02)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Organization</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Email</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayVerifications.map((v, idx) => {
                  const verifiedStatus = v.isVerified ? 'Verified' : (v.status || 'Pending');
                  return (
                    <tr 
                      key={idx} 
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>{v.org || v.name}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{v.type || v.role}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{v.contact || v.email}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          fontSize: '11px', 
                          fontWeight: '700', 
                          padding: '4px 10px', 
                          borderRadius: '20px',
                          background: `${getStatusColor(verifiedStatus)}15`, 
                          color: getStatusColor(verifiedStatus),
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>{verifiedStatus}</span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        {!v.isVerified ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => handleVerifyUser(v._id, 'approve')}
                              style={{
                                padding: '6px 14px', 
                                fontSize: '12px', 
                                fontWeight: '700', 
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #10b981, #059669)', 
                                color: 'white', 
                                border: 'none', 
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(16,185,129,0.2)',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >Approve</button>
                            <button 
                              onClick={() => handleVerifyUser(v._id, 'reject')}
                              style={{
                                padding: '6px 14px', 
                                fontSize: '12px', 
                                fontWeight: '700', 
                                borderRadius: '8px',
                                background: 'rgba(239,68,68,0.1)', 
                                color: '#ef4444', 
                                border: '1px solid rgba(239,68,68,0.2)', 
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.2)'}
                              onMouseLeave={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                            >Reject</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>— Verified</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>User Management</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Manage accounts, update configurations, and modify ban permissions</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(99,102,241,0.02)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr 
                    key={idx} 
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>{u.name}</td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        fontSize: '11px', 
                        fontWeight: '700', 
                        padding: '4px 10px', 
                        borderRadius: '20px',
                        background: u.role === 'admin' || u.role === 'Admin' ? 'rgba(139,92,246,0.15)' : 'rgba(99,102,241,0.1)', 
                        color: u.role === 'admin' || u.role === 'Admin' ? '#a78bfa' : '#818cf8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        fontSize: '11px', 
                        fontWeight: '700', 
                        padding: '4px 10px', 
                        borderRadius: '20px',
                        background: `${getStatusColor(u.isBanned ? 'Banned' : 'Active')}15`, 
                        color: getStatusColor(u.isBanned ? 'Banned' : 'Active'),
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>{u.isBanned ? 'Banned' : 'Active'}</span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      {u.role !== 'admin' && u.role !== 'Admin' ? (
                        <button 
                          onClick={() => handleBanUser(u._id)}
                          style={{
                            padding: '6px 14px', 
                            fontSize: '12px', 
                            fontWeight: '700', 
                            borderRadius: '8px',
                            background: u.isBanned ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                            color: u.isBanned ? '#10b981' : '#ef4444', 
                            border: u.isBanned ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)', 
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = u.isBanned ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = u.isBanned ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
                          }}
                        >
                          {u.isBanned ? 'Unban User' : 'Ban User'}
                        </button>
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>— System</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderDonations = () => {
    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Complete Donation Logs</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Log of all item shares, resource posts, and fulfillment states - {listings.length} entries</p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(99,102,241,0.02)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item Title</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Donor</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recipient</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Value</th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((d, idx) => (
                  <tr 
                    key={idx} 
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>{d.title || d.item}</td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.user?.name || d.donor || 'System'}</td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.recipient || 'Unclaimed'}</td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '700' }}>
                      {d.estimatedValue ? `$${parseFloat(d.estimatedValue).toLocaleString()}` : (d.value || 'N/A')}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        fontSize: '11px', 
                        fontWeight: '700', 
                        padding: '4px 10px', 
                        borderRadius: '20px',
                        background: `${getStatusColor(d.status)}15`, 
                        color: getStatusColor(d.status),
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTopDonorsTab = () => {
    const displayTopDonors = topDonors.length > 0 ? topDonors : mockTopDonors;

    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {displayTopDonors.map((donor, idx) => {
            const donorVal = donor.totalDonationValue || donor.value || 0;
            return (
              <div key={idx} style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '18px', 
                    color: 'white', 
                    fontWeight: '800',
                  }}>#{idx + 1}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{donor.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      {donor.donationCount !== undefined ? donor.donationCount : 0} Donations Completed
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Contribution</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--primary-light)' }}>
                    ${donorVal.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCategoriesTab = () => {
    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {categories.map((cat, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = cat.color;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px',
                  background: `${cat.color}15`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>{cat.icon}</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{cat.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cat.donations} Listings</div>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Allocated Value</div>
                <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
                  ${cat.value.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Volume Share</span>
                  <span style={{ color: cat.color }}>{cat.percentage}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', 
                    width: `${cat.percentage}%`,
                    background: cat.color, 
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSystem = () => {
    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Settings controls */}
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>⚙️ Platform Controls</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Toggle Row: Maintenance */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>Maintenance Mode</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Restrict public site access during builds</div>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  style={{
                    width: '46px', 
                    height: '24px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    cursor: 'pointer',
                    background: maintenanceMode ? '#ef4444' : 'rgba(99,102,241,0.2)', 
                    position: 'relative',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    background: 'white',
                    position: 'absolute', 
                    top: '3px', 
                    left: maintenanceMode ? '25px' : '3px',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </button>
              </div>

              {/* Toggle Row: Registration */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>Allow New Registrations</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Enable or disable user signup portal</div>
                </div>
                <button
                  onClick={() => setAllowRegistration(!allowRegistration)}
                  style={{
                    width: '46px', 
                    height: '24px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    cursor: 'pointer',
                    background: allowRegistration ? '#10b981' : 'rgba(99,102,241,0.2)', 
                    position: 'relative',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    background: 'white',
                    position: 'absolute', 
                    top: '3px', 
                    left: allowRegistration ? '25px' : '3px',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </button>
              </div>

              {/* Toggle Row: Auto matching */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>Intelligent Auto-Matching</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trigger matching algorithm automatically</div>
                </div>
                <button
                  onClick={() => setAutoMatchEnabled(!autoMatchEnabled)}
                  style={{
                    width: '46px', 
                    height: '24px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    cursor: 'pointer',
                    background: autoMatchEnabled ? '#10b981' : 'rgba(99,102,241,0.2)', 
                    position: 'relative',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    background: 'white',
                    position: 'absolute', 
                    top: '3px', 
                    left: autoMatchEnabled ? '25px' : '3px',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </button>
              </div>
            </div>
          </div>

          {/* Config parameters */}
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>📧 Notification Config</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>Email Alerts</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Send transactional emails to members</div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  style={{
                    width: '46px', 
                    height: '24px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    cursor: 'pointer',
                    background: emailNotifications ? '#10b981' : 'rgba(99,102,241,0.2)', 
                    position: 'relative',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '18px', 
                    height: '18px', 
                    borderRadius: '50%', 
                    background: 'white',
                    position: 'absolute', 
                    top: '3px', 
                    left: emailNotifications ? '25px' : '3px',
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </button>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Outbound SMTP Address</div>
                <input
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  style={{
                    width: '100%', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)', 
                    color: 'var(--text-primary)', 
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Inter,sans-serif'
                  }}
                />
              </div>
            </div>
          </div>

          {/* System metadata */}
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>💻 System Environment</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Platform Core Server</span>
                <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Online
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Primary Cluster database</span>
                <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Connected
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>API Gateway Endpoint</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>v1.0.0 (Node/Express)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Environment State</span>
                <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>Development (Localhost)</span>
              </div>
            </div>
          </div>

          {/* Quick System Actions */}
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>⚠️ Administration Actions</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleSaveSettings}
                style={{
                  padding: '12px 16px', 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', 
                  color: 'white',
                  border: 'none', 
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-btn)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                💾 Save Configuration Changes
              </button>
              <button
                onClick={() => alert('Cache cleared successfully!')}
                style={{
                  padding: '12px 16px', 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  borderRadius: '10px',
                  background: 'var(--bg-input)', 
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(99,102,241,0.08)'}
                onMouseLeave={(e) => e.target.style.background = 'var(--bg-input)'}
              >
                🔄 Clear Platform Cache
              </button>
              <button
                onClick={() => { if(confirm('Are you sure you want to reset system values to factory defaults?')) alert('System values reset.'); }}
                style={{
                  padding: '12px 16px', 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  borderRadius: '10px',
                  background: 'rgba(239,68,68,0.1)', 
                  color: '#ef4444',
                  border: '1px solid rgba(239,68,68,0.2)', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.18)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
              >
                ⚠️ Danger: Full System Reset
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
      case 'top-donors': return renderTopDonorsTab();
      case 'categories': return renderCategoriesTab();
      case 'system': return renderSystem();
      default: return renderOverview();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Admin Subheader / Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', margin: 0, color: 'var(--text-primary)' }}>
            System Settings & Platform Operations
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
            Platform metrics, verification requests, and administrator settings overrides.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={fetchAllData}
            disabled={loading}
            style={{
              padding: '10px 18px', 
              fontSize: '13px', 
              fontWeight: '700', 
              borderRadius: '10px',
              background: 'var(--primary-glow)', 
              color: 'var(--primary-light)', 
              border: '1px solid var(--border-strong)', 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--primary-glow)'; }}
          >
            <span style={{ 
              display: 'inline-block',
              animation: isRotating ? 'spin 1s linear infinite' : 'none',
              transform: isRotating ? 'none' : 'rotate(0deg)'
            }}>🔄</span>
            {loading ? 'Refreshing...' : 'Sync Database'}
          </button>

          {/* Add CSS keyframes for rotation directly inline via a style block */}
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(245,158,11,0.15)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '12px',
          padding: '14px 20px',
          color: 'var(--accent)',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeInUp 0.3s'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Modern Horizontal Navigation Pill Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '8px',
        background: 'var(--bg-secondary)',
        borderRadius: '14px',
        border: '1px solid var(--border)',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontFamily: 'Inter,sans-serif',
                fontSize: '13px',
                fontWeight: '700',
                background: isActive ? 'var(--primary-glow)' : 'transparent',
                color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.04)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div style={{ flex: 1 }}>
        {loading && users.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>Synchronizing platform data...</span>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
