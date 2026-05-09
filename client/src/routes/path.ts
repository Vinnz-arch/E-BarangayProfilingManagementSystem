const APP_ROOT = "/app";

export const PATHS = {
  // Public Routes
  HOME: "/",
  LOGIN: "/login",

  // Authenticated
  APP: {
    ROOT: `${APP_ROOT}`,
    DASHBOARD: `${APP_ROOT}/dashboard`,
    SITIO: `${APP_ROOT}/sitio`,
    SITIO_RESIDENTS: `${APP_ROOT}/sitio/:id/residents`,
    SITIO_RESIDENTS_CREATE: `${APP_ROOT}/sitio/:id/residents/create`,
    SITIO_RESIDENTS_EDIT: `${APP_ROOT}/sitio/:id/residents/:residentId/edit`,
    HOUSEHOLD: `${APP_ROOT}/household`,
    BENEFICIARIES: `${APP_ROOT}/beneficiaries`,
    RESIDENTS: `${APP_ROOT}/residents`,
    BARANGAYOFFICIALS: `${APP_ROOT}/barangayofficials`
  },
};