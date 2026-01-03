import axios from 'axios';

/**
 * Get CSRF token from cookie
 */
function getCsrfToken() {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length);
        }
    }
    return null;
}

/**
 * Axios instance configured for API calls
 * Uses session-based authentication with cookies and CSRF tokens
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Required for session cookies
    timeout: 10000, // 10 second timeout
});

/**
 * Request interceptor
 * - Adds CSRF token from cookie to headers (required by Laravel Sanctum)
 */
api.interceptors.request.use(
    (config) => {
        const token = getCsrfToken();
        if (token) {
            config.headers['X-XSRF-TOKEN'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * - Handles common error cases
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default api;
