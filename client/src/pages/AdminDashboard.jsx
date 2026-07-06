import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Gift,
  TrendingUp,
  Users as UsersIcon,
  DollarSign,
  BarChart3,
  ShieldCheck,
  UserCog,
  Package,
  Trophy,
  Grid3X3,
  Settings,
  Moon,
  Bell,
  ChevronDown,
  LogOut,
  ArrowUpRight,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
} from 'lucide-react';
import './AdminDashboard.css';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'verifications', label: 'Verifications', icon: ShieldCheck },
  { id: 'users', label: 'Users', icon: UsersIcon },
  { id: 'donations', label: 'Donations', icon: Package },
  { id: 'top-donors', label: 'Top Donors', icon: Trophy },
  { id: 'categories', label: 'Categories', icon: Grid3X3 },
  { id: 'system', label: 'System', icon: Settings },
];

const categoryEmojis = {
  Electronics: '\uD83D\uDCBB',
  Food: '\uD83C\uDFE0',
  Furniture: '\uD83E\uDE91',
  Clothing: '\uD83E\uDDE5',
  Education: '\uD83C\uDF93',
};

const statusConfig = {
  completed: { label: 'Completed', icon: CheckCircle2, className: 'status-completed' },
  listed: { label: 'Listed', icon: Package, className: 'status-listed' },
  in_transit: { label: 'In Transit', icon: Truck, className: 'status-transit' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'status-cancelled' },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, donationsRes, topDonorsRes, categoriesRes, usersRes, systemRes] =
        await Promise.all([
          api.get('/stats'),
          api.get('/donations'),
          api.get('/donations/top-donors'),
          api.get('/categories'),
          api.get('/users'),
          api.get('/system/status'),
        ]);
      setStats(statsRes.data);
      setDonations(donationsRes.data);
      setTopDonors(topDonorsRes.data);
      setCategories(categoriesRes.data);
      setUsers(usersRes.data);
      setSystemStatus(systemRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('This will delete ALL data. Are you sure?')) return;
    setResetting(true);
    try {
      await api.post('/system/reset');
      await api.post('/seed');
      await loadData();
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setResetting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AU';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statCards = stats
    ? [
        {
          label: 'Total Donations',
          value: stats.totalDonations,
          sub: 'All time donations',
          change: '+5%',
          icon: Gift,
          color: '#8b5cf6',
          borderColor: '#8b5cf6',
        },
        {
          label: 'Active Requests',
          value: stats.activeRequests,
          sub: 'Open requests',
          change: '+12%',
          icon: TrendingUp,
          color: '#22c55e',
          borderColor: '#22c55e',
        },
        {
          label: 'Total Matched',
          value: stats.totalMatched,
          sub: 'Successful matches',
          change: '+8%',
          icon: UsersIcon,
          color: '#f97316',
          borderColor: '#f97316',
        },
        {
          label: 'Value Prevented',
          value: `$${(stats.totalValue || 0).toLocaleString()}`,
          sub: 'Estimated waste prevented',
          change: '+15%',
          icon: DollarSign,
          color: '#ef4444',
          borderColor: '#ef4444',
        },
      ]
    : [];

  const renderOverview = () => (
    <div className="overview-content">
      <div className="overview-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {donations.slice(0, 5).map((d, i) => (
            <div key={i} className="activity-item">
              <div className="activity-icon">
                <Package size={16} />
              </div>
              <div className="activity-text">
                <strong>{d.donorName}</strong> donated <strong>{d.itemName}</strong>
                <span className="activity-meta">
                  {' '}
                  &middot; {d.category} &middot; ${d.value.toLocaleString()}
                </span>
              </div>
              <span className={`status-badge ${statusConfig[d.status]?.className || ''}`}>
                {statusConfig[d.status]?.label || d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVerifications = () => {
    const pending = users.filter((u) => !u.verified && u.role !== 'admin');
    return (
      <div className="tab-content-section">
        <div className="section-header">
          <h3>
            <ShieldCheck size={20} /> Pending Verifications
          </h3>
          <span className="badge">{pending.length} pending</span>
        </div>
        {pending.length === 0 ? (
          <p className="empty-text">No pending verifications</p>
        ) : (
          <div className="verification-list">
            {pending.map((u) => (
              <div key={u._id} className="verification-item">
                <div className="user-avatar" style={{ background: '#f97316' }}>
                  {getInitials(u.fullName)}
                </div>
                <div className="verification-info">
                  <strong>{u.fullName || u.username}</strong>
                  <span>{u.role} &middot; {u.organization || 'No org'}</span>
                </div>
                <span className="status-badge status-pending">
                  <Clock size={14} /> Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderUsers = () => (
    <div className="tab-content-section">
      <div className="section-header">
        <h3>
          <UsersIcon size={20} /> All Users
        </h3>
        <span className="badge">{users.length} total</span>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Organization</th>
              <th>Status</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="user-cell">
                    <div
                      className="user-avatar-sm"
                      style={{
                        background:
                          u.role === 'admin'
                            ? '#8b5cf6'
                            : u.role === 'donor'
                            ? '#22c55e'
                            : '#f97316',
                      }}
                    >
                      {getInitials(u.fullName || u.username)}
                    </div>
                    <div>
                      <strong>{u.fullName || u.username}</strong>
                      <span className="user-email">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-tag role-${u.role}`}>{u.role}</span>
                </td>
                <td>{u.organization || '-'}</td>
                <td>
                  <span className={`status-dot ${u.status === 'active' ? 'dot-active' : 'dot-pending'}`}>
                    {u.status}
                  </span>
                </td>
                <td>{u.verified ? <CheckCircle2 size={16} className="text-green" /> : <Clock size={16} className="text-orange" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDonations = () => (
    <div className="tab-content-section">
      <div className="section-header">
        <h3>
          <Gift size={20} /> All Donations
        </h3>
        <span className="badge-outline">{donations.length} total</span>
      </div>
      <p className="section-subtitle">Complete donation log</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Donor</th>
              <th>Recipient</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d._id}>
                <td>
                  <div>
                    <strong>{d.itemName}</strong>
                    <span className="item-meta">
                      {d.quantity} &middot; {d.category}
                    </span>
                  </div>
                </td>
                <td>{d.donorName}</td>
                <td className={d.recipientName ? '' : 'text-muted'}>
                  {d.recipientName || 'Unclaimed'}
                </td>
                <td className="text-value">${d.value.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${statusConfig[d.status]?.className || ''}`}>
                    {statusConfig[d.status]?.label || d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTopDonors = () => {
    const rankColors = ['#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];
    return (
      <div className="tab-content-section">
        <div className="section-header">
          <h3>
            <Trophy size={20} /> Top Donors
          </h3>
        </div>
        <p className="section-subtitle">Organizations contributing the most value</p>
        <div className="donor-list">
          {topDonors.map((d, i) => (
            <div key={d._id} className="donor-item">
              <div className="donor-rank" style={{ background: rankColors[i] || '#6b7280' }}>
                {i < 3 ? <Trophy size={16} /> : i + 1}
              </div>
              <div className="donor-info">
                <strong>{d._id}</strong>
                <span>
                  {d.categories.join(', ')} &middot; {d.donationCount} donation
                  {d.donationCount > 1 ? 's' : ''}
                </span>
              </div>
              <div className="donor-value">
                <strong>${d.totalValue.toLocaleString()}</strong>
                <span>total value</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategories = () => (
    <div className="tab-content-section">
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.name} className="category-card">
            <div className="category-header">
              <span className="category-emoji">
                {categoryEmojis[cat.name] || '\uD83D\uDCE6'}
              </span>
              <span className="category-pct">{cat.percentage}%</span>
            </div>
            <h4>{cat.name}</h4>
            <p className="category-count">
              {cat.donationCount} donation{cat.donationCount > 1 ? 's' : ''}
            </p>
            <p className="category-value">${cat.totalValue.toLocaleString()}</p>
            <div className="category-bar">
              <div
                className="category-bar-fill"
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="system-grid">
      <div className="tab-content-section">
        <h3>
          <Settings size={18} className="icon-spin" /> Platform Status
        </h3>
        {systemStatus && (
          <div className="status-list">
            {[
              { label: 'Database', value: systemStatus.database },
              { label: 'Matching Engine', value: systemStatus.matchingEngine },
              { label: 'Notifications', value: systemStatus.notifications },
              { label: 'Storage (localStorage)', value: systemStatus.storage },
            ].map((item) => (
              <div key={item.label} className="status-row">
                <span>{item.label}</span>
                <span className="status-value operational">
                  <span className="status-dot-green" />
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tab-content-section danger-zone">
        <h3>
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        <p className="danger-subtitle">Irreversible actions &mdash; proceed with extreme caution</p>
        <div className="danger-box">
          <p>
            Resetting the system will delete all donations, requests, and user changes. The platform
            will reload with default seed data.
          </p>
          <button className="danger-btn" onClick={handleReset} disabled={resetting}>
            <RotateCcw size={16} />
            {resetting ? 'Resetting...' : 'Reset All System Data'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'verifications':
        return renderVerifications();
      case 'users':
        return renderUsers();
      case 'donations':
        return renderDonations();
      case 'top-donors':
        return renderTopDonors();
      case 'categories':
        return renderCategories();
      case 'system':
        return renderSystem();
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <div className="header-logo">
            <Settings size={20} />
          </div>
          <div>
            <h1>Admin Dashboard</h1>
            <span className="header-subtitle">Admin Portal</span>
          </div>
        </div>
        <div className="header-right">
          <span className="header-badge">Admin</span>
          <button className="icon-btn">
            <Moon size={18} />
          </button>
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <div className="user-menu-wrapper">
            <button
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="header-avatar">{getInitials(user?.fullName)}</div>
              <span>{user?.fullName || 'Admin'}</span>
              <ChevronDown size={14} />
            </button>
            {showUserMenu && (
              <div className="user-dropdown">
                <button onClick={logout}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="welcome-bar">
        <span>
          &#9889; Welcome back, {user?.fullName || 'Admin'} &mdash; Platform management &amp;
          analytics
        </span>
      </div>

      <main className="admin-main">
        <div className="stats-grid">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="stat-card" style={{ borderTopColor: card.borderColor }}>
                <div className="stat-card-header">
                  <span className="stat-label">{card.label}</span>
                  <div className="stat-icon" style={{ background: card.color }}>
                    <Icon size={18} color="#fff" />
                  </div>
                </div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-footer">
                  <span className="stat-change">
                    <ArrowUpRight size={14} /> {card.change}
                  </span>
                  <span className="stat-sub">{card.sub}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tab-bar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="tab-content">{renderTab()}</div>
      </main>
    </div>
  );
}
