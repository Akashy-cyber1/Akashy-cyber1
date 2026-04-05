export const API_ENDPOINTS = {
  authHealth: "/auth/health/",
  register: "/auth/register/",
  login: "/auth/login/",
  logout: "/auth/logout/",
  currentUser: "/auth/me/",
  leads: "/leads/",
  leadSources: "/leads/sources/",
  leadStaff: "/leads/staff/",
  followupsHealth: "/followups/health/",
  paymentsHealth: "/payments/health/",
  reportsHealth: "/reports/health/",
} as const;
