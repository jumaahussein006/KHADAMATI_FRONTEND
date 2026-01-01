import axios from 'axios';

const TOKEN_KEY = 'khadamati_token';
const USER_KEY = 'khadamati_user';

// Get API URL from environment variable, fallback to localhost for local dev
// Create React App uses process.env.REACT_APP_ prefix
const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api/v1';
export const API_URL = BASE_URL;
export const UPLOAD_URL = BASE_URL.replace('/api/v1', '');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);
        console.log('🔑 Request interceptor - Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NULL');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        else console.warn('⚠️ No token in localStorage!');

        // CRITICAL: Don't set Content-Type for FormData - let browser set it with boundary
        if (config.data instanceof FormData) {
            console.log('📦 FormData detected - removing Content-Type to let browser set boundary');
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Network errors (no response from server)
        if (!error.response) {
            if (error.code === 'E CONNABORTED' || String(error.message || '').toLowerCase().includes('timeout')) {
                error.networkError = true;
                error.message = `Network error. Please check your connection and ensure the backend server is running on ${API_URL}`;
            } else {
                error.networkError = true;
                error.message = `Cannot connect to server. Please ensure the backend server is running on ${API_URL}`;
            }
            return Promise.reject(error);
        }

        // Server responded with error status
        if (error.response.status === 401) {
            // Token invalid or expired
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }

        error.message = error.response.data?.message || error.response.data?.error || error.message;
        return Promise.reject(error);
    }
);

export default api;
