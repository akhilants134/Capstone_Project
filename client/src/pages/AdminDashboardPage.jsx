import { useState } from 'react';

export default function AdminDashboardPage({ navigate, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'verifications', label: 'Verifications' },
    { id: 'users', label: 'Users' },
    { id: 'donations', label: 'Donations' },
    { id: 'top-donors', label: 'Top Donors' },
    { id: 'categories', label: 'Categories' },
    { id: 'system', label: 'System' },
  ];

  // Mock data
  const stats = [
    { title: 'Total Donations', value: '5', change: '+5%', label: 'All time donations', icon: '📦' },
    { title: 'Active Requests', value: '3', change: '+12%', label: 'Open requests', icon: '📋' },
    { title: 'Total Matched', value: '2', change: '+8%', label: 'Successful matches', icon: '🤝' },
    { title: 'Value Prevented', value: '$20,900', change: '+15%', label: 'Estimated waste prevented', icon: '💰' },
  ];

  const donationPipeline = [
    { status: 'Listed / Available', count: 3 },
    { status: 'Matched', count: 0 },
    { status: 'In Transit', count: 1 },
    { status: 'Completed', count: 1 },
  ];

  const topDonors = [
    { name: 'Tech Solutions Inc', value: 8000 },
    { name: 'ABC Manufacturing Ltd', value: 5700 },
    { name: 'Fresh Foods Factory', value: 4200 },
    { name: 'Green Valley Community', value: 3000 },
  ];

  const recentActivity = [
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

  const verifications = [
    { org: 'ABC Manufacturing Ltd', type: 'Donor', contact: 'contact@abc.com', status: 'Verified' },
    { org: 'Hope Children\'s Home', type: 'Recipient', contact: 'info@hope.org', status: 'Verified' },
    { org: 'Tech Solutions Inc', type: 'Donor', contact: 'admin@tech.com', status: 'Pending' },
    { org: 'Green Valley Community', type: 'Recipient', contact: 'support@green.org', status: 'Unverified' },
    { org: 'Fresh Foods Factory', type: 'Donor', contact: 'sales@fresh.com', status: 'Pending' },
    { org: 'Helping Hands NGO', type: 'Recipient', contact: 'help@hands.org', status: 'Verified' },
    { org: 'John Smith', type: 'People', contact: 'john@email.com', status: 'Unverified' },
    { org: 'Sarah Johnson', type: 'People', contact: 'sarah@email.com', status: 'Pending' },
  ];

  const users = [
    { name: 'Admin User', email: 'admin@resourcematch.com', role: 'Admin', status: 'Active' },
    { name: 'Tech Solutions Inc', email: 'admin@tech.com', role: 'Donor', status: 'Active' },
    { name: 'Hope Children\'s Home', email: 'info@hope.org', role: 'Recipient', status: 'Active' },
    { name: 'ABC Manufacturing Ltd', email: 'contact@abc.com', role: 'Donor', status: 'Active' },
    { name: 'Green Valley Community', email: 'support@green.org', role: 'Recipient', status: 'Active' },
    { name: 'Fresh Foods Factory', email: 'sales@fresh.com', role: 'Donor', status: 'Active' },
    { name: 'Helping Hands NGO', email: 'help@hands.org', role: 'Recipient', status: 'Active' },
    { name: 'John Smith', email: 'john@email.com', role: 'Community', status: 'Active' },
  ];

  const donations = [
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
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderOverview = () => (
    <div style={{ padding: '24px' }}>
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
        {stats.map((stat, idx) => (
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
        {/* Donation Pipeline */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Donation Pipeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {donationPipeline.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.status}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.count}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(item.count / 5) * 100}%`,
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    borderRadius: '4px',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Donors */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Top Donors by Value</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topDonors.map((donor, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{donor.name}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>${donor.value.toLocaleString()}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${(donor.value / 8000) * 100}%`,
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
            {recentActivity.map((activity, idx) => (
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

  const renderVerifications = () => (
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
            {verifications.map((v, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{v.org}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{v.type}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{v.contact}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: '12px', fontWeight: '500', padding: '4px 10px', borderRadius: '6px',
                    background: `${getStatusColor(v.status)}20`, color: getStatusColor(v.status),
                  }}>{v.status}</span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  {v.status === 'Pending' && (
                    <>
                      <button style={{
                        padding: '6px 12px', fontSize: '12px', fontWeight: '500', borderRadius: '6px',
                        background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', marginRight: '8px',
                      }}>Approve</button>
                      <button style={{
                        padding: '6px 12px', fontSize: '12px', fontWeight: '500', borderRadius: '6px',
                        background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer',
                      }}>Reject</button>
                    </>
                  )}
                  {v.status !== 'Pending' && (
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

  const renderUsers = () => (
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
            {users.map((u, idx) => (
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
                    background: `${getStatusColor(u.status)}20`, color: getStatusColor(u.status),
                  }}>{u.status}</span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  {u.role !== 'Admin' && (
                    <button style={{
                      padding: '6px 12px', fontSize: '12px', fontWeight: '500', borderRadius: '6px',
                      background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
                    }}>Ban</button>
                  )}
                  {u.role === 'Admin' && (
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

  const renderDonations = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
          All Donations
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Complete donation log - {donations.length} total entries
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
            {donations.map((d, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>{d.item}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.donor}</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.recipient}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>{d.value}</td>
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

  const renderTopDonors = () => (
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
        {topDonors.map((donor, idx) => (
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
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{donor.value.toLocaleString()} donations</div>
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
              ${donor.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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

  const renderSystem = () => (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
          System Configuration
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Manage platform settings and configurations
        </p>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          System configuration options will be available here.
        </div>
      </div>
    </div>
  );

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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>⚙️</div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>Admin Dashboard</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>Admin Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px',
            background: 'rgba(99,102,241,0.1)', color: '#6366f1',
          }}>Admin</span>
          <button onClick={() => { if (onLogout) onLogout(); else { localStorage.removeItem('user'); navigate('login'); } }} style={{
            padding: '8px 16px', fontSize: '13px', fontWeight: '500', borderRadius: '8px',
            background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
          }}>Logout</button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontSize: '13px', fontWeight: '500',
                background: activeTab === tab.id ? 'var(--gradient-btn)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
