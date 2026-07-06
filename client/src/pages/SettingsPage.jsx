/* ===== Settings Page ===== */
import { useEffect, useState } from "react";

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
  };

  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!stored) {
      return fallback;
    }

    return { ...fallback, ...JSON.parse(stored) };
  } catch {
    return fallback;
  }
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
    {
      id: "dark",
      title: "Dark",
      description: "High contrast workspace with reduced glare.",
      icon: "🌙",
    },
    {
      id: "light",
      title: "Light",
      description: "Clean, bright interface for daytime use.",
      icon: "☀️",
    },
  ];

  return (
    <div style={{ animation: "fadeInUp 0.4s ease", maxWidth: "1100px" }}>
      {saved && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: "var(--secondary)",
            color: "white",
            padding: "12px 18px",
            borderRadius: "14px",
            boxShadow: "var(--shadow-lg)",
            zIndex: 1000,
            fontWeight: "700",
          }}
        >
          Settings saved successfully.
        </div>
      )}

      <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "620px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "9999px",
                background: "rgba(99,102,241,0.12)",
                color: "var(--primary-light)",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Account Preferences
            </div>
            <h1
              style={{
                fontSize: "34px",
                fontWeight: "800",
                fontFamily: "Outfit,sans-serif",
                color: "var(--text-primary)",
                marginBottom: "10px",
              }}
            >
              Settings
            </h1>
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: "15px",
                lineHeight: "1.8",
              }}
            >
              Manage your notification behavior, profile visibility, and
              appearance for {user?.name || "your account"}.
            </p>
            <p
              style={{
                margin: "14px 0 0",
                color: "var(--text-muted)",
                fontSize: "13px",
              }}
            >
              Changes are saved automatically and will still be here when you
              come back.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: "18px 20px",
              minWidth: "260px",
              background: "rgba(99,102,241,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
                fontWeight: "700",
              }}
            >
              Active Theme
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "4px",
                fontFamily: "Outfit,sans-serif",
              }}
            >
              {themeMode === "dark" ? "Dark Mode" : "Light Mode"}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
              Theme changes apply instantly across the app.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card" style={{ padding: "28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  Appearance
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                  }}
                >
                  Choose how ResourceMatch should look and feel.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              {themeCards.map((theme) => {
                const isActive = themeMode === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => applyTheme(theme.id)}
                    style={{
                      textAlign: "left",
                      padding: "18px",
                      borderRadius: "18px",
                      border: `1px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                      background: isActive
                        ? "var(--primary-glow)"
                        : "var(--bg-card)",
                      color: "inherit",
                      cursor: "pointer",
                      transition: "var(--transition)",
                      boxShadow: isActive
                        ? "0 12px 30px rgba(99,102,241,0.18)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "14px",
                      }}
                    >
                      <span style={{ fontSize: "22px" }}>{theme.icon}</span>
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "9999px",
                          border: `2px solid ${isActive ? "var(--primary-light)" : "var(--text-muted)"}`,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isActive && (
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "9999px",
                              background: "var(--primary-light)",
                            }}
                          />
                        )}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "800",
                        color: "var(--text-primary)",
                        marginBottom: "6px",
                      }}
                    >
                      {theme.title}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: "1.6",
                      }}
                    >
                      {theme.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: "28px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Preferences
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                color: "var(--text-secondary)",
                fontSize: "13px",
              }}
            >
              Fine tune how the platform communicates with you.
            </p>

            <div style={{ display: "grid", gap: "14px" }}>
              {preferenceItems.map((item) => (
                <label
                  key={item.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px 18px",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    background: "rgba(99,102,241,0.05)",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: "700",
                        marginBottom: "4px",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        lineHeight: "1.6",
                      }}
                    >
                      {item.hint}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={() => toggle(item.key)}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "var(--primary)",
                      }}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card" style={{ padding: "28px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "18px",
              }}
            >
              Account Overview
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "18px",
                  background: "var(--gradient-btn)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "800",
                  fontSize: "20px",
                  boxShadow: "var(--shadow-btn)",
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "800",
                    color: "var(--text-primary)",
                  }}
                >
                  {user?.name || "Guest User"}
                </div>
                <div
                  style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                >
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
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{ color: "var(--text-secondary)", fontSize: "13px" }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: "28px" }}>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "var(--text-primary)",
                marginBottom: "16px",
              }}
            >
              Quick Actions
            </h3>
            <div style={{ display: "grid", gap: "10px" }}>
              <button className="btn btn-primary btn-full" onClick={handleSave}>
                Save Changes
              </button>
              <button
                className="btn btn-secondary btn-full"
                onClick={() => navigate("dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
