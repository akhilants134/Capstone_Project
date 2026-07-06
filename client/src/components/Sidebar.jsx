/* ===== Sidebar Component ===== */

const navItems = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "browse", icon: "🔍", label: "Browse Listings" },
  { id: "post-request", icon: "➕", label: "Post a Request" },
  { id: "share-something", icon: "🎁", label: "Share Something" },
  { id: "matches", icon: "🤝", label: "My Matches" },
  { id: "donations", icon: "💝", label: "Donations" },
  { id: "messages", icon: "💬", label: "Messages" },
  { id: "profile", icon: "👤", label: "My Profile" },
];

export default function Sidebar({ currentPage, navigate, user, onLogout }) {
  const isSettingsActive = currentPage === "settings";
  const isAdmin = user?.role === "admin";
  const visibleNavItems = isAdmin
    ? [...navItems, { id: "admin", icon: "🛡️", label: "Admin Panel" }]
    : navItems;

  return (
    <aside
      className={`app-sidebar`}
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "var(--gradient-btn)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            boxShadow: "var(--shadow-btn)",
            flexShrink: 0,
          }}
        >
          🌐
        </div>
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "800",
              fontFamily: "Outfit,sans-serif",
              color: "var(--text-primary)",
            }}
          >
            ResourceMatch
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "var(--primary-light)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Connect · Donate · Grow
          </div>
        </div>
      </div>

      {/* User info */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "var(--gradient-success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "700",
            color: "white",
            flexShrink: 0,
          }}
        >
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name || "Guest User"}
          </div>
          <div
            style={{
              fontSize: "11px",
              color:
                user?.role === "donor"
                  ? "var(--secondary-light)"
                  : user?.role === "admin"
                  ? "#f59e0b"
                  : "var(--primary-light)",
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {user?.role === "admin"
              ? "🛡️ Admin"
              : user?.role === "donor"
              ? "💰 Donor"
              : "🙋 Client"}
          </div>
        </div>
      </div>

      {/* Search box */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "12px",
              opacity: 0.6,
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Global Search..."
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "8px 10px 8px 30px",
              fontSize: "12px",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
        {visibleNavItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "none",
                background: isActive ? "var(--primary-glow)" : "transparent",
                borderLeft: isActive
                  ? "3px solid var(--primary)"
                  : "3px solid transparent",
                color: isActive
                  ? "var(--primary-light)"
                  : "var(--text-secondary)",
                cursor: "pointer",
                marginBottom: "4px",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(99,102,241,0.08)";
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
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: isActive ? "600" : "500",
                }}
              >
                {item.label}
              </span>
              {item.id === "matches" && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--primary)",
                    color: "white",
                    borderRadius: "9999px",
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "1px 6px",
                  }}
                >
                  3
                </span>
              )}
              {item.id === "messages" && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--secondary)",
                    color: "white",
                    borderRadius: "9999px",
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "1px 6px",
                  }}
                >
                  5
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => navigate("settings")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 14px",
            borderRadius: "10px",
            border: "none",
            background: isSettingsActive
              ? "var(--primary-glow)"
              : "transparent",
            color: isSettingsActive
              ? "var(--primary-light)"
              : "var(--text-secondary)",
            cursor: "pointer",
            marginBottom: "4px",
            transition: "all 0.2s ease",
            borderLeft: isSettingsActive
              ? "3px solid var(--primary)"
              : "3px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (!isSettingsActive) {
              e.currentTarget.style.background = "rgba(99,102,241,0.08)";
              e.currentTarget.style.color = "var(--text-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSettingsActive) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }
          }}
        >
          <span style={{ fontSize: "16px" }}>⚙️</span>
          <span style={{ fontSize: "13px", fontWeight: "500" }}>Settings</span>
        </button>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 14px",
            borderRadius: "10px",
            border: "none",
            background: "transparent",
            color: "var(--danger)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            opacity: "0.7",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.opacity = "0.7";
          }}
        >
          <span style={{ fontSize: "16px" }}>🚪</span>
          <span style={{ fontSize: "13px", fontWeight: "500" }}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
