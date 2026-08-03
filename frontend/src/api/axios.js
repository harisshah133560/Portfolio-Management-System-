import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

var api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  function (config) {
    var token = localStorage.getItem('ph_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      var status = error.response.status;

      if (status === 401) {
        localStorage.removeItem('ph_token');
        localStorage.removeItem('ph_user');
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register'
        ) {
          window.location.href = '/login';
        }
      }

      return Promise.reject({
        status: status,
        message: error.response.data && error.response.data.message
          ? error.response.data.message
          : 'An error occurred',
        data: error.response.data,
      });
    }

    return Promise.reject({
      status: 0,
      message: 'Network error. Please check your connection.',
      data: null,
    });
  }
);

export default api;