import { callMethod, parseFrappeError } from '../api';

// ── Medicine ──────────────────────────────────────────────────
export const medicineService = {
  getList: (params) => callMethod('hospital_pharmacy.api.get_medicines', params),
  getFilters: () => callMethod('hospital_pharmacy.api.get_medicine_filters'),
  getDetails: (name) => callMethod('hospital_pharmacy.api.get_medicine_details', { name }),
  getPortalStats: () => callMethod('hospital_pharmacy.api.get_portal_stats'),
};

// ── Auth ──────────────────────────────────────────────────────
export const authService = {
  customerLogin: (email, password) =>
    callMethod('hospital_pharmacy.api.customer_login', { email, password }),
  adminLogin: (email, password) =>
    callMethod('hospital_pharmacy.api.admin_login', { email, password }),
  register: (full_name, email, phone, password) =>
    callMethod('hospital_pharmacy.api.register_customer', { full_name, email, phone, password }),
};

// ── Admin ──────────────────────────────────────────────────────
export const adminService = {
  getDashboardData: () => callMethod('hospital_pharmacy.api.get_dashboard_data'),
  searchEverything: (query) => callMethod('hospital_pharmacy.api.search_everything', { query }),
};

export { parseFrappeError };
