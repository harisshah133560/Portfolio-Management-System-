import api from './axios';

var authApi = {
  register: function (data) {
    return api.post('/auth/register', data);
  },
  login: function (data) {
    return api.post('/auth/login', data);
  },
  getMe: function () {
    return api.get('/auth/me');
  },
  getPublicProfile: function () {
    return api.get('/auth/public-profile');
  },
  updateProfile: function (data) {
    return api.put('/auth/profile', data);
  },
  changePassword: function (data) {
    return api.put('/auth/password', data);
  },
  uploadAvatar: function (formData) {
    return api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadCv: function (formData) {
    return api.post('/auth/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteAccount: function () {
    return api.delete('/auth/account');
  },
};

export { authApi };