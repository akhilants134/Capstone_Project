import { useEffect, useMemo, useState } from "react";
import {
  deleteAdminListing,
  deleteUser,
  getAdminListings,
  getAdminStats,
  getAdminUsers,
  toggleAdminListingStatus,
  updateUserRole,
} from "../services/api";

const tabs = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "users", label: "Users", icon: "👥" },
  { id: "listings", label: "Listings", icon: "📦" },
  { id: "health", label: "Platform Health", icon: "🩺" },
];

const initialStats = {
  totalUsers: 0,
  totalListings: 0,
  totalMatches: 0,
  pendingRequests: 0,
};

export default function AdminPage({ user }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState(initialStats);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [listingSearch, setListingSearch] = useState("");

  const [busyUserId, setBusyUserId] = useState("");
  const [busyListingId, setBusyListingId] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsRes, usersRes, listingsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers({ limit: 100 }),
        getAdminListings({ limit: 100 }),
      ]);

      setStats(statsRes?.data?.stats || initialStats);
      setUsers(usersRes?.data?.users || []);
      setListings(listingsRes?.data?.listings || []);
    } catch (err) {
      setError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = useMemo(() => {
    const value = userSearch.trim().toLowerCase();
    if (!value) return users;
    return users.filter(
      (entry) =>
        entry.name?.toLowerCase().includes(value) ||
        entry.email?.toLowerCase().includes(value) ||
        entry.role?.toLowerCase().includes(value)
    );
  }, [users, userSearch]);

  const filteredListings = useMemo(() => {
    const value = listingSearch.trim().toLowerCase();
    if (!value) return listings;
    return listings.filter(
      (entry) =>
        entry.title?.toLowerCase().includes(value) ||
        entry.category?.toLowerCase().includes(value) ||
        entry.status?.toLowerCase().includes(value)
    );
  }, [listings, listingSearch]);

  const handleRoleChange = async (userId, role) => {
    setBusyUserId(userId);
    try {
      await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((entry) => (entry._id === userId ? { ...entry, role } : entry))
      );
    } catch (err) {
      setError(err.message || "Failed to update role.");
    } finally {
      setBusyUserId("");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm("Delete this user and their listings?");
    if (!confirmed) return;

    setBusyUserId(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((entry) => entry._id !== userId));
      setListings((prev) => prev.filter((entry) => entry.user?._id !== userId));
      setStats((prev) => ({ ...prev, totalUsers: Math.max(prev.totalUsers - 1, 0) }));
    } catch (err) {
      setError(err.message || "Failed to delete user.");
    } finally {
      setBusyUserId("");
    }
  };

  const handleListingDelete = async (listingId) => {
    const confirmed = window.confirm("Force-delete this listing?");
    if (!confirmed) return;

    setBusyListingId(listingId);
    try {
      await deleteAdminListing(listingId);
      setListings((prev) => prev.filter((entry) => entry._id !== listingId));
      setStats((prev) => ({ ...prev, totalListings: Math.max(prev.totalListings - 1, 0) }));
    } catch (err) {
      setError(err.message || "Failed to delete listing.");
    } finally {
      setBusyListingId("");
    }
  };

  const handleListingStatusToggle = async (listing) => {
    const nextStatus = listing.status === "active" ? "inactive" : "active";

    setBusyListingId(listing._id);
    try {
      const response = await toggleAdminListingStatus(listing._id, nextStatus);
      const updated = response?.data?.listing;

      setListings((prev) =>
        prev.map((entry) =>
          entry._id === listing._id
            ? { ...entry, status: updated?.status || (nextStatus === "active" ? "active" : "cancelled") }
            : entry
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update listing status.");
    } finally {
      setBusyListingId("");
    }
  };

  const renderOverview = () => (
    <div>
      <div className="grid-4" style={{ marginBottom: "28px" }}>
        {[
          { label: "Total Users", value: stats.totalUsers, tone: "#0ea5e9", emoji: "👥" },
          { label: "Total Listings", value: stats.totalListings, tone: "#10b981", emoji: "📦" },
          { label: "Total Matches", value: stats.totalMatches, tone: "#f59e0b", emoji: "🤝" },
          { label: "Pending Requests", value: stats.pendingRequests, tone: "#ef4444", emoji: "⏳" },
        ].map((item) => (
          <div key={item.label} className="card" style={{ padding: "22px", border: `1px solid ${item.tone}33` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 600 }}>{item.label}</span>
              <span style={{ fontSize: "20px" }}>{item.emoji}</span>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: item.tone, lineHeight: 1 }}>{item.value || 0}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "24px", background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(16,185,129,0.08))" }}>
        <h3 style={{ marginTop: 0, color: "var(--text-primary)", fontSize: "20px", fontFamily: "Outfit,sans-serif" }}>
          Admin Snapshot
        </h3>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 0 }}>
          You are signed in as {user?.email}. Use Users and Listings tabs to perform moderation tasks and platform cleanup actions.
        </p>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: "18px", fontFamily: "Outfit,sans-serif" }}>
          User Management
        </h3>
        <input
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          placeholder="Search by name, email, role"
          style={{
            minWidth: "260px",
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "9px 12px",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
          <thead>
            <tr>
              {[
                "Name",
                "Email",
                "Role",
                "Points",
                "Joined",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  style={{
                    textAlign: "left",
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    borderBottom: "1px solid var(--border)",
                    padding: "12px 8px",
                  }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((entry) => (
              <tr key={entry._id}>
                <td style={{ padding: "12px 8px", borderBottom: "1px solid var(--border)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{entry.name}</strong>
                </td>
                <td style={{ padding: "12px 8px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>{entry.email}</td>
                <td style={{ padding: "12px 8px", borderBottom: "1px solid var(--border)" }}>
                  <span
                    style={{
                      padding: "4px 9px",
                      borderRadius: "999px",
                      background:
                        entry.role === "admin"
                          ? "rgba(245,158,11,0.15)"
                          : entry.role === "donor"
                          ? "rgba(16,185,129,0.14)"
                          : "rgba(14,165,233,0.15)",
                      color:
                        entry.role === "admin"
                          ? "#f59e0b"
                          : entry.role === "donor"
                          ? "#10b981"
                          : "#0ea5e9",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {entry.role}
                  </span>
                </td>
                <td style={{ padding: "12px 8px", borderBottom: "1px solid var(--border)", color: "var(--text-primary)" }}>{entry.points || 0}</td>
                <td style={{ padding: "12px 8px", borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>{new Date(entry.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px 8px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <select
                      value={entry.role}
                      disabled={busyUserId === entry._id}
                      onChange={(e) => handleRoleChange(entry._id, e.target.value)}
                      style={{
                        background: "var(--bg-input)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        padding: "6px 8px",
                      }}
                    >
                      <option value="client">client</option>
                      <option value="donor">donor</option>
                      <option value="admin">admin</option>
                    </select>
                    <button
                      type="button"
                      disabled={busyUserId === entry._id}
                      onClick={() => handleDeleteUser(entry._id)}
                      style={{
                        border: "1px solid rgba(239,68,68,0.4)",
                        background: "rgba(239,68,68,0.08)",
                        color: "#ef4444",
                        borderRadius: "8px",
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderListings = () => (
    <div className="card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: "18px", fontFamily: "Outfit,sans-serif" }}>
          Listing Moderation
        </h3>
        <input
          value={listingSearch}
          onChange={(e) => setListingSearch(e.target.value)}
          placeholder="Search by title, category, status"
          style={{
            minWidth: "260px",
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "9px 12px",
            color: "var(--text-primary)",
          }}
        />
      </div>

      <div style={{ display: "grid", gap: "10px" }}>
        {filteredListings.map((listing) => {
          const isInactive = listing.status !== "active";
          return (
            <div
              key={listing._id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "14px",
                display: "flex",
                justifyContent: "space-between",
                gap: "14px",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "4px" }}>
                  {listing.title}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                  {listing.category} · {listing.type} · Owner: {listing.user?.name || "Unknown"}
                </div>
              </div>

              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 9px",
                  borderRadius: "999px",
                  background: isInactive ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
                  color: isInactive ? "#ef4444" : "#10b981",
                  textTransform: "capitalize",
                }}
              >
                {isInactive ? "inactive" : "active"}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  disabled={busyListingId === listing._id}
                  onClick={() => handleListingStatusToggle(listing)}
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg-input)",
                    color: "var(--text-primary)",
                    borderRadius: "8px",
                    padding: "7px 10px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {isInactive ? "Set Active" : "Set Inactive"}
                </button>
                <button
                  type="button"
                  disabled={busyListingId === listing._id}
                  onClick={() => handleListingDelete(listing._id)}
                  style={{
                    border: "1px solid rgba(239,68,68,0.4)",
                    background: "rgba(239,68,68,0.08)",
                    color: "#ef4444",
                    borderRadius: "8px",
                    padding: "7px 10px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Force Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderHealth = () => (
    <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      {[
        { label: "API Uptime", value: "99.92%", hint: "last 7 days" },
        { label: "Error Rate", value: "0.21%", hint: "rolling 24h" },
        { label: "Queue Latency", value: "142 ms", hint: "avg processing time" },
        { label: "DB Connections", value: "18 / 100", hint: "healthy range" },
      ].map((item) => (
        <div key={item.label} className="card" style={{ padding: "20px" }}>
          <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "8px", textTransform: "uppercase" }}>
            {item.label}
          </div>
          <div style={{ color: "var(--text-primary)", fontSize: "34px", fontWeight: 800, lineHeight: 1 }}>
            {item.value}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>{item.hint}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ animation: "fadeInUp 0.4s ease" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #0f766e 100%)",
          borderRadius: "24px",
          padding: "28px",
          marginBottom: "24px",
          color: "white",
          boxShadow: "0 14px 44px rgba(2,6,23,0.35)",
        }}
      >
        <p style={{ margin: 0, opacity: 0.8, fontWeight: 700, letterSpacing: "0.7px", fontSize: "12px", textTransform: "uppercase" }}>
          ResourceMatch Admin
        </p>
        <h1 style={{ margin: "10px 0 6px", fontFamily: "Outfit,sans-serif", fontSize: "30px" }}>
          Platform Control Panel
        </h1>
        <p style={{ margin: 0, opacity: 0.88, maxWidth: "720px", lineHeight: 1.6 }}>
          Monitor live platform metrics, manage user access, and moderate listings from a single control surface.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "10px 14px",
              background: activeTab === tab.id ? "var(--primary-glow)" : "var(--bg-card)",
              color: activeTab === tab.id ? "var(--primary-light)" : "var(--text-secondary)",
              cursor: "pointer",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div
          style={{
            border: "1px solid rgba(239,68,68,0.35)",
            background: "rgba(239,68,68,0.12)",
            color: "#fca5a5",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: "14px",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ padding: "28px", color: "var(--text-secondary)" }}>Loading admin data...</div>
      ) : (
        <>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "users" && renderUsers()}
          {activeTab === "listings" && renderListings()}
          {activeTab === "health" && renderHealth()}
        </>
      )}
    </div>
  );
}
