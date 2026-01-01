/**
 * API Service - Main API Entry Point
 * 
 * TOGGLE BETWEEN MOCK AND REAL API:
 * - Use './realApiService' for backend connection
 * - Use './mockApiService' for local mock data
 */

// ===========================
// REAL BACKEND API (Active)
// ===========================
export {
  authAPI,
  servicesAPI,
  categoriesAPI,
  healthAPI,
  requestsAPI,
  adminAPI,
  providersAPI,
  dashboardAPI,
  paymentsAPI,
  reportsAPI,
  notificationsAPI,
  locationsAPI,
  currenciesAPI,
  aboutAPI,
  nameChangeAPI,
  profileAPI,
  usersAPI,
  certificatesAPI,
  reviewsAPI,
  addressesAPI
} from './realApiService';

// ===========================
// MOCK API (For Offline Mode)
// ===========================
// Uncomment below and comment above to switch to mock mode
// export {
//   servicesAPI,
//   categoriesAPI,
//   healthAPI,
//   requestsAPI,
//   adminAPI,
//   usersAPI,
//   providersAPI,
//   dashboardAPI,
//   paymentsAPI,
//   reportsAPI,
//   notificationsAPI,
//   locationsAPI,
//   currenciesAPI,
//   aboutAPI,
//   nameChangeAPI
// } from './mockApiService';
