import api from './api';

/**
 * Check if backend server is running
 * @returns {Promise<boolean>} True if backend is reachable
 */
export const checkBackendConnection = async () => {
  // Always return true for mock backend
  return true;
};

/**
 * Get user-friendly error message based on error type
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // Network error (no response from server)
  if (error.networkError || !error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'Request timeout. The server is taking too long to respond.';
    }
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Failed to fetch')) {
      return 'Cannot connect to server. Please ensure the backend server is running on http://127.0.0.1:5000';
    }
    return 'Network error. Please check your connection and ensure the backend server is running.';
  }

  // Server responded with error
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;

    if (status === 401) {
      return 'Authentication failed. Please login again.';
    }
    if (status === 403) {
      return 'Access denied. You do not have permission to perform this action.';
    }
    if (status === 404) {
      return 'Resource not found.';
    }
    if (status === 500) {
      return 'Server error. Please try again later.';
    }

    return message || `Server error (${status}). Please try again.`;
  }

  return error.message || 'An error occurred. Please try again.';
};

