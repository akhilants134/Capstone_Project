import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Building2,
  Heart,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronRight,
  Shield,
} from 'lucide-react';
import './LoginPage.css';

const roles = [
  {
    id: 'community',
    label: 'Community',
    icon: Home,
    color: '#f97316',
    bgColor: '#fff7ed',
    description: 'Community Hub',
    subtitle: 'Connect with local resources and community support.',
    features: ['Browse available resources', 'Connect with donors', 'Community support'],
  },
  {
    id: 'donor',
    label: 'Donor',
    icon: Building2,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    description: 'Donor Portal',
    subtitle: 'Manage donations and track your impact.',
    features: ['List donations', 'Track impact', 'View matching status'],
  },
  {
    id: 'recipient',
    label: 'Recipient',
    icon: Heart,
    color: '#ef4444',
    bgColor: '#fef2f2',
    description: 'Recipient Portal',
    subtitle: 'Request resources and manage received items.',
    features: ['Submit requests', 'Track deliveries', 'Manage received items'],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: Settings,
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    description: 'Admin Platform',
    subtitle: 'Full platform control, analytics, and user management.',
    features: ['Manage all users', 'View platform analytics', 'System configuration'],
  },
];

const demoAccounts = {
  admin: { username: 'admin', password: 'admin123', label: 'Admin User' },
};

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const activeRole = roles.find((r) => r.id === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(username, password);
      if (userData.role === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const demo = demoAccounts[role];
    if (demo) {
      setUsername(demo.username);
      setPassword(demo.password);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="role-selector">
            <h3 className="role-selector-title">1. CHOOSE YOUR ROLE</h3>
            <div className="role-cards">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setError('');
                    }}
                  >
                    {selectedRole === role.id && (
                      <div className="role-check">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                    <div
                      className="role-icon"
                      style={{
                        background:
                          selectedRole === role.id
                            ? 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                            : role.bgColor,
                        color: selectedRole === role.id ? '#fff' : role.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="role-label">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="role-info">
            <div className="role-info-header">
              <div className="role-info-icon" style={{ background: activeRole.bgColor }}>
                <Shield size={24} style={{ color: activeRole.color }} />
              </div>
              <div>
                <h2 className="role-info-title">{activeRole.description}</h2>
                <p className="role-info-subtitle">{activeRole.subtitle}</p>
              </div>
            </div>
            <div className="role-features">
              <h4>WHAT YOU CAN DO:</h4>
              {activeRole.features.map((f, i) => (
                <div key={i} className="feature-item">
                  <CheckCircle2 size={16} className="feature-check" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {demoAccounts[selectedRole] && (
              <div className="demo-section">
                <h4>DEMO ACCOUNTS &mdash; CLICK TO FILL:</h4>
                <button className="demo-btn" onClick={() => fillDemo(selectedRole)}>
                  <div>
                    <strong>{demoAccounts[selectedRole].label}</strong>
                    <span className="demo-creds">
                      user: {demoAccounts[selectedRole].username} &middot; pass:{' '}
                      {demoAccounts[selectedRole].password}
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <div className="login-form-header">
              <Shield size={28} />
              <div>
                <h2>Sign In</h2>
                <p>as {activeRole.label}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="login-error">{error}</div>}

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Signing in...' : `Sign In as ${activeRole.label}`}
                {!loading && <ChevronRight size={18} />}
              </button>

              <p className="login-switch-text">
                Select a different role above to switch portals
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
