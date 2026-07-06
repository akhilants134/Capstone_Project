/* ===== API Service (Fetch-based) ===== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || response.statusText);
  }
  return response.json();
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return handleResponse(response);
};

// Auth
export const login = (data) =>
  apiRequest("/users/login", { method: "POST", body: JSON.stringify(data) });
export const adminLogin = (data) =>
  apiRequest("/users/admin-login", { method: "POST", body: JSON.stringify(data) });
export const signup = (data) =>
  apiRequest("/users/signup", { method: "POST", body: JSON.stringify(data) });
export const register = signup;
export const logout = () => apiRequest("/users/logout");
export const getMe = () => apiRequest("/users/me");

// 2FA
export const setup2FA = () =>
  apiRequest("/users/2fa/setup", { method: "POST" });
export const enable2FA = (code) =>
  apiRequest("/users/2fa/enable", { method: "POST", body: JSON.stringify({ code }) });
export const disable2FA = (code) =>
  apiRequest("/users/2fa/disable", { method: "POST", body: JSON.stringify({ code }) });
export const verify2FA = (preAuthToken, code) =>
  apiRequest("/users/2fa/verify", { method: "POST", body: JSON.stringify({ preAuthToken, code }) });
export const regenerateBackupCodes = (code) =>
  apiRequest("/users/2fa/backup-codes", { method: "POST", body: JSON.stringify({ code }) });

// Listings
export const getListings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/listings?${query}`);
};
export const getStats = () => apiRequest("/listings/stats");
export const getListing = (id) => apiRequest(`/listings/${id}`);
export const createListing = (data) =>
  apiRequest("/listings", { method: "POST", body: JSON.stringify(data) });
export const updateListing = (id, data) =>
  apiRequest(`/listings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const deleteListing = (id) =>
  apiRequest(`/listings/${id}`, { method: "DELETE" });

// Matches
export const getMyMatches = () => apiRequest("/matches/my-matches");
export const applyForListing = (data) =>
  apiRequest("/matches/apply", { method: "POST", body: JSON.stringify(data) });
export const updateMatchStatus = (data) =>
  apiRequest("/matches/update-status", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// Messages
export const getConversations = () => apiRequest("/messages");
export const getMessages = (userId) => apiRequest(`/messages/${userId}`);
export const sendMessage = (data) =>
  apiRequest("/messages", { method: "POST", body: JSON.stringify(data) });

// Notifications
export const getNotifications = () => apiRequest("/notifications");
export const markNotificationsRead = () =>
  apiRequest("/notifications/mark-read", { method: "PATCH" });

// Admin
export const adminGetAllUsers = () => apiRequest("/admin/users");
export const adminToggleBanUser = (userId) =>
  apiRequest(`/admin/users/${userId}/ban`, { method: "PATCH" });
export const adminGetAllListings = () => apiRequest("/admin/listings");
export const adminGetStats = () => apiRequest("/admin/stats");
export const adminGetUnverifiedUsers = () => apiRequest("/admin/verifications");
export const adminToggleUserVerification = (userId, action) =>
  apiRequest(`/admin/verifications/${userId}/verify`, { method: "PATCH", body: JSON.stringify({ action }) });
export const adminGetTopDonors = () => apiRequest("/admin/top-donors");

export default {
  login,
  adminLogin,
  register: signup,
  logout,
  getMe,
  setup2FA,
  enable2FA,
  disable2FA,
  verify2FA,
  regenerateBackupCodes,
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getStats,
  applyForListing,
  updateMatchStatus,
  getMyMatches,
  getConversations,
  getMessages,
  sendMessage,
  getNotifications,
  markNotificationsRead,
  adminGetAllUsers,
  adminToggleBanUser,
  adminGetAllListings,
  adminGetStats,
  adminGetUnverifiedUsers,
  adminToggleUserVerification,
  adminGetTopDonors,
};
