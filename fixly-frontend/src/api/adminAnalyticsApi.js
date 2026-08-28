import fixlyApi from "./fixlyApi";

const BASE = "/api/admin/analytics";

export const getOverview = (period) =>
  fixlyApi.get(`${BASE}/overview`, { params: { period } });

export const getProviderAnalytics = () =>
  fixlyApi.get(`${BASE}/providers`);

export const getBookingTrends = (granularity) =>
  fixlyApi.get(`${BASE}/bookings`, { params: { granularity } });

export const getRevenueTrends = (granularity) =>
  fixlyApi.get(`${BASE}/revenue`, { params: { granularity } });

export const getCategoryPerformance = (period) =>
  fixlyApi.get(`${BASE}/categories`, { params: { period } });

export const getTopProviders = (limit = 5) =>
  fixlyApi.get(`${BASE}/top-providers`, { params: { limit } });

export const getRecentActivity = (limit = 10) =>
  fixlyApi.get(`${BASE}/recent-activity`, { params: { limit } });