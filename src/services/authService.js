import api from './api';
import axios from 'axios';

// Base URL without /api for sanctum csrf-cookie endpoint
const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

/**
 * Auth API service
 * Provides authentication operations with CSRF support for Laravel Sanctum
 */
export const authService = {
    /**
     * Get CSRF cookie from Sanctum before making auth requests
     * @returns {Promise} API response
     */
    getCsrfCookie: () => axios.get(`${baseURL}/sanctum/csrf-cookie`, {
        withCredentials: true,
    }),

    /**
     * Login user (automatically fetches CSRF cookie first)
     * @param {string} email
     * @param {string} password
     * @returns {Promise} API response with user data
     */
    login: async (email, password) => {
        // First, get CSRF cookie
        await authService.getCsrfCookie();
        // Then login
        return api.post('/login', { email, password });
    },

    /**
     * Logout current user
     * @returns {Promise} API response
     */
    logout: () => api.post('/logout'),

    /**
     * Get current authenticated user
     * @returns {Promise} API response with user data
     */
    getCurrentUser: () => api.get('/user'),
};
