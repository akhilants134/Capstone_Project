/* ===== API Service (Fetch-based) ===== */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || response.statusText);
  }
  return response.json();
};

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return handleResponse(response);
};

// Auth
export const login = (data) => apiRequest('/users/login', { method: 'POST', body: JSON.stringify(data) });
export const signup = (data) => apiRequest('/users/signup', { method: 'POST', body: JSON.stringify(data) });
export const logout = () => apiRequest('/users/logout');

// Listings
export const getListings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/listings?${query}`);
};
export const getStats = () => apiRequest('/listings/stats');
export const getListing = (id) => apiRequest(`/listings/${id}`);
export const createListing = (data) => apiRequest('/listings', { method: 'POST', body: JSON.stringify(data) });
export const updateListing = (id, data) => apiRequest(`/listings/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteListing = (id) => apiRequest(`/listings/${id}`, { method: 'DELETE' });

// Matches
export const getMyMatches = () => apiRequest('/matches/my-matches');
export const applyForListing = (data) => apiRequest('/matches/apply', { method: 'POST', body: JSON.stringify(data) });
export const updateMatchStatus = (data) => apiRequest('/matches/update-status', { method: 'PATCH', body: JSON.stringify(data) });

// Messages
export const getConversations = () => apiRequest('/messages');
export const getMessages = (userId) => apiRequest(`/messages/${userId}`);
export const sendMessage = (data) => apiRequest('/messages', { method: 'POST', body: JSON.stringify(data) });

export default {
  login, signup, logout,
  getListings, getListing, createListing, updateListing, deleteListing, getStats,
  applyForListing, updateMatchStatus, getMyMatches,
  getConversations, getMessages, sendMessage
};
