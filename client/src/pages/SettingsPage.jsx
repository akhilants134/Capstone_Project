import { useEffect, useState } from "react";
import { 
  setup2FA, 
  enable2FA, 
  disable2FA, 
  updateMe,
  updatePassword
} from "../services/api";

export default function SettingsPage({
  navigate,
  user,
  onUserUpdate,
  themeMode,
}) {
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('settings_initial_tab');
    if (saved) {
      localStorage.removeItem('settings_initial_tab');
      return saved;
    }
    return 'profile';
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Tab 1: Profile State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    phone: user?.phone || "",
    website: user?.website || "",
    category: user?.category || "tech",
  });

  // Tab 2: Verification State
  const [verificationText, setVerificationText] = useState(user?.verificationDetails || "");

  // Tab 3: Password & PIN State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [pinForm, setPinForm] = useState({
    newPin: "",
    confirmPin: "",
  });
  const [isPinSet, setIsPinSet] = useState(() => !!localStorage.getItem("security_pin"));

  // Tab 4: Security States
  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.twoFactorEnabled || false);
  const [step2FA, setStep2FA] = useState("idle"); // idle | setup | confirm | enabled | disable-prompt
  const [qrCode, setQrCode] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [showManual, setShowManual] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const [loginAlerts, setLoginAlerts] = useState(() => localStorage.getItem("sys_loginAlerts") === "true");
  const [sessionTimeout, setSessionTimeout] = useState(() => localStorage.getItem("sys_sessionTimeout") || "never");

  // Tab 5: Privacy States
  const [profileVisibility, setProfileVisibility] = useState(() => localStorage.getItem("sys_profileVisibility") || "members");
  const [showDonationHistory, setShowDonationHistory] = useState(() => localStorage.getItem("sys_showDonationHistory") !== "false");
  const [showContactInfo, setShowContactInfo] = useState(() => localStorage.getItem("sys_showContactInfo") === "true");
  const [allowDirectMessages, setAllowDirectMessages] = useState(() => localStorage.getItem("sys_allowDirectMessages") !== "false");

  // Tab 6: Devices State
  const [trustedDevices, setTrustedDevices] = useState(() => {
    const saved = localStorage.getItem("sys_trustedDevices");
    if (saved) return JSON.parse(saved);
    return [
      { id: "device-1", name: "Windows PC", current: true, browser: "Chrome 122", location: "New York, US", lastUsed: "Jul 8, 2026, 11:01 AM" },
      { id: "device-2", name: "iPhone 15", current: false, browser: "Safari 17", location: "New York, US", lastUsed: "Mar 6, 2026, 01:45 AM" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("sys_trustedDevices", JSON.stringify(trustedDevices));
  }, [trustedDevices]);

  // Tab 7: Activity Log State
  const [activityLog, setActivityLog] = useState(() => {
    const saved = localStorage.getItem("sys_activityLog");
    if (saved) return JSON.parse(saved);
    return [
      { title: "Login successful", desc: "Browser Session · Your Location", ip: "10.0.0.22", time: "Jul 8, 2026, 11:01 AM", icon: "➡️", bg: "rgba(99,102,241,0.1)" },
      { title: "Account created", desc: "Chrome on Windows · New York, US", ip: "192.168.1.1", time: "Jan 10, 2026, 02:53 PM", icon: "✨", bg: "rgba(16,185,129,0.1)" },
      { title: "Password changed", desc: "Chrome on Windows · New York, US", ip: "192.168.1.1", time: "Jan 25, 2026, 07:35 PM", icon: "🔒", bg: "rgba(245,158,11,0.1)" },
      { title: "Login successful", desc: "Safari on iPhone · New York, US", ip: "10.0.0.55", time: "Mar 6, 2026, 01:40 PM", icon: "➡️", bg: "rgba(99,102,241,0.1)" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("sys_activityLog", JSON.stringify(activityLog));
  }, [activityLog]);

  const addActivityLog = (title, icon, bg) => {
    const systemOS = navigator.platform?.includes("Mac") ? "macOS" : navigator.platform?.includes("Win") ? "Windows" : "Linux";
    const systemBrowser = navigator.userAgent?.includes("Chrome") ? "Chrome" : navigator.userAgent?.includes("Safari") ? "Safari" : "Firefox";
    const newEvent = {
      title,
      desc: `${systemBrowser} on ${systemOS} · Your Location`,
      ip: "10.0.0.22",
      time: new Date().toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      icon,
      bg
    };
    setActivityLog(prev => [newEvent, ...prev]);
  };

  // Synchronize state when user details update
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
        website: user.website || "",
        category: user.category || "tech",
      });
      setVerificationText(user.verificationDetails || "");
      setTwoFAEnabled(user.twoFactorEnabled || false);
    }
  }, [user]);

  // Dynamic Security Score Calculation
  const getSecurityScore = () => {
    let score = 0;
    const checklist = [];

    // 1) 2FA Enabled
    if (twoFAEnabled) {
      score += 17;
      checklist.push({ key: "2fa", label: "2FA enabled", active: true });
    } else {
      checklist.push({ key: "2fa", label: "2FA enabled", active: false });
    }

    // 2) Strong Password (determined by default checked)
    score += 17;
    checklist.push({ key: "pwd", label: "Strong password", active: true });

    // 3) Security PIN Set
    if (isPinSet) {
      score += 17;
      checklist.push({ key: "pin", label: "Security PIN set", active: true });
    } else {
      checklist.push({ key: "pin", label: "Security PIN set", active: false });
    }

    // 4) Login Alerts On
    if (loginAlerts) {
      score += 17;
      checklist.push({ key: "alerts", label: "Login alerts on", active: true });
    } else {
      checklist.push({ key: "alerts", label: "Login alerts on", active: false });
    }

    // 5) Backup Email Set (determined by user having email)
    if (user?.email) {
      score += 16;
      checklist.push({ key: "backup", label: "Backup email set", active: true });
    } else {
      checklist.push({ key: "backup", label: "Backup email set", active: false });
    }

    // 6) Session Timeout Configured
    if (sessionTimeout !== "never") {
      score += 16;
      checklist.push({ key: "timeout", label: "Session timeout configured", active: true });
    } else {
      checklist.push({ key: "timeout", label: "Session timeout configured", active: false });
    }

    let status = "Needs Improvement";
    let color = "#ef4444";
    if (score >= 80) {
      status = "Excellent";
      color = "#10b981";
    } else if (score >= 50) {
      status = "Good";
      color = "#f59e0b";
    }

    return { score, status, color, checklist };
  };

  const securityScore = getSecurityScore();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updateMe(profileForm);
      if (res.status === "success") {
        setSuccessMsg("Profile updated successfully!");
        addActivityLog("Profile updated", "👤", "rgba(99,102,241,0.1)");
        if (onUserUpdate) onUserUpdate(res.data.user);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVerification = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updateMe({ verificationDetails: verificationText });
      if (res.status === "success") {
        setSuccessMsg("Verification details submitted for review.");
        addActivityLog("Verification submitted", "🛡️", "rgba(245,158,11,0.1)");
        if (onUserUpdate) onUserUpdate(res.data.user);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (res.status === "success") {
        setSuccessMsg("Password changed successfully.");
        addActivityLog("Password changed", "🔒", "rgba(245,158,11,0.1)");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPin = (e) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(pinForm.newPin)) {
      setErrorMsg("PIN must be between 4 and 6 numeric digits.");
      return;
    }
    if (pinForm.newPin !== pinForm.confirmPin) {
      setErrorMsg("PIN codes do not match.");
      return;
    }
    localStorage.setItem("security_pin", pinForm.newPin);
    setIsPinSet(true);
    setPinForm({ newPin: "", confirmPin: "" });
    setSuccessMsg("Security PIN configured successfully.");
    addActivityLog("Security PIN configured", "📌", "rgba(16,185,129,0.1)");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      profile: profileForm,
      isVerified: user?.isVerified,
      securityScore: securityScore.score,
      themeMode
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `resourcematch_data_${user?.name?.toLowerCase().replace(/\s/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 2FA TOTP Flow
  const handleSetup2FA = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await setup2FA();
      setQrCode(res.data.qrCode);
      setManualCode(res.data.manualCode);
      setStep2FA("setup");
    } catch (err) {
      setErrorMsg(err.message || "Failed to start 2FA setup.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm2FA = async () => {
    if (!confirmCode.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await enable2FA(confirmCode.trim());
      setBackupCodes(res.data.backupCodes);
      setTwoFAEnabled(true);
      setStep2FA("enabled");
      addActivityLog("2FA Enabled", "🛡️", "rgba(16,185,129,0.1)");
      
      // Update global user
      if (user) {
        const updatedUser = { ...user, twoFactorEnabled: true };
        if (onUserUpdate) onUserUpdate(updatedUser);
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disableCode.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await disable2FA(disableCode.trim());
      setTwoFAEnabled(false);
      setDisableCode("");
      setStep2FA("idle");
      addActivityLog("2FA Disabled", "🔓", "rgba(239,68,68,0.1)");

      // Update global user
      if (user) {
        const updatedUser = { ...user, twoFactorEnabled: false };
        if (onUserUpdate) onUserUpdate(updatedUser);
      }
    } catch (err) {
      setErrorMsg(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'verification', label: 'Verification', icon: '🛡️' },
    { id: 'password', label: 'Password', icon: '🔑' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'privacy', label: 'Privacy', icon: '👁' },
    { id: 'devices', label: 'Devices', icon: '💻' },
    { id: 'activity', label: 'Activity', icon: '📈' },
  ];

  return (
    <div style={{ animation: "fadeInUp 0.4s ease", minHeight: "100vh" }}>
      {/* Toast Alert Success Messages */}
      {successMsg && (
        <div style={{
          position: "fixed", top: "24px", right: "24px",
          background: "#10b981", color: "white",
          padding: "14px 24px", borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(16,185,129,0.3)", zIndex: 1000, fontWeight: "700",
          animation: "fadeInUp 0.3s ease"
        }}>
          ✅ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          position: "fixed", top: "24px", right: "24px",
          background: "#ef4444", color: "white",
          padding: "14px 24px", borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(239,68,68,0.3)", zIndex: 1000, fontWeight: "700",
          animation: "fadeInUp 0.3s ease"
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Modern User Header Box */}
      <div className="card" style={{
        padding: "24px 32px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "24px",
        background: "var(--bg-glass)",
        border: "1px solid var(--border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", fontWeight: "800", color: "white",
            boxShadow: "var(--shadow-btn)", flexShrink: 0
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", fontFamily: "Outfit,sans-serif", color: "var(--text-primary)", margin: 0 }}>
              {user?.name || "User Account"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: "rgba(99,102,241,0.08)", border: "1px solid var(--border)", color: "var(--text-accent)", textTransform: "uppercase" }}>
                {user?.role === 'admin' ? 'Admin' : 'People'}
              </span>
              <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", background: "rgba(99,102,241,0.08)", border: "1px solid var(--border)", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                {user?.role === 'donor' ? 'Donor' : user?.role === 'recipient' ? 'Recipient' : 'Community Member'}
              </span>
              <span style={{
                fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px",
                background: twoFAEnabled ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                color: twoFAEnabled ? "#10b981" : "#f59e0b",
                border: `1px solid ${twoFAEnabled ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}`
              }}>
                {twoFAEnabled ? "🔒 2FA On" : "🔓 2FA Off"}
              </span>
            </div>
          </div>
        </div>

        {/* Sync Status Info */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button 
            onClick={() => navigate("dashboard")}
            style={{
              padding: "10px 20px", fontSize: "13px", fontWeight: "700", borderRadius: "10px",
              background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)", cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(99,102,241,0.08)"}
            onMouseLeave={(e) => e.target.style.background = "var(--bg-input)"}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Sub-navigation Menu */}
      <div style={{
        display: "flex",
        gap: "6px",
        padding: "6px",
        background: "var(--bg-secondary)",
        borderRadius: "14px",
        border: "1px solid var(--border)",
        overflowX: "auto",
        marginBottom: "28px"
      }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 18px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontFamily: "Inter,sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                background: isActive ? "var(--primary-glow)" : "transparent",
                color: isActive ? "var(--primary-light)" : "var(--text-secondary)",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent"
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(99,102,241,0.04)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <span style={{ fontSize: "14px" }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div style={{ minHeight: "380px" }}>
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="card" style={{ padding: "32px", background: "var(--bg-glass)", border: "1px solid var(--border)", animation: "fadeInUp 0.3s ease" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>Profile Information</h3>
            <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "var(--text-secondary)" }}>Update details describing you or your organization.</p>
            
            <form onSubmit={handleSaveProfile} style={{ display: "grid", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    placeholder="e.g. Mumbai, India"
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    placeholder="e.g. +91 98765 43210"
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Category</label>
                  <select
                    value={profileForm.category}
                    onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  >
                    <option value="tech">Electronics / Technology</option>
                    <option value="food">Food Items</option>
                    <option value="medical">Medical Resources</option>
                    <option value="education">Education / Books</option>
                    <option value="shelter">Shelter Resources</option>
                    <option value="financial">Financial Assistance</option>
                    <option value="volunteering">Volunteering Services</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Website Link</label>
                  <input
                    type="url"
                    value={profileForm.website}
                    placeholder="https://example.com"
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Biography (Bio)</label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  placeholder="Describe your organization or personal profile..."
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "12px 24px", fontSize: "14px", fontWeight: "700", borderRadius: "10px",
                    background: "linear-gradient(135deg, var(--primary), var(--primary-light))", color: "white",
                    border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "var(--shadow-btn)"
                  }}
                >
                  {loading ? "Saving..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VERIFICATION TAB */}
        {activeTab === "verification" && (
          <div className="card" style={{ padding: "32px", background: "var(--bg-glass)", border: "1px solid var(--border)", animation: "fadeInUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#f59e0b" }}>
                ⚠️
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>Account Verification</h3>
            </div>
            
            <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Verify your organization to unlock all features and build trust within the community.
            </p>

            {user?.isVerified ? (
              <div style={{
                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: "14px", padding: "20px", color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: "6px"
              }}>
                <div style={{ fontWeight: "700", color: "#10b981", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>✓ Verified Organization</span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Your organization credentials have been successfully reviewed and verified by an administrator.
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                    Verification Document Link or Description
                  </label>
                  <textarea
                    rows={4}
                    value={verificationText}
                    onChange={(e) => setVerificationText(e.target.value)}
                    placeholder="Provide a link to your organization's registration document or website, or describe your organization in detail..."
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", resize: "none", fontFamily: "inherit" }}
                  />
                  <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
                    This information will be reviewed by an administrator.
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleSaveVerification}
                    disabled={loading || !verificationText.trim()}
                    style={{
                      padding: "12px 24px", fontSize: "14px", fontWeight: "700", borderRadius: "10px",
                      background: "linear-gradient(135deg, var(--primary), var(--primary-light))", color: "white",
                      border: "none", cursor: (loading || !verificationText.trim()) ? "not-allowed" : "pointer", boxShadow: "var(--shadow-btn)"
                    }}
                  >
                    {loading ? "Submitting..." : "Submit for Verification"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PASSWORD TAB */}
        {activeTab === "password" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeInUp 0.3s ease" }}>
            {/* Password edit */}
            <div className="card" style={{ padding: "32px", background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "var(--primary-light)" }}>
                  🔑
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>Change Password</h3>
              </div>
              <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                Use a strong, unique password to protect your account. Last changed: 2026-01-05
              </p>

              <form onSubmit={handleUpdatePassword} style={{ display: "grid", gap: "16px", maxWidth: "500px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="At least 8 characters"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "12px 20px", fontSize: "14px", fontWeight: "700", borderRadius: "10px", marginTop: "10px",
                    background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)", cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}
                >
                  🔒 Update Password
                </button>
              </form>
            </div>

            {/* PIN edit */}
            <div className="card" style={{ padding: "32px", background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#10b981" }}>
                  📌
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>Security PIN</h3>
              </div>
              <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                A 4–6 digit PIN used to confirm sensitive actions like large transactions or account changes.
              </p>

              <form onSubmit={handleSetPin} style={{ display: "grid", gap: "16px", maxWidth: "500px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>New Security PIN</label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="4-6 digits"
                    value={pinForm.newPin}
                    onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value.replace(/\D/g, "") })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", letterSpacing: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Confirm PIN</label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    placeholder="Re-enter PIN"
                    value={pinForm.confirmPin}
                    onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value.replace(/\D/g, "") })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", letterSpacing: "4px" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "12px 20px", fontSize: "14px", fontWeight: "700", borderRadius: "10px", marginTop: "10px",
                    background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}
                >
                  🛡️ Set PIN
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", animation: "fadeInUp 0.3s ease" }}>
            {/* Toggles settings column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* 2FA Panel */}
              <div className="card" style={{ padding: "28px", background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>Two-Factor Authentication (2FA)</h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      Add an extra layer of security. When enabled, you'll need a code in addition to your password.
                    </p>
                  </div>
                  <button
                    onClick={twoFAEnabled ? () => setStep2FA("disable-prompt") : handleSetup2FA}
                    style={{
                      width: "46px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: twoFAEnabled ? "#10b981" : "rgba(99,102,241,0.2)", position: "relative",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px", left: twoFAEnabled ? "25px" : "3px",
                      transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                    }} />
                  </button>
                </div>

                {/* TOTP active state setup UI */}
                {step2FA === "setup" && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", display: "grid", gap: "16px" }}>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      <strong>Step 1:</strong> Scan this QR code with Google Authenticator or any TOTP app:
                    </p>
                    {qrCode && (
                      <div style={{ padding: "12px", background: "white", borderRadius: "12px", display: "inline-block", alignSelf: "start" }}>
                        <img src={qrCode} alt="QR Code" style={{ width: "140px", height: "140px", display: "block" }} />
                      </div>
                    )}
                    <button
                      onClick={() => setShowManual(!showManual)}
                      style={{ background: "none", border: "none", color: "var(--text-accent)", fontSize: "12px", fontWeight: "700", cursor: "pointer", textAlign: "left", padding: 0 }}
                    >
                      {showManual ? "▲ Hide Manual Secret" : "▼ Enter Code Manually"}
                    </button>
                    {showManual && (
                      <div style={{ padding: "12px", background: "var(--bg-input)", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "12px", fontFamily: "monospace", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{manualCode}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(manualCode); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }}
                          style={{ background: "none", border: "none", color: "var(--text-accent)", cursor: "pointer", fontWeight: "700" }}
                        >
                          {copiedCode ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    )}

                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "10px" }}>
                      <strong>Step 2:</strong> Enter the verification code:
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        placeholder="6-digit code"
                        value={confirmCode}
                        onChange={e => setConfirmCode(e.target.value.replace(/\D/g, ""))}
                        style={{ padding: "10px 14px", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", letterSpacing: "2px", maxWidth: "160px" }}
                      />
                      <button onClick={handleConfirm2FA} disabled={loading || confirmCode.length !== 6} style={{ padding: "10px 18px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "white", fontWeight: "700", cursor: "pointer" }}>
                        Verify
                      </button>
                      <button onClick={() => setStep2FA("idle")} style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {step2FA === "enabled" && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", display: "grid", gap: "14px" }}>
                    <div style={{ color: "#10b981", fontWeight: "700", fontSize: "14px" }}>✓ 2FA Configured Successfully!</div>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                      Keep these backup codes somewhere safe to recover access if you lose your device:
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {backupCodes.map((c, idx) => (
                        <div key={idx} style={{ padding: "6px", background: "var(--bg-input)", border: "1px solid var(--border)", borderRadius: "6px", textAlign: "center", fontSize: "12px", fontFamily: "monospace", color: "var(--text-primary)" }}>{c}</div>
                      ))}
                    </div>
                    <button onClick={() => setStep2FA("idle")} style={{ padding: "10px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "white", fontWeight: "700", cursor: "pointer", marginTop: "6px" }}>
                      Done
                    </button>
                  </div>
                )}

                {step2FA === "disable-prompt" && (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", display: "grid", gap: "10px" }}>
                    <p style={{ fontSize: "13px", color: "#ef4444", margin: 0, fontWeight: "600" }}>
                      Enter your current 6-digit TOTP code to turn off 2FA:
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        placeholder="6-digit code"
                        value={disableCode}
                        onChange={e => setDisableCode(e.target.value.replace(/\D/g, ""))}
                        style={{ padding: "10px 14px", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", letterSpacing: "2px", maxWidth: "160px" }}
                      />
                      <button onClick={handleDisable2FA} disabled={loading || disableCode.length !== 6} style={{ padding: "10px 18px", borderRadius: "8px", border: "none", background: "#ef4444", color: "white", fontWeight: "700", cursor: "pointer" }}>
                        Disable
                      </button>
                      <button onClick={() => setStep2FA("idle")} style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Login Alerts Panel */}
              <div className="card" style={{ padding: "28px", background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>Login Alerts</h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      Email Alerts on New Login
                    </p>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Sent to {user?.email || "registered email"}</span>
                  </div>
                  <button
                    onClick={() => {
                      const next = !loginAlerts;
                      setLoginAlerts(next);
                      localStorage.setItem("sys_loginAlerts", String(next));
                      addActivityLog(`Login alerts toggled ${next ? 'on' : 'off'}`, "🔔", "rgba(99,102,241,0.1)");
                      setSuccessMsg("Security configuration saved.");
                      setTimeout(() => setSuccessMsg(""), 2000);
                    }}
                    style={{
                      width: "46px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: loginAlerts ? "#10b981" : "rgba(99,102,241,0.2)", position: "relative",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px", left: loginAlerts ? "25px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>
              </div>

              {/* Session Timeout Panel */}
              <div className="card" style={{ padding: "28px", background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "6px" }}>Session Timeout</h3>
                <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  Automatically log out after a period of inactivity to protect your account.
                </p>
                
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => {
                      setSessionTimeout(e.target.value);
                      localStorage.setItem("sys_sessionTimeout", e.target.value);
                      addActivityLog(`Session timeout changed to: ${e.target.value}`, "⏳", "rgba(99,102,241,0.1)");
                      setSuccessMsg("Inactivity timeout saved.");
                      setTimeout(() => setSuccessMsg(""), 2000);
                    }}
                    style={{ padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", width: "240px" }}
                  >
                    <option value="never">Never (not recommended)</option>
                    <option value="15m">15 minutes</option>
                    <option value="30m">30 minutes</option>
                    <option value="1h">1 hour</option>
                    <option value="4h">4 hours</option>
                  </select>
                  {sessionTimeout === "never" && (
                    <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "600" }}>⚠️ Not recommended for security</span>
                  )}
                </div>
              </div>
            </div>

            {/* Security checklist column */}
            <div className="card" style={{ padding: "28px", background: "var(--bg-glass)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>Security Score</h3>
                <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--text-secondary)" }}>How well your account is protected against unauthorized access.</p>
                
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "38px", fontWeight: "800", color: securityScore.color, fontFamily: "Outfit,sans-serif" }}>{securityScore.score}%</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: securityScore.color }}>{securityScore.status}</span>
                </div>

                <div style={{ height: "8px", background: "var(--bg-input)", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
                  <div style={{ height: "100%", width: `${securityScore.score}%`, background: securityScore.color, borderRadius: "4px", transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
                  {securityScore.checklist.filter(c => c.active).length} of {securityScore.checklist.length} security measures active
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                {securityScore.checklist.map((item) => (
                  <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px" }}>{item.active ? "✓" : "✗"}</span>
                      <span style={{ color: item.active ? "var(--text-primary)" : "var(--text-secondary)", textDecoration: item.active ? "none" : "none" }}>{item.label}</span>
                    </div>
                    {!item.active && (
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--primary-light)", cursor: "pointer" }} onClick={() => {
                        if (item.key === "2fa") setActiveTab("security");
                        if (item.key === "pin") setActiveTab("password");
                        if (item.key === "alerts") setLoginAlerts(true);
                        if (item.key === "timeout") setSessionTimeout("1h");
                      }}>Configure</span>
                    )}
                    {item.active && (
                      <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700" }}>Active</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY TAB */}
        {activeTab === "privacy" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeInUp 0.3s ease" }}>
            {/* Visibility Settings */}
            <div className="card" style={{ padding: "32px", background: "var(--bg-glass)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>Profile Visibility</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>Control who can see your profile information on the platform.</p>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Who can view your profile?</label>
                <select
                  value={profileVisibility}
                  onChange={(e) => {
                    setProfileVisibility(e.target.value);
                    localStorage.setItem("sys_profileVisibility", e.target.value);
                    addActivityLog(`Profile visibility set to: ${e.target.value}`, "👁", "rgba(99,102,241,0.1)");
                    setSuccessMsg("Privacy visibility saved.");
                    setTimeout(() => setSuccessMsg(""), 2000);
                  }}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", outline: "none", maxWidth: "400px" }}
                >
                  <option value="members">Members – Logged-in users only</option>
                  <option value="public">Public – Anyone on the web</option>
                  <option value="private">Private – Only me</option>
                </select>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Switch: Donation History */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>Show Donation History</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Others can see your donation/request history</div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !showDonationHistory;
                      setShowDonationHistory(next);
                      localStorage.setItem("sys_showDonationHistory", String(next));
                      addActivityLog(`Donation history toggled ${next ? 'on' : 'off'}`, "👁", "rgba(99,102,241,0.1)");
                    }}
                    style={{
                      width: "46px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: showDonationHistory ? "#10b981" : "rgba(99,102,241,0.2)", position: "relative",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px", left: showDonationHistory ? "25px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>

                {/* Switch: Contact Info */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>Show Contact Information</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Display phone & email on your public profile</div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !showContactInfo;
                      setShowContactInfo(next);
                      localStorage.setItem("sys_showContactInfo", String(next));
                      addActivityLog(`Contact visibility toggled ${next ? 'on' : 'off'}`, "📞", "rgba(99,102,241,0.1)");
                    }}
                    style={{
                      width: "46px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: showContactInfo ? "#10b981" : "rgba(99,102,241,0.2)", position: "relative",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px", left: showContactInfo ? "25px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>

                {/* Switch: Direct Messages */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>Allow Direct Messages</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>Other users can send you messages</div>
                  </div>
                  <button
                    onClick={() => {
                      const next = !allowDirectMessages;
                      setAllowDirectMessages(next);
                      localStorage.setItem("sys_allowDirectMessages", String(next));
                      addActivityLog(`Direct messages toggled ${next ? 'on' : 'off'}`, "💬", "rgba(99,102,241,0.1)");
                    }}
                    style={{
                      width: "46px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                      background: allowDirectMessages ? "#10b981" : "rgba(99,102,241,0.2)", position: "relative",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{
                      width: "18px", height: "18px", borderRadius: "50%", background: "white",
                      position: "absolute", top: "3px", left: allowDirectMessages ? "25px" : "3px",
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Account Data export */}
            <div className="card" style={{ padding: "32px", background: "var(--bg-glass)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#ef4444" }}>
                  ⚠️
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>Data & Account</h3>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                All your data is stored locally on this device. Clearing browser data will reset your account. Use the export option to keep a backup.
              </p>
              <div>
                <button
                  onClick={handleExportData}
                  style={{
                    padding: "10px 18px", fontSize: "13px", fontWeight: "700", borderRadius: "8px",
                    background: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(99,102,241,0.08)"}
                  onMouseLeave={(e) => e.target.style.background = "var(--bg-input)"}
                >
                  📋 Export My Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DEVICES TAB */}
        {activeTab === "devices" && (
          <div className="card" style={{ padding: "32px", background: "var(--bg-glass)", border: "1px solid var(--border)", animation: "fadeInUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "var(--primary-light)" }}>
                💻
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>Trusted Devices</h3>
            </div>
            <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Devices that have previously accessed your account. Remove any you don't recognise.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {trustedDevices.map((dev) => (
                <div
                  key={dev.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px", background: dev.current ? "rgba(99,102,241,0.04)" : "var(--bg-card)",
                    border: `1px solid ${dev.current ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
                    borderRadius: "12px", transition: "all 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ fontSize: "24px", color: "var(--text-secondary)" }}>
                      {dev.name.includes("PC") ? "💻" : "📱"}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)" }}>{dev.name}</span>
                        {dev.current && (
                          <span style={{ fontSize: "10px", fontWeight: "700", background: "rgba(99,102,241,0.15)", color: "var(--primary-light)", padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase" }}>Current</span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {dev.browser}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        📶 {dev.location} · Last used {dev.lastUsed}
                      </div>
                    </div>
                  </div>
                  {!dev.current && (
                    <button
                      onClick={() => {
                        setTrustedDevices(prev => prev.filter(d => d.id !== dev.id));
                        setSuccessMsg("Device access revoked.");
                        setTimeout(() => setSuccessMsg(""), 2000);
                      }}
                      style={{
                        padding: "6px 14px", fontSize: "12px", fontWeight: "700", borderRadius: "8px",
                        background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(239,68,68,0.2)"}
                      onMouseLeave={(e) => e.target.style.background = "rgba(239,68,68,0.1)"}
                    >
                      🗑 Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", animation: "fadeInUp 0.3s ease" }}>
            {/* Activity log */}
            <div className="card" style={{ padding: "32px", background: "var(--bg-glass)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "var(--primary-light)" }}>
                  📈
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>Account Activity Log</h3>
              </div>
              <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                Recent security-related events on your account.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {activityLog.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex", alignItems: "center", gap: "16px",
                      padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border)",
                      borderRadius: "12px"
                    }}
                  >
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: item.bg, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "16px"
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>{item.title}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                          {item.desc}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: "600" }}>IP: {item.ip}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{item.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div style={{
              background: "rgba(16,185,129,0.04)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "20px",
              padding: "24px 28px",
              boxShadow: "var(--shadow-sm)"
            }}>
              <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#10b981", display: "flex", alignItems: "center", gap: "8px", margin: "0 0 12px 0" }}>
                🛡️ Security Tips to Stay Safe
              </h4>
              <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px", lineHeight: "1.5" }}>
                <li>🔒 Never share your password, PIN, or 2FA codes with anyone.</li>
                <li>✉️ We will never ask for your password via email or phone.</li>
                <li>⚠️ If you notice suspicious activity, change your password immediately.</li>
                <li>🌐 Always check the URL before entering credentials.</li>
                <li>📱 Use a password manager to generate and store strong, unique passwords.</li>
                <li>🛡️ Enable 2FA to protect against phishing and credential theft.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
