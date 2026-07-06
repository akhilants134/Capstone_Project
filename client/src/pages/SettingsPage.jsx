/* ===== Settings Page ===== */
import { useEffect, useState } from "react";
import { setup2FA, enable2FA, disable2FA, regenerateBackupCodes } from "../services/api";

const preferenceItems = [
  {
    key: "emailNotifications",
    label: "Email alerts",
    hint: "Match updates, reminders, and important account notices",
  },
  {
    key: "pushNotifications",
    label: "Push notifications",
    hint: "Instant in-app alerts for messages and new matches",
  },
  {
    key: "publicProfile",
    label: "Public profile",
    hint: "Allow other community members to discover your profile",
  },
];

const SETTINGS_STORAGE_KEY = "resourceMatchSettings";

const getInitialSettings = () => {
  const fallback = {
    emailNotifications: true,
    pushNotifications: true,
    publicProfile: false,
    twoFactorEnabled: false,
  };
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) return fallback;
    return { ...fallback, ...JSON.parse(stored) };
  } catch {
    return fallback;
  }
};

// ── 2FA setup steps ──────────────────────────────────────────────────────────
// idle → setup → confirm → enabled
// idle → disable-prompt → idle
const TwoFASection = () => {
  const [step, setStep] = useState("idle"); // idle | setup | confirm | enabled | disable-prompt | backup-view
  const [qrCode, setQrCode] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [regenCode, setRegenCode] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await setup2FA();
      setQrCode(res.data.qrCode);
      setManualCode(res.data.manualCode);
      setStep("setup");
    } catch (err) {
      setError(err.message || "Failed to start setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async () => {
    if (!confirmCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await enable2FA(confirmCode.trim());
      setBackupCodes(res.data.backupCodes);
      setTwoFAEnabled(true);
      setStep("enabled");
    } catch (err) {
      setError(err.message || "Invalid code. Please check your authenticator app.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!disableCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      await disable2FA(disableCode.trim());
      setTwoFAEnabled(false);
      setDisableCode("");
      setStep("idle");
    } catch (err) {
      setError(err.message || "Invalid code. 2FA was not disabled.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (!regenCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await regenerateBackupCodes(regenCode.trim());
      setBackupCodes(res.data.backupCodes);
      setRegenCode("");
    } catch (err) {
      setError(err.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  const copyManualCode = () => {
    navigator.clipboard.writeText(manualCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const infoCard = (icon, text, color = "var(--text-secondary)") => (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "10px 14px", borderRadius: "10px",
      background: "rgba(99,102,241,0.06)", border: "1px solid var(--border)",
      fontSize: "13px", color,
    }}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );

  return (
    <div className="card" style={{ padding: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: twoFAEnabled ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
        }}>
          {twoFAEnabled ? "🛡️" : "🔐"}
        </div>
        <div>
          <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
            Two-Factor Authentication
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
            {twoFAEnabled ? (
              <span style={{ color: "#10b981", fontWeight: "600" }}>✅ Enabled — Your account is protected</span>
            ) : (
              "Add an extra layer of security beyond your password"
            )}
          </p>
        </div>
      </div>

      <div style={{ height: "1px", background: "var(--border)", margin: "20px 0" }} />

      {/* ── IDLE: not yet set up ─────────────────────────────────── */}
      {step === "idle" && !twoFAEnabled && (
        <div style={{ display: "grid", gap: "12px" }}>
          {infoCard("📱", "Works with Google Authenticator, Authy, Microsoft Authenticator, and any TOTP app")}
          {infoCard("🔑", "Each login will ask for a 6-digit code that changes every 30 seconds")}
          {infoCard("💾", "You'll receive 8 backup codes for emergency access")}
          <button
            className="btn btn-primary"
            onClick={handleSetup}
            disabled={loading}
            style={{ marginTop: "8px", width: "fit-content" }}
          >
            {loading ? "⏳ Starting setup..." : "🔐 Enable 2FA"}
          </button>
          {error && <div style={{ color: "#f87171", fontSize: "13px" }}>⚠️ {error}</div>}
        </div>
      )}

      {/* ── SETUP: show QR code ──────────────────────────────────── */}
      {step === "setup" && (
        <div style={{ display: "grid", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "24px", alignItems: "start" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                <strong>Step 1:</strong> Scan this QR code with your authenticator app
              </p>
              {qrCode && (
                <div style={{
                  padding: "12px", background: "white", borderRadius: "16px",
                  display: "inline-block", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}>
                  <img src={qrCode} alt="2FA QR Code" style={{ width: "160px", height: "160px", display: "block" }} />
                </div>
              )}
            </div>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                <strong>Step 2:</strong> Enter the 6-digit code shown in your app to confirm setup
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 123 456"
                value={confirmCode}
                onChange={e => { setConfirmCode(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleEnable()}
                maxLength={7}
                style={{ letterSpacing: "3px", fontSize: "18px", fontWeight: "700", textAlign: "center", marginBottom: "12px" }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn btn-primary" onClick={handleEnable} disabled={loading || !confirmCode.trim()}>
                  {loading ? "⏳ Verifying..." : "✅ Confirm & Enable"}
                </button>
                <button className="btn btn-secondary" onClick={() => { setStep("idle"); setError(""); }}>
                  Cancel
                </button>
              </div>
              {error && <div style={{ color: "#f87171", fontSize: "13px", marginTop: "10px" }}>⚠️ {error}</div>}
            </div>
          </div>

          {/* Manual code fallback */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
            <button
              type="button"
              onClick={() => setShowManual(m => !m)}
              style={{ background: "none", border: "none", color: "var(--text-accent)", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: 0 }}
            >
              {showManual ? "▲ Hide" : "▼ Can't scan QR? Enter code manually"}
            </button>
            {showManual && (
              <div style={{ marginTop: "12px" }}>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Add a new account in your authenticator app and enter this code manually:
                </p>
                <div style={{
                  fontFamily: "monospace", fontSize: "14px", letterSpacing: "2px",
                  background: "var(--bg-input)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "12px 16px",
                  color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span>{manualCode}</span>
                  <button
                    onClick={copyManualCode}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "var(--text-accent)", fontWeight: "600" }}
                  >
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ENABLED: success + backup codes ─────────────────────── */}
      {step === "enabled" && (
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={{
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "14px", padding: "16px",
          }}>
            <div style={{ fontWeight: "700", color: "#34d399", marginBottom: "4px" }}>🎉 2FA Enabled Successfully!</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Your account is now protected. Save these backup codes in a secure location — they can be used if you lose access to your authenticator app.
            </div>
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "10px" }}>
              🔑 Backup Codes <span style={{ color: "#f87171" }}>(shown once only)</span>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
              {backupCodes.map((code, i) => (
                <div key={i} style={{
                  fontFamily: "monospace", fontSize: "14px", fontWeight: "700",
                  padding: "8px 12px", borderRadius: "8px",
                  background: "var(--bg-input)", border: "1px solid var(--border)",
                  color: "var(--text-primary)", textAlign: "center", letterSpacing: "2px",
                }}>
                  {code}
                </div>
              ))}
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => navigator.clipboard.writeText(backupCodes.join("\n"))}
              style={{ fontSize: "13px", marginBottom: "16px" }}
            >
              📋 Copy All Backup Codes
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => setStep("active")}>
            Done — I've saved my backup codes
          </button>
        </div>
      )}

      {/* ── ACTIVE: 2FA is on, management options ───────────────── */}
      {(step === "active" || (step === "idle" && twoFAEnabled)) && (
        <div style={{ display: "grid", gap: "16px" }}>
          {infoCard("🛡️", "Your account is secured with authenticator-based 2FA", "#34d399")}

          {/* Regenerate backup codes */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "10px" }}>
              Regenerate Backup Codes
            </p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Current 6-digit code"
                value={regenCode}
                onChange={e => { setRegenCode(e.target.value); setError(""); }}
                style={{ letterSpacing: "2px", maxWidth: "200px" }}
              />
              <button
                className="btn btn-secondary"
                onClick={handleRegenerateBackupCodes}
                disabled={loading || !regenCode.trim()}
              >
                {loading ? "⏳..." : "🔄 Regenerate"}
              </button>
            </div>
            {backupCodes.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {backupCodes.map((code, i) => (
                    <div key={i} style={{
                      fontFamily: "monospace", fontSize: "13px", fontWeight: "700",
                      padding: "6px 10px", borderRadius: "8px",
                      background: "var(--bg-input)", border: "1px solid var(--border)",
                      color: "var(--text-primary)", textAlign: "center", letterSpacing: "2px",
                    }}>
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Disable 2FA */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
            {step !== "disable-prompt" ? (
              <button
                className="btn btn-secondary"
                onClick={() => setStep("disable-prompt")}
                style={{ color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}
              >
                🔓 Disable 2FA
              </button>
            ) : (
              <div style={{ display: "grid", gap: "10px" }}>
                <p style={{ fontSize: "13px", color: "#f87171", margin: 0, fontWeight: "600" }}>
                  ⚠️ Enter your current 6-digit authenticator code to confirm:
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="6-digit code"
                    value={disableCode}
                    onChange={e => { setDisableCode(e.target.value); setError(""); }}
                    style={{ letterSpacing: "2px", maxWidth: "200px" }}
                    autoFocus
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleDisable}
                    disabled={loading || !disableCode.trim()}
                    style={{ background: "#ef4444" }}
                  >
                    {loading ? "⏳..." : "Disable 2FA"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setStep("active"); setDisableCode(""); setError(""); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          {error && <div style={{ color: "#f87171", fontSize: "13px" }}>⚠️ {error}</div>}
        </div>
      )}
    </div>
  );
};

export default function SettingsPage({
  navigate,
  user,
  themeMode,
  onThemeChange,
}) {
  const [settings, setSettings] = useState(getInitialSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyTheme = (mode) => {
    onThemeChange(mode);
  };

  const handleSave = () => {
    setSaved(true);
    window.clearTimeout(handleSave.dismissTimer);
    handleSave.dismissTimer = window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const themeCards = [
    { id: "dark", title: "Dark", description: "High contrast workspace with reduced glare.", icon: "🌙" },
    { id: "light", title: "Light", description: "Clean, bright interface for daytime use.", icon: "☀️" },
  ];

  return (
    <div style={{ animation: "fadeInUp 0.4s ease", maxWidth: "1100px" }}>
      {saved && (
        <div style={{
          position: "fixed", top: "24px", right: "24px",
          background: "var(--secondary)", color: "white",
          padding: "12px 18px", borderRadius: "14px",
          boxShadow: "var(--shadow-lg)", zIndex: 1000, fontWeight: "700",
        }}>
          Settings saved successfully.
        </div>
      )}

      <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ maxWidth: "620px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 12px", borderRadius: "9999px",
              background: "rgba(99,102,241,0.12)", color: "var(--primary-light)",
              fontSize: "12px", fontWeight: "700", letterSpacing: "0.5px",
              textTransform: "uppercase", marginBottom: "16px",
            }}>
              Account Preferences
            </div>
            <h1 style={{ fontSize: "34px", fontWeight: "800", fontFamily: "Outfit,sans-serif", color: "var(--text-primary)", marginBottom: "10px" }}>
              Settings
            </h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.8" }}>
              Manage your notification behavior, profile visibility, and appearance for {user?.name || "your account"}.
            </p>
            <p style={{ margin: "14px 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
              Changes are saved automatically and will still be here when you come back.
            </p>
          </div>

          <div className="card" style={{ padding: "18px 20px", minWidth: "260px", background: "rgba(99,102,241,0.06)" }}>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", fontWeight: "700" }}>
              Active Theme
            </div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "4px", fontFamily: "Outfit,sans-serif" }}>
              {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
              Theme changes apply instantly across the app.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Appearance */}
          <div className="card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>Appearance</h3>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13px" }}>
                  Choose how ResourceMatch should look and feel.
                </p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
              {themeCards.map((theme) => {
                const isActive = themeMode === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => applyTheme(theme.id)}
                    style={{
                      textAlign: "left", padding: "18px", borderRadius: "18px",
                      border: `1px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                      background: isActive ? "var(--primary-glow)" : "var(--bg-card)",
                      color: "inherit", cursor: "pointer", transition: "var(--transition)",
                      boxShadow: isActive ? "0 12px 30px rgba(99,102,241,0.18)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                      <span style={{ fontSize: "22px" }}>{theme.icon}</span>
                      <span style={{
                        width: "16px", height: "16px", borderRadius: "9999px",
                        border: `2px solid ${isActive ? "var(--primary-light)" : "var(--text-muted)"}`,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isActive && <span style={{ width: "8px", height: "8px", borderRadius: "9999px", background: "var(--primary-light)" }} />}
                      </span>
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>{theme.title}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{theme.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferences */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>Preferences</h3>
            <p style={{ margin: "0 0 20px", color: "var(--text-secondary)", fontSize: "13px" }}>
              Fine tune how the platform communicates with you.
            </p>
            <div style={{ display: "grid", gap: "14px" }}>
              {preferenceItems.map((item) => (
                <label key={item.key} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "16px", padding: "16px 18px", borderRadius: "16px",
                  border: "1px solid var(--border)", background: "rgba(99,102,241,0.05)", cursor: "pointer",
                }}>
                  <div>
                    <div style={{ color: "var(--text-primary)", fontWeight: "700", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "12px", lineHeight: "1.6" }}>{item.hint}</div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={() => toggle(item.key)}
                      style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Security — 2FA */}
          <TwoFASection />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Account Overview */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "18px" }}>Account Overview</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "18px",
                background: "var(--gradient-btn)", display: "flex", alignItems: "center",
                justifyContent: "center", color: "white", fontWeight: "800", fontSize: "20px",
                boxShadow: "var(--shadow-btn)",
              }}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)" }}>
                  {user?.name || "Guest User"}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {user?.email || "No email available"}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                ["Role", user?.role || "Member"],
                ["Location", user?.location || "Not set"],
                ["Status", "Active"],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", gap: "16px",
                  padding: "12px 0", borderBottom: "1px solid var(--border)",
                }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{label}</span>
                  <span style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: "700" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "16px" }}>Quick Actions</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              <button className="btn btn-primary btn-full" onClick={handleSave}>Save Changes</button>
              <button className="btn btn-secondary btn-full" onClick={() => navigate("dashboard")}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
