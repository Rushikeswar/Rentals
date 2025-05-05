const getBackendUrl = () => {
  if (window.runtimeConfig && window.runtimeConfig.BACKEND_URL) {
    return window.runtimeConfig.BACKEND_URL;
  }
  if (API_URL) {
    return API_URL;
  }
  return "http://52.66.241.102:3000";
};

export const API_URL = getBackendUrl();
