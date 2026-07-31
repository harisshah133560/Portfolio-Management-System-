import api from './axios';

var projectApi = {
  getProjects: function (params) {
    return api.get('/projects', { params: params });
  },
  getProject: function (id) {
    return api.get('/projects/' + id);
  },
  createProject: function (formData) {
    return api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateProject: function (id, formData) {
    return api.put('/projects/' + id, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteProject: function (id) {
    return api.delete('/projects/' + id);
  },
  getStats: function () {
    return api.get('/projects/stats');
  },
  deleteAllProjects: function () {
    return api.delete('/projects/all');
  },
};

export { projectApi };