/**
 * Real API Service - Connects to Backend API
 * Base URL: http://localhost:5000/api/v1
 */

import api from '../utils/api';

// ===========================
// Authentication API
// ===========================
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Backend login expects {email, password, role}
    login: async (email, password, role) => {
        const response = await api.post('/auth/login', { email, password, role });
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // NOTE: Not implemented in backend auth.routes.js by default [file:58]
    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },

    // Backend expects: old_password, new_password [file:20]
    changePassword: async (old_password, new_password) => {
        const response = await api.put('/auth/change-password', { old_password, new_password });
        return response.data;
    },

    // NOTE: Not implemented in backend auth.routes.js by default [file:58]
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },
};

// ===========================
// Categories API
// ===========================
export const categoriesAPI = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    create: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    update: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};

// ===========================
// Services API
// ===========================
export const servicesAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();

        // Backend uses category_id/provider_id (snake_case)
        if (filters.category_id) params.append('category_id', filters.category_id);
        if (filters.provider_id) params.append('provider_id', filters.provider_id);

        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const qs = params.toString();
        const response = await api.get(qs ? `/services?${qs}` : '/services');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    },

    getByProvider: async (providerId) => {
        const response = await api.get(`/services/provider/${providerId}`);
        return response.data;
    },

    // Backend: upload.array('images', 5) [file:70]
    create: async (serviceData) => {
        // Don't set Content-Type manually for FormData - axios sets it with boundary automatically
        const config = serviceData instanceof FormData ? {} : {};
        const response = await api.post('/services', serviceData, config);
        return response.data;
    },

    update: async (id, serviceData) => {
        const response = await api.put(`/services/${id}`, serviceData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    },
};

// ===========================
// Health Check API
// ===========================
export const healthAPI = {
    check: async () => {
        const response = await api.get('/health');
        return response.data;
    },
};

// ===========================
// Mock helper (keep if needed)
// ===========================
const mockResponse = (message) => {
    return Promise.resolve({
        status: 'info',
        message: `${message} - Using temporary mock data. Backend endpoint coming soon.`,
        data: [],
    });
};

// ===========================
// Requests (Service Requests) API
// ===========================
// Real backend routes are in serviceRequest.routes.js [file:62]
export const requestsAPI = {
    // Customer - backend filters by authenticated user automatically
    getMy: async (params = {}) => {
        const response = await api.get('/requests', { params });
        return response.data;
    },

    // Provider - backend has specific provider endpoint
    getProvider: async (params = {}) => {
        const response = await api.get('/requests/provider', { params });
        return response.data;
    },

    // Admin/general (protected)
    getAll: async (params = {}) => {
        const response = await api.get('/requests', { params });
        return response.data;
    },

    getById: async (requestId) => {
        const response = await api.get(`/requests/${requestId}`);
        return response.data;
    },

    // Customer create
    create: async (requestData) => {
        const response = await api.post('/requests', requestData);
        return response.data;
    },

    // Provider/admin update status: PUT /requests/:id/status and body {status} [file:62]
    updateStatus: async (requestId, status) => {
        const response = await api.put(`/requests/${requestId}/status`, { status });
        return response.data;
    },

    delete: async (requestId) => {
        const response = await api.delete(`/requests/${requestId}`);
        return response.data;
    },
};

// ===========================
// Notifications API
// ===========================
export const notificationsAPI = {
    getAll: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    create: async (notificationData) => {
        const response = await api.post('/notifications', notificationData);
        return response.data;
    },

    markAsRead: async (notificationIds) => {
        const response = await api.post('/notifications/mark-read', { notification_ids: notificationIds });
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.post('/notifications/mark-all-read');
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    },
};

// ===========================
// Payments API
// ===========================
export const paymentsAPI = {
    // Admin only
    getAll: async () => {
        const response = await api.get('/payments');
        return response.data;
    },

    // Customer
    getMy: async () => {
        const response = await api.get('/payments/my-payments');
        return response.data;
    },

    // Provider
    getProvider: async () => {
        const response = await api.get('/payments/provider-payments');
        return response.data;
    },

    create: async (paymentData) => {
        const response = await api.post('/payments', paymentData);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/payments/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/payments/${id}`);
        return response.data;
    },
};

// ===========================
// Reports API (as-is; routes are admin protected)
// ===========================
export const reportsAPI = {
    getAll: async (queryString = '') => {
        const url = queryString ? `/reports?${queryString}` : '/reports';
        const response = await api.get(url);
        return response.data;
    },

    create: async (reportData) => {
        const response = await api.post('/reports', reportData);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.patch(`/reports/${id}`, { status });
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.patch(`/reports/${id}`, data);
        return response.data;
    },

    getMySubmitted: async () => {
        const response = await api.get('/reports/my-submitted');
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/reports/${id}`);
        return response.data;
    },
};

// ===========================
// Profile API
// ===========================
// Provider routes: /providers/profile/me + PUT /providers/profile [file:65]
// Customer routes: /customers/profile (GET/PATCH) [file:59]
export const profileAPI = {
    get: async (role) => {
        const endpoint = role === 'provider' ? '/providers/profile/me' : '/customers/profile';
        const response = await api.get(endpoint);
        return response.data;
    },

    update: async (role, data) => {
        if (role === 'provider') {
            const response = await api.put('/providers/profile', data);
            return response.data;
        }
        const response = await api.patch('/customers/profile', data);
        return response.data;
    },
};

// ===========================
// Providers API (public)
// ===========================
export const providersAPI = {
    getAll: async () => {
        const response = await api.get('/providers');
        return response.data;
    },

    getById: async (providerId) => {
        const response = await api.get(`/providers/${providerId}`);
        return response.data;
    },
};

// ===========================
// Admin API
// ===========================
export const adminAPI = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.patch(`/admin/users/${id}`, userData);
        return response.data;
    },
};

export const dashboardAPI = {
    getStats: () => mockResponse('Dashboard Stats'),
};

export const locationsAPI = {
    getAll: () => mockResponse('Locations API'),
};

export const currenciesAPI = {
    getAll: () => mockResponse('Currencies API'),
};

export const aboutAPI = {
    get: () => mockResponse('About API'),
};

// ===========================
// Name Change API
// ===========================
export const nameChangeAPI = {
    request: async (data) => {
        const response = await api.post('/name-changes', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/name-changes');
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.patch(`/name-changes/${id}`, { status });
        return response.data;
    },
};

export const usersAPI = {
    getAll: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },
};

// ===========================
// Certificates API
// ===========================
// Actual routes are under /certificates (not /providers/...) [file:57]
export const certificatesAPI = {
    // Public
    getByProvider: async (providerId) => {
        const response = await api.get(`/certificates/provider/${providerId}`);
        return response.data;
    },

    // Protected: POST /certificates with multipart field "certificate" [file:57]
    create: async (formData) => {
        const response = await api.post('/certificates', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/certificates/${id}`);
        return response.data;
    },
};

// ===========================
// Reviews API
// ===========================
export const reviewsAPI = {
    getByService: async (serviceId) => {
        const response = await api.get(`/reviews/service/${serviceId}`);
        return response.data;
    },

    getByProvider: async (providerId) => {
        const response = await api.get(`/reviews/provider/${providerId}`);
        return response.data;
    },

    create: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    update: async (reviewId, reviewData) => {
        const response = await api.patch(`/reviews/${reviewId}`, reviewData);
        return response.data;
    },

    delete: async (reviewId) => {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    },
};

// ===========================
// Addresses API
// ===========================
export const addressesAPI = {
    getAll: async () => {
        const response = await api.get('/addresses');
        return response.data;
    },

    getById: async (addressId) => {
        const response = await api.get(`/addresses/${addressId}`);
        return response.data;
    },

    create: async (addressData) => {
        const response = await api.post('/addresses', addressData);
        return response.data;
    },

    update: async (addressId, addressData) => {
        const response = await api.put(`/addresses/${addressId}`, addressData);
        return response.data;
    },

    delete: async (addressId) => {
        const response = await api.delete(`/addresses/${addressId}`);
        return response.data;
    },
};
