import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: true
});

// Auth
export const login = (data) => API.post('/users/login', data);
export const signup = (data) => API.post('/users/signup', data);
export const logout = () => API.get('/users/logout');

// Listings
export const getListings = (params) => API.get('/listings', { params });
export const getListing = (id) => API.get(`/listings/${id}`);
export const createListing = (data) => API.post('/listings', data);
export const updateListing = (id, data) => API.patch(`/listings/${id}`, data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);

// Matches
export const applyForListing = (data) => API.post('/matches/apply', data);
export const updateMatchStatus = (data) => API.patch('/matches/update-status', data);

export default API;
