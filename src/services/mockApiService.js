// Mock API Service - Replaces backend API calls with localStorage mock data
import {
  getCategories,
  getServices,
  getProviders,
  getUsers,
  getRequests,
  getPayments,
  getReports,
  getNotifications,
  getCertificates,
  getReviews,
  getLocations,
  getCurrencies,
  createCategory,
  createService,
  createRequest,
  createNotification,
  createUser,
  updateCategory,
  updateService,
  updateRequest,
  updateUser,
  deleteCategory,
  deleteService,
  deleteUser,
  deleteReport,
  updateReport,
  getAboutUs,
  updateAboutUs,
  getNameChangeRequests,
  createNameChangeRequest,
  updateNameChangeRequest
} from '../utils/mockData';

// Helper to simulate async API calls
const simulateAsync = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, 100); // simulate network delay
  });
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    const services = getServices();
    return simulateAsync(services);
  },
  getById: async (id) => {
    const services = getServices();
    const service = services.find(s => s.service_id === parseInt(id));
    if (!service) {
      throw new Error('Service not found');
    }
    return simulateAsync(service);
  },
  create: async (data) => {
    const newService = createService(data);
    return simulateAsync(newService);
  },
  update: async (id, data) => {
    const updated = updateService(parseInt(id), data);
    if (!updated) {
      throw new Error('Service not found');
    }
    return simulateAsync(updated);
  },
  delete: async (id) => {
    deleteService(parseInt(id));
    return simulateAsync({ message: 'Service deleted successfully' });
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const categories = getCategories();
    return simulateAsync(categories);
  },
  getById: async (id) => {
    const categories = getCategories();
    const category = categories.find(c => c.category_id === parseInt(id));
    if (!category) {
      throw new Error('Category not found');
    }
    return simulateAsync(category);
  },
  create: async (data) => {
    const newCategory = createCategory(data);
    return simulateAsync(newCategory);
  },
  update: async (id, data) => {
    const updated = updateCategory(parseInt(id), data);
    if (!updated) {
      throw new Error('Category not found');
    }
    return simulateAsync(updated);
  },
  delete: async (id) => {
    deleteCategory(parseInt(id));
    return simulateAsync({ message: 'Category deleted successfully' });
  }
};

// Health Check API
export const healthAPI = {
  check: async () => {
    return simulateAsync({ status: 'ok', mode: 'mock' });
  }
};

// Requests API
export const requestsAPI = {
  getAll: async () => {
    const requests = getRequests();
    const user = JSON.parse(localStorage.getItem('khadamati_user') || '{}');

    // Filter based on user role
    if (user.role === 'customer') {
      return simulateAsync(requests.filter(r => r.customer_id === user.user_id));
    } else if (user.role === 'provider') {
      return simulateAsync(requests.filter(r => r.provider_id === user.user_id));
    }

    return simulateAsync(requests);
  },
  create: async (data) => {
    const newRequest = createRequest(data);
    return simulateAsync(newRequest);
  },
  update: async (id, data) => {
    const updated = updateRequest(parseInt(id), data);
    if (!updated) {
      throw new Error('Request not found');
    }
    return simulateAsync(updated);
  }
};

// Admin API
export const adminAPI = {
  // Dashboard
  getStats: async () => {
    const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');
    const services = getServices();
    const requests = getRequests();
    const payments = getPayments();

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Calculate monthly stats
    const usersThisMonth = users.filter(u => {
      const date = new Date(u.created_at || '2024-01-01');
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;

    const requestsThisMonth = requests.filter(r => {
      const date = new Date(r.request_date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    }).length;

    const stats = {
      totalUsers: users.length,
      totalServices: services.length,
      totalRequests: requests.length,
      totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
      newUsersThisMonth: usersThisMonth,
      newRequestsThisMonth: requestsThisMonth,
      activeProviders: users.filter(u => u.role === 'provider').length,
      completedRequests: requests.filter(r => r.status_id === 3).length
    };

    return simulateAsync(stats);
  },

  // Users
  getUsers: async () => {
    const users = getUsers();
    return simulateAsync(users);
  },
  getUserById: async (id) => {
    const users = getUsers();
    const user = users.find(u => u.user_id === parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return simulateAsync(user);
  },
  deleteUser: async (id) => {
    deleteUser(parseInt(id));
    return simulateAsync({ message: 'User deleted successfully' });
  },

  // Providers
  getProviders: async () => {
    const providers = getProviders();
    const users = JSON.parse(localStorage.getItem('khadamati_users') || '[]');

    // Merge provider data with user data
    const providersWithUserData = providers.map(provider => {
      const user = users.find(u => u.user_id === provider.user_id);
      return {
        ...provider,
        ...user,
        password: undefined // Don't expose passwords
      };
    });

    return simulateAsync(providersWithUserData);
  },

  // Requests
  getRequests: async () => {
    const requests = getRequests();
    return simulateAsync(requests);
  }
};

// Users API (for profile management)
export const usersAPI = {
  getProfile: async () => {
    const user = JSON.parse(localStorage.getItem('khadamati_user') || '{}');
    if (!user.user_id) {
      throw new Error('User not logged in');
    }
    return simulateAsync(user);
  },
  updateProfile: async (data) => {
    const user = JSON.parse(localStorage.getItem('khadamati_user') || '{}');
    const updated = updateUser(user.user_id, data);
    if (updated) {
      // Update the current user in localStorage
      localStorage.setItem('khadamati_user', JSON.stringify(updated));
    }
    return simulateAsync(updated);
  },
  getAll: async () => {
    const users = getUsers();
    return simulateAsync(users);
  }
};

// Providers API
export const providersAPI = {
  getAll: async () => {
    return adminAPI.getProviders();
  },
  getById: async (id) => {
    const providers = getProviders();
    const provider = providers.find(p => p.provider_id === parseInt(id));
    if (!provider) {
      throw new Error('Provider not found');
    }
    return simulateAsync(provider);
  }
};

// Dashboard API
export const dashboardAPI = {
  getAdminStats: async () => {
    return adminAPI.getStats();
  },
  getProviderStats: async () => {
    const user = JSON.parse(localStorage.getItem('khadamati_user') || '{}');
    const services = getServices();
    const requests = getRequests();

    const myServices = services.filter(s => s.provider_id === user.user_id);
    const myRequests = requests.filter(r => r.provider_id === user.user_id);

    const stats = {
      totalServices: myServices.length,
      totalRequests: myRequests.length,
      pendingRequests: myRequests.filter(r => r.status_id === 1).length,
      completedRequests: myRequests.filter(r => r.status_id === 3).length
    };

    return simulateAsync(stats);
  },
  getCustomerStats: async () => {
    const user = JSON.parse(localStorage.getItem('khadamati_user') || '{}');
    const requests = getRequests();
    const payments = getPayments();

    const myRequests = requests.filter(r => r.customer_id === user.user_id);
    const myPayments = payments.filter(p => {
      return myRequests.some(req => req.request_id === p.request_id);
    });

    const stats = {
      totalRequests: myRequests.length,
      pendingRequests: myRequests.filter(r => r.status_id === 1).length,
      completedRequests: myRequests.filter(r => r.status_id === 3).length,
      totalSpent: myPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    };

    return simulateAsync(stats);
  }
};

// Payments API
export const paymentsAPI = {
  getAll: async () => {
    const payments = getPayments();
    return simulateAsync(payments);
  },
  getById: async (id) => {
    const payments = getPayments();
    const payment = payments.find(p => p.payment_id === parseInt(id));
    if (!payment) {
      throw new Error('Payment not found');
    }
    return simulateAsync(payment);
  },
  create: async (data) => {
    const payments = getPayments();
    const newPayment = {
      payment_id: Date.now(),
      create_at: new Date().toISOString(),
      transaction_date: new Date().toISOString(),
      status: 'Completed',
      getaway_response: 'Success',
      ...data
    };
    payments.push(newPayment);
    localStorage.setItem('khadamati_payments', JSON.stringify(payments));
    return simulateAsync(newPayment);
  },
  getByRequest: async (requestId) => {
    const payments = getPayments();
    const payment = payments.find(p => p.request_id === parseInt(requestId));
    return simulateAsync(payment || null);
  }
};

// Reports API
export const reportsAPI = {
  getAll: async () => {
    const reports = getReports();
    return simulateAsync(reports);
  },
  getById: async (id) => {
    const reports = getReports();
    const report = reports.find(r => r.report_id === parseInt(id));
    if (!report) {
      throw new Error('Report not found');
    }
    return simulateAsync(report);
  },
  create: async (data) => {
    const reports = getReports();
    const newReport = {
      report_id: Date.now(),
      create_at: new Date().toISOString(),
      admin_id: null,
      ...data
    };
    reports.push(newReport);
    localStorage.setItem('khadamati_reports', JSON.stringify(reports));
    return simulateAsync(newReport);
  },
  update: async (id, data) => {
    const reports = getReports();
    const index = reports.findIndex(r => r.report_id === parseInt(id));
    if (index === -1) {
      throw new Error('Report not found');
    }
    reports[index] = { ...reports[index], ...data };
    localStorage.setItem('khadamati_reports', JSON.stringify(reports));
    return simulateAsync(reports[index]);
  },
  reply: async (id, replyMessage) => {
    const reports = getReports();
    const index = reports.findIndex(r => r.report_id === parseInt(id));
    if (index === -1) throw new Error('Report not found');

    reports[index].resolved = true;
    reports[index].admin_reply = replyMessage;
    localStorage.setItem('khadamati_reports', JSON.stringify(reports));

    // Create notification for user
    createNotification({
      user_id: reports[index].user_id,
      type: 'ReportReply',
      title: 'Report Resolved',
      message: `Admin replied to your report: ${replyMessage}`
    });

    return simulateAsync(reports[index]);
  },
  delete: async (id) => {
    deleteReport(parseInt(id));
    return simulateAsync({ message: 'Report deleted successfully' });
  }
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    const notifications = getNotifications();
    return simulateAsync(notifications);
  },
  getById: async (id) => {
    const notifications = getNotifications();
    const notification = notifications.find(n => n.notification_id === parseInt(id));
    if (!notification) {
      throw new Error('Notification not found');
    }
    return simulateAsync(notification);
  },
  markAsRead: async (id) => {
    const notifications = getNotifications();
    const index = notifications.findIndex(n => n.notification_id === parseInt(id));
    if (index === -1) {
      throw new Error('Notification not found');
    }
    notifications[index].is_read = true;
    localStorage.setItem('khadamati_notifications', JSON.stringify(notifications));
    return simulateAsync(notifications[index]);
  },
  getByUser: async (userId) => {
    const notifications = getNotifications(parseInt(userId));
    return simulateAsync(notifications);
  }
};

// Locations API
export const locationsAPI = {
  getAll: async () => {
    const locations = getLocations();
    return simulateAsync(locations);
  }
};

// Currencies API
export const currenciesAPI = {
  getAll: async () => {
    const currencies = getCurrencies();
    return simulateAsync(currencies);
  }
};
// About Us API
export const aboutAPI = {
  get: async () => {
    return simulateAsync(getAboutUs());
  },
  update: async (data) => {
    return simulateAsync(updateAboutUs(data));
  }
};

// Name Change Requests API
export const nameChangeAPI = {
  getAll: async () => {
    return simulateAsync(getNameChangeRequests());
  },
  create: async (data) => {
    return simulateAsync(createNameChangeRequest(data));
  },
  updateStatus: async (id, status) => {
    return simulateAsync(updateNameChangeRequest(id, status));
  }
};
